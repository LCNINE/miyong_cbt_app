import { reTestQustion } from "@/type/testType";

// 리테스트 카드 컴포넌트에 넘길 props 타입 정의
type RetestCardProb = {
  answersToRetest: reTestQustion[];
};

export default function RetestCard({ answersToRetest }: RetestCardProb) {
  return (
    <ol className="list-none list-inside space-y-8">
      {answersToRetest.map(({ id, no, content, examples, options, chose_option, correct_option }) => (
        <li key={id} className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            문제 {no}: {content}
          </h2>

          {/* 보기가 있는 경우 */}
          {examples && examples.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">보기:</h3>
              <ul className="space-y-2">
                {examples.map((example) => (
                  <li key={example.id}>
                    {example.type === 'image' ? (
                      <img src={example.content} alt={`Example ${example.id}`} className="max-w-full" />
                    ) : (
                      <p>{example.content}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 선택 옵션 렌더링 */}
          {options && options.length > 0 && (
            <div className="mb-4">
              <ul className="space-y-2">
                {options.map((option) => (
                  <li key={option.no}>
                    <label
                      className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                        chose_option === option.no
                          ? chose_option === correct_option
                            ? "border-green-500 bg-green-100"  // 맞춘 경우
                            : "border-red-500 bg-red-100"      // 틀린 경우
                          : "border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${id}`}
                        value={option.no}
                        checked={chose_option === option.no}
                        readOnly
                        className="hidden"
                      />
                      {option.no}.{' '}
                      {option.type === 'image' ? (
                        <img src={option.content} alt={`Option ${option.no}`} className="max-w-full" />
                      ) : (
                        <span>{option.content}</span>
                      )}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 정답과 해설 */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="text-md font-semibold text-green-500">정답: {correct_option}</h4>
            <p className="text-gray-700">해설: 추가해야함</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
