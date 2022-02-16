import React from "react";
import TextField from "@mui/material/TextField";
import "./styles.css";

type InputProps = {
  value: any;
  handleChange: (value: string | object, name: string, anchor: HTMLInputElement | HTMLTextAreaElement) => void;
  type?: string;
  select?: boolean;
  [x: string]: any;
};
function Inputs({ select = false, value, handleChange, type = "text", ...props }: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <TextField
      {...props}
      type={type}
      className="input__box"
      select={select}
      value={value}
      onChange={(e) => handleChange(e.target.value, e.target.name, e.currentTarget)}
      ref={inputRef}
      data-testid="input"
    />
  );
}

export default Inputs;
