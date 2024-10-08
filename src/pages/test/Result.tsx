import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { incorrectAnswer } from "@/type/testType";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { licenseName, made_at, episode, answers } = location.state || {};

  const [score, setScore] = useState<number | null>(null);
  const [isPassed, setIsPassed] = useState<boolean | null>(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Array<incorrectAnswer>>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const { data: correctOptions, error } = await supabase
        .from("question_options")
        .select("question_id, no")
        .eq("is_correct", true)
        .in(
          "question_id",
          answers.map((answer: { questionId: number; optionNo: number }) => answer.questionId)
        );

      if (error) {
        console.error("Error fetching correct answers:", error);
        return;
      }

      let correctCount = 0;
      const incorrectList: Array<incorrectAnswer> = [];

      answers.forEach((answer: { questionId: number; optionNo: number }) => {
        const correctOption = correctOptions.find(
          (correct: { question_id: number; no: number }) => correct.question_id === answer.questionId
        );
        if (correctOption && correctOption.no === answer.optionNo) {
          correctCount++;
        } else if (correctOption && !(correctOption.no === answer.optionNo)) {
          incorrectList.push({
            questionId: answer.questionId,
            selectedOption: answer.optionNo,
          });
        }
      });

      setIncorrectAnswers(incorrectList);

      const calculatedScore = (correctCount * 10) / 6;
      setScore(calculatedScore);

      setIsPassed(calculatedScore >= 60);
    };

    fetchResults();
  }, [answers]);

  const handleReviewIncorrectAnswers = () => {
    navigate("/retest/afterTest", { state: { incorrectAnswers } });
  };

  const handleToHome = () => {
    navigate("/");
  };

  return (
    <div className="h-full flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md mx-4 p-8"
      >
        <h1 className="text-[1.4rem] font-semibold text-center text-gray-900 mb-8">
          {licenseName} : {episode}회({made_at})
        </h1>
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">
          모의고사 결과
        </h1>
        {score !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="text-center mb-6">
              <p className="text-5xl font-bold text-gray-900">
                {Math.round(score)}점
              </p>
              <p className={`text-xl mt-2 ${isPassed ? "text-green-500" : "text-red-500"}`}>
                {isPassed ? "합격을 축하합니다." : "아쉽게도 불합격입니다."}
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleToHome}
                className="w-full py-3 bg-gray-900 text-white rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                홈으로 돌아가기
              </button>
              {score !== 100 && (
                <button
                  onClick={handleReviewIncorrectAnswers}
                  className="w-full py-3 bg-gray-200 text-gray-900 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  오답노트 보기
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <p className="text-center text-gray-500">결과를 불러오는 중입니다...</p>
        )}
      </motion.div>
    </div>
  );
}
