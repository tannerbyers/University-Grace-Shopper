import React, { useState, useEffect } from "react";
import faker from "faker";
import axios from "axios";
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
    minWidth: 500,
    maxWidth: 650
  },
  media: {
    // height: 0,
    // paddingTop: "56.25%" // 16:9
    height: 0,
    paddingTop: "56.25%", // 16:9,
    marginTop: "30"
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

const ProductItem = ({ product, addToCart }) => {
  const classes = useStyles();
  const [details, setDetails] = useState("hide");
  const [rating, setRating] = useState();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    axios
      .get("/api/avgratings", { params: { productId: product.id } })
      .then(rating => setRating(Math.round(rating.data.avg)));
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        className="card-header"
        title={product.name}
        subheader={
          product.inventory > 0
            ? `${product.inventory} in stock`
            : "out of stock"
        }
      />
      <img src={`../public/${product.name}.png`} />

      <CardContent>
        <Rating active={false} rating={rating} />
        <Typography className="price" variant="body1">
          ${Number(product.price).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          disabled={product.inventory < 1 ? true : false}
          onClick={() => addToCart(product.id, product.inventory - 1)}
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

export default ProductItem;
