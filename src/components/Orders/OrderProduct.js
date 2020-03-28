import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Rating from "../Rating";
import axios from "axios";
import { create } from "domain";

const OrderProduct = ({ product, lineItem, order }) => {
  let [rating, setRating] = useState();
  let [orderAddress, setAddress] = useState();

  const productId = product.id;
  const userId = order.userId;
  const orderId = order.id;

  useEffect(() => {
    axios
      .get("/api/ratings", { params: { userId, productId } })
      .then(rating => {
        setRating(rating.data.rating);
        console.log(rating);
      });
    axios
      .get("/api/addresses", { params: { userId: userId, orderId: orderId } })
      .then(address => setAddress(address.data.address));
  }, []);

  const createRating = rating => {
    axios
      .post("/api/ratings", { rating, userId, productId })
      .then(rating => console.log(rating));
  };

  return (
    <li key={lineItem.id}>
      {product && product.name}
      <span className="quantity">
        Quantity: {lineItem.quantity}
        <br></br>
        Price: {product.price}
        <br></br>
        Address: {orderAddress}
        <br></br>
        Order placed on: {order.createdAt.slice(0, 10)}
        <br></br>
        {rating == undefined ? (
          <Rating rating={rating} setRating={setRating} />
        ) : (
          <div>
            <p>thanks for your input!</p>
            {createRating(rating)}
          </div>
        )}
      </span>
    </li>
  );
};

export default OrderProduct;
