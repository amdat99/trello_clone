import React, { useState } from "react";
import { Typography, Box, Chip } from "@mui/material/";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddIcon from "@mui/icons-material/Add";
import TagManager from "./TagManager";
import useMousePosition from "../../hooks/useMousePosition";
import { requestHandler } from "../../helpers/requestHandler";
import { Task, User, Labels } from "../models";

type Props = {
  taskData: Task;
  pushNewActivity: Function;
  user: User;
  fetchTask: Function;
};

function Tags({ taskData, pushNewActivity, user, fetchTask }: Props) {
  const [edit, setEdit] = useState(null);
  const [tagData, setTagData] = useState({ name: "", color: "#3f51b5" });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showTagManager, setShowTagManager] = useState(false);
  let reqData = { req: null };

  const { x, y } = useMousePosition();

  const toggleManager = (edit: any = false) => {
    setShowTagManager(!showTagManager);
    setPosition({ x, y });
    edit && setEdit(edit);
  };

  const onUpdateTag = (onDelete: boolean = false) => {
    const id = (Math.random() / Math.random()).toString();
    reqData.req = taskData;
    const { req } = reqData;
    const labels = req?.labels && req?.labels.length ? req?.labels : [];
    const task_activity = req?.task_activity;
    const date = new Date().toLocaleString();

    pushNewActivity(
      task_activity,
      date,
      ` ${edit ? (onDelete ? "deleted" : "edited") : "added"} a tag called ${tagData.name}`
    );

    if (!edit) {
      labels.push({
        id,
        name: tagData.name,
        color: tagData.color,
        created: user.name,
        date,
      });
    } else if (edit !== null && !onDelete) {
      labels.filter((tag: Labels) => {
        if (tag.id === edit.id) {
          tag.name = tagData.name;
          tag.color = tagData.color;
        }
      });
    } else if (onDelete) {
      labels.filter((tag: Labels) => {
        if (tag.id === edit.id) {
          labels.splice(labels.indexOf(tag), 1);
        }
      });
    }
    requestHandler({
      type: "post",
      route: "taskitem/add",
      body: { labels: JSON.stringify(labels), task_activity: JSON.stringify(task_activity), id: taskData.id },
    }).then((res) => {
      if (res === "tags added successfully") {
        fetchTask();
        setTagData({ name: "", color: "#3f51b5" });
      } else {
        alert(res?.errors ? res?.errors : "something went wrong");
      }
      edit && setEdit(null);
    });
  };

  return (
    <>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <LocalOfferIcon color="primary" sx={{ height: 17, transform: "rotate(100deg)", mt: 0.2 }} />
        <Typography variant="subtitle2" gutterBottom>
          Tags
        </Typography>
        <AddIcon sx={{ cursor: "pointer" }} onClick={() => toggleManager(false)} />
      </Box>
      <Box
        className="hide-scroll "
        sx={{ maxHeight: "32%", overflow: "scroll", flexDirection: "row", display: "flex", flexWrap: "wrap" }}
      >
        {taskData?.labels &&
          taskData.labels.map((label, i: number) => (
            <div key={i}>
              <Chip sx={chipStyles(label.color)} label={label.name} size="small" onClick={() => toggleManager(label)} />
            </div>
          ))}
        <TagManager
          position={position}
          showTagManager={showTagManager}
          setShowTagManager={setShowTagManager}
          tagData={tagData}
          setTagData={setTagData}
          edit={edit}
          setEdit={setEdit}
          onUpdateTag={onUpdateTag}
        />
      </Box>
    </>
  );
}

const chipStyles = (color: string) => ({
  mr: 0.5,
  mt: 0.5,
  fontSize: 10,
  bgcolor: color,
  color: "white",
  cursor: "pointer",
  zIndex: 999,
  transition: "transform 0.3s cubic-bezier(0.25, 0.45, 0.45, 0.95)",

  ":hover": {
    transform: "scale(1.05)",
    bgcolor: color,
    transition: "transform 0.3s cubic-bezier(0.25, 0.45, 0.45, 0.95)",
  },
});

export default Tags;
