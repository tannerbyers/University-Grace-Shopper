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
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { IconButton, Button, Badge } from "@material-ui/core";

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
  const [guestCartCount, setGuestCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [saveForLaterItems, setSaveForLaterItems] = useState([]);
  const [promocodes, setPromocodes] = useState([]);

  useEffect(() => {
    axios.get("/api/saveforlateritems", headers()).then(response => {
      setSaveForLaterItems(response.data);

      axios.get("/api/promocodes", headers()).then(response => {
        setPromocodes(response.data);
      });
    });
  }, []);

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
    },

    loginLink: {
      color: "dodgerblue",
      border: "2px solid dodgerblue"
    }
  }));

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  axios.get("/api/promocodes", headers()).then(response => {
    console.log(response.data);
  });

  // returns the number of unique items saved in localStorage --> i.e number of lineItems for guest
  function allStorage() {
    var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      values.push(localStorage.getItem(keys[i]));
    }

    return values.length / 2;
  }

  return (
    <Router>
      {/*
      The page that loads when a user is NOT logged in
    */}
      {!auth.id ? (
        <div>
          <AppBar className="app-bar" boxShadow={3}>
            <Toolbar className="tool-bar">
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
                  label={
                    <Badge badgeContent={allStorage()} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  }
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
              <Button
                className={classes.loginLink}
                variant="outlined"
                component={RouterLink}
                to="/Login"
              >
                Login
              </Button>
            </Toolbar>
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

          <AppBar>
            <Toolbar className="tool-bar">
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
                  label={<CartWidget lineItems={lineItems} />}
                  {...a11yProps(1)}
                  component={RouterLink}
                  to="/Cart"
                />
                <Tab
                  label="Orders"
                  {...a11yProps(2)}
                  component={RouterLink}
                  to="/Orders"
                />
              </Tabs>

              <div>
                <Button onClick={logout}>
                  Logout{" "}
                  {auth.firstname === null || auth.lastname === null
                    ? auth.username
                    : auth.firstname + " " + auth.lastname}
                </Button>
                <Button color="primary" component={RouterLink} to="/Profile">
                  {<AccountBoxRoundedIcon />}
                </Button>
              </div>
            </Toolbar>

            {auth.role === "ADMIN" ? (
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/AdminTools"
              >
                Administator Tools
              </Button>
            ) : (
              ""
            )}
            {/*<RouterLink to="/Cart">
                <CartWidget lineItems={lineItems} />
          </RouterLink>*/}
          </AppBar>
          <RouterLink to="/Profile">
            <Button>Profile</Button>
          </RouterLink>

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
              <AdminTools
                setPromocodes={setPromocodes}
                promocodes={promocodes}
                headers={headers}
                users={users}
                setUsers={setUsers}
              />
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
