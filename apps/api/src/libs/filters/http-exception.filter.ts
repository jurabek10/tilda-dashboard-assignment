import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";

type ValidationLikeBody = {
  message?: string | string[];
  errors?: Array<{ field: string; message: string }>;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse() as string | ValidationLikeBody;

      let message: string;
      let errors: Array<{ field: string; message: string }> | undefined;

      if (typeof body === "string") {
        message = body;
      } else {
        const rawMessage = body.message;
        if (Array.isArray(rawMessage)) {
          message = "Validation failed";
          errors = rawMessage.map((m) => ({
            field: extractField(m),
            message: m,
          }));
        } else {
          message = rawMessage ?? exception.message;
        }
        if (body.errors) errors = body.errors;
      }

      res.status(status).json({
        statusCode: status,
        message,
        ...(errors ? { errors } : {}),
        path: req.url,
      });
      return;
    }

    this.logger.error(exception);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      path: req.url,
    });
  }
}

function extractField(msg: string): string {
  const match = msg.match(/^([a-zA-Z0-9_.]+)\s+/);
  return match ? match[1] : "_";
}
