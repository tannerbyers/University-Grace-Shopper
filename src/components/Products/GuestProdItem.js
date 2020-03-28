import React, { useState, useEffect } from "react";
import axios from "axios";
import faker from "faker";
import Rating from "../Rating";

const GuestProdItem = ({ product }) => {
  const [details, setDetails] = useState("hide");
  const [rating, setRating] = useState();
  const [inventory, setInventory] = useState(product.inventory);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    axios
      .get("/api/avgratings", { params: { productId: product.id } })
      .then(rating => setRating(Math.round(rating.data.avg)));
  }, []);

  const toggleDetails = () => {
    if (details == "") {
      setDetails("hide");
    } else {
      setDetails("");
    }
  };

  // this function increases the counts the amount of times a certain product has been clicked
  // and sets the product's localStorage object quantity to that amount
  const incrementQuantity = () => {
    let currentValue = window.localStorage.getItem(`${product.name}Quantity`)
      ? parseInt(window.localStorage.getItem(`${product.name}Quantity`))
      : 0;
    let newValue = currentValue + 1;
    window.localStorage.setItem(`${product.name}Quantity`, newValue);
  };

  const addToCartGuest = () => {
    // this is only here to keep the stock acccurate
    setClickCount(clickCount + 1);

    incrementQuantity();
    //put request to update the inventory for each product added to cart
    axios
      .put("/api/guestProducts", {
        productId: product.id,
        inventory: inventory - 1
      })
      .then(() => setInventory(inventory - 1))
      .then(() =>
        window.localStorage.setItem(
          `${product.name}`,
          JSON.stringify({
            name: product.name,
            productId: product.id,
            quantity: Number(
              window.localStorage.getItem(`${product.name}Quantity`)
            )
          })
        )
      )
      .then(() => window.localStorage.getItem(`${product.name}`))
      .then(lineItem => console.log(JSON.parse(lineItem)));
  };

  return (
    <div className="item">
      <h1>{product.name}</h1>
      <img src="http://placeimg.com/140/80/animals" />
      <h3>${Number(product.price).toFixed(2)}</h3>
      <h4>Stock: {product.inventory - clickCount}</h4>
      <h1>
        <button className="details" onClick={toggleDetails}>
          &#10576;
        </button>
      </h1>
      <p className={details}>
        This product is {faker.commerce.productAdjective()}.<br></br>
        Average Rating
        <Rating active={false} rating={rating} />
      </p>
      <button disabled={inventory < 1 ? true : false} onClick={addToCartGuest}>
        Add to Cart
      </button>
    </div>
  );
};

export default GuestProdItem;
