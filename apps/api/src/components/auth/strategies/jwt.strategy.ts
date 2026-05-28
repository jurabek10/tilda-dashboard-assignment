import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { Request } from "express";
import type { JwtPayload } from "@tilda/shared";
import type { AuthUserContext } from "../../../libs/types/auth-user";

const cookieExtractor = (req: Request): string | null => {
  const token = (req as Request & { cookies?: Record<string, string> })
    ?.cookies?.access_token;
  return typeof token === "string" && token.length > 0 ? token : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>("JWT_SECRET") ?? "dev-only-secret-change-me",
    });
  }

  validate(payload: JwtPayload): AuthUserContext {
    if (!payload?.sub) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email };
  }
}
