import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type NotificationProps = {
  type: AlertColor;
  message: string;
  show: boolean;
  setNotify: any;
};

function Notification({ type, message, show, setNotify }: NotificationProps) {
  const resetNotification = () => {
    setNotify({ type: "", message: "" });
  };

  return (
    <Snackbar
      open={show}
      autoHideDuration={4000}
      onClose={resetNotification}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={resetNotification} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Notification;
