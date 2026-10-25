import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { envs } from '../config/envs.js';

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
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  
}
