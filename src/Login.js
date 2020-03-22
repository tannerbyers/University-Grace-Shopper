import React, { useState, useEffect } from "react";

const Login = ({ login, createUser }) => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [wantsToMakeAccount, setWantsToMakeAccount] = useState(true);

  useEffect(() => {
    setWantsToMakeAccount(false);
  }, []);

  const onSubmit = ev => {
    if (!wantsToMakeAccount) {
      ev.preventDefault();
      login({ username, password })
        .catch(ex => setError(ex.response.data.message))
        .then(() => {
          setUsername("");
          setPassword("");
        });
    } else {
      ev.preventDefault();
      const role = "USER";
      createUser({ username, firstname, lastname, password, role })
        .catch(ex => setError(ex.response.data.message))
        .then(() => {
          setUsername("");
          setFirstname("");
          setLastname("");
          setPassword("");
        });
    }
  };

  return (
    <div>
      {!wantsToMakeAccount ? (
        <form onSubmit={onSubmit}>
          <h1>Login</h1>
          <div className="error">{error}</div>
          <input
            value={username}
            onChange={ev => setUsername(ev.target.value)}
          />
          <input
            type="password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />
          <button>Login</button>
        </form>
      ) : (
        <form onSubmit={onSubmit}>
          <h1>Create an account</h1>
          <div className="error">{error}</div>
          <input
            placeholder="choose a username"
            value={username}
            onChange={ev => setUsername(ev.target.value)}
          />
          <input
            placeholder="First name"
            value={firstname}
            onChange={ev => setFirstname(ev.target.value)}
          />
          <input
            placeholder="Last name"
            value={lastname}
            onChange={ev => setLastname(ev.target.value)}
          />
          <input
            placeholder="choose a password"
            type="password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />
          <button>Sign up</button>
        </form>
      )}

      <button
        type="button"
        onClick={() => {
          if (wantsToMakeAccount === false) setWantsToMakeAccount(true);
          else setWantsToMakeAccount(false);
        }}
      >
        {!wantsToMakeAccount
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"}
      </button>
    </div>
  );
};

export default Login;
