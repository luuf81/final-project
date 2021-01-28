import React, { useState } from "react";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Provider, useSelector } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { user } from "./reducers/user";
import { workout } from "reducers/workout";
import { Container, Paper } from "@material-ui/core";
import App from "./App";

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
    }
  }
});

export const AppWrapper = () => {
  
  return (
    <Provider store={store}>
    <ThemeProvider theme={theme}>
        <App/>
    </ThemeProvider>
    </Provider>
  );
};
