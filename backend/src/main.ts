import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in the DTO
      transform: true, // Transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    }),
  );

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend URL (assuming frontend runs on port 3001)
    credentials: true, // Allow cookies to be sent with requests
  });

  // Parse cookies in incoming requests
  app.use(cookieParser());

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Rent App API')
    .setDescription('API documentation for the Rent Management Application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearer', // Using the default name to match @ApiBearerAuth() without arguments
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api-docs`,
  );
}
bootstrap();
