import { useEffect, useState } from "react";

export function useItem() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchItems() {
      try {
        setLoading(true);
        const res = await fetch("https://dummyjson.com/products?limit=500");
        const data = await res.json();



        if (isMounted) {
          setItems(data.products);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return { items, loading, error };
}
