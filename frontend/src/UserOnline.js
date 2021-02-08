import React, { useState, useEffect } from "react";
import { Container, Paper, Snackbar } from "@material-ui/core";
import { user } from "./reducers/user";
import { useSelector } from "react-redux";

export const UserOnline = () => {

    

    const [open, setOpen] = useState(false)

    const userOnline = useSelector((store) => store.user.onlineUsers[store.user.onlineUsers.length - 1]);
    console.log(userOnline)

    //if(userOnline !== []) setOpen(true)
    
     useEffect(() => {
         if(userOnline) setOpen(true)
     }, [userOnline])

    return (
        <>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            message={"user " + userOnline + " connected" }
          />
        </>
      );
    };
    
    export default UserOnline;