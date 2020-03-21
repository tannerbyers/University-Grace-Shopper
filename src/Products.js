import React from "react";
import faker from "faker";
import Rating from "./components/Rating";
import ProductItem from "./components/Products/ProductItem";
import ProductNav from "./components/Products/ProductNav";

const Products = ({ products, addToCart }) => {
  return (
    <div>
      <ProductNav />
      <div className="parent">
        {products.map(product => {
          return (
            <ProductItem
              key={product.id}
              addToCart={addToCart}
              product={product}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Products;

/*
<ul>
        {
          products.map( product => {
            return (
              <li key={ product.id }>
                <span>
                { product.name }
                </span>
                <span>
                ${
                  Number(product.price).toFixed(2)
                }
                </span>
                <button onClick={ ()=> addToCart(product.id)}>Add to Cart</button>
              </li>
            );
          })
        }
      </ul>
      */
