import React from "react";
const Item = React.memo(function Item({ title, price, onClick }) {
  console.log(`Rendering Item: ${title}`);

  return (
    <div className="item">
      <span>{title} - ${price}</span>
      <button onClick={() => onClick(title)}>Select</button>
    </div>
  );
});

export default Item;
    