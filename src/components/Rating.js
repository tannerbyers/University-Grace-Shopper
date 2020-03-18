import React, { useState } from "react";
import ReactDOM from "react-dom";
import StarRatingComponent from "react-star-rating-component";

const Rating = ({ products }) => {
  let [rating, setRating] = useState();

  return (
    <div className="rating-form">
      <StarRatingComponent
        name={Math.random()}
        starCount={5}
        value={rating}
        onStarClick={setRating}
      />
    </div>
  );
};

export default Rating;
