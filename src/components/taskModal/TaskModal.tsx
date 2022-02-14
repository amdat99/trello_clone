import React, { useState, useEffect } from "react";
import { Slide, IconButton, Box, Grow, Typography, Avatar, Tooltip, Card, Button, Modal } from "@mui/material/";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
// import InputAdornment from "@mui/material/InputAdornment";
import ReactMde, { getDefaultToolbarCommands } from "react-mde";
import * as Showdown from "showdown";
import xssFilter from "showdown-xss-filter";
import Inputs from "../inputs/Inputs";
import PopoverWrapper from "../popover/PopoverWrapper";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddAssignedUsers from "components/createModal/AddAssignedUsers";
import TaskSideBar from "./TaskSideBar";
import CommentsActivity from "./Comments&Activity";
import getTheme from "../../theme";
import useFetchData from "../../hooks/useFetchData";
import { requestHandler } from "../../helpers/requestHandler";
import { youtubeCommand, tableCommand } from "./utlis";
import "./styles.css";
import { User, Task } from "../models";
require("showdown-youtube");

type Props = {
  taskId: string;
  user: User;
  setUrl: (url: string) => void;
  todos: any;
  position: { x: number; y: number };
  setCurrentResId: ({ id: string, rerender: number }) => void;
  onShowCtxMenu: Function;
};

