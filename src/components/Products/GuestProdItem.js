import React, { useState, useEffect } from "react";
import axios from "axios";
import faker from "faker";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import {
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Typography
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Rating from "../Rating";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  }
}));

const GuestProdItem = ({ product }) => {
  const classes = useStyles();
  const [details, setDetails] = useState("hide");
  const [rating, setRating] = useState();
  const [inventory, setInventory] = useState(product.inventory);
  const [clickCount, setClickCount] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    axios
      .get("/api/avgratings", { params: { productId: product.id } })
      .then(rating => setRating(Math.round(rating.data.avg)));
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
      .then(() => window.localStorage.getItem(`${product.name}`));
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        className="card-header"
        title={product.name}
        subheader={
          product.inventory - clickCount > 0
            ? `${product.inventory - clickCount} in stock`
            : "out of stock"
        }
      />
      <img src="http://placeimg.com/140/80/animals" />

      <CardContent>
        <Rating active={false} rating={rating} />
        <Typography className="price" variant="body1">
          ${Number(product.price).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          disabled={inventory < 1 ? true : false}
          onClick={addToCartGuest}
        >
          <AddShoppingCartIcon variant="contained" />
        </IconButton>

        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            This product is {faker.commerce.productAdjective()}.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default GuestProdItem;
