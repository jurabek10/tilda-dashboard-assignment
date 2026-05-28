import { IsEmail, IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class LoginDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsEmail({}, { message: "올바른 이메일 형식이 아닙니다." })
  email!: string;

  @IsString()
  @MinLength(8, { message: "비밀번호는 8자 이상이어야 합니다." })
  password!: string;
}
