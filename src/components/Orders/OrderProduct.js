import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Rating from "../Rating";
import axios from "axios";
import { create } from "domain";

const OrderProduct = ({ product, lineItem, order }) => {
  let [rating, setRating] = useState();
  let [orderAddress, setAddress] = useState();
  let [size, setSize] = useState("20%");

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
      .get("/api/Oaddresses", { params: { userId: userId, orderId: orderId } })
      .then(address => setAddress(address.data.address));
  }, []);

  const createRating = rating => {
    axios
      .post("/api/ratings", { rating, userId, productId })
      .then(rating => console.log(rating));
  };

  const handleSize = e => {
    if (size == "20%") {
      setSize("80%");
    } else {
      setSize("20%");
    }
  };

  return (
    <li key={lineItem.id}>
      <div className="orderItem">
        <h1>{product && product.name}</h1>
        <h4>Quantity: {lineItem.quantity}</h4>
        <img
          onClick={handleSize}
          style={{ width: size, alignContent: "center" }}
          src={`../public/${product.name}.png`}
        ></img>
        <ul style={{ listStyleType: "none", display: "inline-flex" }}>
          <li>Shipped Date: {order.createdAt.slice(0, 10)}</li>
          <li>Address: {orderAddress}</li>
          <li>Price: ${product.price}.00</li>
        </ul>
        {rating == undefined ? (
          <Rating rating={rating} setRating={setRating} />
        ) : (
          <div>
            Thanks for your input!
            {createRating(rating)}
          </div>
        )}
      </div>
    </li>
  );
};

export default OrderProduct;
/*
      <div>
        <h1>{product && product.name}</h1>
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
      </div>*/
