import { incorrectAnswer, reTestQustion } from "@/type/testType";
import RetestCard from "./RetestCard";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { fetchQuestionsAndOptions } from "./fetch";

export default function RetestAfterTest() {
  const location = useLocation();
  const [questionData, setQuestionData] = useState<reTestQustion[]>([]);

  // result 페이지에서 넘어왔는지 확인 (result 페이지에서 넘어오면 틀린 문제 목록을 state로 전달)
  const incorrectAnswersFromResult = location.state?.incorrectAnswers ?? null;

  // incorrectAnswers 가져오기 (react-query 사용)
  const {
    data: incorrectAnswers,
    isLoading: isLoadingIncorrect,
    error: incorrectError,
  } = useQuery(
    ["incorrectAnswers"],
    () => {
      return Promise.resolve(incorrectAnswersFromResult);
    },
    {
      enabled: !!incorrectAnswersFromResult, // user가 있을 때만 쿼리 실행
    }
  );

  // 질문과 선택지 가져오기 (react-query 사용)
  const {
    data: questionsAndOptions,
    isLoading: isLoadingQuestions,
    error: questionError,
  } = useQuery(
    ["questionsAndOptions", incorrectAnswers],
    () =>
      fetchQuestionsAndOptions(
        incorrectAnswers?.map((answer: incorrectAnswer) => answer.questionId) ||
          []
      ),
    {
      enabled: incorrectAnswers && incorrectAnswers.length > 0, // undefined가 아닌지 확인하고 길이를 체크
    }
  );

  // 데이터 병합 후 상태 업데이트
  useEffect(() => {
    if (questionsAndOptions && incorrectAnswers) {
      const { questions, examples, options } = questionsAndOptions;

      const combinedData = questions.map((question) => {
        const questionExamples = examples.filter(
          (example) => example.question_id === question.id
        );
        const questionOptions = options.filter(
          (option) => option.question_id === question.id
        );
        const incorrectAnswer = incorrectAnswers.find(
          (answer: incorrectAnswer) => answer.questionId === question.id
        );
        const correctOption =
          questionOptions.find((option) => option.is_correct)?.no || null;

        return {
          ...question,
          examples: questionExamples,
          options: questionOptions,
          chose_option: incorrectAnswer ? incorrectAnswer.selectedOption : null,
          correct_option: correctOption,
        };
      });

      setQuestionData(combinedData);
    }
  }, [questionsAndOptions, incorrectAnswers]);

  if (isLoadingIncorrect || isLoadingQuestions) {
    return <div>Loading...</div>;
  }

  if (incorrectError || questionError) {
    return <div>Error loading data.</div>;
  }

  return <RetestCard answersToRetest={questionData} />;
}
