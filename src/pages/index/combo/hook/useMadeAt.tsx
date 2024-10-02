import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { fetchMadeAts } from "../fetchData";
import { COMBO } from "@/query-keys/combo-query-key";

const useMadeAt = (selectedLicense: string) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  console.log('selectedLicense : ' + selectedLicense);

  const { data, isLoading, error } = useQuery(
    [COMBO.MADEAT, selectedLicense],
    // selectedLicenseId가 정의되어 있을 때만 fetchMadeAts 호출
    () => selectedLicense ? fetchMadeAts(selectedLicense) : Promise.resolve([]),
    {
      enabled: !!selectedLicense, // selectedLicenseId가 존재할 때만 쿼리 실행
      onError: (error: unknown) => {
        console.log('Error fetching licenses:', error);
        // 에러 발생 시 '/error' 페이지로 이동
        navigate('/error', { state: { message: `Error loading licenses: ${error}` } });
      },
    }
  );

  console.log('useMadeAt 옴', data);

  // 필요한 데이터를 반환
  return { data, isLoading, error };
};

export default useMadeAt;
