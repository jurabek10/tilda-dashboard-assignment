import {
  IsEmail,
  IsString,
  Length,
  Matches,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

export class SignupDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsEmail({}, { message: "올바른 이메일 형식이 아닙니다." })
  email!: string;

  @IsString()
  @MinLength(8, { message: "비밀번호는 8자 이상이어야 합니다." })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
    message: "영문, 숫자, 특수문자를 모두 포함해야 합니다.",
  })
  password!: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @Length(2, 8, { message: "이름은 2~8자여야 합니다." })
  name!: string;
}
