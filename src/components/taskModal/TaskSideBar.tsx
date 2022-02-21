import React from "react";
import { Slide, Card, Divider, Box } from "@mui/material/";
import Tags from "../tags/Tags";
import TaskSettings from "../taskSettings/TaskSettings";
import { Task, User } from "../models";

type Props = {
  taskData: Task;
  dividerStyles: Object;
  pushNewActivity: Function;
  user: User;
  fetchTask: Function;
  StyledButton: any;
  toggleSideBar: boolean;
  onAssignTask: Function;
  min700: boolean;
  min600: boolean;
  archive: boolean;
  setCurrentResId: ({ id: string, rerender: number }) => void;
};
function TaskSideBar({
  dividerStyles,
  taskData,
  StyledButton,
  pushNewActivity,
  onAssignTask,
  user,
  fetchTask,
  toggleSideBar,
  setCurrentResId,
  min700,
  min600,
  archive,
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
            <Box sx={{ bottom: 0, position: "absolute", width: "92%" }}>
              <Divider sx={dividerStyles} />
              <TaskSettings
                taskData={taskData}
                pushNewActivity={pushNewActivity}
                user={user}
                fetchTask={fetchTask}
                archive={archive}
                onAssignTask={onAssignTask}
                setCurrentResId={setCurrentResId}
              />
              <Divider sx={dividerStyles} />
            </Box>
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
    opacity: min700 ? 0.9 : 0.99,
    ":hover": {
      border: "1px solid black",
    },
  },
});

export default TaskSideBar;
