import React from "react";
import faker from "faker";
import Rating from "./components/Rating";
import ProductItem from "./components/Products/ProductItem";

const Products = ({ products, addToCart }) => {
  return (
    <div>
      <nav className="product-filter">
        <h1>Products</h1>

        <div className="sort">
          <div className="collection-sort">
            <label>Filter by:</label>
            <select>
              <option value="/">All Products</option>
            </select>
          </div>

          <div className="collection-sort">
            <label>Sort by:</label>
            <select>
              <option value="/">Featured</option>
            </select>
          </div>
        </div>
      </nav>
      <div className="parent">
        {products.map(product => {
          return <ProductItem addToCart={addToCart} product={product} />;
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
