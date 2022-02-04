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

function Authentication({ formType, setShowFormType }) {
  const setUserData = useUserStore((state) => state.setUserData);
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
    formType === "login"
      ? setLoginData({ ...loginData, [name]: value })
      : setRegisterData({ ...registerData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (formType === "register" && registerData.password !== registerData.confirmPassword) {
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

    if (formType === "login") {
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
  const currentInputs = formType === "login" ? loginInputs : registerInputs;

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

  const boxStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      {formType && (
        <Box sx={boxStyles}>
          <Notification message={notify.message} type={notify.type} show={notify.type !== ""} setNotify={setNotify} />
          <Grow in={currentInputs.length !== 0}>
            <Card raised sx={cardStyles}>
              <Typography variant={"h5"} sx={{ mb: 2 }} color="primary">
                {formType}
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
                onClick={() => setShowFormType(formType === "login" ? "register" : "login")}
                variant={"caption"}
                sx={{ mb: 2, cursor: "pointer" }}
              >
                {showLogin ? "I don't have an account" : "I want to login"}
              </Typography>
              {loading && <LinearProgress sx={{ mt: 1 }} />}
            </Card>
          </Grow>
        </Box>
      )}
    </>
  );
}

export default Authentication;
