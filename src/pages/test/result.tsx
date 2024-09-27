import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { incorrectAnswer } from "@/type/testType";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../auth/AuthContext";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용
  const { license_id, made_at, answers } = location.state || {};
  const { user, loading } = useAuth();

  console.log(answers)

  const [score, setScore] = useState<number | null>(null);
  const [isPassed, setIsPassed] = useState<boolean | null>(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Array<incorrectAnswer>>([]); // 틀린 답안 저장할 배열

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
      const incorrectList: Array<incorrectAnswer> = [];
  
      // 사용자가 제출한 답안과 서버에서 받아온 정답을 비교
      answers.forEach((answer: { questionId: number; optionNo: number }) => {
        const correctOption = correctOptions.find(
          (correct: { question_id: number; no: number }) => correct.question_id === answer.questionId
        );
        if (correctOption && correctOption.no === answer.optionNo) {
          correctCount++;
        }else if(correctOption && !(correctOption.no === answer.optionNo)){
          incorrectList.push({
            questionId: answer.questionId,
            selectedOption: answer.optionNo
          });
        }
      });

      // 틀린 문제를 상태로 저장
      setIncorrectAnswers(incorrectList);
      console.log()
      
      if (!loading && user && incorrectAnswers && incorrectAnswers.length > 0) {
        console.log(11111111111111)
        // incorrectAnswers 배열을 map으로 변환한 후에 insert에 전달
        const insertData = incorrectAnswers.map(answers => ({
          question_id: answers.questionId,
          chose_answer: answers.selectedOption,
          user_id: user.id, // useAuth로부터 받은 user 객체의 id 사용
        }));

        // insert 호출
        const { error: insertError } = await supabase
          .from('wrong_logs')
          .insert(insertData);

        if (insertError) throw insertError; // 에러가 있으면 던지기
      }
      
      const calculatedScore = correctCount * 10/6;
      setScore(calculatedScore);

      // 예를 들어 60점 이상이면 합격
      setIsPassed(calculatedScore >= 60);
    };
  
    fetchResults();
  }, []);

  useEffect(() => {
    const insertWrongLogs = async () => {
      if (!loading && user && incorrectAnswers && incorrectAnswers.length > 0) {
        console.log(11111111111111)
        // incorrectAnswers 배열을 map으로 변환한 후에 insert에 전달
        const insertData = incorrectAnswers.map(answers => ({
          question_id: answers.questionId,
          chose_answer: answers.selectedOption,
          user_id: user.id, // useAuth로부터 받은 user 객체의 id 사용
        }));

        // insert 호출
        const { error: insertError } = await supabase
          .from('wrong_logs')
          .insert(insertData);

        if (insertError) throw insertError; // 에러가 있으면 던지기
      }
    }
    insertWrongLogs()
  },[incorrectAnswers, loading, user])

  // 오답노트 페이지로 이동하는 함수
  const handleReviewIncorrectAnswers = () => {
    navigate("/retest", { state: { incorrectAnswers } }); // 오답노트 페이지로 이동하며, 틀린 답안을 상태로 전달
  };
  // 홈으로 이동하는 함수
  const handleToHome = () => {
    navigate("/"); // 오답노트 페이지로 이동하며, 틀린 답안을 상태로 전달
  };

  return (
    <div>
      <h1>{license_id} : {made_at} 모의고사 결과</h1>
      {score !== null && (
        <div>
          <p>당신의 점수는: {Math.round(score)}점 입니다.</p>
          <p>{isPassed ? "합격" : "불합격"}</p>
          <Button onClick={handleToHome} className="mt-4">
              홈으로
          </Button>
          {score != 100 &&(
            <Button onClick={handleReviewIncorrectAnswers} className="mt-4">
              오답노트 보기
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
