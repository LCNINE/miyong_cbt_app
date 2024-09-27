import { incorrectAnswer, reTestQustion } from "@/type/testType";
import { useLocation } from "react-router-dom";
import RetestCard from "./RetestCard";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function Retest (){
  const location = useLocation();
  const [incorrectAnswers, setIncorrectAnswers]=useState<Array<incorrectAnswer>>([])
  const { user} = useAuth();
  const [questionData, setQuestionData] = useState<reTestQustion[]>([]);

  // 페이지 로드시 동기적으로 실행되는 함수
  const fetchData = async () => {
    try {
      // incorrectAnswers 가져오기
      if (location.state?.incorrectAnswers) {
        console.log('if');
        setIncorrectAnswers(location.state.incorrectAnswers);
      } else {
        console.log('else');
        const fetchedAnswers = await fetchIncorrectAnswers(); // 비동기 함수 호출
        if (fetchedAnswers) {
          setIncorrectAnswers(fetchedAnswers);
          console.log(fetchedAnswers);
        }
      }

      // 질문 ID 가져오기
      const questionIds = incorrectAnswers.map((answer) => answer.questionId);
      console.log('questionIds : ' + questionIds);

      // 질문 가져오기
      const { data: questions, error: questionError } = await supabase
        .from("questions")
        .select("*")
        .in("id", questionIds);

      if (questionError) {
        console.error("Error fetching questions:", questionError);
        return;
      }

      console.log('2 : ' + 2);

      // 예제 가져오기
      const { data: examples, error: exampleError } = await supabase
        .from("examples")
        .select("*")
        .in("question_id", questionIds);

      if (exampleError) {
        console.error("Error fetching examples:", exampleError);
        return;
      }

      console.log('3 : ' + 3);

      // 선택지 가져오기
      const { data: options, error: optionError } = await supabase
        .from("question_options")
        .select("*")
        .in("question_id", questionIds)
        .order("no", { ascending: true });

      if (optionError) {
        console.error("Error fetching options:", optionError);
        return;
      }

      console.log('4 : ' + 4);

      // 데이터를 조합하여 상태에 저장
      const combinedData = questions.map((question) => {
        const questionExamples = examples.filter((example) => example.question_id === question.id);
        const questionOptions = options.filter((option) => option.question_id === question.id);
        const incorrectAnswer = incorrectAnswers.find((answer) => answer.questionId === question.id);
        const correctOption = questionOptions.find((option) => option.is_correct)?.no || null;

        return {
          ...question,
          examples: questionExamples,
          options: questionOptions,
          chose_option: incorrectAnswer ? incorrectAnswer.selectedOption : null,
          correct_option: correctOption,
        };
      });

      console.log('combinedData : ' + combinedData);
      setQuestionData(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 페이지가 처음 로드될 때 한 번만 실행되도록 useEffect 사용
  useEffect(() => {
    fetchData();
  }, []); // 빈 의존성 배열을 넣어 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 설정


  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchIncorrectAnswers(){
    console.log("fetchIncorrectAnswers")
    if(user?.id){
      const { data, error } = await supabase
      .from('wrong_logs')
      .select('question_id, chose_answer')
      .eq('user_id', user.id)

    if (error) {
      console.error("Error fetching license:", error);
    } else if(data) {
      // 데이터를 변환하여 chose_answer를 selected_option으로 변경
      return data.map((item: { question_id: number; chose_answer: number | null; }) => ({
        questionId: item.question_id,
        selectedOption: item.chose_answer, // chose_answer를 selectedOption으로 변환
      }));
    }
    }
  }

  return (
    <RetestCard answersToRetest={questionData}/>
  )
}