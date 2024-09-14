export function Pagination({
  postsNum,
  postsPerPage,
  setCurrentPage,
  currentPage
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
    <div className="fixed bottom-0 w-full bg-gray-100 border-t border-gray-300 flex justify-around py-3">
      <div className="text-center w-1/2 border-r-2 border-gray-300">
        <button onClick={goToPrevPage} disabled={currentPage === 1} className="w-full">
          prev
        </button>
      </div>
      <div className="text-center w-1/2">
        <button onClick={goToNextPage} disabled={currentPage === pageList.length} className="w-full">
          next
        </button>
      </div>
    </div>
  );
}