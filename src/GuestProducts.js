import React from "react";
import GuestProdItem from "./components/Products/GuestProdItem";

const GuestProducts = ({ products }) => {
  let sortedProducts = products.sort((a, b) => {
    const prodA = a.name.toUpperCase();
    const prodB = b.name.toUpperCase();

    let comparison = 0;
    if (prodA > prodB) {
      comparison = 1;
    } else if (prodA < prodB) {
      comparison = -1;
    }
    return comparison;
  });

  return (
    <div>
      <div className="parent">
        {sortedProducts &&
          sortedProducts.map(product => {
            return <GuestProdItem key={product.id} product={product} />;
          })}
      </div>
    </div>
  );
};

export default GuestProducts;
