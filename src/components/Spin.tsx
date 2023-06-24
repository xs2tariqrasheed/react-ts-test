import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  spinnerContainer: {
    position: "relative",
    display: "inline-block",
  },
  spinnerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 1,
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 30,
    height: 30,
    border: "4px solid rgba(243, 243, 243, 0.7)",
    borderRadius: "50%",
    borderTop: "4px solid #3498db",
    animation: "$spin 1.5s linear infinite",
    zIndex: 2,
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
});

export const Spin = ({ spinning, children }: any) => {
  const classes = useStyles();
  return (
    <div className={classes.spinnerContainer}>
      {spinning && <div className={classes.spinnerOverlay}></div>}
      {spinning && <div className={classes.spinner}></div>}
      {children}
    </div>
  );
};
