import React, { useState } from "react";
import Inputs from "../../components/inputs/Inputs";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Grow from "@mui/material/Grow";
import Notification from "../../components/notification/Notifications";
import { useUserStore } from "../../store";
import { requestHandler } from "../../helpers/requestHandler";

function Authentication({}) {
  const setUserData = useUserStore((state) => state.setUserData);
  const min1000 = useMediaQuery("(min-width:1000px)");
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({ type: "", message: "" });

  const loginInputs = [
    {
      type: "email",
      name: "email",
      value: loginData.email,
    },
    {
      type: "password",
      minLength: 6,
      name: "password",
      value: loginData.password,
      helperText: "Atleast 6 characters are required for the password",
    },
  ];
  const passwordUnMatch =
    registerData.password !== registerData.confirmPassword && registerData.confirmPassword && registerData.password;
  const registerInputs = [
    {
      type: "text",
      name: "name",
      value: registerData.name,
    },
    {
      type: "email",
      name: "email",
      value: registerData.email,
    },
    {
      type: "password",
      name: "password",
      minLength: 6,
      value: registerData.password,
    },
    {
      type: "password",
      name: "confirmPassword",
      minLength: 6,
      value: registerData.confirmPassword,
      helperText: passwordUnMatch ? "Passwords do not match" : "Atleast 6 characters are required for the password",
      error: passwordUnMatch,
    },
  ];

  const onHandleChange = (value, name) => {
    showLogin ? setLoginData({ ...loginData, [name]: value }) : setRegisterData({ ...registerData, [name]: value });
  };

  const onSubmit = (e) => {
    console.log("runs");
    e.preventDefault();
    if (!showLogin && registerData.password !== registerData.confirmPassword) {
      return setNotify({ type: "error", message: "Password and confirm password does not match" });
    }
    setLoading(true);
    const login = (data) => {
      requestHandler({ route: "auth/login", type: "post", body: data }).then((data) => {
        setLoading(false);
        if (data?.email) {
          setUserData(data);
        } else {
          setNotify({ type: "error", message: data?.errors ? data.errors : "error logging in" });
        }
      });
    };

    if (showLogin) {
      login(loginData);
    } else {
      requestHandler({ route: "auth/register", type: "post", body: registerData }).then((data) => {
        setLoading(false);
        if (data && data === "registered successfully") {
          login(registerData);
        } else {
          setNotify({ type: "error", message: data?.errors ? data.errors : "error registering" });
        }
      });
    }
  };
  const currentInputs = showLogin ? loginInputs : registerInputs;

  return (
    <>
      <div
        className="background"
        style={{
          backgroundImage:
            "url(" +
            "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        }}
      ></div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Notification message={notify.message} type={notify.type} show={notify.type !== ""} setNotify={setNotify} />
        <Grow in={currentInputs.length !== 0}>
          <Card
            raised
            sx={{
              maxWidth: min1000 ? "40%" : "55%",
              maxHeight: "67vh",
              p: 5,
              pb: 4,
              zIndex: 999,
              mt: min1000 ? "10vh" : "5vh",
              position: "relative",
            }}
          >
            <Typography variant={"h5"} sx={{ mb: 2 }} color="primary">
              {showLogin ? "Login" : "Register"}
            </Typography>
            <Box component="form" onSubmit={onSubmit} autoComplete="off">
              {currentInputs.map((input) => (
                <Inputs
                  key={input.name}
                  type={input.type}
                  label={input.name}
                  name={input.name}
                  value={input.value}
                  handleChange={onHandleChange}
                  placeholder={input.placeholder && input.placeholder}
                  inputProps={input.minLength && { minLength: input.minLength }}
                  helperText={input.helperText && input.helperText}
                  required
                  error={input.error && input.error}
                  sx={{ mb: 1 }}
                />
              ))}
              <Button type={"submit"} variant="contained" disabled={loading}>
                Submit
              </Button>
            </Box>
            <Typography
              color="primary"
              onClick={() => setShowLogin(!showLogin)}
              variant={"caption"}
              sx={{ mb: 2, cursor: "pointer" }}
            >
              {showLogin ? "I don't have an account" : "I want to login"}
            </Typography>
            {loading && <LinearProgress sx={{ mt: 1 }} />}
          </Card>
        </Grow>
      </Box>
    </>
  );
}

export default Authentication;
