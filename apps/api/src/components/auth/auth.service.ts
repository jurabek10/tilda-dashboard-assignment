import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import type { JwtPayload, User } from "@tilda/shared";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async signup(dto: SignupDto): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException("이미 사용중인 이메일입니다.");
    }
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
      },
    });
    return this.toPublicUser(user);
  }

  async login(
    dto: LoginDto
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
    const accessToken = this.signToken({ sub: user.id, email: user.email });
    return { user: this.toPublicUser(user), accessToken };
  }

  async me(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.toPublicUser(user);
  }

  async updateName(userId: string, name: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });
    return this.toPublicUser(user);
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto
  ): Promise<void> {
    if (dto.newPassword !== dto.newPasswordConfirm) {
      throw new BadRequestException({
        message: "새 비밀번호가 일치하지 않습니다.",
        errors: [
          { field: "newPasswordConfirm", message: "새 비밀번호가 일치하지 않습니다." },
        ],
      });
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException({
        message: "새 비밀번호는 현재 비밀번호와 달라야 합니다.",
        errors: [
          { field: "newPassword", message: "새 비밀번호는 현재 비밀번호와 달라야 합니다." },
        ],
      });
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException({
        message: "현재 비밀번호가 올바르지 않습니다.",
        errors: [
          { field: "currentPassword", message: "현재 비밀번호가 올바르지 않습니다." },
        ],
      });
    }
    const passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  private signToken(payload: JwtPayload): string {
    return this.jwt.sign(payload);
  }

  private toPublicUser(u: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    };
  }
}
