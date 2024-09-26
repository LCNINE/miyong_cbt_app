'use server'

import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { AuthError } from "@supabase/supabase-js";
import { SignUpFormValues } from "./schema";

interface signUpProps {
  values: SignUpFormValues;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: ReturnType<typeof useNavigate>;
}

export async function signUp({ values, setLoading, navigate }: signUpProps){
  setLoading(true);
  try {
    const { email, password, name } = values;

    // Supabase 회원가입 처리
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;

    // 회원가입 성공 후 public.users 테이블에 데이터 추가
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          name: name,
          email: email,
        });

      if (insertError) throw insertError;

      alert("회원가입에 성공했습니다. 입력하신 메일주소에서 추가 인증을 해주세요.");
      navigate("/");
    }
  } catch (error) {
    // 에러 타입을 AuthError 또는 PostgrestError로 처리
    if (error instanceof AuthError) {
      alert(`Auth error: ${error.message}`);
    } else {
      alert(`Database error: ${(error as Error).message}`);
      console.error("Unexpected error:", error);
    }
  } finally {
    setLoading(false);
  }
  return null;
}