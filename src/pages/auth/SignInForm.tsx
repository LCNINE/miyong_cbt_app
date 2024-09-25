import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Zod를 사용한 폼 스키마 정의
const loginSchema = z.object({
  email: z.string().email({ message: "이메일 형식으로 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 6자리 이상 입력해주세요." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 회원가입 후 다른 페이지로 이동하기 위해 useNavigate 사용

  // react-hook-form과 zod를 이용한 폼 상태 관리
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    setLoading(true);

    // 로그인 로직 (API 호출 등)
    console.log("Logging in with values:", values);

    // 예시로 setTimeout을 사용해 로딩 상태 확인
    setTimeout(() => {
      setLoading(false);
      alert("Logged in!");
      navigate("/"); // 회원가입 후 메인 페이지로 이동 (/ 대신 다른 경로로 변경 가능)
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center max-h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 shadow-lg rounded-md max-w-sm w-full">
          <h2 className="text-2xl font-semibold text-center">로그인</h2>

          {/* Email 필드 */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
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
          
          {/* 비밀번호 찾기 링크를 오른쪽에 배치 */}
          <div className="flex justify-between items-center">
            <span></span> {/* 좌측에 빈 공간을 넣어 비밀번호 찾기 링크가 우측에 붙도록 */}
            <a href="#" className="text-sm hover:underline">비밀번호 찾기</a>
          </div>

          {/* Submit 버튼 */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
