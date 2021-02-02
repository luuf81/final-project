import React, { useState, useEffect } from "react";
import moment from "moment";
import { user } from "../reducers/user";
import { fetchActivities, postActivity, workout } from "../reducers/workout";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkouts } from "reducers/workout";
import { Box, Card, CardContent, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";

const URL = "https://happyhabits.herokuapp.com/users";
export const ActivityList = () => {
  const dispatch = useDispatch();
  const activities = useSelector((store) => store.workout.activities);
  const workouts = useSelector((store) => store.workout.workouts);
  
  //workouts.activities.map(item => console.log(item))
  //activities.map(item => console.log(item.user.name))

  return (
    
    <Box mt={10}>
      <Paper>
        {workouts.map((item) => (
          <Box m={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography>Username: {item.user.name}</Typography>
                <Typography>Date: {item.sessionDate}</Typography>
                <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Exercise</TableCell>
                            <TableCell>Sets</TableCell>
                            <TableCell>Reps</TableCell>
                            <TableCell>Weight</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {item.activities.map(activity => (
                                <TableRow>
                                    <TableCell component="th" scope="row">{activity.type.name}</TableCell>
                                    <TableCell align="right">{activity.sets}</TableCell>
                                    <TableCell align="right">{activity.reps}</TableCell>
                                    <TableCell align="right">{activity.weight}</TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default ActivityList;
