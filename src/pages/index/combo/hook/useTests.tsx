import { useQuery } from "react-query";
import { fetchTests } from "../fetchData";
import { COMBO } from "@/query-keys/combo-query-key";

const useTests = () => {

  const { data, isLoading, error } = useQuery([COMBO.Test], fetchTests, {
    onError: (error: unknown) => {
      console.log('Error fetching tests:', error);
      // 에러 발생 시 '/error' 페이지로 이동
      
    },
  });

  // 필요한 데이터를 반환
  return { data, isLoading, error };
};

export default useTests;
