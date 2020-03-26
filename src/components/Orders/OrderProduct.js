import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Rating from "../Rating";
import axios from "axios";
import { create } from "domain";

const OrderProduct = ({ product, lineItem, order }) => {
  let [rating, setRating] = useState();

  const productId = product.id;
  const userId = order.userId;

  useEffect(() => {
    let ratingData;
    axios
      .get("/api/ratings", { params: { userId, productId } })
      .then(rating => {
        setRating(rating.data.rating);
        console.log(rating);
      });
  }, []);

  const createRating = rating => {
    axios
      .post("/api/ratings", { rating, userId, productId })
      .then(rating => console.log(rating));
  };

  console.log(rating);

  return (
    <li key={lineItem.id}>
      {product && product.name}
      <span className="quantity">
        Quantity: {lineItem.quantity}
        {rating == undefined ? (
          <Rating rating={rating} setRating={setRating} />
        ) : (
          <p>thanks for your input!{createRating(rating)}</p>
        )}
      </span>
    </li>
  );
};

export default OrderProduct;
