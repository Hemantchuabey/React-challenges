import React, { useCallback, useMemo } from "react";
import Item from "./Item";
import { Virtuoso } from "react-virtuoso"; 

function List({ items }) {
  const handleClick = useCallback((title) => {
    console.log("Clicked:", title);
  }, []);

  // Always return an array
  const itemList = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
    }));
  }, [items]);

  if (!itemList || itemList.length === 0) {
    return <p>No items found</p>;
  }

  return (
    <Virtuoso
      style={{ height: 600, width: "100vw" }}
      totalCount={itemList.length}
      itemContent={(index) => {
        const item = itemList[index];
        return (
          <Item
            title={item.title}
            price={item.price}
            onClick={handleClick}
          />
        );
      }}
    />
  );
}

export default React.memo(List);
