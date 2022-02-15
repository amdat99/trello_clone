import React, { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
// import ReactMde from "react-mde";
import Grow from "@mui/material/Grow";
import Box from "@mui/material/Box";
import Inputs from "../inputs/Inputs";
import { requestHandler } from "../../helpers/requestHandler";
import { User, Activity } from "../models";

type CommentsActivity = {
  name: string;
  message: string;
  color: string;
  date: Date;
  receiver: string;
  type?: string;
  comment?: string;
};

type Props = {
  buttonStyles: object;
  taskData: any;
  isFetching?: boolean;
  user: User;
  reqData: any;
  fetchTask: Function;
  primaryColor: string;
  pushNewActivity: (name: string, date: string, message: string, user: string) => void;
};

function CommentsActivity({
  primaryColor,
  buttonStyles,
  taskData,
  isFetching,
  user,
  reqData,
  fetchTask,
  pushNewActivity,
}: Props) {
  const [showActivity, setShowActivity] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [comment, setComment] = useState("");
  const styles = makeStyles(primaryColor);

  const addComment = () => {
    reqData.req = taskData;
    const { req } = reqData;
    const comments = req?.comments && req?.comments.length ? req?.comments : [];
    const task_activity = req?.task_activity;
    const date = new Date().toLocaleString();
    pushNewActivity(task_activity, date, ` added a comment`, user.user_name);
    comments.push({
      name: user.name,
      color: user.color,
      comment: comment,
      date: date,
      sortDate: new Date().getTime(),
      type: "comment",
    });
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

  const { comments, task_activity } = taskData;
  const commentsActivity = comments && task_activity ? [...comments, ...task_activity] : task_activity;

  const sortItems = (a, b) => {
    const dateA = a.sortDate;
    const dateB = b.sortDate;
    return dateA < dateB ? 1 : -1;
  };

  return (
    <>
      {/* use later possibly */}
      {/* <div style={{ opacity: 0.9 }}>
        <Box sx={cmmntHeaderStyles}>
          <Typography sx={{ fontSize: 13 }} variant="body1">
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
      </div> */}
      <Inputs
        sx={{ mt: 2 }}
        value={comment}
        label="comment"
        handleChange={setComment}
        multiline
        row={4}
        inputProps={{
          style: {
            fontSize: 12,
          },
        }}
      />
      {comment !== "" && (
        <Grow in={comment !== ""}>
          <Button onClick={addComment} size="small" variant="contained" sx={buttonStyles}>
            Send
          </Button>
        </Grow>
      )}
      <Box>
        <Typography
          onClick={() => setShowActivity(!showActivity)}
          sx={{ cursor: "pointer", fontSize: 11, width: !showActivity ? 70 : 88, mr: 1 }}
          variant="caption"
          color={showActivity ? "primary" : "secondary"}
        >
          {showActivity ? "Hide activity" : "Show activity"}
        </Typography>
        <Typography
          onClick={() => setShowComments(!showComments)}
          sx={{ cursor: "pointer", fontSize: 11, width: !showActivity ? 70 : 88 }}
          variant="caption"
          color={showComments ? "primary" : "secondary"}
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </Typography>
      </Box>

      {/* <Divider style={{ background: "#2c387e", margin: 1 }} /> */}
      <Box mt={1}>
        {!isFetching &&
          commentsActivity &&
          commentsActivity.sort(sortItems).map(
            (
              activity: {
                name: string;
                message: string;
                color: string;
                date: Date;
                receiver: string;
                type?: string;
                comment?: string;
              },
              i: React.Key
            ) => (
              <Box key={i} sx={{ p: 0.5, mb: showActivity ? 1 : 0 }}>
                {activity?.hasOwnProperty("type")
                  ? showComments && (
                      <Box sx={{ position: "relative", bottom: !showActivity ? 10 : 0 }}>
                        <Box sx={styles.commentBox}>
                          <Tooltip title={activity.name} placement="bottom" key={i}>
                            <Avatar sx={avatarStyles(activity.color)}>{activity.name[0].toUpperCase()}</Avatar>
                          </Tooltip>
                          <Card sx={styles.card}>
                            <b style={styles.color}>{activity.name}</b>
                            <Typography sx={styles.text} variant="body1">
                              {activity.comment}
                            </Typography>
                          </Card>
                        </Box>
                        <Typography sx={styles.activityDate} variant="body1">
                          {activity.date}
                        </Typography>
                        <Divider style={{ background: "#2c387e", borderRadius: "1px" }} />
                      </Box>
                    )
                  : showActivity && (
                      <>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Tooltip title={activity.name} placement="bottom" key={i}>
                            {
                              <Avatar sx={avatarStyles(activity.color)}>
                                {activity.name ? activity.name[0].toUpperCase() : ""}
                              </Avatar>
                            }
                          </Tooltip>
                          <Card sx={styles.card}>
                            {activity.receiver ? (
                              <Typography sx={styles.text} variant="body1">
                                <b style={styles.color}>{activity.receiver}</b> was added to the task by
                                <b style={styles.color}> {activity.name}</b>
                              </Typography>
                            ) : (
                              <Typography sx={styles.text} variant="body1">
                                <b style={styles.color}>{activity.name}</b>
                                {activity.message}
                              </Typography>
                            )}
                          </Card>
                        </Box>
                        <Typography sx={styles.activityDate} variant="body1">
                          {activity.date}
                        </Typography>
                        <Divider style={{ background: "#2c387e", borderRadius: "1px" }} />
                      </>
                    )}
              </Box>
            )
          )}
      </Box>
    </>
  );
}

export default CommentsActivity;

const makeStyles = (color: string) => ({
  activityDate: {
    fontSize: 10,
    position: "relative",
    bottom: "10px",
    left: "28.5px",
    color: color,
  },
  commentBox: {
    display: "flex",
    alignItems: "center",
    mb: 1,
  },
  color: {
    color: color,
    fontSize: 12,
  },
  card: {
    p: 0.5,
    ml: 0.5,
    pr: 1.1,
  },

  text: {
    fontSize: 12,
    ml: 0.1,
  },
});

const avatarStyles = (color: string) => ({
  width: 25,
  height: 25,
  bgcolor: color,
  fontSize: 15,
  mb: 0.5,
});
