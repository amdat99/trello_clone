import React, { useState } from "react";
import { Slide, Card, Divider } from "@mui/material/";
import Tags from "../tags/Tags";
import { Task } from "../models";

type Props = {
  taskData: Task;
  dividerStyles: Object;
};
function TaskSideBar({ dividerStyles, taskData }: Props) {
  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit style={{ transitionDelay: "100ms" }}>
      <Card
        className="hide-scroll todos__single1"
        sx={{
          p: 1,
          mt: 5,
          width: 130,
          position: "absolute",
          height: "82vh",
          overflowY: "scroll",
          ml: 70.1,
          opacity: 0.9,
          ":hover": {
            border: "1px solid black",
          },
        }}
      >
        <Divider sx={{ mt: 2 }} />
        <Tags taskData={taskData} />
        <Divider sx={dividerStyles} />
      </Card>
    </Slide>
  );
}

export default TaskSideBar;
