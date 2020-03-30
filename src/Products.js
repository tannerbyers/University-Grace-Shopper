import React from "react";
import faker from "faker";
import { Grid, Box } from "@material-ui/core";
import Rating from "./components/Rating";
import ProductItem from "./components/Products/ProductItem";
import Footer from "./components/Footer"
//import ProductNav from "./components/Products/ProductNav";

const Products = ({ products, addToCart, lineItems }) => {
  let sortedProducts = products;

  function compare(a, b) {
    const productA = a.name.toUpperCase();
    const productB = b.name.toUpperCase();


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
            <img style={{height: "100vh", width: "100%"}}src={`../public/homepage.png`} />
      <Grid className="products-heading" container spacing={1}>
        <h2>
          <span>━━━━━━━</span>PRODUCTS<span>━━━━━━━</span>
        </h2>
      </Grid>
      <Box
        display="flex"
        flexDirection="row"
        className="products-container"
        container
        justifyContent="center"
        flexWrap="wrap"
        spacing={10}
      >
        {sortedProducts &&
          sortedProducts.map(product => {
            return (
              <Box item xs={6}>
                <ProductItem
                key={product.id}
                addToCart={addToCart}
                product={product}
                lineItems={lineItems}
                />
              </Box>
            );
          })}
      </Box>
      <Footer />
    </div>
  );
};

export default Products;
