import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productsApi";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);
  return { products, loading };
}
