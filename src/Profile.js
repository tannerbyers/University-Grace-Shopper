import React, { useState, useEffect } from "react";

const Profile = ({ auth, changePassword, changeName }) => {
  const [newPassword, setNewPassword] = useState("");
  const [reEnteredPassword, setReEnteredPassword] = useState("");
  const [firstname, setFirstname] = useState(auth.firstname);
  const [lastname, setLastname] = useState(auth.lastname);
  const [wantsToChangePW, setWantsToChangePW] = useState(true);
  const [wantsToUpdateProfile, setWantsToUpdateProfile] = useState(true);

  useEffect(() => {
    setWantsToChangePW(false);
  }, []);

  useEffect(() => {
    setWantsToUpdateProfile(false);
  }, []);

  const submitNewPassword = ev => {
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

  const submitNewName = ev => {
    ev.preventDefault();
    changeName({ firstname: firstname, lastname: lastname, id: auth.id });
  };

  return (
    <div>
      <h1>Hello, {auth.firstname}</h1>
      <div>
        <div>
          <h3>Profile info</h3>
          <p>username: {auth.username}</p>
          <p>firstname: {firstname}</p>
          <p>lastname: {lastname}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!wantsToUpdateProfile) setWantsToUpdateProfile(true);
            else setWantsToUpdateProfile(false);
          }}
        >
          Update Profile
        </button>
        <button
          type="button"
          onClick={() => {
            if (!wantsToChangePW) setWantsToChangePW(true);
            else setWantsToChangePW(false);
          }}
        >
          Change Password
        </button>
      </div>

      <div>
        {wantsToUpdateProfile ? (
          <div>
            <form onSubmit={submitNewName}>
              <label>first name</label>
              <input
                type="text"
                value={firstname}
                onChange={ev => setFirstname(ev.target.value)}
              />
              <label>last name</label>
              <input
                type="text"
                value={lastname}
                onChange={ev => setLastname(ev.target.value)}
              />
              <button type="submit">Save changes</button>
            </form>
          </div>
        ) : (
          ""
        )}
        {wantsToChangePW ? (
          <div>
            <form onSubmit={submitNewPassword}>
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
