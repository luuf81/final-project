import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, FormControl } from "@material-ui/core";
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

const URL = "http://localhost:8080/users";
export const MainApp = () => {
  const dispatch = useDispatch();

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
    <>
    <ActivityForm/>
    <ActivityList/>
    </>
    // <Grid
    //   container
    //   direction="column"
    //   alignItems="center"
    //   justify="center"
    //   style={{ minHeight: "100vh" }}
    // >
    //   <MuiPickersUtilsProvider utils={MomentUtils}>
    //     <KeyboardDatePicker
    //       disableToolbar
    //       variant="inline"
    //       // format="MM/DD/yyyy"
    //       format="YYYY-MM-DD"
    //       margin="normal"
    //       id="date-picker-inline"
    //       label="Date picker inline"
    //       value={date}
    //       onChange={setDate}
    //       KeyboardButtonProps={{
    //         "aria-label": "change date",
    //       }}
    //     />
    //   </MuiPickersUtilsProvider>
    //   <TextField
    //     required
    //     value={date}
    //     onChange={(event) => setDate(event.target.value)}
    //   />
    //   <TextField
    //     required
    //     value={exercise}
    //     onChange={(event) => setExercise(event.target.value)}
    //   />
    //   <TextField
    //     required
    //     value={sets}
    //     onChange={(event) => setSets(event.target.value)}
    //   />
    //   <TextField
    //     required
    //     value={reps}
    //     onChange={(event) => setReps(event.target.value)}
    //   />
    //   <TextField
    //     required
    //     value={weight}
    //     onChange={(event) => setWeight(event.target.value)}
    //   />
    //   <Button type="submit" onClick={handleSubmit}>
    //     Submit
    //   </Button>
    // </Grid>
    // <div>
    //   <h1>Profile</h1>
    //   <h2>Status :</h2>
    //   <h4>Response :</h4>
    //   <p>{`${statusMessage}`}</p>
    //   <h4>userId :</h4>
    //   <p> {`${userId}`}</p>
    //   <h4>accessToken :</h4>
    //   <p> {`${accessToken}`}</p>
    //   <input type="submit" onClick={logout} value="Test Logout" />
    //   <form>
    //       <div><label>
    //         Activity Date
    //         <input
    //           required
    //           value={date}
    //           onChange={(event) => setDate(event.target.value)}
    //         />
    //       </label></div>
    //       <div><label>
    //         Exercise
    //         <input
    //           required
    //           value={exercise}
    //           onChange={(event) => setExercise(event.target.value)}
    //         />
    //       </label></div>
    //       <div><label>
    //         Sets
    //         <input
    //           required
    //           value={sets}
    //           onChange={(event) => setSets(event.target.value)}
    //         />
    //       </label></div>
    //       <div><label>
    //         Reps
    //         <input
    //           required
    //           value={reps}
    //           onChange={(event) => setReps(event.target.value)}
    //         />
    //       </label></div>
    //       <div><label>
    //         weight
    //         <input
    //           required
    //           value={weight}
    //           onChange={(event) => setWeight(event.target.value)}
    //         />
    //       </label></div>
    //       <div><button type="submit" onClick={handleSubmit}>
    //         Submit
    //       </button></div>
    //     </form>
    // </div>
  );
};
export default MainApp;
