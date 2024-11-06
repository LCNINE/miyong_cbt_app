"use server";

import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { AuthError } from "@supabase/supabase-js";
import { SignUpFormValues } from "./schema";

interface signUpProps {
  values: SignUpFormValues;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: ReturnType<typeof useNavigate>;
}

export async function signUp({ values, setLoading, navigate }: signUpProps) {
  setLoading(true);
  try {
    const { email, password } = values;

    // Supabase 회원가입 처리
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // 회원가입 성공 후 public.users 테이블에 데이터 추가
    if (data.user) {
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id,
        name: null,
        email: email,
      });

      if (insertError) throw insertError;

      navigate("/");
    }
  } catch (error) {
    // 에러 타입을 AuthError 또는 PostgrestError로 처리
    if (error instanceof AuthError) {
      if (error.message == 'User already registered') {
        return 'User already registered';
      } else {
        return `Auth error: ${error.message}`;
      }
    } else {
      return `Database error: ${(error as Error).message}`;
    }
  } finally {
    setLoading(false);
  }
  return 'success';
}
