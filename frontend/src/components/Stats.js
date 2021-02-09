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

  let setsData = [
    {
      muscle: "Chest",
      sets: 0,
    },
    {
      muscle: "Shoulders",
      sets: 0,
    },
    {
      muscle: "Triceps",
      sets: 0,
    },
    {
      muscle: "Biceps",
      sets: 0,
    },
    {
      muscle: "Back",
      sets: 0,
    },
    {
      muscle: "Abs",
      sets: 0,
    },
    {
      muscle: "Front Legs",
      sets: 0,
    },
    {
      muscle: "Back Legs",
      sets: 0,
    },
    {
      muscle: "Glutes",
      sets: 0,
    },
    {
      muscle: "Calves",
      sets: 0,
    },
  ] 

  const dispatch = useDispatch();
  const activities = useSelector((store) => store.workout.activities);
  const currentExercise = useSelector((store) => store.workout.currentExercise.name);
  console.log(currentExercise)
  const workouts = useSelector((store) => store.workout.workouts);
  

  activities.forEach(item => {
    const found = setsData.find(exercise => exercise.muscle == item.type.primaryMuscle)
    found.sets += item.sets
    
  })
  

  const exerciseWeight = activities
    .filter((item) => item.type.name === currentExercise)
    .reverse();

  function formatXAxis(activityDate) {
    return moment(activityDate).format("ddd");
  }

  //   bench.forEach(item => item.activityDate = moment(item.activityDate).format("ddd"))
  //   console.log(bench)

  function customTick({ payload, x, y, textAnchor, stroke, radius }) {
    return (
      <g
        className="recharts-layer recharts-polar-angle-axis-tick"
      >
        <text
          radius={radius}
          fill="white"
          stroke={stroke}
          x={x}
          y={y}
          className="recharts-text recharts-polar-angle-axis-tick-value"
          text-anchor={textAnchor}
        >
          <tspan x={x} dy="0em">
            {payload.value}
          </tspan>
        </text>
      </g>
    );
  }

  //style={{ fill: 'white' }}

  return (
    <>
    <Container>
    <Typography style={{marginTop:"30px"}}>Your muscle (im)balance compared to your followers</Typography>
    <RadarChart outerRadius={90} width={350} height={300} data={setsData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="muscle"  tick={customTick}/>
        <PolarRadiusAxis angle={30} domain={[0, 40]} />
        <Radar
          name="Testuser"
          dataKey="sets"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
      {/* <RadarChart outerRadius={90} width={350} height={350} data={data}>
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
      </RadarChart> */}
      {currentExercise && <>
      <Typography style={{margin:"30px"}}>Your recent {currentExercise} workout history </Typography>
      <LineChart width={300} height={250} data={exerciseWeight}>
        <Line type="monotone" dataKey="weight" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="activityDate" tickFormatter={formatXAxis} />
        <YAxis />
        <Tooltip label="activityDate" />
      </LineChart></>}
      </Container>
    </>
  );
};

export default Stats;
