import React from "react";
import faker from "faker";

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
        <div className="item">
          <h1>{faker.commerce.product()}</h1>
          <img src="http://placeimg.com/140/80/animals"></img>
          <h4>{faker.commerce.price()}</h4>
          <p>
            This product is {faker.commerce.productAdjective()}. It is{" "}
            {faker.commerce.productMaterial()}.
          </p>
        </div>
        <div className="item">
          <h1>{faker.commerce.product()}</h1>
          <img src="http://placeimg.com/140/80/animals"></img>
          <h4>{faker.commerce.price()}</h4>
          <p>
            This product is {faker.commerce.productAdjective()}. It is{" "}
            {faker.commerce.productMaterial()}.
          </p>
        </div>
        <div className="item">
          <h1>{faker.commerce.product()}</h1>
          <img src="http://placeimg.com/140/80/animals"></img>
          <h4>{faker.commerce.price()}</h4>
          <p>
            This product is {faker.commerce.productAdjective()}. It is{" "}
            {faker.commerce.productMaterial()}.
          </p>
        </div>
        {products.map(product => {
          return (
            <div key={product.id} className="item">
              <h1>{product.name}</h1>
              <img src="http://placeimg.com/140/80/animals"></img>
              <h4>{product.price}</h4>
              <h1>
                <b>&#10576;</b>
              </h1>
              <p>
                This product is {faker.commerce.productAdjective()}. It is{" "}
                {faker.commerce.productMaterial()}.
              </p>
              <button onClick={() => addToCart(product.id)}>Add to Cart</button>
            </div>
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
