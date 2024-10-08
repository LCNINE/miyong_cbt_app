import { supabase } from "@/lib/supabaseClient";

// Supabase에서 signed URL 가져오기
export async function fetchSignedUrl (path: string) {
  const { data, error } = await supabase.storage
    .from("image") // 버킷 이름을 넣으세요
    .createSignedUrl(path, 60); // URL 유효 기간 설정

  if (error) {
    console.error("Error fetching signed URL:", error);
    return null;
  }

  return data?.signedUrl;
};