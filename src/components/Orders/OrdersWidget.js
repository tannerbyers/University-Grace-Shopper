import React, { useState } from "react";

const OrdersWidget = () => {
  return (
    <div style={{position: "relative"}}>
      <img
        style={{ width: "30px", height: "30px" }}
        src="https://image.flaticon.com/icons/svg/1374/1374128.svg"
      />
      <div style={{position: "absolute", top: "-15px", right: "-10px", fontSize: "1rem"}}>
          100
      </div>
    </div>
  );
};

export default OrdersWidget;
