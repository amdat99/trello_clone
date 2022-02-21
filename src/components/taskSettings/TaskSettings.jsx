import React from "react";
import { Typography, Box, Button, Tooltip, Grow } from "@mui/material/";
import SettingsApplicationsOutlinedIcon from "@mui/icons-material/SettingsApplicationsOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Inputs from "../inputs/Inputs";
import { requestHandler } from "../../helpers/requestHandler";

function TaskSettings({ taskData, user, pushNewActivity, setCurrentResId, fetchTask, onAssignTask, archive }) {
  const [edited, setEdited] = React.useState({ color: false, dueDate: false });
  const [onAction, setOnAction] = React.useState({ archive: false });

  const suspendRestoreTask = () => {
    let task_activity = taskData.task_activity;
    pushNewActivity(
      task_activity,
      new Date().toLocaleString(),
      ` ${archive ? "restored this task" : "archived this task"}`
    );
    requestHandler({
      route: "task/suspendrestore",
      type: "post",
      body: {
        id: taskData.id,
        type: archive ? "restore" : "suspend",
        task_activity: JSON.stringify(task_activity),
        list_id: taskData.list_id,
        name: taskData.name,
        color: taskData.color,
        assigned_users: taskData.assigned_users,
        due_date: taskData.due_date,
        labels: taskData.labels,
      },
    }).then((res) => {
      const msg = archive ? "task restored successfully" : "task suspended successfully";
      if (res === msg) {
        archive ? setCurrentResId() : setCurrentResId({ id: taskData.list_id, rerender: Date.now() });
        setOnAction({ archive: false });
      } else {
        alert(res?.errors ? res.errors : "error updating task");
        task_activity.pop();
      }
    });
  };

  const deleteTask = () => {
    requestHandler({ type: "delete", route: "task/delete", body: { id: taskData.id } }).then((res) => {
      if (res === "task deleted successfully") {
        setCurrentResId();
      } else {
        alert(res?.errors ? res.errors : "error deleting task");
      }
    });
  };

  const onChange = (value, color) => {
    if (color) {
      taskData.color = value;
      !edited.color && setEdited({ dueDate: false, color: true });
    } else {
      taskData.due_date = value;
      !edited.dueDate && setEdited({ dueDate: true, color: false });
    }
  };

  const onUpdateTask = (color) => {
    const tasks = [];
    onAssignTask(tasks, taskData.assigned_users);
    pushNewActivity(
      taskData.task_activity,
      new Date().toLocaleString(),
      color
        ? ` changed the task colour to ${taskData.color}`
        : ` changed the task due date to ${new Date(taskData.due_date).toLocaleDateString()}`
    );
    requestHandler({
      type: "post",
      route: "taskitem/add",
      body: {
        color: color ? taskData.color : null,
        due_date: !color ? taskData.due_date : null,
        task_activity: JSON.stringify(taskData.task_activity),
        tasks: JSON.stringify(tasks),
        list_id: taskData.list_id,
        id: taskData.id,
      },
    }).then((res) => {
      const message = color ? "color added successfully" : "due date added successfully";
      if (res === message) {
        setEdited({ dueDate: false, color: false });
        setCurrentResId({ id: taskData.list_id, rerender: Date.now() });
        fetchTask();
      } else {
        alert(res?.errors ? res.errors : "error adding color");
        taskData.task_activity.pop();
      }
    });
  };

  const inputs = [
    {
      name: "date",
      label: "Due Date",
      type: "datetime-local",
      value: new Date(taskData?.due_date).toLocaleDateString(),
      onChange: (val) => onChange(val, false),
    },
    {
      name: "color",
      label: "Task Color",
      type: "color",
      value: taskData?.color ? taskData.color : "#3f51b5",
      onChange: (val) => onChange(val, true),
    },
  ];

  return (
    <>
      <Box sx={{ flexDirection: "row", display: "flex", mb: 1 }}>
        <SettingsApplicationsOutlinedIcon
          color={taskData?.color || "primary"}
          sx={{ height: 25, mt: 0.2, color: taskData?.color }}
        />
        <Typography sx={{ mb: 1 }} variant="subtitle1">
          Settings
        </Typography>
      </Box>
      {inputs.map((input, index) => (
        <Inputs
          key={index}
          value={input.value}
          InputLabelProps={{
            shrink: true,
            style: {
              fontSize: "0.8rem",
            },
          }}
          InputProps={{
            style: {
              height: "2rem",
              marginBottom: "0.75rem",
              fontSize: "0.68rem",
            },
          }}
          handleChange={input.onChange}
          label={input.label}
          type={input.type}
          size="small"
        />
      ))}
      {edited.color || edited.dueDate ? (
        <>
          <Grow in={edited.color || edited.dueDate}>
            <Typography
              variant="subtitle2"
              onClick={() => onUpdateTask(edited.color ? true : false)}
              sx={{ cursor: "pointer" }}
            >
              Update {edited.color ? "Colour" : "Date"}
            </Typography>
          </Grow>
        </>
      ) : null}
      <Tooltip
        title={
          onAction.archive
            ? !archive
              ? "Archiving will move the task to the archive view (hold to unlock permenant delete)"
              : "Restoring will move the task back to the list view"
            : "Archive"
        }
      >
        <Button
          size="small"
          sx={{ mt: 1, bgcolor: onAction.archive ? "#B02627" : taskData?.color }}
          onClick={() => (onAction.archive ? suspendRestoreTask() : setOnAction({ ...onAction, archive: true }))}
          variant="contained"
        >
          {!onAction.archive ? (archive ? "Restore" : "Archive") : "Confirm?"}
        </Button>
      </Tooltip>
      {onAction.archive && (
        <Tooltip title="Go back">
          <ArrowBackOutlinedIcon
            sx={{ height: 15, cursor: "pointer" }}
            onClick={() => setOnAction({ ...onAction, archive: false })}
          />
        </Tooltip>
      )}
      {archive && (
        <Button size="small" onClick={deleteTask} sx={{ mt: 1 }} variant="contained" color="error">
          Delete Task
        </Button>
      )}
    </>
  );
}

export default TaskSettings;
