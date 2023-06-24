/* eslint-disable react/prop-types */
import { createUseStyles } from "react-jss";

// Define styles
const useStyles = createUseStyles({
  container: {
    width: "100%",
    maxWidth: 1200, // You can set your max width
    marginLeft: "auto",
    marginRight: "auto",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
  },
  col: {
    flex: ({ size }) => (size ? `0 0 ${(100 * size) / 12}%` : "0 0 100%"),
    maxWidth: ({ size }) => (size ? `${(100 * size) / 12}%` : "100%"),
  },
});

export const Container = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.container}>{children}</div>;
};

export const Row = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.row}>{children}</div>;
};

export const Col = ({ size, children }) => {
  const classes = useStyles({ size });
  return <div className={classes.col}>{children}</div>;
};
