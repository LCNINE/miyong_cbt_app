import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { PostList } from "@/components/PostList";
import { Pagination } from "@/components/Pagination";
import { supabase } from "@/lib/supabaseClient";
import { Example, Option, Question, QuestionWithExamplesAndOptions } from "@/type/testType"; // 타입 import

export default function Test (){
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage =1;

  const queryParams = new URLSearchParams(location.search);
  const license_id = queryParams.get("license_id");
  const made_at = queryParams.get("made_at");

  const [questionData, setQuestionData] = useState<QuestionWithExamplesAndOptions[]>([]);
  const [license, setLicense] = useState<string | null>(null); // 단일 license 객체 상태

  // Supabase에서 데이터 가져오기
  useEffect(() => {
    const fetchLicense = async () => {
      const { data, error } = await supabase
        .from('licenses') // licenses 테이블에서
        .select('license') // id와 license 컬럼만 가져오기
        .eq('id', license_id) // license_id가 'aa'인 데이터만 필터링
        .single(); // 단일 레코드만 가져오기 (단일 레코드를 예상할 때 사용)
  
      if (error) {
        console.error("Error fetching license:", error);
      } else {
        setLicense(data.license); // 단일 레코드를 상태로 설정
      }
    }
  
    fetchLicense();

    const fetchQuestions = async () => {
      if (license_id && made_at) {
        // 1. questions 테이블에서 문제 가져오기
        const { data: questions, error: questionError } = await supabase
          .from("questions")
          .select("*")
          .eq("license", license_id)
          .eq("made_at", made_at);

          if (questionError) {
            console.error("Error fetching questions:", questionError);
            return;
          }

        const questionIds = questions.map((question: Question) => question.id);

        // 2. 해당 문제에 대한 examples 가져오기
        const { data: examples, error: exampleError } = await supabase
          .from("examples")
          .select("*")
          .in("question_id", questionIds);

        if (exampleError) {
          console.error("Error fetching examples:", exampleError);
          return;
        }

        // 3. 해당 문제에 대한 options 가져오기
        const { data: options, error: optionError } = await supabase
          .from("question_options")
          .select("*")
          .in("question_id", questionIds)
          .order("no", { ascending: true }); // 1~4번까지 순서대로 정렬

        if (optionError) {
          console.error("Error fetching options:", optionError);
          return;
        }

        // 4. 각 question에 해당하는 examples와 options를 합쳐서 통합된 구조 생성
        const combinedData: QuestionWithExamplesAndOptions[] = questions.map((question: Question) => {
          const questionExamples = examples.filter((example: Example) => example.question_id === question.id);
          const questionOptions = options.filter((option: Option) => option.question_id === question.id);

          return {
            ...question,
            examples: questionExamples, // 해당 문제의 보기
            options: questionOptions,   // 해당 문제의 선지
          };
        });

        // 5. 통합된 데이터를 상태로 설정
        setQuestionData(combinedData);
      }
    };

    fetchQuestions();
  }, [license_id, made_at]);

  const firstPostIndex = (currentPage - 1) * postsPerPage;
  const lastPostIndex = firstPostIndex + postsPerPage;
  const currentQuestion = questionData.slice(firstPostIndex, lastPostIndex);

  return (
    <div className="flex flex-col h-full">
      <h1>{license} : {made_at} 모의고사</h1>

      <main className="flex-grow">
        <PostList list={currentQuestion} />
      </main>

      <footer className="flex-grow-0">
        <Pagination
          postsNum={questionData.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </footer>
    </div>
  )
}