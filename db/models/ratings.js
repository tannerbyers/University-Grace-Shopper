const client = require("../client");

const ratings = {
  read: async ({ userId, productId }) => {
    const SQL =
      "SELECT rating from ratings WHERE userId = $1 AND productId = $2";
    return (await client.query(SQL, [userId, productId])).rows[0];
  },
  create: async ({ rating, userId, productId }) => {
    const SQL = `INSERT INTO ratings(rating, userId, productId) values($1, $2, $3) returning *`;
    return (await client.query(SQL, [rating, userId, productId])).rows[0];
  },
  average: async ({ productId }) => {
    const SQL = "SELECT AVG(rating) FROM ratings WHERE productId = $1";
    return (await client.query(SQL, [productId])).rows[0];
  }
};

module.exports = ratings;
