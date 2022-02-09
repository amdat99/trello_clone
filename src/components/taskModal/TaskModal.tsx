import React from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import xssFilter from "showdown-xss-filter";
import "react-mde/lib/styles/css/react-mde-all.css";
import Inputs from "../inputs/Inputs";
import useFetchData from "../../hooks/useFetchData";
import { requestHandler } from "../../helpers/requestHandler";

function TaskModal({ taskId, setUrl, user, todos }) {
  const {
    data: task,
    fetchData: fetchTask,
    error,
  } = useFetchData({ type: "post", route: "task/single", body: taskId && { id: taskId } }, taskId && taskId);
  const [taskData, setTaskData] = React.useState(null);
  const [comment, setComment] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">("preview");

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
    setTaskData({ ...taskData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const tasks = taskData;
    //   const currentTaskData = []
    //   todos[taskData.list_id].forEach(task => {
    //     if (task.id === taskData.id) {
    //       currentTaskData.push({id:taskData.id,name:taskData.name,assigned_users:taskData.assigned_users});
    // }else{
    //   currentTaskData.push(list)
    // }
    delete tasks.assigned_users;
    delete tasks.labels;
    delete tasks.task_activity;
    //   console.log(tasks);
    //   requestHandler({
    //     type: "put",
    //   route: "task/update",
    //   body: {
    //     id: taskData.id,
    //     list_id: taskData.list_id,
    //     prev_listid: taskData.list_id,
    //     tasks: JSON.stringify(currentTaskData),
    //     },
    //   }).then((response) => {
    requestHandler({ type: "put", route: "task/updatedata", body: { tasks } }).then((res) => {
      console.log(res);
      fetchTask();
    });
    //   });
  };

  console.log(todos);
  const save = (data: any) => {
    console.log("save");
  };
  return (
    <Modal open={taskId !== "" || taskId !== null} onClose={() => setUrl(null)} sx={modalStyles}>
      {taskData ? (
        <Card sx={containerStyles}>
          <Box sx={{ p: 1, flexDirection: "column", display: "flex", width: 500 }} onSubmit={onSubmit} component="form">
            <Inputs
              value={taskData?.name || ""}
              type={"name"}
              handleChange={onHandleChange}
              name={"name"}
              variant="standard"
              sx={{ mb: 1, width: "95%", color: "white", input: { color: "#2C387E", fontSize: 24 } }}
              InputProps={{
                disableUnderline: true,
              }}
            />
            <Typography sx={{ fontSize: 11 }} variant="body2" gutterBottom>
              Assigned Users:
            </Typography>

            {taskData?.assigned_users &&
              taskData.assigned_users.map((user) => (
                <Tooltip title={user.name} placement="bottom" key={user.name}>
                  <Avatar sx={{ width: 20, height: 20, mr: 0.7, bgcolor: user.color, fontSize: 15, mb: 0.5 }}>
                    {user.name[0].toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            <Box mt={1} sx={{ background: "white", wordWrap: "break-word" }}>
              <ReactMde
                value={taskData?.description || ""}
                onChange={(val) => setTaskData({ ...taskData, description: val })}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
                childProps={{
                  writeButton: {
                    tabIndex: -1,
                  },
                }}
                // paste={{
                //   saveImage: save,
                // }}
              />
              <Button size="small" type={"submit"}>
                update
              </Button>
            </Box>
            <Divider variant="inset" sx={dividerStyles} />

            <Inputs
              value={comment}
              placeholder="Add a message here"
              type={"text"}
              handleChange={setComment}
              name={"comment"}
              dense
              multiline
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Avatar sx={{ width: 20, height: 20, bgcolor: user.color, fontSize: 15, mb: 0.5 }}>
                      {user.name[0].toUpperCase()}
                    </Avatar>
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{ mt: 1, width: "96%", fontSize: 10 }}
            />
            <Divider sx={dividerStyles} />

            <Box mt={1}>
              {taskData?.task_activity &&
                taskData.task_activity.map((activity) => (
                  <Card key={activity.id} sx={{ p: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Tooltip title={activity.name} placement="bottom" key={activity.name}>
                        <Avatar sx={{ width: 25, height: 25, bgcolor: user.color, fontSize: 15, mb: 0.5 }}>
                          {activity.name[0].toUpperCase()}
                        </Avatar>
                      </Tooltip>
                      <Typography sx={{ fontSize: 11, ml: 1 }} variant="body1">
                        {activity.message}
                      </Typography>
                    </Box>
                    <Typography sx={activityDateStyles} variant="body1">
                      {activity.date}
                    </Typography>
                  </Card>
                ))}
            </Box>

            {/* <Button type={"submit"} sx={{ mt: 1 }} variant="contained" size="small">
            Create
          </Button> */}
          </Box>
          <Card sx={{ p: 1, width: 150, mt: 5, flexWrap: "wrap", opacity: 0.95, position: "relative", left: "7px" }}>
            <Divider sx={dividerStyles} />
            <Typography variant="subtitle1" gutterBottom>
              Tags:
            </Typography>
            {taskData?.labels &&
              taskData.labels.map((label) => (
                <Chip sx={chipStyles} label={label.name} color={label.color} size="small" />
              ))}

            <Divider sx={dividerStyles} />
          </Card>
        </Card>
      ) : (
        <div>Loading</div>
      )}
    </Modal>
  );
}

const containerStyles = {
  p: 1,
  width: "600px",
  display: "flex",
  flexDirection: "row",
  overflow: "scroll",
  backgroundImage:
    "url(" + "https://image.freepik.com/free-vector/white-abstract-background-design_23-2148825582.jpg" + ")",
  height: "90%",
  backgroundPosition: "center",
  backgroundSize: "cover",
  opacity: 0.98,
  mt: 5,
};

const chipStyles = {
  mr: 0.5,
  mt: 0.5,
  fontSize: 10,
};

const modalStyles = {
  position: "absolute",
  height: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
};

const dividerStyles = {
  m: 1,
};

const activityDateStyles = {
  fontSize: 10,
  position: "relative",
  bottom: "10px",
  left: "35px",
  color: "#2c387e",
};

export default TaskModal;
