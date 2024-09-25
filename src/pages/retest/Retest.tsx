import { incorrectAnswers } from "@/type/testType";
import { useLocation } from "react-router-dom";

export default function Retest (){
  const location = useLocation();
  const incorrectAnswers: Array<incorrectAnswers>= location.state?.incorrectAnswers || {};

  console.log(incorrectAnswers)

  return (
    <ol className="list-none list-inside space-y-8">
      {incorrectAnswers.map(({ questionId, selectedOption}) => (
        <li>
          <h2 className="text-xl font-semibold mb-4">
            문제 {questionId}
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            고른답 {selectedOption}
          </h2>
        </li>
      ))}
    </ol>
  )
}