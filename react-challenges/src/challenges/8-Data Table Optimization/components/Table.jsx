import { useCallback, useMemo } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 20;
const Table = ({ products,page, filter, sortAsc, updateParams }) => {
  // const [filter, setFilter] = useState("");
  // const [sortAsc, setSortAsc] = useState(true);
  // const [page, setPage] = useState(1);
  console.log("Products : ", products);


  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(filter.toLowerCase())
  );
  },[products,filter])
  
  
  console.log("FilteredProducts : ", filtered);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  );
  },[filtered,sortAsc])
  console.log("Sorted Products : ", sorted);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return sorted.slice(start, start + ITEMS_PER_PAGE);
  }, [sorted, page]);

const handleFilter = useCallback((e) => {  
  updateParams({filter : e.target.value , page: 1})
},[updateParams])


 const handleSort = useCallback(
    () => updateParams({ sort: sortAsc ? "desc" : "asc" }),
    [updateParams, sortAsc]
  );

const handlePageChange = useCallback((newPage) => {
  updateParams({page : newPage})
}, [updateParams])

  return (
    <div>
      <input
        className="border px-2 py-1 mb-2 "
        placeholder="Filter by title..."
        value={filter}
        onChange={handleFilter}
      />
      <table className="w-[50vw] border-collapse border border-gray-300">
        <TableHeader sortAsc={sortAsc} onSort={handleSort} />
        <TableBody products={paginated} />
      </table>
      <Pagination
        currentPage={page}
        totalItems={sorted.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Table;
