import React, { useState, useEffect } from "react";
import { IconButton, Divider, Box, Grow, Typography, Card, Button, Modal } from "@mui/material/";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ViewSidebarRoundedIcon from "@mui/icons-material/ViewSidebarRounded";
import * as timeago from "timeago.js";
import UpdateIcon from "@mui/icons-material/Update";
import { styled } from "@mui/material/styles";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import InputAdornment from "@mui/material/InputAdornment";
import ReactMde, { getDefaultToolbarCommands } from "react-mde";
import * as Showdown from "showdown";
import xssFilter from "showdown-xss-filter";
import Inputs from "../inputs/Inputs";
import PopoverWrapper from "../popover/PopoverWrapper";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddAssignedUsers from "components/createModal/AddAssignedUsers";
import AvatarGroup from "../avatarGroup/AvatarGroup";
import TaskSideBar from "./TaskSideBar";
import CommentsActivity from "./Comments&Activity";
import getTheme from "../../theme";
import useFetchData from "../../hooks/useFetchData";
import { requestHandler } from "../../helpers/requestHandler";
import { youtubeCommand, tableCommand, options } from "./utlis";
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
  const {
    data: task,
    fetchData: fetchTask,
    isFetching,
  } = useFetchData({ type: "post", route: "task/single", body: taskId && { id: taskId, options } }, taskId && taskId);
  const min600 = useMediaQuery("(min-width:600px)");
  const min700 = useMediaQuery("(min-width:700px)");
  const [uneditedDesc, setUnEditedDesc] = useState("");
  const [open, setOpen] = useState(true);
  const [toggleSideBar, setToggleSideBar] = useState(true);
  const [hasEdited, setHasEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const [showAssignedUsers, setShowAssignedUsers] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("preview");
  const styles = makeStyles(taskData?.color);
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
    if (!min700) {
      setToggleSideBar(false);
    } else {
      setToggleSideBar(true);
    }
  }, [min700]);

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

    onAssignTask(currentTaskData, taskData.assigned_users);

    try {
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
  const pushNewActivity = (activity: any, date: string | Date, message: string, receiver: string | null = null) => {
    activity.push({
      id: Date.now(),
      message: message,
      name: user.name,
      color: user.color,
      sortDate: new Date().getTime(),
      date: date,
      receiver: receiver,
    });
  };

  const onAssignTask = (currentTaskData: any, assignedUsers: object) => {
    todos[taskData.list_id].map((task: any) => {
      if (task.id === taskData.id) {
        currentTaskData.push({
          id: taskData.id,
          name: taskData.name,
          assigned_users: assignedUsers,
          color: taskData.color,
          due_date: taskData.due_date,
          tags: taskData.labels,
        });
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
    onAssignTask(currentTaskData, users);

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
        users.pop();
        alert(response?.errors ? response.errors : "no data found");
      }
    });
  };

  //for later use
  const save = (data: any) => {
    console.log("save");
  };

  const StyledButton = styled(Button)(() => ({
    width: "20%",
    textTransform: "none",
    marginTop: 7,
    backgroundColor: taskData?.color,
    ":hover": {
      backgroundColor: taskData?.color,
    },
  }));

  return (
    <>
      <Modal open={(taskId !== "" || taskId !== null) && open} onClose={() => setUrl(null)} sx={styles.modal}>
        {taskData ? (
          <Grow in={true}>
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
                <Box sx={{ position: "relative", bottom: 15, borderRadius: "10px" }}>
                  <UpdateIcon color={taskData?.color || "primary"} sx={{ height: 15 }} />
                  <Typography sx={{ fontSize: 11 }} variant="caption">
                    Updated: {timeago.format(taskData.updated_at)}
                  </Typography>
                  <CalendarTodayRoundedIcon color={taskData?.color || "primary"} sx={{ height: 15, ml: 1 }} />
                  <Typography sx={{ fontSize: 11 }} variant="caption">
                    Due : {new Date(taskData.due_date).toLocaleDateString()}
                  </Typography>
                  {!min700 && (
                    <ViewSidebarRoundedIcon
                      color={taskData?.color || "primary"}
                      onClick={() => setToggleSideBar(!toggleSideBar)}
                      sx={{ ml: "50vw", cursor: "pointer", height: 25 }}
                    />
                  )}
                  <Divider color={taskData?.color || "grey"} />
                </Box>
                <Inputs
                  value={taskData?.name || ""}
                  type={"name"}
                  handleChange={onHandleChange}
                  color={taskData?.color || "primary"}
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <ModeEditIcon sx={{ height: 20, mb: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography sx={{ fontSize: 11 }} color={taskData?.color || "primary"} variant="body2" gutterBottom>
                  Assigned Users:
                </Typography>
                <Box flexDirection={"row"} sx={{ display: "flex" }}>
                  {taskData?.assigned_users && <AvatarGroup users={taskData?.assigned_users} />}
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
                        <StyledButton variant="contained" size="small" type={"submit"} disabled={loading || isFetching}>
                          Save
                        </StyledButton>
                      </Grow>
                      <Grow in={true}>
                        <StyledButton
                          onClick={() => setSelectedTab("preview")}
                          variant="contained"
                          sx={{ ml: 1 }}
                          size="small"
                          type={"button"}
                        >
                          Cancel
                        </StyledButton>
                      </Grow>
                    </>
                  )}
                </Box>
                <CommentsActivity
                  user={user}
                  reqData={reqData}
                  StyledButton={StyledButton}
                  taskData={taskData}
                  fetchTask={fetchTask}
                  pushNewActivity={pushNewActivity}
                />
              </Box>

              <TaskSideBar
                dividerStyles={styles.divider}
                taskData={taskData}
                pushNewActivity={pushNewActivity}
                user={user}
                fetchTask={fetchTask}
                StyledButton={StyledButton}
                min700={min700}
                setCurrentResId={setCurrentResId}
                min600={min600}
                onAssignTask={onAssignTask}
                toggleSideBar={toggleSideBar}
              />
            </Card>
          </Grow>
        ) : (
          <span>Loading...</span>
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
});

export default TaskModal;
