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
    <Card
      raised
      sx={{
        p: 1,
        width: 130,
        flexWrap: "wrap",
        position: "absolute",
        height: "89.8%",
        ml: 66.3,
        top: "5%",
      }}
    >
      <Divider sx={dividerStyles} />
      <Typography sx={{ color: "#2C387E" }} variant="subtitle1" gutterBottom>
        Tags:
      </Typography>
      {taskData?.labels &&
        taskData.labels.map((label, i) => (
          <Chip key={i} sx={chipStyles} label={label.name} color={label.color} size="small" />
        ))}
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
