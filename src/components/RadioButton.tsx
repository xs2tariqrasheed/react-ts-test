import React from "react";
import { createUseStyles } from "react-jss";

interface RadioBoxProps {
  label?: string;
  disabled?: boolean;
  value?: string | number | readonly string[] | undefined;
  checked: boolean | undefined;
  onChange: (e: string | number | readonly string[] | undefined) => void;
}

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

function RadioButton(props: RadioBoxProps) {
  const classes = useStyles();

  const handleRadioChange = () => {
    props.onChange(props.value);
  };

  return (
    <label style={{ display: "flex", alignItems: "center" }}>
      <input
        disabled={props?.disabled}
        style={{ height: 18, width: 18 }}
        type="radio"
        value={props.value}
        checked={props.checked}
        onChange={handleRadioChange}
      />

      <div style={{ margin: "5px 0px 0px 4px" }}>{props.label}</div>
    </label>
  );
}

export default RadioButton;
