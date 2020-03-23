import React from "react";
import "./components/SaveForLater/SaveForLater";
import SaveForLater from "./components/SaveForLater/SaveForLater";

const Cart = ({ lineItems, cart, createOrder, removeFromCart, products }) => {
  const isZero = (e, lineItemId) => {
    if (e.target.value == 0) {
      console.log("OH NO ");
      removeFromCart(lineItemId)
    }
  };

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
                <input
                  onChange={(event) => isZero(event, lineItem.id)}
                  type="number"
                  min="0"
                  defaultValue={lineItem.quantity}
                  max="10"
                ></input>
                <button onClick={() => removeFromCart(lineItem.id)}>
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
