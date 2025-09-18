export default function Pagination({currentPage,totalItems, itemsPerPage,onPageChange}){
    const totalPages = Math.ceil(totalItems/ itemsPerPage)

    return (
        <div className="flex gap-2 mt-2">
            <button className="border px-2 py-1" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button className = "border px-2 py-1" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
    )
}