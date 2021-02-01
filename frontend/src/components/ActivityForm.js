import React, { useState, useEffect } from "react";
import {
  Card, CardContent,
Button,
  Grid,
  TextField,
  FormControl,
  Slider,
  Typography
} from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
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

const URL = "http://localhost:8080/users";
export const ActivityForm = () => {
  const dispatch = useDispatch();

  //new state
  const [date, setDate] = useState(moment(Date.now()).format("YYYY-MM-DD"));
  const [exercise, setExercise] = useState("benchpress");
  const [inputValue, setInputValue] = React.useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(8);
  const [weight, setWeight] = useState(60);

  //old state
  const accessToken = useSelector((store) => store.user.login.accessToken);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ date, exercise, sets, reps, weight });
    dispatch(postActivity(date, exercise, sets, reps, weight));
    setExercise("benchpress");
    setReps(8);
    setSets(3);
    setWeight(60);
  };

  const handleDateChange = (date) => {
    setDate(moment(date).format("YYYY-MM-DD"));
  };

  const handleSetChange = (event, newValue) => {
    setSets(newValue)
  }

  const handleRepChange = (event, newValue) => {
    setReps(newValue)
  }

  const handleWeightChange = (event, newValue) => {
    setWeight(newValue)
  }

  return (
      <Card>
          <CardContent>
    <Grid
      container
      direction="column"
      //alignItems="center"
      justify="center"
      //style={{ minHeight: "100vh" }}
    >
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          fullWidth
          // format="MM/DD/yyyy"
          format="YYYY-MM-DD"
          margin="normal"
          id="date-picker-inline"
          label="Activity date"
          value={date}
          onChange={
        //       () => {
        //     setDate(moment(date).format("YYYY-MM-DD"));
        //     console.log(date);
        //   }
          handleDateChange
        }
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
      <Autocomplete
        id="combo-box-demo"
        options={["benchpress", "squats"]}
        value={exercise}
        onChange={(event, newValue) => {
          setExercise(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        //getOptionLabel={(option) => option.title}
        fullWidth
        //style={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Exercise" variant="outlined" />
        )}
      />
      <Typography id="continuous-slider" gutterBottom>
        Sets
      </Typography>
      <Slider
        value={sets}
        valueLabelDisplay="on"
        step={1}
        min={1}
        max={10}
        onChange={handleSetChange}
        //onChange={(event) => setReps(event.target.value)}
        aria-labelledby="continuous-slider"
      />
       <Typography id="continuous-slider" gutterBottom>
        Reps
      </Typography>
      <Slider
        value={reps}
        valueLabelDisplay="on"
        step={1}
        min={1}
        max={20}
        onChange={handleRepChange}
        //onChange={(event) => setReps(event.target.value)}
        aria-labelledby="continuous-slider"
      />
      <Typography id="continuous-slider" gutterBottom>
        Weight
      </Typography>
      <Slider
        value={weight}
        valueLabelDisplay="on"
        step={2.5}
        min={0}
        max={140}
        onChange={handleWeightChange}
        //onChange={(event) => setReps(event.target.value)}
        aria-labelledby="continuous-slider"
      />

      {/* <TextField
        required
        value={sets}
        onChange={(event) => setSets(event.target.value)}
      /> */}
      {/* <TextField
        required
        value={reps}
        onChange={(event) => setReps(event.target.value)}
      />
      <TextField
        required
        value={weight}
        onChange={(event) => setWeight(event.target.value)}
      /> */}
      <Button type="submit" onClick={handleSubmit} fullWidth color="primary" variant="contained">
        Log those Gainz
      </Button>
    </Grid></CardContent></Card>
    // <div>
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
export default ActivityForm;
