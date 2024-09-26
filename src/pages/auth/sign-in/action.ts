import { supabase } from "@/lib/supabaseClient";
import { SignInFormValues } from "./schema";

interface signInProps {
  values: SignInFormValues;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export async function signIn({ values, setLoading }: signInProps) {
  setLoading(true);

  const { email, password } = values;
  console.log('email : ' + email);
  console.log('password : ' + password);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 이메일 미인증 에러 처리
      if (error.message.includes("Email not confirmed")) {
        return { error: "로그인 실패: 이메일 인증을 완료해주세요." };
      } else {
        return { error: `로그인 실패: ${error.message}` };
      }
    }

    console.log("Logged in successfully:", data);
    return { data };
  } catch (error) {
    console.error("Error during login:", error);
    return { error: "로그인 중 문제가 발생했습니다." };
  } finally {
    setLoading(false);
  }
}
