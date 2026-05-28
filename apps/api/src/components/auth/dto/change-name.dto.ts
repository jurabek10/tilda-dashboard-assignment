import { IsString, Length } from "class-validator";
import { Transform } from "class-transformer";

export class ChangeNameDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @Length(2, 8, { message: "이름은 2~8자여야 합니다." })
  name!: string;
}
