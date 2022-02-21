import React, { useState } from "react";
import Inputs from "../../components/inputs/Inputs";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Grow from "@mui/material/Grow";
import Notification from "../../components/notification/Notifications";
import { useUserStore } from "../../store";
import { requestHandler } from "../../helpers/requestHandler";
import { colours } from "./utils";

function Authentication({ formType, setShowFormType }) {
  const styles = makeStyles();
  const setUserData = useUserStore((state) => state.setUserData);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({ type: "", message: "" });

  const loginInputs = [
    {
      type: "email",
      name: "email",
    },
    {
      type: "password",
      minLength: 6,
      name: "password",
      helperText: "6 characters are required for password",
    },
  ];
  const passwordUnMatch =
    registerData.password !== registerData.confirmPassword && registerData.confirmPassword && registerData.password;
  const registerInputs = [
    {
      type: "text",
      name: "name",
    },
    {
      type: "email",
      name: "email",
    },
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
        : registerData.password.length < 6 && "6 characters are required for password",
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
    if (formType === "register" && passwordUnMatch) {
      return setNotify({
        type: "error",
        message: "Password and confirm password does not match",
      });
    }
    setLoading(true);
    const login = (data) => {
      requestHandler({ route: "auth/login", type: "post", body: data }).then((data) => {
        if (data?.email) {
          setUserData(data);
        } else {
          setNotify({
            type: "error",
            message: data?.errors ? data.errors : "error logging in",
          });
        }
        setLoading(false);
      });
    };

    if (formType === "login") {
      login(loginData);
    } else {
      registerData.color = colours[Math.floor(Math.random() * 14) + 1];
      requestHandler({
        route: "auth/register",
        type: "post",
        body: registerData,
      }).then((data) => {
        if (data && data === "registered successfully") {
          login(registerData);
        } else {
          setNotify({
            type: "error",
            message: data?.errors ? data.errors : "error registering",
          });
        }
        setLoading(false);
      });
    }
  };
  const currentInputs = formType === "login" ? loginInputs : registerInputs;

  return (
    <>
      {formType && (
        <Box sx={styles.box}>
          <Notification message={notify.message} type={notify.type} show={notify.type !== ""} setNotify={setNotify} />
          <Grow in={currentInputs.length !== 0}>
            <Card raised sx={styles.card}>
              <Typography variant={"h5"} sx={{ mb: 2 }} color="primary">
                {formType.charAt(0).toUpperCase() + formType.slice(1)}
              </Typography>
              <Box component="form" onSubmit={onSubmit} autoComplete="off">
                {currentInputs.map((input) => (
                  <Inputs
                    key={input.name}
                    type={input.type}
                    label={input.name}
                    name={input.name}
                    value={formType === "login" ? loginData[input.name] : registerData[input.name]}
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
                sx={{ mt: 2, cursor: "pointer" }}
              >
                {formType === "login" ? "I want to Register" : "I want to login"}
              </Typography>
              {formType === "login" && (
                <Typography
                  sx={{ cursor: "pointer" }}
                  onClick={() => setShowFormType("Forgot Password")}
                  variant={"caption"}
                  color="secondary"
                >
                  Forgot password
                </Typography>
              )}
              {loading && <LinearProgress sx={{ mt: 1 }} />}
            </Card>
          </Grow>
        </Box>
      )}
    </>
  );
}

const makeStyles = () => ({
  card: {
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
  },
  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Authentication;
