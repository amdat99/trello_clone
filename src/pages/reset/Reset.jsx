import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Inputs from "../../components/inputs/Inputs";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { requestHandler } from "../../helpers/requestHandler";
// import { colours } from "./utils";

// import { requestHandler } from "../../helpers/requestHandler";

const boxStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyles = {
  minWidth: 300,
  maxWidth: 300,
  maxHeight: "67vh",
  p: 4,
  mt: "20vh",
  mb: "20vh",
  zIndex: 999,
  position: "relative",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
  borderRadius: "10px",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
};

function Reset() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);



  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const passwordUnMatch =
  !(registerData.password === registerData.confirmPassword)
  const resetInputs = [
    {
      type: "password",
      name: "password",
      minLength: 6,
    },
    {
      type: "password",
      name: "confirmPassword",
      minLength: 6,
      helperText: passwordUnMatch
        ? "Passwords do not match"
        : "6 characters are required for password",
      error: passwordUnMatch,
    },
  ];

  const onSubmit = (e)=>{
    e.preventDefault()
    setLoading(true);
    requestHandler({ route: "auth/reset", type: "put", body: {email, password: registerData.password, verify_id: token} }).then((data) => {
      setLoading(false);
      if(data === "password reset successfully"){
        alert("Password reset success");
        navigate("/");
      }
      else{
        return alert(data?.errors ? data.errors : 'data not found')
      }
    });
  }
  const onHandleChange = (value, name) => {
    setRegisterData({ ...registerData, [name]: value });
  };



  useEffect(() => {
    if (!email || !token) {
      navigate("/");
    }
  }, [email, token]);

  console.log("email", email, "token", token);
  return (
    <div
      className="background"
      style={{
        backgroundImage:
          "url(" +
          "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      }}
    >
      <Box sx={boxStyles}>
        <Card raised sx={cardStyles}>
          <Typography variant={"h5"} sx={{ mb: 2 }} color="primary">
            Create New Password
          </Typography>
          <Box component="form" onSubmit={onSubmit} autoComplete="off">
            {resetInputs.map((input) => (
              <Inputs
                key={input.name}
                type={input.type}
                label={input.name}
                name={input.name}
                value={resetInputs[input.name]}
                handleChange={onHandleChange}
                inputProps={input.minLength && { minLength: input.minLength }}
                helperText={input.helperText && input.helperText}
                required
                error={input.error && input.error}
                sx={{ mb: 1 }}
              />
            ))}
            <Button 
              type={"submit"} 
              variant="contained" 
              disabled={loading || (passwordUnMatch || !(registerData.password.length >= resetInputs[0].minLength))  }>
              Submit
            </Button>
          </Box>
        </Card>
      </Box>
    </div>
  );
}

export default Reset;
