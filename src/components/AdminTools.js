import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminTools = ({
  headers,
  users,
  setUsers,
  promocodes,
  setPromocodes
}) => {
  const [promocodeInput, setPromocodeInput] = useState("");
  const [promocodePercentage, setPromocodePercentage] = useState(0);

  console.log("promocodes: ", promocodes);

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
    <div>
      <h2>Administrator Tools</h2>
      <div>
        <h3> Add Promo Code </h3>
        <label>
          Promo Code:{" "}
          <input
            onChange={e => setPromocodeInput(e.target.value)}
            type="text"
          />
        </label>
        <br />
        <label>
          Percentage:{" "}
          <input
            onChange={e => setPromocodePercentage(e.target.value)}
            type="number"
          />
        </label>
        <br />
        <button onClick={AddNewPromocode}> Add </button>
      </div>
      <h4> Promo Codes: </h4>
      <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
      {promocodes.map((promocode)=> {
        return (<div style={{boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          transition: "0.3s", width: "30vw", height: "20vh", padding: "1rem"}}>
          <p>Name: {promocode.promocode}</p>
          <p>Discount: {promocode.percentage}</p>
          <p>Status: {promocode.activeStatus.toString()}</p>
          </div>)
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
                <button onClick={() => toggleUserLock(user)}>
                  {user.isLocked ? "unlock user" : "lock user"}
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default AdminTools;
