import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const CartWidget = ({ lineItems }) => {
  const useStyles = makeStyles(theme => ({
    badge: {
      "& > *": {
        margin: theme.spacing(1)
      }
    }
  }));

  const classes = useStyles();

const CartWidget = ({ lineItems }) => {
  let totalItemsInCart = 0;
  for (let i = 0; i < lineItems.length; i++) {
    totalItemsInCart += lineItems[i].quantity;
  }

  return (
    <div className={classes.badge}>
      <Badge badgeContent={lineItems.length} color="error">
        <ShoppingCartIcon />
      </Badge>
    </div>
  );
  // return (
  //   <div style={{ position: "relative" }}>
  //     <img
  //       style={{ width: "30px", height: "30px" }}
  //       src="https://image.flaticon.com/icons/svg/1374/1374128.svg"
  //     ></img>
  //     <p style={{ position: "absolute", top: "-35", left: "30" }}> {lineItems.length} </p>
  //   </div>
  // );
};

export default CartWidget;
