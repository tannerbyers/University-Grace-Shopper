import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import faker from "faker";
import axios from "axios";
import Rating from "../Rating";

const ProductItem = ({ product, addToCart }) => {
  const [details, setDetails] = useState("hide");
  const [rating, setRating] = useState();

  useEffect(() => {
    axios
      .get("/api/avgratings", { params: { productId: product.id } })
      .then(rating => setRating(Math.round(rating.data.avg)));
  }, []);

  const handleClick = e => {
    if (details == "") {
      setDetails("hide");
    } else {
      setDetails("");
    }
  };

  const RenderButton = () => {
    if (product.inventory && product.inventory > 0) {
      return (
        <button onClick={() => addToCart(product.id, product.inventory - 1)}>
          Add to Cart
        </button>
      );
    } else {
      return <button disabled={true}>Add to Cart</button>;
    }
  };

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
        This product is {faker.commerce.productAdjective()}.<br></br>
        Average Rating
        <Rating active={false} rating={rating} />
      </p>
      <RenderButton />
    </div>
  );
};

export default ProductItem;
