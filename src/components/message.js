import React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";


//importado do codeSandbox
const useStyles = makeStyles(() =>
  createStyles({
    messageRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
    },
    messageRowRight: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "10px",
    },
    messageBox: {
      position: "relative",
      padding: "10px",
      width: "max-content",
      maxWidth: "60%",
      font: "400 .9em 'Open Sans', sans-serif",
      borderRadius: "10px",
      wordBreak: "break-word",
    },
    messageBlue: {
      backgroundColor: "#A8DDFD",
      border: "1px solid #97C6E3",
      color: "#000",
    },
    messageOrange: {
      backgroundColor: "#f8e896",
      border: "1px solid #dfd087",
      color: "#000",
    },
    arrowLeft: {
      position: "absolute",
      top: "10px",
      left: "-10px",
      width: 0,
      height: 0,
      borderTop: "10px solid transparent",
      borderBottom: "10px solid transparent",
      borderRight: "10px solid #A8DDFD",
    },
    arrowRight: {
      position: "absolute",
      top: "10px",
      right: "-10px",
      width: 0,
      height: 0,
      borderTop: "10px solid transparent",
      borderBottom: "10px solid transparent",
      borderLeft: "10px solid #f8e896",
    },
    messageContent: {
      margin: 0,
    },
    messageTimeStamp: {
      fontSize: ".85em",
      fontWeight: "300",
      marginTop: "5px",
      textAlign: "right",
    },
    avatar: {
      color: "#fff",
      backgroundColor: deepOrange[500],
      width: 32,
      height: 32,
      marginRight: "10px",
    },
    displayName: {
      fontSize: "0.85em",
      marginBottom: "3px",
      color: "#555",
    },
  })
);


// classe adaptada do codigo do codeSandbox
export const Message = ({ message, timestamp, photoURL, displayName, isUser }) => {
  const classes = useStyles();

  return (
    <div className={isUser ? classes.messageRowRight : classes.messageRow}>
      {!isUser && <Avatar alt={displayName} className={classes.avatar} src={photoURL} />}
      <div>
        {!isUser && <div className={classes.displayName}>{displayName}</div>}
        <div
          className={`${classes.messageBox} ${
            isUser ? classes.messageOrange : classes.messageBlue
          }`}
        >
          <div className={isUser ? classes.arrowRight : classes.arrowLeft}></div>
          <p className={classes.messageContent}>{message}</p>
          <div className={classes.messageTimeStamp}>{timestamp}</div>
        </div>
      </div>
    </div>
  );
};
