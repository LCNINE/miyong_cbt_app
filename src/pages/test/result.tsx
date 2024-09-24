import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Result() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const license_id = queryParams.get("license_id");
  const made_at = queryParams.get("made_at");
  const answers = JSON.parse(queryParams.get("answers") || "[]"); // 전달받은 답안 데이터

  console.log(answers)

  const [score, setScore] = useState<number | null>(null);
  const [isPassed, setIsPassed] = useState<boolean | null>(null);

  // 결과 계산
  useEffect(() => {
    const fetchResults = async () => {
      // 서버에서 모든 문제의 정답을 가져옴 (is_correct = true인 옵션만 가져오기)
      const { data: correctOptions, error } = await supabase
        .from("question_options") // question_options 테이블에서
        .select("question_id, no") // question_id와 정답 번호(no) 가져오기
        .eq("is_correct", true) // 정답인 옵션만
        .in("question_id", answers.map((answer: { questionId: number; optionNo: number }) => answer.questionId)); // 사용자가 제출한 question_id에 해당하는 정답만 가져옴
  
      if (error) {
        console.error("Error fetching correct answers:", error);
        return;
      }
  
      let correctCount = 0;
  
      // 사용자가 제출한 답안과 서버에서 받아온 정답을 비교
      answers.forEach((answer: { questionId: number; optionNo: number }) => {
        const correctOption = correctOptions.find(
          (correct: { question_id: number; no: number }) => correct.question_id === answer.questionId
        );
        if (correctOption && correctOption.no === answer.optionNo) {
          correctCount++;
        }
      });
      

      // 60% 점수 계산
      const calculatedScore = correctCount * 0.6;
      setScore(calculatedScore);

      // 예를 들어 60점 이상이면 합격
      setIsPassed(calculatedScore >= 60);
    };
  
    fetchResults();
  }, [answers, license_id, made_at]);

  return (
    <div>
      <h1>{license_id} : {made_at} 모의고사 결과</h1>
      {score !== null && (
        <div>
          <p>당신의 점수는: {Math.round(score)}점 입니다.</p>
          <p>{isPassed ? "합격" : "불합격"}</p>
        </div>
      )}
    </div>
  );
}
