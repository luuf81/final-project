import React, { useState } from "react";
import Profile from "./Profile";
import { useDispatch, useSelector } from "react-redux";
import { user } from "../reducers/user";
import { Button, Grid, TextField, FormControl } from "@material-ui/core";
const SIGNUP_URL = "http://localhost:8080/users";
const LOGIN_URL = "http://localhost:8080/sessions";

export const LoginForm = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((store) => store.user.login.accessToken);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSuccess = (loginResponse) => {
    localStorage.setItem('superToken', loginResponse.accessToken)
    dispatch(
      user.actions.setAccessToken({ accessToken: loginResponse.accessToken })
    );
    dispatch(user.actions.setUserId({ userId: loginResponse.userId }));
    dispatch(user.actions.setStatusMessage({ statusMessage: 'Login Success' }));
  };

  const handleLoginFailed = (loginError) => {
    dispatch(user.actions.setAccessToken({ accessToken: null }));
    dispatch(user.actions.setStatusMessage({ statusMessage: loginError }));
  };

  // To sign up a user.
  const handleSignup = (event) => {
    event.preventDefault();

    fetch(SIGNUP_URL, {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => handleLoginSuccess(json))
      .catch((err) => handleLoginFailed(err));
  };

  // To login a user
  const handleLogin = (event) => {
    event.preventDefault();
    fetch(LOGIN_URL, {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => handleLoginSuccess(json))
      .catch((err) => handleLoginFailed(err));
  };

  if (!accessToken) {
    // If user is logged out, show login form
    return (
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        >
            <TextField
              label="Username"
              margin="normal"
              variant="outlined"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          
            <TextField
              label="Password"
              margin="normal"
              variant="outlined"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              color="secondary"
            />
          <Button 
            type="submit"
            variant="contained" 
            color="primary" 
            onClick={handleSignup}>
            Sign-Up
          </Button>
          <Button type="submit" 
            variant="contained"
            color="primary" 
            onClick={handleLogin}>
            Login
          </Button>
        </Grid>
    );
  } else {
    // If user is logged in, show profile
    return <Profile />;
  }
};
export default LoginForm;
