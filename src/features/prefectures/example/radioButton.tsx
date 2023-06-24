/* eslint-disable react/prop-types */
import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  radioButtonContainer: {
    display: "flex",
    alignItems: "center",
  },
  radioButton: {
    marginRight: "8px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "1px solid #999",
    cursor: "pointer",
  },
  radioLabel: {
    fontSize: "14px",
  },
});

function MyRadioButton(props: any) {
  const classes = useStyles();

  const handleRadioChange = () => {
    props.onChange(props.value);
  };

  return (
    <div className={classes.radioButtonContainer}>
      <div
        className={classes.radioButton}
        onClick={handleRadioChange}
        style={{ backgroundColor: props.checked ? "#1890ff" : "transparent" }}
      />
      <span className={classes.radioLabel}>{props.label}</span>
    </div>
  );
}

export default MyRadioButton;
