import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./libs/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      validationError: { target: false, value: false },
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const origin = process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? [
    "http://localhost:3000",
  ];
  app.enableCors({
    origin,
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, "0.0.0.0");
  Logger.log(`API listening on http://localhost:${port}/api`, "Bootstrap");
}

void bootstrap();
