import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Zod 스키마를 사용하여 폼 유효성 검사를 정의합니다.
const signUpSchema = z
  .object({
    email: z.string().email({ message: "이메일 형식으로 입력해주세요" }),
    name: z.string().min(1, { message: '이름을 입력해주세요.'}) ,
    password: z.string().min(6, { message: "비밀번호는 6자리 이상 입력해주세요." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"], // confirmPassword 필드에서 에러 표시
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 회원가입 후 다른 페이지로 이동하기 위해 useNavigate 사용

  // react-hook-form과 zodResolver를 사용하여 폼 상태를 관리합니다.
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (values: SignUpFormValues) => {
    setLoading(true);

    // 회원가입 로직 처리 (API 호출 등)
    console.log("Signing up with values:", values);

    // 예시로 setTimeout을 사용해 로딩 상태 확인
    setTimeout(() => {
      setLoading(false);
      alert("Sign up successful!");
      navigate("/"); // 회원가입 후 메인 페이지로 이동 (/ 대신 다른 경로로 변경 가능)
    }, 1000);
  };

  function goBackToSignIn() {
    navigate("/sign-in"); // /sign-up으로 이동
  };

  return (
    <div className="flex justify-center items-center h-full max-h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 bg-white p-8 shadow-lg rounded-md max-w-sm w-full max-h-[90%]">
          <h2 className="text-2xl font-semibold text-center">회원가입</h2>

          {/* Email 필드 */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email 필드 */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password 필드 */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password 필드 */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit 버튼 */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "회원가입 중..." : "회원가입"}
          </Button>

          <div className='my-4 flex flex-row items-center'>
            <Separator className='flex-1' />
            <p className='text-xs text-muted-foreground'>
              계정이 있으신가요?
            </p>
            <Separator className='flex-1' />
          </div>

          <Button onClick={goBackToSignIn} className="w-full">기존 계정으로 로그인</Button>

        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
