import React, { useState, useEffect } from "react";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import LoginForm from "./components/LoginForm";
import { Provider, useSelector, useDispatch } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { user } from "./reducers/user";
import { workout } from "reducers/workout";
import { Container, Paper, Snackbar } from "@material-ui/core";
import MainApp from "components/MainApp";
import io from "socket.io-client"
import UserOnline from "./UserOnline"


const URL = "https://happyhabits.herokuapp.com/users";

// const reducer = combineReducers({
//   user: user.reducer,
//   workout: workout.reducer,
// });

// const store = configureStore({ reducer });

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#a6d4fa",
    },
  },
  typography: {
    button: {
      marginTop: "20px",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
}));

export const App = () => {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  //const [username, setUsername] = useState(null)
  //let username = null
  //const [open, setOpen] = useState(false)

  const dispatch = useDispatch();
  const accessToken = useSelector((store) => store.user.login.accessToken);
  const loggedinUser = useSelector((store) => store.user.login.userId);
  //const [userOnline, setUseronline] = useState(false)

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

  // const handleClose = (event, reason) => {
  //   setOpen(false);
  // };

  var socket;

  if (accessToken) {
    socket = io("http://localhost:8080");
    console.log(socket);
    socket.emit('user', accessToken)
  }

  //useEffect(() => {
  if(socket)socket.on('user', userSocket => {
    if(userSocket._id !== loggedinUser) {
    console.log(userSocket.name + ': connected')
    dispatch(user.actions.setOnlineusers( userSocket.name ))
    //setUseronline(true)
    //setOpen(true)
    //setUsername(user.name)
    //username = user.name
    //setOpen(true)
    }
  })
//}, [userOnline])

  return (
    <Container className={classes.mainContainer}>
      {!accessToken && <LoginForm />}
      {accessToken && <MainApp />}
      {/* {userOnline && <UserOnline/>} */}
      <UserOnline/>
    </Container>
  );
};

export default App;
