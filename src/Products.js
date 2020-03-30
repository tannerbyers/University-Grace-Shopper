import React from "react";
import faker from "faker";
import { Grid } from "@material-ui/core";
import Rating from "./components/Rating";
import ProductItem from "./components/Products/ProductItem";
//import ProductNav from "./components/Products/ProductNav";

const Products = ({ products, addToCart }) => {
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
      <Grid className="products-heading" container spacing={1}>
        <h2>
          <span>━━━━━━━</span>PRODUCTS<span>━━━━━━━</span>
        </h2>
      </Grid>
      <Grid
        className="products-container"
        container
        spacing={10}
        justify="center"
      >
        {sortedProducts &&
          sortedProducts.map(product => {
            return (
              <Grid item xs={6}>
                <ProductItem
                  key={product.id}
                  addToCart={addToCart}
                  product={product}
                />
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default Products;
