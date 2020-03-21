import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import faker from "faker";

const ProductItem = ({ product, addToCart }) => {
  const [details, setDetails] = useState("hide");
  const [inventory, setInventory] = useState(0);

  useEffect(() => {
    setInventory(product.inventory);
    console.log(product.inventory);
  }, []);

  const handleClick = e => {
    setInventory(inventory - 1);
    if (details == "") {
      setDetails("hide");
    } else {
      setDetails("");
    }
  };

  console.log(inventory);

  return (
    <div className="item">
      <h1>{product.name}</h1>
      <img src="http://placeimg.com/140/80/animals"></img>
      <h3>${product.price}</h3>
      <h4>Stock : {inventory}</h4>
      <h1>
        <button className="details" onClick={handleClick}>
          &#10576;
        </button>
      </h1>
      <p className={details}>
        This product is {faker.commerce.productAdjective()}. It is{" "}
        {faker.commerce.productMaterial()}.
      </p>
      <button onClick={() => addToCart(product.id, product.inventory)}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductItem;
