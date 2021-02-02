import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  Slider,
  Typography,
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
import { fetchWorkouts, postExercise } from "reducers/workout";

const filter = createFilterOptions();

const URL = "https://happyhabits.herokuapp.com/users";
export const ActivityForm = () => {
  const dispatch = useDispatch();
  const exercises = useSelector((store) => store.workout.exercises);

  //free solo state test
  //const [value, setValue] = useState(useSelector((store) => store.workout.newExercise.name))
  const [value, setValue] = useState()
  
  const [open, toggleOpen] = useState(false);

  const handleClose = () => {
    setDialogValue({
      name: "",
      primary: "",
      secondary: ""
    });

    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = useState({
    name: "",
    primary: "",
    secondary: ""
  });

  const handleInputSubmit = (event) => {
    event.preventDefault();
    dispatch(postExercise(dialogValue.name, dialogValue.primary, dialogValue.secondary));
     setValue({
       name: dialogValue.name,
       primary: dialogValue.primary,
       secondary: dialogValue.secondary
     });
    console.log(value)

    handleClose();
  };

  //end free solo test

  //new state
  const [date, setDate] = useState(moment(Date.now()).format("YYYY-MM-DD"));
  const [exercise, setExercise] = useState("benchpress");
  // old select state const [inputValue, setInputValue] = React.useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(8);
  const [weight, setWeight] = useState(60);

  //old state
  const accessToken = useSelector((store) => store.user.login.accessToken);

  const handleSubmit = (e) => {
    e.preventDefault();
    //setValue(this.inputRef.value)
    console.log(value)
    dispatch(postActivity(date, value.name, sets, reps, weight));
    setExercise("benchpress");
    setReps(8);
    setSets(3);
    setWeight(60);
  };

  const handleDateChange = (date) => {
    setDate(moment(date).format("YYYY-MM-DD"));
  };

  const handleSetChange = (event, newValue) => {
    setSets(newValue);
  };

  const handleRepChange = (event, newValue) => {
    setReps(newValue);
  };

  const handleWeightChange = (event, newValue) => {
    setWeight(newValue);
  };

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
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                // timeout to avoid instant validation of the dialog's form.
                setTimeout(() => {
                  toggleOpen(true);
                  setDialogValue({
                    name: newValue,
                    primary: "",
                    secondary: ""
                  });
                });
              } else if (newValue && newValue.inputValue) {
                toggleOpen(true);
                setDialogValue({
                  name: newValue.inputValue,
                  primary: "",
                    secondary: ""
                });
              } else {
                console.log(newValue)
                setValue(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              if (params.inputValue !== "") {
                filtered.push({
                  inputValue: params.inputValue,
                  name: `Add "${params.inputValue}"`,
                });
              }

              return filtered;
            }}
            id="free-solo-dialog-demo"
            options={exercises}
            getOptionLabel={(option) => {
              // e.g value selected with enter, right from the input
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            renderOption={(option) => option.name}
            fullWidth
            freeSolo
            renderInput={(params) => (
              <TextField    
              {...params}
                label="Free solo dialog"
                variant="standard"
              />
            )}
          />
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <form onSubmit={handleInputSubmit}>
              <DialogTitle id="form-dialog-title">Add a new Exercise</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Did you miss any exercise? Add it here...
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  value={dialogValue.name}
                  onChange={(event) =>
                    setDialogValue({
                      ...dialogValue,
                      name: event.target.value,
                    })
                  }
                  label="title"
                  type="text"
                />
                <TextField
                  margin="dense"
                  id="name"
                  value={dialogValue.primary}
                  onChange={(event) =>
                    setDialogValue({ ...dialogValue, primary: event.target.value })
                  }
                  label="primary"
                  type="text"
                />
                <TextField
                  margin="dense"
                  id="name"
                  value={dialogValue.secondary}
                  onChange={(event) =>
                    setDialogValue({ ...dialogValue, secondary: event.target.value })
                  }
                  label="secondary"
                  type="text"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Add
                </Button>
              </DialogActions>
            </form>
          </Dialog>
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
          <Button
            type="submit"
            onClick={handleSubmit}
            fullWidth
            color="primary"
            variant="contained"
          >
            Log Activity
          </Button>
        </Grid>
      </CardContent>
    </Card>    
  );
};
export default ActivityForm;

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
]
