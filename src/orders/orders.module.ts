import { Module } from '@nestjs/common';
import { NatsModule } from '../transports/nats.module.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    NatsModule
  ]
})
export class OrdersModule { }
