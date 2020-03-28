import React, { useState } from "react";
import ReactDOM from "react-dom";
import StarRatingComponent from "react-star-rating-component";

const Rating = ({ active, rating, setRating }) => {
  return (
    <StarRatingComponent
      name={String(Math.random())}
      starCount={5}
      value={rating}
      onStarClick={setRating}
      editing={active}
    />
  );
};

export default Rating;
