import React, { useState } from "react";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import LoginForm from "./components/LoginForm";
import { Provider, useSelector } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { user } from "./reducers/user";
import { workout } from "reducers/workout";
import { Container, Paper } from "@material-ui/core";
import MainApp from "components/MainApp";

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
  typography: {
    button: {
      marginTop: '20px'
    },
  }
});

const useStyles = makeStyles(theme => ({
  mainContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: 0
    },
  }
}));

export const App = () => {

  const classes = useStyles()
  
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  //const dispatch = useDispatch();
  const accessToken = useSelector((store) => store.user.login.accessToken);

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
    
    <Container className={classes.mainContainer}>
        {!accessToken && <LoginForm/>}
        {accessToken && <MainApp/>}
    </Container>
  );
};

export default App;