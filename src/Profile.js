import React, { useState, useEffect } from "react";

const Profile = ({ auth, changePassword }) => {
  const [newPassword, setNewPassword] = useState("");
  const [reEnteredPassword, setReEnteredPassword] = useState("");
  const [wantsToChangePW, setWantsToChangePW] = useState(true);

  useEffect(() => {
    setWantsToChangePW(false);
  }, []);

  const onSubmit = ev => {
    ev.preventDefault();
    if (newPassword === reEnteredPassword) {
      changePassword({
        username: auth.username,
        password: newPassword,
        id: auth.id
      }).then(() => {
        setNewPassword("");
        setReEnteredPassword("");
      });
    }
  };

  return (
    <div>
      <h1>Hello, {auth.username}</h1>
      <button
        type="button"
        onClick={() => {
          if (!wantsToChangePW) setWantsToChangePW(true);
          else setWantsToChangePW(false);
          console.log(wantsToChangePW);
        }}
      >
        Change Password
      </button>
      <div>
        {wantsToChangePW ? (
          <div>
            <form onSubmit={onSubmit}>
              <label>new password</label>
              <input
                type="password"
                value={newPassword}
                onChange={ev => setNewPassword(ev.target.value)}
              />
              <label>re-enter password</label>
              <input
                type="password"
                value={reEnteredPassword}
                onChange={ev => setReEnteredPassword(ev.target.value)}
              />
              <button type="submit">Save changes</button>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Profile;
