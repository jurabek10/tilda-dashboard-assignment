import { z } from "zod";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const passwordSchema = z
  .string()
  .min(8, "비밀번호는 8자 이상이어야 합니다.")
  .regex(
    PASSWORD_REGEX,
    "영문, 숫자, 특수문자를 모두 포함해야 합니다."
  );

const emailSchema = z
  .string()
  .min(1, "이메일을 입력해주세요.")
  .email("올바른 이메일 형식이 아닙니다.");

const nameSchema = z
  .string()
  .trim()
  .min(2, "이름은 2자 이상이어야 합니다.")
  .max(8, "이름은 8자 이하이어야 합니다.")
  .refine((v) => !/\s/.test(v), { message: "공백은 사용할 수 없습니다." });

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginInput = z.infer<typeof loginSchema>;

export const changeNameSchema = z.object({
  name: nameSchema,
});
export type ChangeNameInput = z.infer<typeof changeNameSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요."),
    newPassword: passwordSchema,
    newPasswordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((d) => d.newPassword === d.newPasswordConfirm, {
    path: ["newPasswordConfirm"],
    message: "새 비밀번호가 일치하지 않습니다.",
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    path: ["newPassword"],
    message: "새 비밀번호는 현재 비밀번호와 달라야 합니다.",
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
