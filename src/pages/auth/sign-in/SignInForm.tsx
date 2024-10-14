import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { SignInFormValues, signInSchema } from "./schema";
import { signIn } from "./action";
import { useToast } from "@/hooks/use-toast";

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 회원가입 후 다른 페이지로 이동하기 위해 useNavigate 사용
  const { toast } = useToast(); // useToast 훅을 통해 toast 사용

  // react-hook-form과 zod를 이용한 폼 상태 관리
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "", // 기본값 설정
      password: "", // 기본값 설정
    },
  });

  const submitSignIn = async (values: SignInFormValues) => {
    try {
      const { data, error } = await signIn({ values, setLoading });
  
      if (error) {
        // 로그인 실패 시 toast 메시지 출력
        toast({
          title: "로그인 실패",
          description: "존재하지 않는 계정입니다.",
        });
        return; // 실패 시 더 이상 진행하지 않음
      }
  
      // 로그인 성공 시 toast 메시지 출력
      toast({
        title: "로그인 성공",
        description: data?.user.email + "님 환영합니다!",
      });
  
      navigate("/"); // 로그인 성공 시 메인 페이지로 이동
    } catch {
      toast({
        title: "로그인 실패",
        description: "로그인 중 문제가 발생했습니다.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center max-h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitSignIn)}
          className="space-y-6 bg-white p-8 shadow-lg rounded-md max-w-sm w-full"
        >
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
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 비밀번호 찾기 링크를 오른쪽에 배치 */}
          <div className="flex justify-between items-center">
            <span></span>{" "}
            {/* 좌측에 빈 공간을 넣어 비밀번호 찾기 링크가 우측에 붙도록 */}
            <a href="#" className="text-sm hover:underline">
              비밀번호 찾기
            </a>
          </div>

          {/* Submit 버튼 */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
