import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from '../config/service.js';
import { envs } from '../config/envs.js';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.productsMicroserviceHost,
          port: envs.productsMicroservicePort
        }
      }
    ])
  ]
})
export class OrdersModule {}
