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
  getLineItems,
  headers,
  saveForLaterItems,
  setSaveForLaterItems,
  addToCart
}) => {
  const updateInventory = (productId, inventory, lineItemId, quantity) => {
    axios
      .put("/api/products", { productId, inventory, lineItemId, quantity })
      .then(() => {
        updateProducts();
        getLineItems();
      });
  };

  let Total = 0;
  console.log("lineItems", lineItems);
  console.log("products", products);

  let currentLineItems = lineItems.filter(
    lineItem => lineItem.orderId === cart.id
  );

  for (let i = 0; i < currentLineItems.length; i++) {
    for (let j = 0; j < products.length; j++) {
      if (currentLineItems[i].productId === products[j].id) {
        console.log("How many times should this be called");
        Total += parseInt(products[j].price * currentLineItems[i].quantity);
      }
    }
  }

  const AddSaveItemForLaterToCart = saveForLaterItem => {
    console.log(saveForLaterItem);
    for (let i = 0; i < products.length; i++) {
      if (products[i].name == saveForLaterItem.name) {
        addToCart(products[i].id, products[i].inventory - 1);
      }
    }
  };

  let [address, setAddress] = useState("");
  let [savedAddresses, setSaved] = useState([]);

  const handleInput = e => {
    setAddress(e.target.value);
  };

  let userId = cart.userId;
  let orderId = cart.id;

  useEffect(() => {
    axios
      .get("/api/addresses", {
        params: { userId: userId, orderId: orderId }
      })
      .then(addresses => setSaved([addresses.data]));
  }, []);

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

  console.log(savedAddresses);

  const saveItemForLater = (name, price) => {
    console.log("clicked saved for later");

    axios
      .post("/api/saveforlateritems", { name, price }, headers())
      .then(res => {
        axios.get("/api/saveforlateritems", headers()).then(response => {
          console.log("current saveforlaterlist", response.data);
          setSaveForLaterItems(response.data);
        });
      });
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
      <select>
        {savedAddresses &&
          savedAddresses.map(address => {
            return (
              <option key={Math.random()} value={address.address}>
                {address.address}
              </option>
            );
          })}
      </select>
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
                    saveItemForLater(
                      product.name,
                      product.price,
                      product.inventory
                    );
                    removeFromCart(
                      lineItem.id,
                      product.id,
                      lineItem.quantity + product.inventory,
                      0
                    );
                  }}
                >
                  Save for later
                </button>
                <button
                  onClick={() => {
                    if (
                      lineItem.quantity + product.inventory !=
                      lineItem.quantity
                    ) {
                      updateInventory(
                        lineItem.productId,
                        product.inventory - 1,
                        lineItem.id,
                        lineItem.quantity + 1
                      );
                    }
                  }}
                >
                  +
                </button>
                <button
                  onClick={() => {
                    if (lineItem.quantity != 0) {
                      updateInventory(
                        lineItem.productId,
                        product.inventory + 1,
                        lineItem.id,
                        lineItem.quantity - 1
                      );
                    }
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
      <h3>Total: {Total}</h3>
      <SaveForLater
        saveForLaterItems={saveForLaterItems}
        setSaveForLaterItems={setSaveForLaterItems}
        headers={headers}
        AddSaveItemForLaterToCart={AddSaveItemForLaterToCart}
      />
    </div>
  );
};

export default Cart;
