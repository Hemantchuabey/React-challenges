import Table from "../components/Table";
import { useProducts } from "../hooks/useProducts";
import { useSearchParams } from "react-router-dom";
export default function ProductPages() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const filter = searchParams.get("filter") || "";
  const sortAsc = searchParams.get("sort") !== "desc";

  const updatedParams = (updates) => {
    const newParams = {
      page,
      filter,
      sort: sortAsc ? "asc" : "desc",
      ...updates,
    };

    setSearchParams(newParams);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  return (
    <Table
      products={products}
      page={page}
      filter={filter}
      sortAsc={sortAsc}
      updateParams={updatedParams}
    />
  );
}
