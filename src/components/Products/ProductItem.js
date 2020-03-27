import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import faker from "faker";
import axios from "axios";
import Rating from "../Rating";

const ProductItem = ({ auth, product, addToCart }) => {
  const [details, setDetails] = useState("hide");
  const [rating, setRating] = useState();
  const [inventory, setInventory] = useState(product.inventory);
  const [clickCount, setClickCount] = useState(1);

  useEffect(() => {
    axios
      .get("/api/avgratings", { params: { productId: product.id } })
      .then(rating => setRating(Math.round(rating.data.avg)));
  }, []);

  useEffect(() => {
    axios
      .put(`/api/productsGuest/${product.id}`, {
        productId: product.id,
        inventory: inventory
      })
      .then(response => setInventory(response.data.inventory));
  }, []);

  const handleClick = e => {
    if (details == "") {
      setDetails("hide");
    } else {
      setDetails("");
    }
  };

  const addToGuestCart = () => {
    setInventory(inventory - 1);
    setClickCount(clickCount + 1);
    const quantity = clickCount;
    window.localStorage.setItem(`quantity ${product.id}`, quantity);

    // inventory resets when refreshed

    // console.log(`${product.name} has been clicked ${clickCount} times`);
    // then update cart
  };

  const RenderButton = () => {
    if (auth.id) {
      if (product.inventory && product.inventory > 0) {
        return (
          <button onClick={() => addToCart(product.id, product.inventory - 1)}>
            Add to Cart
          </button>
        );
      } else {
        return <button disabled={true}>Add to Cart</button>;
      }
    } else {
      if (inventory && inventory > 0) {
        return <button onClick={addToGuestCart}>Add to Cart</button>;
      } else {
        return <button disabled={true}>Add to Cart</button>;
      }
    }
  };

  return (
    <div className="item">
      <h1>{product.name}</h1>
      <img src="http://placeimg.com/140/80/animals"></img>
      <h3>${product.price}</h3>
      {auth.id ? (
        <h4>Stock : {product.inventory}</h4>
      ) : (
        <h4>Stock : {inventory}</h4>
      )}
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
