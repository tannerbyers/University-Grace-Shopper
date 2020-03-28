const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
const models = db.models;

app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(express.json());

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    const error = Error("not authorized");
    error.status = 401;
    return next(error);
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return next(Error("not authorized: Must be Admin"));
  }
  next();
};

app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next();
  }
  db.findUserFromToken(token)
    .then(auth => {
      req.user = auth;
      next();
    })
    .catch(ex => {
      const error = Error("not authorized");
      error.status = 401;
      next(error);
    });
});

app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

app.post("/api/auth", (req, res, next) => {
  db.authenticate(req.body)
    .then(token => res.send({ token }))
    .catch(serverError => {
      const error = Error(serverError);
      error.status = 401;
      next(error);
    });
});

app.get("/api/auth", isLoggedIn, (req, res, next) => {
  res.send(req.user);
});

// update password
app.put("/api/auth/:id", (req, res, next) => {
  models.users
    .update(req.body)
    .then(updatedUser => res.send(updatedUser))
    .catch(next);
});

app.put("/api/updateName/:id", (req, res, next) => {
  models.users
    .updateFirstLast(req.body)
    .then(updatedUser => res.send(updatedUser))
    .catch(next);
});

app.put("/api/lockUser/:id", (req, res, next) => {
  models.users
    .lockOrUnlockUser(req.body)
    .then(lockededUser => res.send(lockededUser))
    .catch(next);
});

// create new user
app.post("/api/createUser", (req, res, next) => {
  models.users
    .create(req.body)
    .then(newUser => res.send(newUser))
    .catch(next);
});

app.get("/api/getCart", (req, res, next) => {
  db.getCart(req.user.id)
    .then(cart => res.send(cart))
    .catch(next);
});

app.get("/api/getOrders", (req, res, next) => {
  db.getOrders(req.user.id)
    .then(orders => res.send(orders))
    .catch(next);
});

app.post("/api/createOrder", (req, res, next) => {
  db.createOrder(req.user.id)
    .then(order => res.send(order))
    .catch(next);
});

app.get("/api/getLineItems", (req, res, next) => {
  db.getLineItems(req.user.id)
    .then(lineItems => res.send(lineItems))
    .catch(next);
});

app.post("/api/addToCart", (req, res, next) => {
  db.models.products.update({
    inventory: req.body.inventory,
    productId: req.body.productId
  });
  db.addToCart({ userId: req.user.id, productId: req.body.productId })
    .then(lineItem => res.send(lineItem))
    .catch(next);
});

app.delete("/api/removeFromCart/:id", (req, res, next) => {
  db.removeFromCart({ userId: req.user.id, lineItemId: req.params.id })
    .then(() => res.sendStatus(204))
    .catch(next);
});

app.post("/api/addresses", (req, res, next) => {
  db.models.addresses
    .create({
      address: req.body.address,
      userId: req.body.userId,
      orderId: req.body.orderId
    })
    .then(address => res.send(address))
    .catch(next);
});

app.get("/api/addresses", (req, res, next) => {
  db.models.addresses
    .read({ userId: req.query.userId, orderId: req.query.orderId })
    .then(address => res.send(address))
    .catch(next);
});

app.get("/api/products", (req, res, next) => {
  db.models.products
    .read()
    .then(products => res.send(products))
    .catch(next);
});

app.put("/api/products", (req, res, next) => {
  db.updateProductInventory(req.body).then(() => {
    db.updateLineItemInventory(req.body).then(() => {
      res.send(products);
    });
  });
});

app.get("/api/ratings", (req, res, next) => {
  db.models.ratings
    .read({
      userId: req.query.userId,
      productId: req.query.productId
    })
    .then(rating => res.send(rating))
    .catch(next);
});

app.get("/api/avgratings", (req, res, next) => {
  db.models.ratings
    .average({
      productId: req.query.productId
    })
    .then(rating => res.send(rating))
    .catch(next);
});

app.post("/api/ratings", (req, res, next) => {
  db.models.ratings
    .create({
      rating: req.body.rating,
      userId: req.body.userId,
      productId: req.body.productId
    })
    .then(rating => res.send(rating));
});

app.post("/api/saveforlateritems", (req, res, next) => {
  db.models.saveforlateritems
    .create({
      name: req.body.name,
      price: req.body.price,
      userId: req.user.id
    })
    .then(saveforlateitem => res.send(saveforlateitem))
    .catch(next);
});

app.get("/api/saveforlateritems", (req, res, next) => {
  db.models.saveforlateritems
    .read()
    .then(saveforlateritems => res.send(saveforlateritems))
    .catch(next);
});

app.delete("/api/saveforlateritems/:id", (req, res, next) => {
  db.models.saveforlateritems
    .delete(req.params.id)
    .then(saveforlateritems => res.send(saveforlateritems))
    .catch(next);
});

app.get("/api/getUsers", (req, res, next) => {
  db.models.users
    .read()
    .then(users => res.send(users))
    .catch(next);
});

Object.keys(models).forEach(key => {
  app.get(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
    models[key]
      .read({ user: req.user })
      .then(items => res.send(items))
      .catch(next);
  });
  app.post(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
    models[key]
      .create({ user: req.user })
      .then(items => res.send(items))
      .catch(next);
  });
});

app.use((req, res, next) => {
  const error = {
    message: `page not found ${req.url} for ${req.method}`,
    status: 404
  };
  next(error);
});

app.use((err, req, res, next) => {
  console.log(err.status);
  res.status(err.status || 500).send({ message: err.message });
});

module.exports = app;
