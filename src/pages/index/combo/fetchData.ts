import { supabase } from "@/lib/supabaseClient"

export async function fetchLicenses() {
  const { data, error } = await supabase
    .from('licenses')  // licenses 테이블에서
    .select('id, license') // license 컬럼만 가져오기
    .order('license', { ascending: false })  // license를 기준으로 오름차순 정렬

  if (error) {
    console.error("Error fetching licenses:", error)
  } else {
    return data
  }
}

export async function fetchMadeAts(selectedLicense : string) {
  // Supabase에서 직접 SQL 쿼리 실행 (RPC 호출)
  const { data, error } = await supabase
    .rpc('get_distinct_made_at', { license_name: selectedLicense }); // RPC 함수 호출

  if (error) {
    console.error("Error fetching madeAts:", error);
  } else {
    // label과 value 형태로 변환
    const uniqueMadeAts = data.map((item: { made_at: string }) => ({
      label: new Date(item.made_at).toLocaleDateString(), // 날짜 포맷팅
      value: item.made_at,
    }));

    return uniqueMadeAts;
  }
};

export async function fetchTests() {
  const { data, error } = await supabase
    .rpc('fetch_tests_with_license');  // RPC 함수 호출

  if (error) {
    console.error("Error fetching tests with licenses:", error);
    return [];
  } else {
    return data;
  }
}
