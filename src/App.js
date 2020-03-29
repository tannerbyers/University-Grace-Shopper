import React, { useState, useEffect } from "react";
import qs from "qs";
import axios from "axios";
import Login from "./Login";
import Orders from "./Orders";
import CartWidget from "./components/Cart/CartWidget";
import Cart from "./Cart";
import Profile from "./Profile";
import AdminTools from "./components/AdminTools";
import Products from "./Products";
import GuestProducts from "./GuestProducts";
import GuestCart from "./GuestCart";
import GuestOrders from "./GuestOrders";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

/****************************************************************************/
/****************************************************************************/
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import HomeIcon from "@material-ui/icons/Home";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

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
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [lineItems, setLineItems] = useState([]);

  /********************************************************************************/
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper
    }
  }));

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  /****************************************************************************/
  /****************************************************************************/

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
    axios.get("/api/getUsers", headers()).then(response => {
      setUsers(response.data);
    });
  }, []);

  useEffect(() => {
    if (auth.id) {
      axios.get("/api/getOrders", headers()).then(response => {
        setOrders(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth.role === "ADMIN") {
      axios.get("/api/getUsers", headers()).then(response => {
        setUsers(response.data);
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
    const person = response.data;
    if (person.isLocked) {
      console.log("account locked");
    } else {
      setAuth(person);
      console.log(person.isLocked);
    }
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

  const updateProducts = () => {
    axios.get("/api/products").then(response => setProducts(response.data));
  };

  const addToCart = (productId, inventory) => {
    event.preventDefault();
    axios
      .post("/api/addToCart", { productId, inventory }, headers())
      .then(response => {
        const lineItem = response.data;
        const found = lineItems.find(_lineItem => _lineItem.id === lineItem.id);
        if (!found) {
          updateProducts();
          setLineItems([...lineItems, lineItem]);
        } else {
          const updated = lineItems.map(_lineItem =>
            _lineItem.id === lineItem.id ? lineItem : _lineItem
          );
          setLineItems(updated);
          updateProducts();
        }
      });
  };

  const removeFromCart = (lineItemId, productId, inventory, quantity) => {
    axios.delete(`/api/removeFromCart/${lineItemId}`, headers()).then(() => {
      setLineItems(lineItems.filter(_lineItem => _lineItem.id !== lineItemId));
    });

    axios
      .put("/api/products", { productId, inventory, lineItemId, quantity })
      .then(() => {
        updateProducts();
        getLineItems();
      });
  };

  const changePassword = credentials => {
    axios.put(`/api/auth/${auth.id}`, credentials);
  };

  const changeName = firstAndLastName => {
    axios.put(`/api/updateName/${auth.id}`, firstAndLastName);
  };

  const createUser = credentials => {
    axios.post("/api/createUser", credentials);
  };

  const getLineItems = () => {
    axios.get("/api/getLineItems", headers()).then(response => {
      setLineItems(response.data);
    });
  };

  const { view } = params;

  return (
    <Router>
      {/*
      The page that loads when a user is NOT logged in
    */}
      {!auth.id ? (
        <div>
          <AppBar>
            <Tabs
              className="nav-bar"
              value={value}
              onChange={handleChange}
              aria-label="nav bar"
            >
              <Tab
                label="home"
                {...a11yProps(0)}
                component={RouterLink}
                to="/"
              />
              <Tab
                label={<ShoppingCartIcon />}
                {...a11yProps(1)}
                component={RouterLink}
                to="/GuestCart"
              />
              <Tab
                label="Orders"
                {...a11yProps(2)}
                component={RouterLink}
                to="/GuestOrders"
              />
            </Tabs>

            {/*<div>
              <Link to="/">Home</Link>
            </div>
            <div>
              <Link to="/GuestCart">
                <CartWidget lineItems={lineItems} />
              </Link>
            </div>
            <div>
              <Link to="/GuestOrders">Orders</Link>
            </div>
            <div>
              <Link to="/Login">Login</Link>
            </div>*/}
          </AppBar>

          <Switch>
            <Route path="/GuestCart">
              <GuestCart products={products} />
            </Route>
            <Route path="/GuestOrders">
              <GuestOrders />
            </Route>
            <Route path="/Login">
              <Login login={login} createUser={createUser} />
            </Route>
            <Route path="/">
              <GuestProducts products={products} />
            </Route>
          </Switch>
        </div>
      ) : (
        <div>
          {/*
          The page that loads when a user IS logged in
          */}
          <nav className="header">
            <div>
              <Link to="/">Home</Link>
            </div>
            <div>
              <Link to="/Cart">
                <CartWidget lineItems={lineItems} />
              </Link>
            </div>
            <div>
              <Link to="/Orders">Orders</Link>
            </div>
            <div>
              {auth.role === "ADMIN" ? (
                <Link to="/AdminTools">Admin Tools</Link>
              ) : (
                ""
              )}
            </div>
          </nav>
          <Link to="/">
            <button onClick={logout}>
              Logout{" "}
              {auth.firstname === null || auth.lastname === null
                ? auth.username
                : auth.firstname + " " + auth.lastname}
            </button>
          </Link>

          <Link to="/Profile">Profile</Link>

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
                addToCart={addToCart}
                updateProducts={updateProducts}
                getLineItems={getLineItems}
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
              <Profile
                auth={auth}
                changePassword={changePassword}
                changeName={changeName}
              />
            </Route>
            <Route path="/AdminTools">
              <AdminTools headers={headers} users={users} setUsers={setUsers} />
            </Route>
            <Route path="/">
              <Products addToCart={addToCart} products={products} />{" "}
            </Route>
          </Switch>
        </div>
      )}
    </Router>
  );
};

export default App;
