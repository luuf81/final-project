import React, { useState } from "react";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import LoginForm from "./components/LoginForm";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { user } from "./reducers/user";
import { workout } from "reducers/workout";
import { Container, Paper } from "@material-ui/core";

const URL = "http://localhost:8080/users";

const reducer = combineReducers({ user: user.reducer, workout: workout.reducer });

const store = configureStore({ reducer });

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: '#a6d4fa',
    },
  },
});

export const App = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // To sign up a user.
  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(URL, {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.log("error:", err));
  };
  return (
    <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Container>
      <Paper>
      <LoginForm />
      </Paper>
      </Container>
    </Provider>
    </ThemeProvider>
  );
};
