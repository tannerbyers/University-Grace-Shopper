const client = require("./client");

const { authenticate, compare, findUserFromToken, hash } = require("./auth");

const models = ({ products, users, orders, lineItems, saveforlateritems } = require("./models"));

const {
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
  updateProductInventory,
  updateLineItemInventory
} = require("./userMethods");

const sync = async () => {
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS saveforlateritems;
    DROP TABLE IF EXISTS ratings;
    DROP TABLE IF EXISTS "lineItems";
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;

    CREATE TABLE users(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(100) NOT NULL UNIQUE,
      firstname VARCHAR(100),
      lastname VARCHAR(100),
      password VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'USER',
      "isLocked" BOOL DEFAULT FALSE,
      CHECK (char_length(username) > 0)
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      price DECIMAL NOT NULL,
      inventory INTEGER NOT NULL,
      CHECK (char_length(name) > 0)
    );
    CREATE TABLE orders(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "userId" UUID REFERENCES users(id) NOT NULL,
      status VARCHAR(10) DEFAULT 'CART',
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE "lineItems"(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "orderId" UUID REFERENCES orders(id) NOT NULL,
      "productId" UUID REFERENCES products(id) NOT NULL,
      quantity INTEGER DEFAULT 1
    );
    CREATE TABLE saveforlateritems(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      price DECIMAL NOT NULL,
      "userId" UUID REFERENCES users(id) NOT NULL
    );
    CREATE TABLE ratings(
      rating INTEGER DEFAULT NULL,
      userId UUID REFERENCES users(id) NOT NULL,
      productId UUID references products(id) NOT NULL
    );
  `;
  await client.query(SQL);

  const _users = {
    lucy: {
      username: "lucy",
      firstname: "Lucy",
      lastname: "McLucyson",
      password: "LUCY",
      role: "ADMIN",
      isLocked: false
    },
    moe: {
      username: "moe",
      firstname: "Moe",
      lastname: "McMoeson",
      password: "MOE",
      role: "USER",
      isLocked: true
    },
    curly: {
      username: "larry",
      password: "LARRY",
      role: "USER",
      isLocked: false
    }
  };

  const _products = {
    foo: {
      name: "foo",
      price: 2,
      inventory: 10
    },
    bar: {
      name: "bar",
      price: 2,
      inventory: 5
    },
    bazz: {
      name: "bazz",
      price: 2.5,
      inventory: 8
    },
    quq: {
      name: "quq",
      price: 11.99,
      inventory: 9
    }
  };
  const [lucy, moe] = await Promise.all(
    Object.values(_users).map(user => users.create(user))
  );

  const [foo, bar, bazz] = await Promise.all(
    Object.values(_products).map(product => products.create(product))
  );

  const _orders = {
    moe: {
      userId: moe.id
    },
    lucy: {
      userId: lucy.id
    }
  };

  const userMap = (await users.read()).reduce((acc, user) => {
    acc[user.username] = user;
    return acc;
  }, {});

  const productMap = (await products.read()).reduce((acc, product) => {
    acc[product.name] = product;
    return acc;
  }, {});
  return {
    users: userMap,
    products: productMap
  };
};

module.exports = {
  sync,
  models,
  authenticate,
  findUserFromToken,
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
  updateProductInventory,
  updateLineItemInventory,
  saveforlateritems
};
