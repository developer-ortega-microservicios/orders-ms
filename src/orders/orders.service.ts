import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { envs } from '../config/envs.js';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrdersService');

  constructor() {
    const adapter = new PrismaPg({ connectionString: envs.databaseUrl });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database Connected')
  }

  create(createOrderDto: CreateOrderDto) {
    return this.order.create({ data: createOrderDto })
  }

  findAll() {
    return this.order.findMany({})
  }

  async findOne(id: string) {

    const order = await this.order.findFirst({
      where: { id }
    });

    if(!order){
      throw new RpcException({ 
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${ id } not found`
       })
    }

    return order;
  }

  
}
