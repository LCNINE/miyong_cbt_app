import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SignUpFormValues, signUpSchema } from "./schema";
import { signUp } from "./action";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 회원가입 후 다른 페이지로 이동하기 위해 useNavigate 사용

  // react-hook-form과 zodResolver를 사용하여 폼 상태를 관리합니다.
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',      // 기본값 설정
      name: '',      // 기본값 설정
      password: '',   // 기본값 설정
      confirmPassword: '',   // 기본값 설정
    },
  });

  const submitSignUp = (values: SignUpFormValues) => {
    // onSubmit 로직을 SignUpHandler로 전달
    signUp({ values, setLoading, navigate });
  };

  function goBackToSignIn() {
    navigate("/sign-in"); // /sign-up으로 이동
  };

  return (
    <div className="flex justify-center items-center h-full max-h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitSignUp)} className="space-y-3 bg-white p-8 shadow-lg rounded-md max-w-sm w-full max-h-[90%]">
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
