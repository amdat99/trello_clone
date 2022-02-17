import React, { useState } from "react";
import { Slide, Card, Divider } from "@mui/material/";
import Tags from "../tags/Tags";
import { Task, User } from "../models";

type Props = {
  taskData: Task;
  dividerStyles: Object;
  pushNewActivity: Function;
  user: User;
  fetchTask: Function;
  toggleSideBar: boolean;
  min700: boolean;
  min600: boolean;
};
function TaskSideBar({
  dividerStyles,
  taskData,
  pushNewActivity,
  user,
  fetchTask,
  toggleSideBar,
  min700,
  min600,
}: Props) {
  const styles = makeStyles(min700, min600);
  return (
    <>
      {toggleSideBar && (
        <Slide direction="left" in={true} mountOnEnter unmountOnExit style={{ transitionDelay: "100ms" }}>
          <Card className="hide-scroll todos__single1" sx={styles.card}>
            <Divider sx={{ mt: 2 }} />
            <Tags taskData={taskData} pushNewActivity={pushNewActivity} user={user} fetchTask={fetchTask} />
            <Divider sx={dividerStyles} />
          </Card>
        </Slide>
      )}
    </>
  );
}

const makeStyles = (min700, min600) => ({
  card: {
    p: 1,
    mt: 5,
    width: 130,
    position: min700 ? "absolute" : "fixed",
    right: min700 ? "auto" : "2px",
    height: "82vh",
    overflowY: "scroll",
    ml: 70.1,
    opacity: 0.9,
    ":hover": {
      border: "1px solid black",
    },
  },
});

export default TaskSideBar;
