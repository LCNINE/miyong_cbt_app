export function Pagination({
  postsNum,
  postsPerPage,
  setCurrentPage,
  currentPage
}: {
  postsNum: number,
  postsPerPage: number,
  setCurrentPage: (page: number) => void,
  currentPage: number
}) {
  const pageList = [];
  const totalPages = Math.ceil(postsNum / postsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageList.push(i);
  }

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
      <button
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        className={`w-1/2 text-center py-2 border-r border-gray-300 ${
          currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
        }`}
      >
        Prev
      </button>
      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className={`w-1/2 text-center py-2 ${
          currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
        }`}
      >
        Next
      </button>
    </div>
  );
}
