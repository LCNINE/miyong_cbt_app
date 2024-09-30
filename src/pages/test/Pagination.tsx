export function Pagination({
  postsNum,
  postsPerPage,
  setCurrentPage,
  currentPage,
  handleSubmit,  // handleSubmit 함수를 props로 받아옵니다.
}: {
  postsNum: number,
  postsPerPage: number,
  setCurrentPage: (page: number) => void,
  currentPage: number,
  handleSubmit: () => void,  // 결과 제출 함수
}) {
  const totalPages = Math.ceil(postsNum / postsPerPage);

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  if (totalPages === 1) {
    return null;
  }

  return (
    <div className="w-full h-12 bg-gray-100 border-t border-gray-300 flex justify-between items-center py-3">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        className={`w-1/2 text-center py-2 border-r border-gray-300 ${
          currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
        }`}
      >
        이전
      </button>

      {/* 현재 페이지가 마지막 페이지일 경우 handleSubmit 실행, 그렇지 않으면 다음 페이지로 이동 */}
      {currentPage === totalPages ? (
        <button
          onClick={handleSubmit}
          className="w-1/2 text-center py-2 hover:bg-gray-200"
        >
          제출
        </button>
      ) : (
        <button
          onClick={goToNextPage}
          className={`w-1/2 text-center py-2 ${
            currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
          }`}
        >
          다음
        </button>
      )}
    </div>
  );
}
