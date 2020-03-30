import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import faker from "faker";
import axios from "axios";
import Rating from "../Rating";

const ProductItem = ({ product, addToCart }) => {
  const [details, setDetails] = useState("hide");
  const [rating, setRating] = useState();
  const [enable, setEnable] = useState(false);

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

  const handleButton = async e => {
    setEnable(true);
    await addToCart(product.id, product.inventory - 1);
    setTimeout(() => setEnable(false), 500);
  };

  return (
    <div className="item">
      <h1>{product.name}</h1>
      <img src={`../public/${product.name}.png`}></img>
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
      <button disabled={enable} className="addToCart" onClick={handleButton}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductItem;
