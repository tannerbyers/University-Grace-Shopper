const client = require('../client');

const saveforlateritems = {
  read: async()=> {
    return (await client.query('SELECT * from saveforlateritems')).rows;
  },

  create: async({ name, price, userId })=> {
    const SQL = `INSERT INTO saveforlateritems ("name", "price", "userId") values($1, $2, $3) returning *`;
    return (await client.query(SQL, [name, price, userId])).rows[0];
  },
  delete: async(id)=> {
    const SQL = `DELETE FROM saveforlateritems WHERE id=$1 returning *`;
    return (await client.query(SQL, [id])).rows[0];
  }
};

module.exports = saveforlateritems;
