import React, { useEffect } from "react";
import axios from "axios";

const AdminTools = ({ headers, users, setUsers }) => {
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
