import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "이메일 형식으로 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 6자리 이상 입력해주세요." }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;