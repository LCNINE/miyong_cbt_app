import { incorrectAnswer } from "@/type/testType";
import { useLocation } from "react-router-dom";
import RetestCard from "./RetestCard";

export default function Retest (){
  const location = useLocation();
  const incorrectAnswers: Array<incorrectAnswer>= location.state?.incorrectAnswers || {};

  console.log(incorrectAnswers)

  return (
    <RetestCard answersToRetest={incorrectAnswers}/>
  )
}