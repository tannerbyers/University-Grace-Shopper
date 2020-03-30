import React, { useState, useEffect } from "react";
import "./components/SaveForLater/SaveForLater";
import SaveForLater from "./components/SaveForLater/SaveForLater";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { IconButton, Button, MenuItem } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";

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

  let currentLineItems = lineItems.filter(
    lineItem => lineItem.orderId === cart.id
  );

  for (let i = 0; i < currentLineItems.length; i++) {
    for (let j = 0; j < products.length; j++) {
      if (currentLineItems[i].productId === products[j].id) {
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

  let filteredAddress = savedAddresses.filter((address, pos, arr) => {
    return arr.map(addy => addy["address"]).indexOf(address["address"]) === pos;
  });

  console.log("filter", filteredAddress);

  let userId = cart.userId;
  let orderId = cart.id;
  let lineItemsCopy = [];

  useEffect(() => {
    products.forEach(product => {
      if (window.localStorage.getItem(`${product.name}`)) {
        lineItemsCopy.push(
          JSON.parse(window.localStorage.getItem(`${product.name}`))
        );
      }
    });

    for (let i = 0; i < lineItemsCopy.length; i++){
      console.log("TESTING", lineItemsCopy[i].name)
      for (let j = 0; j < products.length; j++){
        console.log("PRODUCT", products[j])
        if (lineItemsCopy[i].name = products[j].name){
         addToCart(products[i].id, products[i].inventory -  products[j].quantity );
         localStorage.removeItem(lineItemsCopy[i].name);
        }
      }
    }

    axios
      .get("/api/addresses", {
        params: { userId: userId, orderId: orderId }
      })
      .then(addresses => setSaved(addresses.data));
  }, []);

  const handleClick = e => {
    if (address !== "") {
      axios
        .post("/api/addresses", { address, userId, orderId })
        .then(add => console.log("chicken", add));
      createOrder();
    } else {
      alert("Please provide an address");
    }
  };

  const handleSelect = e => {
    console.log(e.target.value);
    setAddress(e.target.value);
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
    <Box marginTop="5rem">
      <h2>Cart - {cart.id && cart.id.slice(0, 4)}</h2>
      <Box
        width="32rem"
        height="3rem"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <TextField
          id="standard-basic"
          label="Address"
          onChange={handleInput}
        ></TextField>
        <Select onChange={handleSelect} variant="outlined">
          <MenuItem selected value="">
            New Address
          </MenuItem>
          {savedAddresses &&
            filteredAddress.map(address => {
              console.log();
              return (
                <MenuItem key={Math.random()} value={address.address}>
                  {address.address}
                </MenuItem>
              );
            })}
        </Select>
        <Button
          variant="contained"
          disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
          onClick={handleClick}
        >
          Create Order
        </Button>
      </Box>

      <Box>
        {lineItems
          .filter(lineItem => lineItem.orderId === cart.id)
          .map(lineItem => {
            const product = products.find(
              product => product.id === lineItem.productId
            );
            return (
              <Box marginTop="2rem" marginBottom="2rem">
                <Card>
                  <Box
                    key={lineItem.id}
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    paddingLeft="0.5rem"
                    paddingRight="0.5rem"
                  >
                    <Box width="6rem">{product && product.name}</Box>
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

                    <div>
                      <IconButton
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
                        <AddIcon />
                      </IconButton>
                      <IconButton
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
                        <RemoveIcon />
                      </IconButton>
                    </div>
                    <Button
                      variant="contained"
                      startIcon={<FavoriteIcon />}
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
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<RemoveShoppingCartIcon />}
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
                    </Button>
                  </Box>
                </Card>
              </Box>
            );
          })}
      </Box>
      <h3>Subtotal: ${Total}</h3>
      <SaveForLater
        saveForLaterItems={saveForLaterItems}
        setSaveForLaterItems={setSaveForLaterItems}
        headers={headers}
        AddSaveItemForLaterToCart={AddSaveItemForLaterToCart}
      />
    </Box>
  );
};

export default Cart;
