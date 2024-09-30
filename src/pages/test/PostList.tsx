import { supabase } from "@/lib/supabaseClient";
import { QuestionWithExamplesAndOptions } from "@/type/testType";
import { useEffect, useState } from "react";

export function PostList({
  list,
  onSelectOption,
  selectedAnswers,
  currentPage,
  setCurrentPage,
  totalQuestions
}: {
  list: QuestionWithExamplesAndOptions[],
  onSelectOption: (questionId: number, optionNo: number) => void,
  selectedAnswers: { [key: number]: number | null },
  currentPage: number,
  setCurrentPage: (page: number) => void,
  totalQuestions: number
}) {
  const [signedUrls, setSignedUrls] = useState<{ [key: string]: string }>({});

  // 이미지 URL 가져오는 함수
  const fetchSignedUrl = async (path: string) => {
    const { data, error } = await supabase.storage
      .from('image')  // 버킷 이름을 넣으세요
      .createSignedUrl(path, 60); // URL 유효 기간(초)
    
    if (error) {
      console.error('Error fetching signed URL:', error);
      return null;
    }

    return data?.signedUrl;
  };

  useEffect(() => {
    const loadImageUrls = async () => {
      const urls: { [key: string]: string } = {};

      // 리스트의 모든 이미지 예시들에 대해 Signed URL 가져오기
      for (const question of list) {
        if (question.examples) {
          for (const example of question.examples) {
            if (example.type === 'image') {
              console.log('example.content : ' + example.content);
              const url = await fetchSignedUrl(example.content);  // 예시의 content가 파일의 경로라고 가정
              if (url) {
                console.log('url : ' + url)
                urls[example.content] = url;
              }
            }
          }
        }

        // 옵션들에 대한 이미지 URL도 가져오기
        if (question.options) {
          for (const option of question.options) {
            if (option.type === 'image') {
              const url = await fetchSignedUrl(option.content);
              if (url) {
                urls[option.content] = url;
              }
            }
          }
        }
      }

      setSignedUrls(urls);  // Signed URL들을 state로 저장
    };

    loadImageUrls();
  }, [list]);
  const handleOptionSelect = (questionId: number, optionNo: number) => {
    onSelectOption(questionId, optionNo);

    // 자동으로 다음 페이지로 이동, 마지막 페이지에서는 이동하지 않음
    if (currentPage < totalQuestions) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <ol className="list-none list-inside space-y-8">
      {list.map(({ id, no, content, examples, options }) => (
        <li key={id} className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            문제 {no}: {content}
          </h2>

          {examples && examples.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">보기:</h3>
              <ul className="space-y-2">
                {examples.map((example) => (
                  <li key={example.id}>
                    {example.type === 'image' ? (
                      <img
                        src={signedUrls[example.content] || ''}
                        alt={`Example ${example.id}`}
                        className="max-w-full"
                      />
                    ) : (
                      <p>{example.content}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {options && options.length > 0 && (
            <div className="mb-4">
              <ul className="space-y-2">
                {options.map((option) => (
                  <li key={option.no}>
                    <label
                      className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAnswers[id] === option.no
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${id}`}
                        value={option.no}
                        checked={selectedAnswers[id] === option.no}
                        onChange={() => handleOptionSelect(id, option.no)}
                        className="hidden"
                      />
                      {option.no}.{' '}
                      {option.type === 'image' ? (
                        <img
                          src={signedUrls[option.content] || ''}
                          alt={`Option ${option.no}`}
                          className="max-w-full"
                        />
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
