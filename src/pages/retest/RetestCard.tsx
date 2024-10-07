import { fetchSignedUrl } from "@/hooks/fetchSignedUrl";
import { cn } from "@/lib/utils";
import { reTestQustion } from "@/type/testType";
import { useEffect, useState } from "react";

// 리테스트 카드 컴포넌트에 넘길 props 타입 정의
type RetestCardProb = {
  answersToRetest: reTestQustion[];
};

export default function RetestCard({ answersToRetest }: RetestCardProb) {
  // 이미지 URL 상태 및 로딩 상태 관리
  const [signedUrls, setSignedUrls] = useState<{ [key: string]: string }>({});
  const [loadingImages, setLoadingImages] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const loadImageUrls = async () => {
      const urls: { [key: string]: string } = {};
      const loadingStates: { [key: string]: boolean } = {};

      // 모든 예시 및 옵션 이미지의 signed URL 가져오기
      for (const question of answersToRetest) {
        if (question.examples) {
          for (const example of question.examples) {
            if (example.type === "image") {
              const url = await fetchSignedUrl(example.content);
              if (url) {
                urls[example.content] = url;
                loadingStates[example.content] = true;
              }
            }
          }
        }

        if (question.options) {
          for (const option of question.options) {
            if (option.type === "image") {
              const url = await fetchSignedUrl(option.content);
              if (url) {
                urls[option.content] = url;
                loadingStates[option.content] = true;
              }
            }
          }
        }
      }

      setSignedUrls(urls);
      setLoadingImages(loadingStates);
    };

    loadImageUrls();
  }, [answersToRetest]);

  // 이미지 로딩 완료 핸들러 추가
  const handleImageLoad = (content: string) => {
    setLoadingImages((prev) => ({ ...prev, [content]: false }));
  };

  return (
    <ol className="list-none list-inside space-y-8">
      {answersToRetest.map(
        ({
          id,
          no,
          content,
          examples,
          options,
          chose_option,
          correct_option,
        }) => (
          <li key={id} className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              문제 {no}: {content}
            </h2>

            {/* 보기가 있는 경우 */}
            {examples.map((example) => (
              <div key={example.id}>
                {example.type === "image" ? (
                  <>
                    {loadingImages[example.content] && (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-500"></div>
                      </div>
                    )}
                    <img
                      src={signedUrls[example.content] || ""}
                      alt={`Example ${example.id}`}
                      className="max-w-full"
                      onLoad={() => handleImageLoad(example.content)}
                    />
                  </>
                ) : (
                  <p>{example.content}</p>
                )}
              </div>
            ))}

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
                              ? "border-green-500 bg-green-100" // 맞춘 경우
                              : "border-red-500 bg-red-100" // 틀린 경우
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
                        {option.no}.{" "}
                        {option.type === "image" ? (
                          <>
                            {loadingImages[option.content] && (
                              <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-500"></div>
                              </div>
                            )}
                            <img
                              src={signedUrls[option.content] || ""}
                              alt={`Option ${option.no}`}
                              className={cn(
                                "max-w-full",
                                loadingImages[option.content]
                                  ? "hidden"
                                  : "block"
                              )}
                              onLoad={() => handleImageLoad(option.content)}
                            />
                          </>
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
              <h4 className="text-md font-semibold text-green-500">
                정답: {correct_option}
              </h4>
            </div>
          </li>
        )
      )}
    </ol>
  );
}
