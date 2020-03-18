const client = require('../client');
const { hash } = require('../auth');

const users = {
  read: async () => {
    return (await client.query('SELECT * from users')).rows;
  },
  create: async ({ username, password, role }) => {
    const SQL = `INSERT INTO users(username, password, role) values($1, $2, $3) returning *`;
    return (await client.query(SQL, [username, await hash(password), role]))
      .rows[0];
  },
  update: async ({ password, id }) => {
    const SQL = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING *';
    return (await client.query(SQL, [await hash(password), id])).rows[0];
  }
};

module.exports = users;
