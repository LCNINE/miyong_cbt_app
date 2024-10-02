import { useQuery } from "react-query";
import { fetchLicenses } from "../fetchData";
import { useNavigate } from "react-router-dom";
import { COMBO } from "@/query-keys/combo-query-key";

const useLicense = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const { data, isLoading, error } = useQuery([COMBO.LICENSES], fetchLicenses, {
    onError: (error: unknown) => {
      console.log('Error fetching licenses:', error);
      // 에러 발생 시 '/error' 페이지로 이동
      navigate('/error', { state: { message: `Error loading licenses: ${error}` } });
    },
  });

  // 필요한 데이터를 반환
  return { data, isLoading, error };
};

export default useLicense;
