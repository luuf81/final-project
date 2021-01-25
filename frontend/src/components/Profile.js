import React, { useState, useEffect } from "react";
import { user } from "../reducers/user";
import { fetchActivities, postActivity, workout } from "../reducers/workout"
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkouts } from 'reducers/workout'

const URL = "http://localhost:8080/users";
export const Profile = () => {
  const dispatch = useDispatch();

  //new state
  const [date, setDate] = useState("")
  const [exercise, setExercise] = useState("")
  const [sets, setSets] = useState(0)
  const [reps, setReps] = useState(0)
  const [weight, setWeight] = useState(0)

  const workouts = useSelector((store) => store.workout.workouts)
  const activities = useSelector((store) => store.workout.activities)
  
  //old state
  const accessToken = useSelector((store) => store.user.login.accessToken);
  const userId = useSelector((store) => store.user.login.userId);
  const statusMessage = useSelector((store) => store.user.login.statusMessage);

  const loginSuccess = (loginResponse) => {};

  const loginFailed = (loginError) => {};

  const logout = () => {};

  useEffect(() => {
    dispatch(fetchWorkouts())
    dispatch(fetchActivities())
  }, [workouts.activities] )

  const handleSubmit = () => {
    dispatch(postActivity(date, exercise, sets, reps, weight ))
  };

  return (
    <div>
      <h1>Profile</h1>
      <h2>Status :</h2>
      <h4>Response :</h4>
      <p>{`${statusMessage}`}</p>
      <h4>userId :</h4>
      <p> {`${userId}`}</p>
      <h4>accessToken :</h4>
      <p> {`${accessToken}`}</p>
      <input type="submit" onClick={logout} value="Test Logout" />
      <form>
          <div><label>
            Activity Date
            <input
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label></div>
          <div><label>
            Exercise
            <input
              required
              value={exercise}
              onChange={(event) => setExercise(event.target.value)}
            />
          </label></div>
          <div><label>
            Sets
            <input
              required
              value={sets}
              onChange={(event) => setSets(event.target.value)}
            />
          </label></div>
          <div><label>
            Reps
            <input
              required
              value={reps}
              onChange={(event) => setReps(event.target.value)}
            />
          </label></div>
          <div><label>
            weight
            <input
              required
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
            />
          </label></div>
          <div><button type="submit" onClick={handleSubmit}>
            Submit
          </button></div>
        </form>
    </div>
  );
};
export default Profile;
