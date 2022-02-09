import React from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import "react-mde/lib/styles/css/react-mde-all.css";

function TaskSideBar({ dividerStyles, taskData }) {
  return (
    <Card sx={{ p: 1, width: 150, mt: 5, flexWrap: "wrap", opacity: 0.95, position: "relative", left: "7px" }}>
      <Divider sx={dividerStyles} />
      <Typography variant="subtitle1" gutterBottom>
        Tags:
      </Typography>
      {taskData?.labels &&
        taskData.labels.map((label) => <Chip sx={chipStyles} label={label.name} color={label.color} size="small" />)}
      <Divider sx={dividerStyles} />
    </Card>
  );
}

const chipStyles = {
  mr: 0.5,
  mt: 0.5,
  fontSize: 10,
};
export default TaskSideBar;
