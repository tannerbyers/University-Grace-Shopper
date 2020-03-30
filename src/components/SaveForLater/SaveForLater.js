import React from "react";
import axios from "axios";

const SaveForLater = ({ AddSaveItemForLaterToCart, setSaveForLaterItems, saveForLaterItems }) => {
  const removeSaveItemForLater = id => {
    axios.delete(`/api/saveforlateritems/${id}`).then(response => {
      setSaveForLaterItems(saveForLaterItems.filter(items => items.id !== id));
    });
  };

  console.log("saveforlateritems", saveForLaterItems);

  return (
    <div style={{ position: "relative" }}>
      <h3> Save For later (X Items)</h3>
      {saveForLaterItems ? (
        saveForLaterItems.map(saveForLaterItem => {
          return (
            <div>
              <li>Name: {saveForLaterItem.name}</li>
              <li>Price: {saveForLaterItem.price}</li>
              <button
                onClick={() => removeSaveItemForLater(saveForLaterItem.id)}
              >
                {" "}
                Remove{" "}
              </button>
              <button
                onClick={() => {AddSaveItemForLaterToCart(saveForLaterItem); removeSaveItemForLater(saveForLaterItem.id)}}
              >
                Add to Cart
              </button>
            </div>
          );
        })
      ) : (
        <p> No Items Saved Currently</p>
      )}
    </div>
  );
};

export default SaveForLater;
