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

const URL = "http://localhost:8080/users";

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
  sidePaper: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  stickyNav: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "black",
  },
}));

export const MainApp = () => {
  const dispatch = useDispatch();

  const classes = useStyles();

  const workouts = useSelector((store) => store.workout.workouts);
  const activities = useSelector((store) => store.workout.activities);

  const [value, setValue] = React.useState("recents");

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
        <Paper className={(classes.paper, classes.sidePaper)}>
          <UserList />
        </Paper>
        <Paper className={classes.paper}>
          <ActivityForm />
          <ActivityList />
        </Paper>
        <Paper className={(classes.paper, classes.sidePaper)}>
          <Stats />
        </Paper>
      </Grid>
      <BottomNavigation
        value={value}
        onChange={handleChange}
        className={classes.stickyNav}
      >
        <BottomNavigationAction
          label="Recents"
          value="recents"
          icon={<Restore />}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<Favorite />}
        />
        <BottomNavigationAction
          label="Nearby"
          value="nearby"
          icon={<LocationOn />}
        />
        <BottomNavigationAction
          label="Folder"
          value="folder"
          icon={<Folder />}
        />
      </BottomNavigation>
    </>
  );
};
export default MainApp;
