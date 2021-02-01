import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    workouts: [],
    activities: [],
    exercises: [],
    newExercise: {}
}

export const workout = createSlice({
    name: "workout",
    initialState,
    reducers: {
        setWorkouts: (state, action) => {
            state.workouts = action.payload
        },
        setActivities: (state, action) => {
            state.activities = action.payload
        },
        setExercises: (state, action) => {
            state.exercises = action.payload
        },
        setNewExercise: (state, action) => {
            state.newExercise = action.payload
        },
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
            dispatch(workout.actions.setActivities(activities))
        })
}}

export const postActivity = (date, exercise, sets, reps, weight) => {
    return(dispatch) => {
    fetch("http://localhost:8080/activities", {
    method: "POST",
    headers: {'Content-Type': 'application/json', Authorization: localStorage.getItem('accessToken')},
    body: JSON.stringify({activityDate: date, type: exercise, sets, reps, weight})
    })
    .then(res => res.json())
    .then((workouts) => {
        dispatch(workout.actions.setWorkouts(workouts))
    })
}
}

export const fetchExercises = () => {
    return (dispatch) => {
        console.log(localStorage.getItem('accessToken'))
        fetch("http://localhost:8080/activitytypes", {
            method: 'GET',
            headers: { Authorization: localStorage.getItem('accessToken') },
          })
        .then(res => res.json())
        .then((exercises) => {
            console.log(exercises)
            dispatch(workout.actions.setExercises(exercises))
        })
}}

export const postExercise = (name, primary, secondary) => {
    return(dispatch) => {
    fetch("http://localhost:8080/activitytypes", {
    method: "POST",
    headers: {'Content-Type': 'application/json', Authorization: localStorage.getItem('accessToken')},
    body: JSON.stringify({name, category: 'gym', primaryMuscle: primary, secondaryMuscle: secondary})
    })
    .then(res => res.json())
    .then((json) => {
        dispatch(workout.actions.setExercises(json.exercises))
        dispatch(workout.actions.setNewExercise(json.activityType))
    })
}
}