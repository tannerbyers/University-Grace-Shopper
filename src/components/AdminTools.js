import React, { useEffect } from "react";
import axios from "axios";

const AdminTools = ({ users }) => {
  const toggleUserLock = userToLock => {
    const action = !userToLock.isLocked;
    axios.put(`/api/lockUser/${userToLock.id}`, {
      isLocked: action,
      id: userToLock.id
    });
  };
  return (
    <div>
      <h2>Administrator Tools</h2>
      <h4>Users:</h4>
      <ul>
        {users.map(user => {
          return (
            <li key={user.id}>
              <p>USERNAME: {user.username}</p>
              <p>ROLE: {user.role}</p>
              <p>ACCOUNT STATUS: {user.isLocked ? "locked" : "active"}</p>
              <button onClick={() => toggleUserLock(user)}>lock account</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminTools;
