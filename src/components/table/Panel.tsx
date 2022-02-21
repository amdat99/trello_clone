import React, { useState, useEffect } from "react";
import { Card, Button, Avatar, Tooltip, Box, Typography } from "@mui/material";
import AvatarGroup from "components/avatarGroup/AvatarGroup";
import Calender from "../calender/Calender";
import { Activity } from "../models";

function Panel({ rowData, orgName }) {
  const [calenderData, setCalenderData] = useState(null);

  const formatCalendar = React.useCallback(() => {
    let clndrData = [];
    if (rowData) {
      let currentDate = null;
      let index = 0;
      rowData.task_activity.forEach((act: Activity) => {
        //@ts-ignore
        if (currentDate !== act.date.slice(0, 10)) {
          clndrData.push({
            value: rowData.task_activity.length,
            day: new Date(act.sortDate).toISOString().split("T")[0],
          });
          // @ts-ignore
          currentDate = act.date.slice(0, 10);
          index++;
        } else if (clndrData[index]?.value) {
          clndrData[index].value = clndrData[index]?.value + 1;
        }
      });
    }
    setCalenderData(clndrData);
  }, [rowData]);

  useEffect(() => {
    formatCalendar();
  }, [rowData]);

  return (
    <Card sx={{ m: 1 }}>
      <Box ml={1}>
        <Button
          onClick={() => {
            window.open(`/board/${orgName}?board=${rowData.board_name}&task=${rowData.id}&view=l`, "_blank").focus();
          }}
        >
          Open task
        </Button>
        {rowData?.assigned_users && <AvatarGroup users={rowData.assigned_users} />}
      </Box>
      <Box m={1} sx={{ flexDirection: "row", display: "flex", flexWrap: "wrap" }}>
        {calenderData && (
          <Box sx={{ height: 150, width: "50vw", m: 1, mb: 3, minWidth: 350 }}>
            <Tooltip title={"Task daily activity"} placement="bottom">
              <Typography sx={{ width: 20, ml: "46%" }}>Activity</Typography>
            </Tooltip>
            <Calender data={calenderData} />
          </Box>
        )}
      </Box>
      {JSON.stringify(rowData.task_comments)}
    </Card>
  );
}

export default Panel;
