import React from "react";
import GuestProdItem from "./components/Products/GuestProdItem";
import { Grid, Box } from "@material-ui/core";
import Footer from "./components/Footer";

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
      <img
        style={{ height: "100vh", width: "100%" }}
        src={`../public/homepage.png`}
      />
      <Grid className="products-heading" container spacing={1}>
        <h2>
          <span>━━━━━━━</span>PRODUCTS<span>━━━━━━━</span>
        </h2>
      </Grid>
      <Box
        className="products-container"
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
                <GuestProdItem key={product.id} product={product} />
              </Box>
            );
          })}
      </Box>
      <Footer />
    </div>
  );
};

export default GuestProducts;
