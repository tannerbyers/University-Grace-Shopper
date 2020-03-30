import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import FavoriteIcon from "@material-ui/icons/Favorite";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { IconButton, Button, MenuItem } from "@material-ui/core";

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
    <Box className="guest-cart-container">
      <h2>Cart</h2>
      <Button variant="contained" onClick={handleClick}>
        Create Order
      </Button>
      <Box>
        {lineItems.map(lineItem => {
          const product = products.find(product => product.id === lineItem.id);
          return (
            <Box
              key={lineItem.productId}
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              paddingLeft="0.5rem"
              paddingRight="0.5rem"
            >
              <Box width="6rem">{lineItem.name}</Box>
              <label>Quantity</label>
              <p>
                {lineItem.quantity == 0
                  ? removeFromCart(lineItem.name)
                  : lineItem.quantity}
              </p>
              <IconButton
                onClick={() => {
                  if (lineItem.quantity != 0) {
                    updateInventory(lineItem, lineItem.quantity + 1);
                  }
                }}
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={() => updateInventory(lineItem, lineItem.quantity - 1)}
              >
                <RemoveIcon />
              </IconButton>
              <Button
                variant="contained"
                onClick={() => removeFromCart(lineItem.name)}
              >
                Remove From Cart
              </Button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default GuestCart;
