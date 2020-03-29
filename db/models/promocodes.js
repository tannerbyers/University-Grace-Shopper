const client = require("../client");

const promocodes = {
  read: async () => {
    return (await client.query('SELECT * from promocodes')).rows;
  },
  create: async ({ promocode, percentage, activestatus, userId}) => {
    console.log(promocode, percentage, activestatus);
    const SQL =
      'INSERT INTO promocodes(promocode, percentage, "activeStatus", "userId") values($1, $2, $3, $4) returning *';
    return (await client.query(SQL, [promocode, percentage, activestatus, userId]))
      .rows[0];
  },
  update: async ({ promocode, activestatus }) => {
    const SQL = 'UPDATE promocodes SET "activeStatus" = $1 WHERE promocode = $2 RETURNING *';
    return (await client.query(SQL, [activestatus, promocode])).rows[0];
  }
};

module.exports = promocodes;
