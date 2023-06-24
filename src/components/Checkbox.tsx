import React from "react";
import { createUseStyles } from "react-jss";

interface CheckBoxProps {
  label?: string;
  disabled?: boolean;
  checked: boolean;
  onChange: (e: boolean) => void;
}

const useStyles = createUseStyles({
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
  },
  checkboxInput: {
    marginRight: "8px",
    width: "16px",
    height: "16px",
    borderRadius: "2px",
    border: "1px solid #999",
    cursor: "pointer",
  },
  checkboxLabel: {
    fontSize: "14px",
  },
});

function CheckBox(props: CheckBoxProps) {
  const classes = useStyles();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.checked);
  };

  return (
    <div className={classes.checkboxContainer}>
      <input
        disabled={props?.disabled || false}
        type="checkbox"
        className={classes.checkboxInput}
        checked={props.checked}
        onChange={handleCheckboxChange}
      />
      <label className={classes.checkboxLabel}>{props.label}</label>
    </div>
  );
}

export default CheckBox;