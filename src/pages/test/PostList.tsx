import { useEffect, useState } from "react";
import { QuestionWithExamplesAndOptions } from "@/type/testType";
import { cn } from "@/lib/utils";
import { fetchSignedUrl } from "@/hooks/fetchSignedUrl";

export function PostList({
  list,
  onSelectOption,
  selectedAnswers,
  currentPage,
  setCurrentPage,
  totalQuestions,
  onSubmit,
  instantFeedback,
}: {
  list: QuestionWithExamplesAndOptions[];
  onSelectOption: (questionId: number, optionNo: number) => void;
  selectedAnswers: { [key: number]: number | null };
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalQuestions: number;
  onSubmit: () => void;
  instantFeedback: boolean;
}) {
  const [signedUrls, setSignedUrls] = useState<{ [key: string]: string }>({});
  const [loadingImages, setLoadingImages] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const loadImageUrls = async () => {
      const urls: { [key: string]: string } = {};
      const loadingStates: { [key: string]: boolean } = {};

      for (const question of list) {
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
  }, [list]);

  const isLastPage = currentPage === totalQuestions;

  const handleOptionSelect = (
    questionId: number,
    optionNo: number,
    isCorrect: boolean
  ) => {
    onSelectOption(questionId, optionNo);

    // 마지막 문제는 항상 자동 진행 차단 → 사용자가 제출하기 CTA를 누름
    if (isLastPage) return;

    // 바로 채점 모드에서 오답이면 자동 진행 차단 → 사용자가 직접 다음으로 넘어감
    if (instantFeedback && !isCorrect) return;

    setTimeout(() => {
      setCurrentPage(currentPage + 1);
    }, 500);
  };

  const handleImageLoad = (content: string) => {
    setLoadingImages((prev) => ({ ...prev, [content]: false }));
  };

  return (
    <ol className="list-none space-y-6 flex-1 flex flex-col">
      {list.map(({ id, content, examples, options, explanation }) => {
        const selectedOptionNo = selectedAnswers[id] ?? null;
        const correctOption = options?.find((o) => o.is_correct);
        const hasSelected = selectedOptionNo !== null;
        const isAnswerCorrect =
          hasSelected && correctOption?.no === selectedOptionNo;
        // 바로 채점 모드 + 선택 완료 시에만 색상 피드백 노출
        const showFeedback = instantFeedback && hasSelected;
        const showWrongHint = showFeedback && !isAnswerCorrect;

        return (
          <li key={id} className="flex flex-col flex-1">
            <h2 className="text-xl font-bold text-center text-slate-900 leading-relaxed mb-6 px-2">
              {content}
            </h2>

            {examples && examples.length > 0 && (
              <div className="mb-6">
                <ul className="space-y-2">
                  {examples.map((example) => (
                    <li key={example.id}>
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
                            className={cn(
                              "max-w-full mx-auto",
                              loadingImages[example.content]
                                ? "hidden"
                                : "block"
                            )}
                            onLoad={() => handleImageLoad(example.content)}
                          />
                        </>
                      ) : (
                        <p className="text-sm text-slate-600 text-center">
                          {example.content}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {options && options.length > 0 && (
              <ul className="space-y-3">
                {options.map((option) => {
                  const isSelected = selectedOptionNo === option.no;
                  const isCorrectOption = !!option.is_correct;

                  // 색상 결정 로직
                  let stateClass =
                    "border-slate-200 text-slate-900 hover:border-slate-400";
                  if (showFeedback) {
                    if (isSelected && isAnswerCorrect) {
                      // 사용자가 정답을 선택
                      stateClass =
                        "border-emerald-500 bg-emerald-50 text-emerald-900";
                    } else if (isSelected && !isAnswerCorrect) {
                      // 사용자가 오답을 선택
                      stateClass =
                        "border-red-500 bg-red-50 text-red-900";
                    } else if (!isAnswerCorrect && isCorrectOption) {
                      // 오답 시 정답 옵션을 비교용으로 강조
                      stateClass =
                        "border-emerald-500 text-emerald-700 bg-white";
                    } else {
                      stateClass = "border-slate-200 text-slate-500 bg-white";
                    }
                  } else if (isSelected) {
                    // 일반 모드의 선택 상태
                    stateClass =
                      "border-slate-900 bg-slate-900 text-white";
                  }

                  return (
                    <li key={option.no}>
                      <label
                        className={cn(
                          "flex items-start gap-3 w-full px-4 py-3 rounded-2xl border bg-white shadow-sm cursor-pointer transition-colors",
                          stateClass
                        )}
                      >
                        <input
                          type="radio"
                          name={`question-${id}`}
                          value={option.no}
                          checked={isSelected}
                          onChange={() =>
                            handleOptionSelect(id, option.no, isCorrectOption)
                          }
                          className="hidden"
                        />
                        <span className="font-semibold w-5 shrink-0 text-right">
                          {option.no}.
                        </span>
                        {option.type === "image" ? (
                          <div className="flex-1 flex justify-center">
                            {loadingImages[option.content] && (
                              <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-slate-500"></div>
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
                          </div>
                        ) : (
                          <span className="flex-1 leading-relaxed text-left break-keep">
                            {option.content}
                          </span>
                        )}
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}

            {showWrongHint && correctOption && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-semibold text-red-700">
                  오답이에요
                </p>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed break-keep">
                  정답은{" "}
                  <span className="font-semibold text-emerald-700">
                    {correctOption.no}번
                  </span>
                  이에요.
                  {correctOption.type !== "image" && (
                    <>
                      {" "}
                      <span className="text-slate-900">
                        {correctOption.content}
                      </span>
                    </>
                  )}
                </p>
                {explanation && (
                  <p className="text-sm text-slate-700 mt-3 pt-3 border-t border-red-200 leading-relaxed break-keep whitespace-pre-line">
                    {explanation}
                  </p>
                )}
              </div>
            )}

            {/* 마지막 문제 → 제출하기, 바로 채점 + 오답 → 다음 문제 수동 진행 */}
            {isLastPage ? (
              <button
                onClick={onSubmit}
                className="mt-6 w-full py-4 rounded-2xl bg-slate-900 text-white text-base font-semibold hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                제출하기
              </button>
            ) : (
              showWrongHint && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="mt-3 w-full py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                >
                  다음 문제
                </button>
              )
            )}
          </li>
        );
      })}
    </ol>
  );
}
