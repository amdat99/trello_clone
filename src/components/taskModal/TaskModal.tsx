import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grow from "@mui/material/Grow";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
// import InputAdornment from "@mui/material/InputAdornment";
import ReactMde, { getDefaultToolbarCommands } from "react-mde";
import * as Showdown from "showdown";
import xssFilter from "showdown-xss-filter";
import "react-mde/lib/styles/css/react-mde-all.css";
import Inputs from "../inputs/Inputs";
import PopoverWrapper from "../popover/PopoverWrapper";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddAssignedUsers from "components/createModal/AddAssignedUsers";
import TaskSideBar from "./TaskSideBar";
import CommentsActivity from "./Comments&Activity";
import useFetchData from "../../hooks/useFetchData";
import { requestHandler } from "../../helpers/requestHandler";

function TaskModal({ taskId, setUrl, user, todos, setCurrentResId, onShowCtxMenu, position }) {
  const {
    data: task,
    fetchData: fetchTask,
    error,
    isFetching,
  } = useFetchData({ type: "post", route: "task/single", body: taskId && { id: taskId } }, taskId && taskId);
  const min600 = useMediaQuery("(min-width:600px)");
  const [hasEdited, setHasEdited] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const [showAssignedUsers, setShowAssignedUsers] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("preview");
  const reqData: any = { req: null };

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    extensions: [xssFilter],
  });

  React.useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  React.useEffect(() => {
    if (task) {
      setTaskData(task[0]);
    }
  }, [task]);
  const onHandleChange = (value: string | object, name: string) => {
    !hasEdited && setHasEdited(true);
    setTaskData({ ...taskData, [name]: value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    selectedTab === "write" && setSelectedTab("preview");
    if (!hasEdited && !user) return;
    reqData.req = taskData;
    const tasks = taskData;
    const activity = taskData.task_activity;
    const currentTaskData = [];
    getAssignedUsers(currentTaskData, taskData.assigned_users);
    const date = new Date().toLocaleString();
    pushNewActivity(activity, date, " updated this task ");
    delete tasks.assigned_users;
    delete tasks.labels;
    delete tasks.task_activity;
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
            fetchTask();
            setCurrentResId({ id: taskData.list_id, rerender: Date.now() });
          }
        });
      }
    });
  };

  const pushNewActivity = (activity: any, date: string, message, receiver = null) => {
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
    pushNewActivity(task_activity, new Date().toLocaleString(), ` to this task `, user.user_name);
    let users = taskData.assigned_users;
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
      <Modal open={taskId !== "" || taskId !== null} onClose={() => setUrl(null)} sx={modalStyles}>
        {taskData ? (
          <Grow in={taskData}>
            <Card className="hide-scroll" sx={containerStyles}>
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
                sx={{ p: 1, flexDirection: "column", display: "flex", width: 500 }}
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
                    input: color,
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                />

                <Typography sx={{ fontSize: 11, color: "#2C387E" }} variant="body2" gutterBottom>
                  Assigned Users:
                </Typography>
                <Box flexDirection={"row"} sx={{ display: "flex" }}>
                  {taskData?.assigned_users &&
                    taskData.assigned_users.map((user: { name: {}; color: any }, i) => (
                      <Tooltip title={user.name} placement="bottom" key={i}>
                        <Avatar sx={{ width: 20, height: 20, mr: 0.7, bgcolor: user.color, fontSize: 15, mb: 0.5 }}>
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
                <Box mt={1} sx={{ background: "white", wordWrap: "break-word" }}>
                  <Card sx={{ p: 1, opacity: 0.9 }}>
                    <div onClick={selectedTab === "preview" ? () => setSelectedTab("write") : () => {}}>
                      <ReactMde
                        value={taskData?.description || ""}
                        onChange={(val) => setTaskData({ ...taskData, description: val })}
                        selectedTab={selectedTab}
                        toolbarCommands={selectedTab === "preview" ? [[]] : getDefaultToolbarCommands()}
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
                        suggestionTriggerCharacters={["@"]}
                        suggestionsAutoplace={true}
                        childProps={{
                          writeButton: {
                            tabIndex: -1,
                            color: "blue",
                          },
                          textArea: {
                            background: "blue",
                          },
                        }}
                        paste={{
                          // @ts-ignore
                          saveImage: save,
                        }}
                      />
                    </div>
                    {selectedTab !== "preview" && (
                      <>
                        <Button variant="contained" sx={buttonStyles} size="small" type={"submit"}>
                          Update
                        </Button>
                        <Button
                          onClick={() => setSelectedTab("preview")}
                          variant="contained"
                          sx={{ width: "20%", mt: 1, ml: 1, textTransform: "none" }}
                          size="small"
                          type={"button"}
                        >
                          Close
                        </Button>
                      </>
                    )}
                  </Card>
                </Box>
                <CommentsActivity
                  user={user}
                  reqData={reqData}
                  buttonStyles={buttonStyles}
                  converter={converter}
                  taskData={taskData}
                  isFetching={isFetching}
                  dividerStyles={dividerStyles}
                  fetchTask={fetchTask}
                  pushNewActivity={pushNewActivity}
                />
              </Box>
              <TaskSideBar dividerStyles={dividerStyles} taskData={taskData} />
            </Card>
          </Grow>
        ) : (
          <div>Loading</div>
        )}
      </Modal>
    </>
  );
}

const containerStyles = {
  p: 1,
  width: "670px",
  borderRadius: "10px",
  display: "flex",
  border: "3px solid #2c387e",
  flexDirection: "row",
  overflow: "scroll",
  background: "#F2F2F2",
  height: "90%",
  backgroundPosition: "center",
  backgroundSize: "cover",
  outline: "none",
  opacity: 0.1,
  mt: 5,
  boxShadow: "10px 10px 10px 10px rgba(0, 0, 0, 0.5)",
};
const color = { color: "#2C387E" };

const modalStyles = {
  position: "absolute",
  height: "100%",
  width: "100%",
  opacity: 0.99,
  display: "flex",
  zIndex: 1,
  justifyContent: "center",
};

const dividerStyles = {
  m: 1,
};

const buttonStyles = {
  width: "20%",
  textTransform: "none",
  mt: 1,
};

export default TaskModal;
