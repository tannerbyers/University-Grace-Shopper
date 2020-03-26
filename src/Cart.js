import React from "react";
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

  console.log("products", products);
  console.log("line items", lineItems);
  return (
    <div>
      <h2>Cart - {cart.id && cart.id.slice(0, 4)}</h2>
      <button
        disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
        onClick={createOrder}
      >
        Create Order
      </button>
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
