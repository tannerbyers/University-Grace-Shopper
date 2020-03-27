import React, { useState, useEffect } from "react";
import "./components/SaveForLater/SaveForLater";
import SaveForLater from "./components/SaveForLater/SaveForLater";
import axios from "axios";

const Cart = ({
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  products,
  updateProducts,
  getLineItems
}) => {
  const updateInventory = (productId, inventory, lineItemId, quantity) => {
    axios
      .put("/api/products", { productId, inventory, lineItemId, quantity })
      .then(() => {
        updateProducts();
        getLineItems();
      });
  };

  let [address, setAddress] = useState("");

  const handleInput = e => {
    setAddress(e.target.value);
  };

  let userId = cart.userId;
  let orderId = cart.id.slice(0, 4);

  const handleClick = e => {
    if (address !== "") {
      axios
        .post("/api/addresses", { address, userId, orderId })
        .then(add => console.log(add));
      createOrder();
    } else {
      alert("Please provide an address");
    }
  };

  return (
    <div>
      <h2>Cart - {cart.id && cart.id.slice(0, 4)}</h2>
      <button
        disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
        onClick={handleClick}
      >
        Create Order
      </button>
      <input
        onChange={handleInput}
        type="text"
        placeholder="Please provide an address"
      ></input>
      <ul>
        {lineItems
          .filter(lineItem => lineItem.orderId === cart.id)
          .map(lineItem => {
            const product = products.find(
              product => product.id === lineItem.productId
            );
            return (
              <li key={lineItem.id}>
                {product && product.name}
                <label>Quantity</label>
                <p>
                  {lineItem.quantity == 0
                    ? removeFromCart(
                        lineItem.id,
                        product.id,
                        lineItem.quantity + product.inventory,
                        0
                      )
                    : lineItem.quantity}
                </p>
                <button
                  onClick={() => {
                    updateInventory(
                      lineItem.productId,
                      product.inventory - 1,
                      lineItem.id,
                      lineItem.quantity + 1
                    );
                  }}
                >
                  +
                </button>
                <button
                  onClick={() => {
                    updateInventory(
                      lineItem.productId,
                      product.inventory + 1,
                      lineItem.id,
                      lineItem.quantity - 1
                    );
                  }}
                >
                  -
                </button>{" "}
                <button
                  onClick={() => {
                    removeFromCart(
                      lineItem.id,
                      product.id,
                      lineItem.quantity + product.inventory,
                      0
                    );
                  }}
                >
                  Remove From Cart
                </button>
              </li>
            );
          })}
      </ul>
      <SaveForLater />
    </div>
  );
};

export default Cart;