function TaskModal({ taskId, setUrl, user, todos, setCurrentResId, onShowCtxMenu, position }: Props) {
  const theme = getTheme("light").palette;
  const styles = makeStyles(theme.primary.main);
  const {
    data: task,
    fetchData: fetchTask,
    error,
    isFetching,
  } = useFetchData({ type: "post", route: "task/single", body: taskId && { id: taskId } }, taskId && taskId);
  const min600 = useMediaQuery("(min-width:600px)");
  const [uneditedDesc, setUnEditedDesc] = useState("");
  const [hasEdited, setHasEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const [showAssignedUsers, setShowAssignedUsers] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("preview");
  const reqData: any = { req: null };
  const commands = getDefaultToolbarCommands();
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    extensions: [xssFilter, "youtube"],
  });

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  useEffect(() => {
    if (task) {
      setTaskData(task[0]);
      setUnEditedDesc(task[0]?.description ? task[0].description : "");
    }
  }, [task]);

  const onHandleChange = (value: string | object, name: string) => {
    !hasEdited && setHasEdited(true);
    setTaskData({ ...taskData, [name]: value });
  };
  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    selectedTab === "write" && setSelectedTab("preview");
    if ((!hasEdited && !user) || isFetching || loading) return;
    setLoading(true);

    const tasks = taskData;
    const activity = taskData.task_activity;
    const currentTaskData = [];
    const date = new Date();

    getAssignedUsers(currentTaskData, taskData.assigned_users);

    try {
      //@ts-ignore
      pushNewActivity(activity, new Date().toLocaleString(), " updated this task ");
    } catch (e) {
      setLoading(false);
      return alert(e);
    }

    delete tasks.assigned_users;
    delete tasks.labels;
    delete tasks.task_activity;
    delete tasks.comments;
    tasks.updated_at = date;
    tasks.task_activity = JSON.stringify(activity);

    requestHandler({
      type: "put",
      route: "task/update",
      body: {
        id: taskData.id,
        list_id: taskData.list_id,
        prev_listid: taskData.list_id,
        tasks: JSON.stringify(currentTaskData),
      },
    }).then((response) => {
      if (response === "task updated successfully") {
        requestHandler({ type: "put", route: "task/updatedata", body: { tasks } }).then((res) => {
          if (res === "task updated successfully") {
            setLoading(false);
            fetchTask();
            setCurrentResId({ id: taskData.list_id, rerender: Date.now() });
          } else {
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    });
  };

  const pushNewActivity = (activity: any, date: any, message: string, receiver = null) => {
    activity.push({
      message: message,
      name: user.name,
      color: user.color,
      date: date,
      receiver: receiver,
    });
  };

  const getAssignedUsers = (currentTaskData: any, assignedUsers: object) => {
    todos[taskData.list_id].map((task: any) => {
      if (task.id === taskData.id) {
        currentTaskData.push({ id: taskData.id, name: taskData.name, assigned_users: assignedUsers });
      } else {
        currentTaskData.push(task);
      }
    });
  };
  const onAssignUser = (user: { user_name: string; color: string; id: string }) => {
    const currentTaskData = [];
    const task_activity = taskData.task_activity;
    let users = taskData.assigned_users;

    pushNewActivity(task_activity, new Date().toLocaleString(), ` to this task `, user.user_name);
    users.push({ name: user.user_name, color: user.color });
    getAssignedUsers(currentTaskData, users);

    requestHandler({
      type: "put",
      route: "task/updatedata",
      body: {
        id: taskData.id,
        assigned_users: JSON.stringify(users),
        name: user.user_name,
        tasks: "1",
        task_activity: JSON.stringify(task_activity),
      },
    }).then((response) => {
      if (response === "task updated successfully") {
        requestHandler({
          type: "put",
          route: "task/update",
          body: {
            id: taskData.id,
            list_id: taskData.list_id,
            prev_listid: taskData.list_id,
            tasks: JSON.stringify(currentTaskData),
          },
        }).then((res) => {
          if (res === "task updated successfully") {
            fetchTask();
            setCurrentResId({ id: taskData.list_id, rerender: Date.now() });
          }
        });
      } else {
        fetchTask();
        alert(response?.errors ? response.errors : "no data found");
      }
    });
  };

  //for later use
  const save = (data: any) => {
    console.log("save");
  };

  return (
    <>
      <Modal open={taskId !== "" || taskId !== null} onClose={() => setUrl(null)} sx={styles.modal}>
        {taskData ? (
          <Grow in={taskData !== null}>
            <Card className="hide-scroll" sx={styles.container}>
              <PopoverWrapper
                open={showAssignedUsers}
                anchor={showAssignedUsers}
                onClose={() => setShowAssignedUsers(false)}
                position={position}
                styles={{
                  top: position.y.toString() + "px",
                  position: "fixed",
                  left: min600 ? "-285px" : "-180px",
                }}
              >
                <AddAssignedUsers onAssignUser={onAssignUser} />
              </PopoverWrapper>
              <Box
                sx={{ p: 1, flexDirection: "column", display: "flex", width: 530 }}
                onSubmit={onSubmit}
                component="form"
              >
                <Inputs
                  value={taskData?.name || ""}
                  type={"name"}
                  handleChange={onHandleChange}
                  name={"name"}
                  variant="standard"
                  sx={{
                    mb: 1,
                    width: "95%",
                    color: "white",
                    input: { fontSize: "1rem" },
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                />

                <Typography sx={{ fontSize: 11 }} color="primary" variant="body2" gutterBottom>
                  Assigned Users:
                </Typography>
                <Box flexDirection={"row"} sx={{ display: "flex" }}>
                  {taskData?.assigned_users &&
                    taskData.assigned_users.map((user: { name: {}; color: any }, i: React.Key) => (
                      <Tooltip title={user.name} placement="bottom" key={i}>
                        <Avatar sx={{ width: 25, height: 25, mr: 0.7, bgcolor: user.color, fontSize: 15, mb: 0.5 }}>
                          {user.name[0].toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    ))}
                  <IconButton
                    onClick={() => {
                      onShowCtxMenu();
                      setShowAssignedUsers(!showAssignedUsers);
                    }}
                    sx={{ position: "relative", bottom: 6 }}
                    size="small"
                  >
                    <AddRoundedIcon />
                  </IconButton>
                </Box>
                <Box
                  mt={1}
                  sx={{
                    background: selectedTab === "preview" ? "transaprent" : "transaprent",
                    wordWrap: "break-word",
                    fontSize: 12,
                  }}
                >
                  <div onClick={selectedTab === "preview" ? () => setSelectedTab("write") : () => {}}>
                    <ReactMde
                      value={taskData?.description || ""}
                      commands={{
                        youtube: youtubeCommand,
                        table: tableCommand,
                      }}
                      onChange={(val) => setTaskData({ ...taskData, description: val })}
                      selectedTab={selectedTab}
                      toolbarCommands={selectedTab === "preview" ? [[]] : [...commands, ["youtube"]]}
                      onTabChange={setSelectedTab}
                      generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
                      suggestionTriggerCharacters={["@"]}
                      suggestionsAutoplace={true}
                      childProps={{
                        writeButton: {
                          tabIndex: -1,
                        },
                      }}
                      paste={{
                        // @ts-ignore
                        saveImage: save,
                      }}
                    />
                  </div>
                  {selectedTab === "preview" &&
                    !isFetching &&
                    taskData?.description &&
                    uneditedDesc !== taskData?.description && (
                      <Typography color="secondary" sx={{ fontSize: 11 }} variant="body2" gutterBottom>
                        You have unsaved changes
                      </Typography>
                    )}
                  {selectedTab !== "preview" && (
                    <>
                      <Grow in={true}>
                        <Button
                          variant="contained"
                          sx={styles.button}
                          size="small"
                          type={"submit"}
                          disabled={loading || isFetching}
                        >
                          Update
                        </Button>
                      </Grow>
                      <Grow in={true}>
                        <Button
                          onClick={() => setSelectedTab("preview")}
                          variant="contained"
                          sx={{ width: "20%", mt: 1, ml: 1, textTransform: "none" }}
                          size="small"
                          type={"button"}
                        >
                          Close
                        </Button>
                      </Grow>
                    </>
                  )}
                </Box>
                <CommentsActivity
                  user={user}
                  reqData={reqData}
                  buttonStyles={styles.button}
                  taskData={taskData}
                  isFetching={isFetching}
                  dividerStyles={styles.divider}
                  fetchTask={fetchTask}
                  primaryColor={theme.primary.main}
                  pushNewActivity={pushNewActivity}
                />
              </Box>
              <TaskSideBar dividerStyles={styles.divider} taskData={taskData} />
            </Card>
          </Grow>
        ) : (
          <div>Loading</div>
        )}
      </Modal>
    </>
  );
}

const makeStyles = (color: string) => ({
  container: {
    p: 1,
    width: "700px",
    borderRadius: "10px",
    display: "flex",
    border: `2px solid ${color}`,
    flexDirection: "row",
    overflow: "scroll",
    background: "#F2F2F2",
    height: "90%",
    backgroundPosition: "center",
    backgroundSize: "cover",
    outline: "none",
    mt: 5,
    boxShadow: "10px 10px 10px 10px rgba(0, 0, 0, 0.5)",
  },
  modal: {
    position: "absolute",
    height: "100%",
    width: "100%",
    opacity: 0.99,
    display: "flex",
    zIndex: 1,
    justifyContent: "center",
  },
  divider: {
    m: 1,
  },
  button: {
    width: "20%",
    textTransform: "none",
    mt: 1,
  },
});

export default TaskModal;
