import React, { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ReactMde from "react-mde";
import Grow from "@mui/material/Grow";
import Box from "@mui/material/Box";
import "react-mde/lib/styles/css/react-mde-all.css";
import { requestHandler } from "../../helpers/requestHandler";

function CommentsActivity({
  converter,
  buttonStyles,
  taskData,
  isFetching,
  dividerStyles,
  user,
  reqData,
  fetchTask,
  pushNewActivity,
}) {
  const [showActivity, setShowActivity] = useState(false);
  const [comment, setComment] = useState("");

  const addComment = () => {
    reqData.req = taskData;
    const { req } = reqData;
    const comments = req?.comments && req?.comments.length ? req?.comments : [];
    const task_activity = req?.task_activity;
    pushNewActivity(task_activity, new Date().toLocaleString(), ` added a comment`, user.user_name);
    comments.push({ name: user.name, color: user.color, comment: comment, date: new Date().toLocaleString() });
    requestHandler({
      type: "post",
      route: "comment/add",
      body: { comments: JSON.stringify(comments), task_activity: JSON.stringify(task_activity), id: taskData.id },
    }).then((res) => {
      if (res === "comment added successfully") {
        setComment("");
        fetchTask();
      }
    });
  };
  const comments = taskData?.comments ? [...taskData.comments].reverse() : [];
  const activity = taskData?.task_activity ? [...taskData.task_activity].reverse() : [];

  return (
    <>
      <div style={{ opacity: 0.9 }}>
        <Box sx={cmmntHeaderStyles}>
          <Typography sx={{ fontSize: 13.3 }} variant="body1">
            Add Comment
          </Typography>
        </Box>
        <ReactMde
          value={comment}
          maxEditorHeight={50}
          onChange={setComment}
          selectedTab={"write"}
          toolbarCommands={[[]]}
          generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
          suggestionTriggerCharacters={["@"]}
          suggestionsAutoplace={true}
          childProps={{
            writeButton: {
              tabIndex: -1,
            },
          }}
          // paste={{
          //   saveImage: save,
          // }}
        />
      </div>
      {comment !== "" && (
        <Grow in={comment !== ""}>
          <Button onClick={addComment} size="small" variant="contained" sx={buttonStyles}>
            Send
          </Button>
        </Grow>
      )}
      <Typography
        onClick={() => setShowActivity(!showActivity)}
        sx={{ cursor: "pointer", color: "#2c387e" }}
        variant="caption"
      >
        {showActivity ? "Show comments" : "Show activity"}
      </Typography>
      <Divider sx={dividerStyles} />
      <Box mt={1}>
        {!isFetching &&
          showActivity &&
          activity.map(
            (
              activity: {
                name: string;
                message: string;
                color: string;
                date: Date;
                receiver: string;
              },
              i: React.Key
            ) => (
              <Box key={i} sx={{ p: 0.5, mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Tooltip title={activity.name} placement="bottom" key={i}>
                    <Avatar sx={{ width: 25, height: 25, bgcolor: activity.color, fontSize: 15, mb: 0.5 }}>
                      {activity.name[0].toUpperCase()}
                    </Avatar>
                  </Tooltip>
                  <Card sx={{ p: 0.5, ml: 0.5, pr: 1.1 }}>
                    {activity.receiver ? (
                      <Typography sx={{ fontSize: 11, ml: 1 }} variant="body1">
                        <b style={colorStyles}>{activity.receiver}</b> was added to the task by
                        <b style={colorStyles}> {activity.name}</b>
                      </Typography>
                    ) : (
                      <Typography sx={{ fontSize: 11, ml: 1 }} variant="body1">
                        <b style={colorStyles}>{activity.name}</b>
                        {activity.message}
                      </Typography>
                    )}
                  </Card>
                </Box>
                <Typography sx={activityDateStyles} variant="body1">
                  {activity.date}
                </Typography>
                <Divider />
              </Box>
            )
          )}
        {!isFetching &&
          !showActivity &&
          comments.map((comment, i) => (
            <Box key={i} sx={{ p: 0.5, mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Tooltip title={comment.name} placement="bottom" key={i}>
                  <Avatar sx={{ width: 25, height: 25, bgcolor: comment.color, fontSize: 15, mb: 0.5 }}>
                    {comment.name[0].toUpperCase()}
                  </Avatar>
                </Tooltip>
                <Card sx={{ p: 0.5, ml: 0.5, pr: 1.1 }}>
                  <b style={colorStyles}>{comment.name}</b>
                  <Typography sx={{ fontSize: 11, ml: 0.1, wordWrap: "break-word" }} variant="body1">
                    {comment.comment}
                  </Typography>
                </Card>
              </Box>
              <Typography sx={activityDateStyles} variant="body1">
                {comment.date}
              </Typography>
              <Divider />
            </Box>
          ))}
      </Box>
    </>
  );
}

export default CommentsActivity;

const activityDateStyles = {
  fontSize: 10,
  position: "relative",
  bottom: "10px",
  left: "28.5px",
  color: "#2c387e",
};

const colorStyles = {
  color: "#2c387e",
  fontSize: 12,
};

const cmmntHeaderStyles = {
  bgcolor: "white",
  position: "relative",
  p: 1,
  border: "0.5px solid #c8ccd0",
  pb: 0.3,
  top: 32,
};
