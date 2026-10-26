import { Controller, NotImplementedException, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrdersService } from './orders.service.js';
import { OrderPaginationDto } from './dto/order-pagination.dto.js';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  changeOrderStatus(){
    // return this.ordersService.changeOrderStatus()
    throw new NotImplementedException();
  }
}
