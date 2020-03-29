import React, { useState, useEffect } from "react";
import axios from "axios";

const GuestCart = ({ products }) => {
  const [lineItems, setLineItems] = useState([]);
  let lineItemsCopy = [];

  useEffect(() => {
    products.forEach(product => {
      if (window.localStorage.getItem(`${product.name}`)) {
        lineItemsCopy.push(
          JSON.parse(window.localStorage.getItem(`${product.name}`))
        );
      }
    });
    setLineItems(lineItemsCopy);
  }, []);

  const removeFromCart = itemName => {
    window.localStorage.removeItem(itemName);
    setLineItems(lineItems.filter(item => item.name !== itemName));
  };

  const updateInventory = (lineItem, quantity) => {
    const updatedObj = JSON.stringify({
      name: lineItem.name,
      productId: lineItem.productId,
      quantity: quantity
    });

    let lineItemsCopy = [];

    window.localStorage.setItem(`${lineItem.name}`, updatedObj);

    products.forEach(product => {
      if (window.localStorage.getItem(`${product.name}`)) {
        lineItemsCopy.push(
          JSON.parse(window.localStorage.getItem(`${product.name}`))
        );
      }
    });
    setLineItems(lineItemsCopy);

    console.log(window.localStorage.getItem(`${lineItem.name}`));
  };

  const handleClick = () => {
    console.log(lineItems);
  };

  return (
    <div className="guest-cart-container">
      <h2>Cart</h2>
      <button onClick={handleClick}>Create Order</button>
      <ul>
        {lineItems.map(lineItem => {
          const product = products.find(product => product.id === lineItem.id);
          return (
            <li key={lineItem.productId}>
              {lineItem.name}
              <label>Quantity</label>
              <p>
                {lineItem.quantity == 0
                  ? removeFromCart(lineItem.name)
                  : lineItem.quantity}
              </p>
              <button
                onClick={() => updateInventory(lineItem, lineItem.quantity + 1)}
              >
                +
              </button>
              <button
                onClick={() => updateInventory(lineItem, lineItem.quantity - 1)}
              >
                -
              </button>
              <button onClick={() => removeFromCart(lineItem.name)}>
                Remove From Cart
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GuestCart;
