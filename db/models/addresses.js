const client = require("../client");

const addresses = {
  read: async ({ userId }) => {
    const SQL = "SELECT * FROM addresses WHERE userId = $1";
    return (await client.query(SQL, [userId])).rows;
  },
  readorder: async ({ userId, orderId }) => {
    const SQL =
      "SELECT address from addresses WHERE userId = $1 AND orderId = $2";
    return (await client.query(SQL, [userId, orderId])).rows[0];
  },
  create: async ({ address, userId, orderId }) => {
    console.log(address, userId, orderId);
    const SQL =
      "INSERT INTO addresses(address, userId, orderId) values($1, $2, $3) returning *";
    return (await client.query(SQL, [address, userId, orderId])).rows[0];
  }
};

module.exports = addresses;
