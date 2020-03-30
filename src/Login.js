import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, TextField } from "@material-ui/core";
// import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

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

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const useStyles = makeStyles(theme => ({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2)
      }
    }
  }));

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

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
    <Box marginTop="6rem" padding="1rem">
      {!wantsToMakeAccount ? (
        <form onSubmit={onSubmit}>
          <h1>Login</h1>
          <div className="error">{error}</div>
          <TextField
            label="username"
            value={username}
            onChange={ev => setUsername(ev.target.value)}
          />
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />
          <br />

          <Button type="submit" variant="contained">
            Login
          </Button>
        </form>
      ) : (
        <form onSubmit={onSubmit}>
          <h1>Create an account</h1>
          <div className="error">{error}</div>
          <TextField
            label="Choose a username"
            value={username}
            onChange={ev => setUsername(ev.target.value)}
          />
          <TextField
            label="First name"
            value={firstname}
            onChange={ev => setFirstname(ev.target.value)}
          />
          <TextField
            label="Last name"
            value={lastname}
            onChange={ev => setLastname(ev.target.value)}
          />
          <TextField
            label="Choose a password"
            type="password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />
          <br />
          <Button type="submit" variant="contained">
            Sign up
          </Button>
        </form>
      )}

      <Button
        type="button"
        onClick={() => {
          if (wantsToMakeAccount === false) setWantsToMakeAccount(true);
          else setWantsToMakeAccount(false);
        }}
      >
        {!wantsToMakeAccount
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"}
      </Button>
    </Box>
  );
};

export default Login;
