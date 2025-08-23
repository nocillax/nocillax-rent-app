import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend URL (assuming frontend runs on port 3001)
    credentials: true, // Allow cookies to be sent with requests
  });

  // Parse cookies in incoming requests
  app.use(cookieParser());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
