import React from "react";
import ReactDOM from "react-dom";

const ProductNav = () => {
  return (
    <nav className="product-filter">
      <h1>Products</h1>

      <div className="sort">
        <div className="collection-sort">
          <label>Filter by:</label>
          <select>
            <option value="/">All Products</option>
          </select>
        </div>

        <div className="collection-sort">
          <label>Sort by:</label>
          <select>
            <option value="/">Featured</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default ProductNav;
