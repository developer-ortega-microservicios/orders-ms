import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger } from '@nestjs/common';
import { envs } from './config/envs.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main');


  await app.listen(envs.port);

  logger.log(`Orders running on port ${envs.port}`)

}
await bootstrap();
