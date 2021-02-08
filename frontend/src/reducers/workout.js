import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    workouts: [],
    activities: [],
    exercises: [],
    newExercise: {},
    currentExercise: ""
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
        setCurrentExercise: (state, action) => {
            state.currentExercise = action.payload
        },
    }
})

export const fetchWorkouts = () => {
    return (dispatch) => {
        console.log(localStorage.getItem('accessToken'))
        fetch("https://happyhabits.herokuapp.com/workouts", {
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
        fetch("https://happyhabits.herokuapp.com/activities", {
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
    fetch("https://happyhabits.herokuapp.com/activities", {
    method: "POST",
    headers: {'Content-Type': 'application/json', Authorization: localStorage.getItem('accessToken')},
    body: JSON.stringify({activityDate: date, type: exercise, sets, reps, weight})
    })
    .then(res => res.json())
    .then((workouts) => {
        console.log(workouts)
        dispatch(workout.actions.setWorkouts(workouts.workouts))
        dispatch(workout.actions.setActivities(workouts.activities))
    })
}
}

export const fetchExercises = () => {
    return (dispatch) => {
        console.log(localStorage.getItem('accessToken'))
        fetch("https://happyhabits.herokuapp.com/activitytypes", {
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
    fetch("https://happyhabits.herokuapp.com/activitytypes", {
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