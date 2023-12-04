import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

const SortingArrow = ({ sortBy, sortOrder, activeSortBy, handleSortOrderChange, level }) => {
    return (
        <div className='d-flex align-items-center justify-content-center'>
            {level}
            <div className='d-flex flex-column ms-1'>
                <TiArrowSortedUp
                    onClick={() => handleSortOrderChange('asc', sortBy)}
                    className={`sortOrder ${activeSortBy === sortBy ? (sortOrder === 'asc' ? "ascActive" : "") : ""}`}
                />
                <TiArrowSortedDown
                    onClick={() => handleSortOrderChange('desc', sortBy)}
                    className={`sortOrder ${activeSortBy === sortBy ? (sortOrder === 'desc' ? "descActive" : "") : ""}`}
                />
            </div>
        </div>
    );
};

export default SortingArrow;
