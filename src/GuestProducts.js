import React from "react";
import GuestProdItem from "./components/Products/GuestProdItem";
import { Grid } from "@material-ui/core";

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
    <div className="products-page">
      <Grid className="products-heading" container spacing={3}>
        <h2>
          <span>━━━━━━━</span>PRODUCTS<span>━━━━━━━</span>
        </h2>
      </Grid>
      <Grid className="products-container" container spacing={3}>
        {sortedProducts &&
          sortedProducts.map(product => {
            return (
              <Grid item xs={3}>
                <GuestProdItem
                  className="product-card"
                  key={product.id}
                  product={product}
                />
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default GuestProducts;
