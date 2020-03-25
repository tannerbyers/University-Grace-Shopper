const client = require("../client");
const { hash } = require("../auth");

const users = {
  read: async () => {
    return (await client.query("SELECT * from users")).rows;
  },
  create: async ({
    username,
    firstname,
    lastname,
    password,
    role,
    isLocked
  }) => {
    const SQL = `INSERT INTO users(
                  username, 
                  firstname, 
                  lastname, 
                  password, 
                  role, 
                  "isLocked"
                ) values($1, $2, $3, $4, $5, $6) RETURNING *`;
    return (
      await client.query(SQL, [
        username,
        firstname,
        lastname,
        await hash(password),
        role,
        isLocked
      ])
    ).rows[0];
  },
  update: async ({ password, id }) => {
    const SQL = "UPDATE users SET password = $1 WHERE id = $2 RETURNING *";
    return (await client.query(SQL, [await hash(password), id])).rows[0];
  },
  updateFirstLast: async ({ firstname, lastname, id }) => {
    const SQL =
      "UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *";
    return (await client.query(SQL, [firstname, lastname, id])).rows[0];
  },
  lockOrUnlockUser: async ({ isLocked, id }) => {
    const SQL = 'UPDATE users SET "isLocked" = $1 WHERE id = $2 RETURNING *';
    return (await client.query(SQL, [isLocked, id])).rows[0];
  }
};

module.exports = users;
