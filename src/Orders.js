import React from "react";
import OrderProduct from "./components/Orders/OrderProduct";

const Orders = ({ lineItems, orders, products }) => {
  console.log(products);
  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {orders.map(order => {
          const _lineItems = lineItems.filter(
            lineItem => lineItem.orderId === order.id
          );

          return (
            <li key={order.id}>
              <div>OrderID: {order.id.slice(0, 4)}</div>
              <ul>
                {_lineItems.map(lineItem => {
                  const product = products.find(
                    product => product.id === lineItem.productId
                  );
                  return (
                    <OrderProduct
                      key={product.id}
                      order={order}
                      product={product}
                      lineItem={lineItem}
                    />
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Orders;
