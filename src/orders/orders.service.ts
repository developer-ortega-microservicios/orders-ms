import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaPg } from '@prisma/adapter-pg';
import { firstValueFrom } from 'rxjs';
import { envs } from '../config/envs.js';
import { NATS_SERVICE } from '../config/service.js';
import { PrismaClient } from '../generated/prisma/client.js';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderPaginationDto } from './dto/order-pagination.dto.js';
import { OrderWithProducts } from './interfaces/order-with-products.interface.js';
import { PaidOrderDto } from './dto/paid-order.dto.js';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrdersService');

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
    const adapter = new PrismaPg({ connectionString: envs.databaseUrl });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database Connected')
  }

  async create(createOrderDto: CreateOrderDto) {

    try {

      // Confirmar los ids de los productos
      const productIds = createOrderDto.items.map(item => item.productId)

      const products: any[] = await firstValueFrom(
        this.client.send({ cmd: 'validate_product' }, productIds)
      );

      // Calculo de los valores
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(product => product.id === orderItem.productId,).price;

        return acc + price * orderItem.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity
      }, 0);

      // Crear una transacción base de datos
      const order = await this.order.create({
        data: {
          totalAmount: totalAmount,
          totalItems: totalItems,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(product => product.id === orderItem.productId).price,
                productId: orderItem.productId,
                quantity: orderItem.quantity
              }))
            }
          }
        },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true
            }
          }
        }
      });

      return {
        ...order,
        OrderItem: order.OrderItem.map((orderItem) => ({
          ...orderItem,
          name: products.find(product => product.id === orderItem.productId)
            .name
        }))
      }

    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Check logs'
      })
    }


  }

  async findAll(orderPaginationDto: OrderPaginationDto) {

    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status
      }
    })

    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: orderPaginationDto.status
        }
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage)
      }
    }
  }

  async findOne(id: string) {

    const order = await this.order.findFirst({
      where: { id },
      include: {
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true
          }
        }
      }
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`
      })
    }

    const productIds = order.OrderItem.map( orderItem => orderItem.productId);
    const products : any[] = await firstValueFrom(
      this.client.send({ cmd: 'validate_product' }, productIds)
    )

    return{
      ...order,
      OrderItem: order.OrderItem.map( orderItem => ({
        ...orderItem,
        name: products.find( product => product.id === orderItem.productId).name
      }))
    };
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {

    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: { status: status }
    })

  }

  async createPaymentSession( order: OrderWithProducts){
    const paymentSession = await firstValueFrom(
      this.client.send(
        'create.payment.session', {
          orderId: order.id,
          currency: "usd",
          items: order.OrderItem.map( item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        })
    )

    return paymentSession;
  }

  async paidOrder ( paidOrderDto: PaidOrderDto ) {
    this.logger.log('Paid Order')

    const order = await this.order.update({
      where: { id: paidOrderDto.orderId },
      data: {
        status: 'PAID',
        paid: true,
        paidAt: new Date(),
        stripeChargeId: paidOrderDto.stripePaymentId,

        orderReceipts: {
          upsert: {
            create: { receiptUrl: paidOrderDto.receiptUrl },
            update: { receiptUrl: paidOrderDto.receiptUrl }
          }
        }
      }
    })

    return order;

  } 


}
