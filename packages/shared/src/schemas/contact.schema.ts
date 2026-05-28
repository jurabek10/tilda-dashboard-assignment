import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "성함은 2자 이상이어야 합니다.")
    .max(20, "성함은 20자 이하이어야 합니다."),
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  company: z
    .string()
    .trim()
    .max(20, "회사명은 20자 이하이어야 합니다.")
    .refine((v) => v.length === 0 || v.length >= 2, {
      message: "회사명은 2자 이상이어야 합니다.",
    })
    .optional()
    .or(z.literal("").optional()),
  message: z.string().trim().min(1, "내용을 입력해주세요."),
});

export type ContactInput = z.infer<typeof contactSchema>;
