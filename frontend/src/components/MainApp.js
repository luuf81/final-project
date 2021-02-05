import React, { useState, useEffect } from "react";
import {
  Button,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Grid,
  TextField,
  FormControl,
  Paper,
} from "@material-ui/core";
import { Folder, Restore, Favorite, LocationOn } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";

import { user } from "../reducers/user";
import {
  fetchActivities,
  fetchExercises,
  postActivity,
  workout,
} from "../reducers/workout";
//import { socketEvents } from "../reducers/user"
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkouts } from "reducers/workout";
import ActivityForm from "./ActivityForm";
import ActivityList from "./ActivityList";
import UserList from "./UserList";
import Stats from "./Stats";
//import classes from "*.module.css";

const URL = "https://happyhabits.herokuapp.com/users";

const useStyles = makeStyles((theme) => ({
  paper: {
    minHeight: "800px",
    width: "600px",
    //padding: '0 30px',
    margin: "30px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
      margin: 0,
    },
  },
  userPaper: {
    [theme.breakpoints.down("sm")]: {
      // display: props => props.value === "users" ? "block" : "none",
      display: "block",
    },
  },
  activitiesPaper: {
    [theme.breakpoints.down("sm")]: {
      // display: props => props.value === "activities" ? "block" : "none",
      display: "block",
    },
  },
  statsPaper: {
    [theme.breakpoints.down("sm")]: {
      // display: props => props.value === "stats" ? "block" : "none",
      display: "block",
    },
  },
  hiddenPaper: {
    [theme.breakpoints.down("sm")]: {
      // display: props => props.value === "stats" ? "block" : "none",
      display: "none",
    },
  },
  stickyNav: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "black",
    [theme.breakpoints.up("sm")]: {
      // display: props => props.value === "stats" ? "block" : "none",
      display: "none",
    },
  },
}));

export const MainApp = (props) => {
  const dispatch = useDispatch();

  const classes = useStyles(props);

  const workouts = useSelector((store) => store.workout.workouts);
  const activities = useSelector((store) => store.workout.activities);

  const [value, setValue] = React.useState("activities");
  console.log(value);

  console.log(props);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(fetchExercises());
    dispatch(fetchWorkouts());
    dispatch(fetchActivities());
    //dispatch(socketEvents())
  }, []);

  return (
    <>
      <Grid container item wrap="nowrap">
        <Paper
          className={
            (classes.paper, value === "users" ? classes.userPaper : classes.hiddenPaper)
          }
        >
          <UserList />
        </Paper>
        <Paper className={(classes.paper, value === "activities" ? classes.activitiesPaper : classes.hiddenPaper)}>
          <ActivityForm />
          <ActivityList />
        </Paper>
        <Paper className={(classes.paper, value === "stats" ? classes.statsPaper : classes.hiddenPaper)}>
          <Stats />
        </Paper>
      </Grid>
      <BottomNavigation
        value={value}
        onChange={handleChange}
        className={classes.stickyNav}
      >
        <BottomNavigationAction
          label="Users"
          value="users"
          icon={<Restore />}
        />
        <BottomNavigationAction
          label="Activities"
          value="activities"
          icon={<Favorite />}
        />
        <BottomNavigationAction
          label="Stats"
          value="stats"
          icon={<LocationOn />}
        />
      </BottomNavigation>
    </>
  );
};
export default MainApp;
