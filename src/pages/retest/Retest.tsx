import { incorrectAnswer, reTestQustion } from "@/type/testType";
import RetestCard from "./RetestCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useQuery } from "react-query";
import { fetchIncorrectAnswers, fetchQuestionsAndOptions } from "./fetch";
import { Helmet } from "react-helmet-async";

export default function Retest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState<reTestQustion[]>([]);

  // incorrectAnswers 가져오기 (react-query 사용)
  const {
    data: incorrectAnswers,
    isLoading: isLoadingIncorrect,
    error: incorrectError,
  } = useQuery(
    ["incorrectAnswers", user?.id ?? null],
    () => {
      // 그렇지 않으면 전체 틀린 문제를 가져옴
      return fetchIncorrectAnswers(user?.id ?? null);
    },
    {
      enabled: !!user, // user가 있을 때만 쿼리 실행
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
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        불러오는 중...
      </div>
    );
  }

  if (incorrectError || questionError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        데이터를 불러오지 못했습니다.
      </div>
    );
  }

  const isEmpty = questionData.length === 0;

  return (
    <>
      <Helmet>
        <title>미용필시시험/retest - 미용필기시험 재시험</title>
        <meta name="description" content="미용필기시험 재시험" />
        <meta name="google-site-verification" content="LK2lMpCXPbmg_peIKBrco_0Rp_scYKp4Mn0u5yI6vCI" />
        <meta name="naver-site-verification" content="dd4919f9da4dfbafdd79f35ed97505cf41418c50" />
      </Helmet>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            아직 다시 풀 문제가 없어요
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            모의고사를 풀고 틀린 문제가 생기면
            <br />
            여기에서 다시 풀어볼 수 있어요.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            모의고사 풀러 가기
          </button>
        </div>
      ) : (
        <RetestCard answersToRetest={questionData} />
      )}
    </>
  );
}
