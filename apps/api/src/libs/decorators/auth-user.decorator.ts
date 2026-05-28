import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { AuthUserContext } from "../types/auth-user";

export const AuthUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUserContext => {
    const req = ctx.switchToHttp().getRequest<Request & { user: AuthUserContext }>();
    return req.user;
  }
);
