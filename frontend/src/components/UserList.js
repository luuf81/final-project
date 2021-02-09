import React, { useState, useEffect } from "react";
import { fetchUsers, user } from "../reducers/user";
import { fetchActivities, postActivity, workout } from "../reducers/workout";
import { followUser } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkouts } from "reducers/workout";
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { PersonAdd } from '@material-ui/icons';
import io from "socket.io-client";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

export const UserList = () => {
  const dispatch = useDispatch();
  const activities = useSelector((store) => store.workout.activities);
  const workouts = useSelector((store) => store.workout.workouts);
  const users = useSelector((store) => store.user.users);
  const onlineUsers = useSelector((store) => store.user.onlineUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [onlineUsers]);

  const handleFollowUser = (userName) => {
    //e.preventDefault();
    dispatch(followUser(userName))
  }

  return (
    <>
      <Typography align="center" variant="h4">
        Your gym buddies
      </Typography>
      {users.map((user) => 
        onlineUsers.find((item) => item === user.name) ? 
        <div style={{ display: "flex", alignItems: "center", margin: "5px" }}>
              <StyledBadge
                overlap="circle"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
              >
                <Avatar style={{ backgroundColor: "#FF5722" }}>
                  {user.name.charAt(0)}
                </Avatar>
              </StyledBadge>
              <Typography style={{ marginLeft: "15px" }}>
                {user.name}
              </Typography>
        </div> :
        <div style={{ display: "flex", alignItems: "center", margin: "5px", justifyContent:"space-between" }}>
        
          <Avatar style={{ backgroundColor: "#FF5722" }}>
            {user.name.charAt(0)}
          </Avatar>
        
        <Typography style={{ marginLeft: "15px" }}>
          {user.name}
        </Typography>
        <IconButton aria-label="delete" style={{marginLeft:"100px"}}
        onClick={() => handleFollowUser(user.name)}
        >
        <PersonAdd />
      </IconButton>
  </div>  
        
        
      )}
    </>
  );
};

//

export default UserList;
