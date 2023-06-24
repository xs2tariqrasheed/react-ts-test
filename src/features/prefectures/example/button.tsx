import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  button: {
    // Ant Design button properties
    display: "inline-block",
    padding: "0 15px",
    height: "32px",
    lineHeight: "32px",
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "center",
    whiteSpace: "nowrap",
    border: "none",
    borderRadius: "4px",
    background: "#40a9ff",
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s",

    // Hover effect
    "&:hover": {
      background: "#1890ff",
    },
  },
});

function Button() {
  const classes = useStyles();

  return <button className={classes.button}>Click me</button>;
}

export default Button;
