export const fetchProducts = async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  return Array.from({ length: 500 }, (_, i) => ({
    ...data[i % data.length],
    id: i + 1,
  }));
};
