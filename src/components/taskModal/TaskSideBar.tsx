import React from "react";
import { Slide, Typography, Card, Chip, Divider } from "@mui/material/";
import "react-mde/lib/styles/css/react-mde-all.css";

function TaskSideBar({ dividerStyles, taskData }) {
  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit style={{ transitionDelay: "100ms" }}>
      <Card
        className="hide-scroll"
        raised
        sx={{
          p: 1,
          mt: 5,
          width: 130,
          position: "absolute",
          height: "82vh",
          overflowY: "scroll",
          ml: 70.1,
          opacity: 0.9,
        }}
      >
        <Divider sx={{ mt: 4 }} />
        <Typography color="primary" variant="subtitle1" gutterBottom>
          Tags:
        </Typography>
        {taskData?.labels &&
          taskData.labels.map((label, i: number) => (
            <Chip key={i} sx={chipStyles} label={label.name} color={label.color} size="small" />
          ))}
        <Divider sx={dividerStyles} />
      </Card>
    </Slide>
  );
}

const chipStyles = {
  mr: 0.5,
  mt: 0.5,
  fontSize: 10,
};
export default TaskSideBar;
