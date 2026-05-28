import { IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: "비밀번호는 8자 이상이어야 합니다." })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
    message: "영문, 숫자, 특수문자를 모두 포함해야 합니다.",
  })
  newPassword!: string;

  @IsString()
  newPasswordConfirm!: string;
}
