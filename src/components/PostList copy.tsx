import { QuestionWithExamplesAndOptions } from "@/type/testType";

export function PostList({ list }: { list: QuestionWithExamplesAndOptions[] }) {
  return (
    <ol>
      {list.map(({ id, no, content, examples, options }) => (
        <li key={id}>
          {/* 문제 제목 */}
          <h2>
            문제 {no} : {content}
          </h2>

          {/* 보기 출력 */}
          {examples && examples.length > 0 && (
            <div>
              <h3>보기:</h3>
              <ul>
                {examples.map((example) => (
                  <li key={example.id}>
                    {/* 보기의 type이 'image'일 경우 이미지 출력 */}
                    {example.type === 'image' ? (
                      <img src={example.content} alt={`Example ${example.id}`} style={{ maxWidth: '100%' }} />
                    ) : (
                      <p>{example.content}</p> // 텍스트 보기
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 선지 출력 */}
          {options && options.length > 0 && (
            <div>
              <ul>
                {options.map((option) => (
                  <li key={option.no}>
                    {/* 선지 번호와 내용 */}
                    {option.no}.{' '}
                    {option.type === 'image' ? (
                      <img src={option.content} alt={`Option ${option.no}`} style={{ maxWidth: '100%' }} />
                    ) : (
                      <span>{option.content}</span> // 텍스트 선지
                    )}
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
