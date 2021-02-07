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
  Container,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";

export const Stats = () => {
  const data = [
    {
      subject: "Math",
      A: 120,
      B: 110,
      fullMark: 150,
    },
    {
      subject: "Chinese",
      A: 98,
      B: 130,
      fullMark: 150,
    },
    {
      subject: "English",
      A: 86,
      B: 130,
      fullMark: 150,
    },
    {
      subject: "Geography",
      A: 99,
      B: 100,
      fullMark: 150,
    },
    {
      subject: "Physics",
      A: 85,
      B: 90,
      fullMark: 150,
    },
    {
      subject: "History",
      A: 65,
      B: 85,
      fullMark: 150,
    },
  ];

  const dispatch = useDispatch();
  const activities = useSelector((store) => store.workout.activities);
  const workouts = useSelector((store) => store.workout.workouts);

  const bench = activities
    .filter((item) => item.type.name === "benchpress")
    .reverse();

  function formatXAxis(activityDate) {
    return moment(activityDate).format("ddd");
  }

  //   bench.forEach(item => item.activityDate = moment(item.activityDate).format("ddd"))
  //   console.log(bench)

  return (
    <>
    <Container>
      <RadarChart outerRadius={90} width={350} height={350} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        <Radar
          name="Mike"
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name="Lily"
          dataKey="B"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
      <LineChart width={300} height={200} data={bench}>
        <Line type="monotone" dataKey="weight" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="activityDate" tickFormatter={formatXAxis} />
        <YAxis />
        <Tooltip label="activityDate" />
      </LineChart>
      </Container>
    </>
  );
};

export default Stats;
