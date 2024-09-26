import { incorrectAnswer } from "@/type/testType";

type RetestCardProb = {
  answersToRetest: incorrectAnswer[];
};

export default function RetestCard({ answersToRetest }: RetestCardProb){
  return(
    <>
      <ol className="list-none list-inside space-y-8">
        {answersToRetest.map(({ questionId, selectedOption}) => (
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
    </>
  )
}