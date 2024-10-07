import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email({ message: "이메일 형식으로 입력해주세요" }),
    password: z.string().min(6, { message: "비밀번호는 6자리 이상 입력해주세요." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"], // confirmPassword 필드에서 에러 표시
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;