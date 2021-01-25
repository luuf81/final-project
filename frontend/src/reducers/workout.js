import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    workouts: [],
    activities: []
}

export const workout = createSlice({
    name: "workout",
    initialState,
    reducers: {
        setWorkouts: (state, action) => {
            console.log('im now in reducer')
            state.workouts = action.payload
        },
        setActivities: (state, action) => {
            console.log('im now in reducer')
            state.activities = action.payload
        }
    }
})

export const fetchWorkouts = () => {
    return (dispatch) => {
        console.log(localStorage.getItem('accessToken'))
        fetch("http://localhost:8080/workouts", {
            method: 'GET',
            headers: { Authorization: localStorage.getItem('accessToken') },
          })
        .then(res => res.json())
        .then((workouts) => {
            console.log(workouts)
            dispatch(workout.actions.setWorkouts(workouts))
        })
}}

export const fetchActivities = () => {
    return (dispatch) => {
        console.log(localStorage.getItem('accessToken'))
        fetch("http://localhost:8080/activities", {
            method: 'GET',
            headers: { Authorization: localStorage.getItem('accessToken') },
          })
        .then(res => res.json())
        .then((activities) => {
            console.log(activities)
            dispatch(workout.actions.setActivities(activities))
        })
}}

export const postActivity = (date, exercise, sets, reps, weight) => {
    fetch("http://localhost:8080/activities", {
    method: "POST",
    headers: {'Content-Type': 'application/json', Authorization: localStorage.getItem('accessToken')},
    body: JSON.stringify({activityDate: date, type: exercise, sets, reps, weight})
    })
    .then(res => res.json())
    .then((res) => {
        console.log(res)
    })
}