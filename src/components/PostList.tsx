import { QuestionWithExamplesAndOptions } from "@/type/testType";

export function PostList({ list, onSelectOption, selectedAnswers }: { list: QuestionWithExamplesAndOptions[], onSelectOption: (questionId: number, optionNo: number) => void, selectedAnswers: { [key: number]: number | null } }) {
  return (
    <ol>
      {list.map(({ id, no, content, examples, options }) => (
        <li key={id}>
          <h2>
            문제 {no} : {content}
          </h2>

          {examples && examples.length > 0 && (
            <div>
              <h3>보기:</h3>
              <ul>
                {examples.map((example) => (
                  <li key={example.id}>
                    {example.type === 'image' ? (
                      <img src={example.content} alt={`Example ${example.id}`} style={{ maxWidth: '100%' }} />
                    ) : (
                      <p>{example.content}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {options && options.length > 0 && (
            <div>
              <ul>
                {options.map((option) => (
                  <li key={option.no}>
                    <label
                      style={{
                        display: "block",
                        border: selectedAnswers[id] === option.no ? "2px solid #007BFF" : "2px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px",
                        marginBottom: "8px",
                        cursor: "pointer",
                        transition: "border-color 0.2s, background-color 0.2s",
                        backgroundColor: selectedAnswers[id] === option.no ? "#E0F3FF" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedAnswers[id] !== option.no) {
                          e.currentTarget.style.borderColor = "#007BFF";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedAnswers[id] !== option.no) {
                          e.currentTarget.style.borderColor = "#ccc";
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${id}`}
                        value={option.no}
                        checked={selectedAnswers[id] === option.no}
                        onChange={() => onSelectOption(id, option.no)} // 선택할 때 선지 선택
                        style={{ display: "none" }} // 라디오 버튼 숨기기
                      />
                      {option.no}.{' '}
                      {option.type === 'image' ? (
                        <img src={option.content} alt={`Option ${option.no}`} style={{ maxWidth: '100%' }} />
                      ) : (
                        <span>{option.content}</span>
                      )}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
