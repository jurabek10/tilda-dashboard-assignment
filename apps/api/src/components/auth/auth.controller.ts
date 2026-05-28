import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { ChangeNameDto } from "./dto/change-name.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthUser } from "../../libs/decorators/auth-user.decorator";
import type { AuthUserContext } from "../../libs/types/auth-user";

const COOKIE_NAME = "access_token";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly cfg: ConfigService
  ) {}

  @Post("signup")
  signup(@Body() dto: SignupDto) {
    return this.auth.signup(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.auth.login(dto);
    this.setAuthCookie(res, result.accessToken);
    return result;
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response): void {
    this.clearAuthCookie(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@AuthUser() user: AuthUserContext) {
    return this.auth.me(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateName(
    @AuthUser() user: AuthUserContext,
    @Body() dto: ChangeNameDto
  ) {
    return this.auth.updateName(user.id, dto.name);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me/password")
  async changePassword(
    @AuthUser() user: AuthUserContext,
    @Body() dto: ChangePasswordDto
  ) {
    await this.auth.changePassword(user.id, dto);
    return { ok: true };
  }

  private setAuthCookie(res: Response, token: string): void {
    const secure =
      (this.cfg.get<string>("COOKIE_SECURE") ?? "false").toLowerCase() ===
      "true";
    const domain = this.cfg.get<string>("COOKIE_DOMAIN") || undefined;
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      domain,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearAuthCookie(res: Response): void {
    res.clearCookie(COOKIE_NAME, { path: "/" });
  }
}
