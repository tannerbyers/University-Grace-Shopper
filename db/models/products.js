const client = require("../client");

const products = {
  read: async () => {
    return (await client.query("SELECT * from products")).rows;
  },
  create: async ({ name, price, inventory }) => {
    const SQL = `INSERT INTO products(name, price, inventory) values($1, $2, $3) returning *`;
    return (await client.query(SQL, [name, price, inventory])).rows[0];
  },
  update: async ({ productId, inventory }) => {
    const SQL = "UPDATE products SET inventory = $1 WHERE id = $2 RETURNING *";
    return (await client.query(SQL, [inventory, productId])).rows[0];
  }
};

module.exports = products;
