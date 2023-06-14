import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const configs: ConfigService = app.get(ConfigService);
  const port = configs.get<number>('PORT');
  const NODE_ENV = configs.get<number>('NODE_ENV');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(port, () => {
    new Logger('----CHAT----').log(
      `http://...:${port}`,
      `NODE_ENV - ${NODE_ENV}`,
    );
  });
}
bootstrap();
