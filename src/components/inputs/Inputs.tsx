import React from "react";
import TextField from "@mui/material/TextField";
import "./styles.css";

type InputProps = {
  value: string;
  handleChange: (value: string, name: string) => void;
  type: string;
  props?: any;
};
function Inputs({ value, handleChange, type = "text", ...props }: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <TextField
      {...props}
      type={type}
      autoComplete={type === "password" ? "new-password" : "on"}
      className="input__box"
      value={value}
      onChange={(e) => handleChange(e.target.value, e.target.name)}
      ref={inputRef}
    />
  );
}

export default Inputs;
