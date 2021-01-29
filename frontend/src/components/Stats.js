import React, { useState, useEffect } from "react";
import moment from "moment";
import { user } from "../reducers/user";
import { fetchActivities, postActivity, workout } from "../reducers/workout";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkouts } from "reducers/workout";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export const Stats = () => {
  const data = [
    { name: "Page A", uv: 400 },
    { name: "Page B", uv: 500 },
    { name: "Page C", uv: 600 },
    { name: "Page D", uv: 300 },
  ];

  const dispatch = useDispatch();
  const activities = useSelector((store) => store.workout.activities);
  const workouts = useSelector((store) => store.workout.workouts);

   const bench = activities.filter(item => item.type.name === "benchpress" ).reverse()
  
   function formatXAxis(activityDate) {
    return moment(activityDate).format('ddd')
    }

   //   bench.forEach(item => item.activityDate = moment(item.activityDate).format("ddd"))
//   console.log(bench)


  return (
    <>
      <LineChart width={300} height={200} data={bench}>
        <Line type="monotone" dataKey="weight" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="activityDate" tickFormatter={formatXAxis}/>
        <YAxis />
        <Tooltip label="activityDate"/>
      </LineChart>
    </>
  );
};

export default Stats;
