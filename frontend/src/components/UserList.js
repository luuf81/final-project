import React, { useState, useEffect } from "react";
import { fetchUsers, user } from "../reducers/user";
import { fetchActivities, postActivity, workout } from "../reducers/workout";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkouts } from "reducers/workout";
import { Box, Card, CardContent, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";

export const UserList = () => {
    
    const dispatch = useDispatch();
    const activities = useSelector((store) => store.workout.activities);
    const workouts = useSelector((store) => store.workout.workouts);
    const users = useSelector((store) => store.user.users);

    useEffect(() => {
        dispatch(fetchUsers());
      }, []);


return (
        <>
        <Typography align="center" variant="h4">Your gym buddies</Typography>
        {users.map(user => (<Typography>{user.name}</Typography>))}
        </>
)

}
    
export default UserList;