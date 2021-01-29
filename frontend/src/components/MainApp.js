import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Grid,
  TextField,
  FormControl,
  Paper,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";

import { user } from "../reducers/user";
import { fetchActivities, postActivity, workout } from "../reducers/workout";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkouts } from "reducers/workout";
import ActivityForm from "./ActivityForm";
import ActivityList from "./ActivityList";
import UserList from "./UserList";
import Stats from "./Stats";
//import classes from "*.module.css";

const URL = "http://localhost:8080/users";

const useStyles = makeStyles({
  paper: {
    minHeight: '800px',
    width: '600px',
    //padding: '0 30px',
    margin: '30px'
  },
});

export const MainApp = () => {
  const dispatch = useDispatch();

  const classes = useStyles();  

  //new state
  // const [date, setDate] = useState(Date.now());
  // const [exercise, setExercise] = useState("");
  // const [sets, setSets] = useState(0);
  // const [reps, setReps] = useState(0);
  // const [weight, setWeight] = useState(0);

  const workouts = useSelector((store) => store.workout.workouts);
  const activities = useSelector((store) => store.workout.activities);

  // //old state
  // const accessToken = useSelector((store) => store.user.login.accessToken);
  // const userId = useSelector((store) => store.user.login.userId);
  // const statusMessage = useSelector((store) => store.user.login.statusMessage);

  // const loginSuccess = (loginResponse) => {};

  // const loginFailed = (loginError) => {};

  // const logout = () => {};

  useEffect(() => {
    dispatch(fetchWorkouts());
    dispatch(fetchActivities());
  }, []);

  //  console.log(activities)

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   console.log( {date, exercise, sets, reps, weight})
  //   dispatch(postActivity(date, exercise, sets, reps, weight));
  //   setExercise("")
  //   setReps(0)
  //   setSets(0)
  //   setWeight(0)

  // };

  return (
    <Grid 
    container
    item
    wrap='nowrap'
    >
      <Paper className={classes.paper}><UserList /></Paper>
      <Paper className={classes.paper}>
        <ActivityForm />
        <ActivityList />
      </Paper >
      <Paper className={classes.paper}><Stats /></Paper>
    </Grid>
  );
};
export default MainApp;
