import { useLocation, useNavigate } from "react-router-dom"; // useNavigate 추가
import { useEffect, useState } from "react";
import { PostList } from "./PostList";
import { Pagination } from "./Pagination";
import { Example, Option, Question, QuestionWithExamplesAndOptions } from "@/type/testType"; // 타입 import
import { supabase } from "@/lib/supabaseClient.ts";

export default function Test () {
  const location = useLocation();
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 1;

  const queryParams = new URLSearchParams(location.search);
  const test_id = Number(queryParams.get("test_id"));

  const [questionData, setQuestionData] = useState<QuestionWithExamplesAndOptions[]>([]);
  const [licenseName, setLicenseName] = useState<string | null>(null);
  const [licenseId, setLicenseId] = useState<number | null>(null);
  const [madeAt, setMadeAt] = useState<string | null>(null);
  const [episode, setEpisode] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({}); // 사용자가 선택한 답안 저장

  // Supabase에서 데이터 가져오기
  useEffect(() => {

    const fetchQuestions = async () => {
      if (test_id) {
        const { data: questions, error: questionError } = await supabase
          .from("questions")
          .select(`
            *,
            tests (
              episode
            )
          `)
          .eq("test_id", test_id)
          .order('no', { ascending: true });


        if (questionError) {
          console.error("Error fetching questions:", questionError);
          return;
        }else console.log(questions)

        const questionIds = questions.map((question: Question) => question.id);

        const { data: examples, error: exampleError } = await supabase
          .from("examples")
          .select("*")
          .in("question_id", questionIds);

        if (exampleError) {
          console.error("Error fetching examples:", exampleError);
          return;
        }

        const { data: options, error: optionError } = await supabase
          .from("question_options")
          .select("*")
          .in("question_id", questionIds)
          .order("no", { ascending: true });

        if (optionError) {
          console.error("Error fetching options:", optionError);
          return;
        }

        const combinedData: QuestionWithExamplesAndOptions[] = questions.map((question: Question) => {
          const questionExamples = examples.filter((example: Example) => example.question_id === question.id);
          const questionOptions = options.filter((option: Option) => option.question_id === question.id);

          return {
            ...question,
            examples: questionExamples,
            options: questionOptions,
          };
        });

        setQuestionData(combinedData);

        
        if(questions){
          setLicenseId(questions[0].license)
          setMadeAt(questions[0].made_at)
          if(questions[0].tests) setEpisode(questions[0].tests.episode)
        }
      }
    };

    

    fetchQuestions();
  }, [test_id]);

  useEffect(() => {
    const fetchLicense = async () => {
      if(licenseId){
        const { data:license, error } = await supabase
          .from("licenses")
          .select("license")
          .eq("id", licenseId)
          .single(); // single() 호출

        if (error) {
          console.error("Error fetching license:", error);
          return;
        }

        if (license) {
          setLicenseName(license.license); // data에서 license를 추출
        }
      }
    }
    
    fetchLicense();
  },[licenseId]);

  const firstPostIndex = (currentPage - 1) * postsPerPage;
  const lastPostIndex = firstPostIndex + postsPerPage;
  const currentQuestion = questionData.slice(firstPostIndex, lastPostIndex);

  // 선택 처리 함수
  const handleOptionSelect = (questionId: number, optionNo: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionNo,
    }));
  };

  // 결과 제출 및 다음 페이지로 이동 함수
  const handleSubmit = () => {
    // 모든 질문을 포함하여 선택하지 않은 문제는 기본값 null로 처리
    const answers = questionData.map((question) => ({
      questionId: question.id,
      optionNo: selectedAnswers[question.id] || null, // 선택되지 않은 경우 null
    }));

    // navigate를 이용해 데이터를 state로 전달
    navigate("/result", {
      state: {
        licenseName: licenseName,
        made_at: madeAt,
        episode: episode,
        answers: answers,
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <h1>{licenseName} : {episode}회({madeAt}) 모의고사</h1>

      <main className="flex-grow">
        <PostList
          list={currentQuestion}
          onSelectOption={handleOptionSelect}
          selectedAnswers={selectedAnswers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalQuestions={questionData.length}
        />
      </main>

      <footer className="flex-grow-0">
        <Pagination
          postsNum={questionData.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          handleSubmit={handleSubmit}  // handleSubmit을 Pagination에 전달
        />
      </footer>

      {/* 별도의 결과 제출 버튼은 필요 없음, Pagination 내에서 처리됨 */}
    </div>
  );
}
