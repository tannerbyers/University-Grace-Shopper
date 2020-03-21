import React, { useState } from "react";

const CartWidget = ({lineItems}) => {
  return (
    <div style={{ position: "relative" }}>
      <img
        style={{ width: "30px", height: "30px" }}
        src="https://image.flaticon.com/icons/svg/1374/1374128.svg"
      ></img>
      <p style={{ position: "absolute", top: "-35", left: "30" }}> {lineItems.length} </p>
    </div>
  );
};

export default CartWidget;
