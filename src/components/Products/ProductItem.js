import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import faker from "faker";

const ProductItem = ({ product, addToCart }) => {
  const [details, setDetails] = useState("hide");

  const handleClick = e => {
    if (details == "") {
      setDetails("hide");
    } else {
      setDetails("");
    }
  };

  console.log(product);

  return (
    <div className="item">
      <h1>{product.name}</h1>
      <img src="http://placeimg.com/140/80/animals"></img>
      <h3>${product.price}</h3>
      <h4>Stock : {product.inventory}</h4>
      <h1>
        <button className="details" onClick={handleClick}>
          &#10576;
        </button>
      </h1>
      <p className={details}>
        This product is {faker.commerce.productAdjective()}. It is
        {faker.commerce.productMaterial()}.
      </p>
      <button onClick={() => addToCart(product.id, product.inventory - 1)}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductItem;
