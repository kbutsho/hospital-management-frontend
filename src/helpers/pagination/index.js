const Pagination = ({ totalItem, currentPage, dataPerPage, handelPaginate }) => {
    const totalPages = Math.ceil(totalItem / dataPerPage);
    const maxVisiblePages = 5;
    if (totalPages <= 1) {
        return null;
    }
    const renderPaginationButtons = () => {
        const buttons = [];
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (currentPage > 1) {
            buttons.push(
                <button
                    key="prev"
                    className="paginationBtn"
                    onClick={() => handelPaginate(currentPage - 1)}>
                    Prev
                </button>
            );
        }
        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    className="paginationBtn"
                    onClick={() => handelPaginate(1)}>
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(<span key="ellipsis-start">...</span>);
            }
        }
        for (let page = startPage; page <= endPage; page++) {
            buttons.push(
                <button
                    key={page}
                    className={`paginationBtn ${currentPage === page ? "activePagination" : ''}`}
                    onClick={() => handelPaginate(page)}
                >
                    {page}
                </button>
            );
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(<span key="ellipsis-end">...</span>);
            }
            buttons.push(
                <button
                    key={totalPages}
                    className="paginationBtn"
                    onClick={() => handelPaginate(totalPages)}>
                    {totalPages}
                </button>
            );
        }
        if (currentPage < totalPages) {
            buttons.push(
                <button
                    key="next"
                    className="paginationBtn"
                    onClick={() => handelPaginate(currentPage + 1)}>
                    Next
                </button>
            );
        }
        return buttons;
    };
    return <div className="pagination">{renderPaginationButtons()}</div>;
};

export default Pagination;
