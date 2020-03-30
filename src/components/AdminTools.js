import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField } from "@material-ui/core";

const AdminTools = ({
  headers,
  users,
  setUsers,
  promocodes,
  setPromocodes
}) => {
  const [promocodeInput, setPromocodeInput] = useState("");
  const [promocodePercentage, setPromocodePercentage] = useState(0);

  const AddNewPromocode = () => {
    axios
      .post(
        "/api/promocodes",
        { promocode: promocodeInput, percentage: promocodePercentage },
        headers()
      )
      .then(response => {
        console.log(response.data);
      });
    setPromocodePercentage("");
    setPromocodeInput("");

    axios.get("/api/promocodes", headers()).then(response => {
      setPromocodes(response.data);
    });
  };

  const toggleUserLock = userToLock => {
    const action = !userToLock.isLocked;
    axios
      .put(`/api/lockUser/${userToLock.id}`, {
        isLocked: action,
        id: userToLock.id
      })
      .then(
        axios.get("/api/getUsers", headers()).then(response => {
          setUsers(response.data);
        })
      );
  };
  return (
    <Box marginTop="6rem">
      <h2>Administrator Tools</h2>
      <div>
        <h3> Add Promo Code </h3>

        <Box marginBottom="1rem">
          <TextField
            label="Promo code"
            onChange={e => setPromocodeInput(e.target.value)}
            type="text"
          />

          <br />

          <TextField
            label="Percentage"
            onChange={e => setPromocodePercentage(e.target.value)}
            type="number"
          />
        </Box>

        <br />
        <Button variant="contained" onClick={AddNewPromocode}>
          {" "}
          Add{" "}
        </Button>
      </div>
      <h4> Promo Codes: </h4>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {promocodes.map(promocode => {
          return (
            <div
              style={{
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                transition: "0.3s",
                width: "30vw",
                height: "20vh",
                padding: "1rem"
              }}
            >
              <p>Name: {promocode.promocode}</p>
              <p>Discount: {promocode.percentage}</p>
              <p>Status: {promocode.activeStatus.toString()}</p>
            </div>
          );
        })}
      </div>
      <hr />
      <h4>Users:</h4>
      <ul>
        {users
          .sort((a, b) => {
            const userA = a.username.toUpperCase();
            const userB = b.username.toUpperCase();

            let comparison = 0;
            if (userA > userB) {
              comparison = 1;
            } else if (userA < userB) {
              comparison = -1;
            }
            return comparison;
          })
          .map(user => {
            return (
              <li key={user.id}>
                <p>USERNAME: {user.username}</p>
                <p>ROLE: {user.role}</p>
                <p>ACCOUNT STATUS: {user.isLocked ? "locked" : "active"}</p>
                <Button
                  variant="contained"
                  onClick={() => toggleUserLock(user)}
                >
                  {user.isLocked ? "unlock user" : "lock user"}
                </Button>
              </li>
            );
          })}
      </ul>
    </Box>
  );
};

export default AdminTools;
