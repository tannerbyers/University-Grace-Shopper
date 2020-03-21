import React, { useState, useEffect } from "react";
import qs from "qs";
import axios from "axios";
import Login from "./Login";
import Orders from "./Orders";
import Cart from "./Cart";
import Profile from "./Profile";
import Products from "./Products";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const headers = () => {
  const token = window.localStorage.getItem("token");

  return {
    headers: {
      authorization: token
    }
  };
};

const App = () => {
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1)));
  const [auth, setAuth] = useState({});
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    axios.get("/api/products").then(response => setProducts(response.data));
  }, []);

  useEffect(() => {
    if (auth.id) {
      const token = window.localStorage.getItem("token");
      axios.get("/api/getLineItems", headers()).then(response => {
        setLineItems(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get("/api/getCart", headers()).then(response => {
        setCart(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get("/api/getOrders", headers()).then(response => {
        setOrders(response.data);
      });
    }
  }, [auth]);

  const login = async credentials => {
    const token = (await axios.post("/api/auth", credentials)).data.token;
    window.localStorage.setItem("token", token);
    exchangeTokenForAuth();
  };

  const exchangeTokenForAuth = async () => {
    if (!window.localStorage.getItem("token")) {
      return;
    }
    const response = await axios.get("/api/auth", headers());
    setAuth(response.data);
  };

  const logout = () => {
    window.location.hash = "#";
    window.localStorage.removeItem("token");
    setAuth({});
  };

  useEffect(() => {
    exchangeTokenForAuth();
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", () => {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  const createOrder = () => {
    const token = window.localStorage.getItem("token");
    axios
      .post("/api/createOrder", null, headers())
      .then(response => {
        setOrders([response.data, ...orders]);
        const token = window.localStorage.getItem("token");
        return axios.get("/api/getCart", headers());
      })
      .then(response => {
        setCart(response.data);
      });
  };

  const addToCart = (productId, inventory) => {
    event.preventDefault();
    axios
      .post("/api/addToCart", { productId, inventory }, headers())
      .then(response => {
        const lineItem = response.data;
        const found = lineItems.find(_lineItem => _lineItem.id === lineItem.id);
        if (!found) {
          setLineItems([...lineItems, lineItem]);
        } else {
          const updated = lineItems.map(_lineItem =>
            _lineItem.id === lineItem.id ? lineItem : _lineItem
          );
          setLineItems(updated);
        }
      });
  };

  const removeFromCart = lineItemId => {
    axios.delete(`/api/removeFromCart/${lineItemId}`, headers()).then(() => {
      setLineItems(lineItems.filter(_lineItem => _lineItem.id !== lineItemId));
    });
  };

  const changePassword = ev => {
    ev.preventDefault();
    const newPassword = document.querySelector('[name="new_pw"]').value;
    const reEnteredPassword = document.querySelector('[name="re_entered_pw"]')
      .value;

    if (newPassword === reEnteredPassword) {
      axios
        .put(`/api/auth/${auth.id}`, {
          password: newPassword,
          id: auth.id
        })
        .then(response => console.log(response.data))
        .then(() => console.log("pasword updated!"));
    } else {
      alert("passwords don't match");
    }
  };

  const { view } = params;

  if (!auth.id) {
    return <Login login={login} />;
  } else {
    return (
      <Router>
        <div>
          <nav className="header">
            <div>
              <Link to="/">Home</Link>
            </div>
            <div>
              <Link to="/Cart">Cart</Link>
            </div>
            <div>
              <Link to="/Orders">Orders</Link>
            </div>
          </nav>
          <button onClick={logout}>Logout {auth.username} </button>
          <Link to="/Profile">Profile</Link>
          {/*<button onClick={() => changePassword(auth)}>Change Password</button>*/}

          {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/Cart">
              <Cart
                lineItems={lineItems}
                removeFromCart={removeFromCart}
                cart={cart}
                createOrder={createOrder}
                products={products}
              />{" "}
            </Route>
            <Route path="/Orders">
              <Orders
                lineItems={lineItems}
                products={products}
                orders={orders}
              />
            </Route>
            <Route path="/Profile">
              <Profile auth={auth} changePassword={changePassword} />
            </Route>
            <Route path="/">
              <Products addToCart={addToCart} products={products} />{" "}
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
};

export default App;
