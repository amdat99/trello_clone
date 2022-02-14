import React, { useEffect } from "react";
import MaterialTable from "@material-table/core";
import { useNavigate } from "react-router-dom";
import { Box, Fade, LinearProgress, Card, Button, Avatar, Tooltip } from "@mui/material";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import useFetchData from "../../hooks/useFetchData";

function Table({ orgName }) {
  const navigate = useNavigate();
  const { data: tasks, fetchData: fetchTasks } = useFetchData(
    {
      type: "post",
      route: "task/orgtasks",
    },
    "task/orgtasks"
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const columns = [
    {
      field: "name",
      title: "Name",
    },
    {
      field: "created_by",
      title: "Created by",
    },
    {
      field: "description",
      title: "Description",
    },
    {
      field: "board_name",
      title: "Board",
    },
    {
      field: "created_at",
      title: "Created at",
    },
    {
      field: "updated_at",
      title: "Updated at",
    },
  ];

  return (
    <>
      {!tasks && <LinearProgress sx={{ m: 50 }} />}
      <Fade in={tasks !== null}>
        <Card
          raised
          sx={{ overflowY: "scroll", maxHeight: "90%", m: 2, ml: 5, mt: 7.5, bgcolor: "#F2F2F2", p: 1, pr: 0 }}
        >
          <Card>
            {tasks && (
              <MaterialTable
                columns={columns}
                data={tasks}
                title="Org Tasks"
                options={{
                  columnResizable: true,
                  sorting: true,
                  filtering: true,
                  headerStyle: {
                    color: "#3f51b5",
                  },
                  exportMenu: [
                    {
                      label: "Export PDF",
                      exportFunc: (cols, datas) => ExportPdf(cols, datas, "Tasks"),
                    },
                    {
                      label: "Export CSV",
                      exportFunc: (cols, datas) => ExportCsv(cols, datas, "Tasks"),
                    },
                  ],
                }}
                detailPanel={({ rowData }: any) => {
                  return (
                    <>
                      Assigned Users + comments + activity
                      <Button
                        onClick={() => {
                          window
                            .open(`/board/${orgName}?board=${rowData.board_name}&task=${rowData.id}&view=l`, "_blank")
                            .focus();
                        }}
                      >
                        Open task
                      </Button>
                      <pre style={{ maxWidth: "90vw", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                        {rowData?.assigned_users &&
                          rowData.assigned_users.map((user: { name: {}; color: any }, i: React.Key) => (
                            <Tooltip title={user.name} placement="bottom" key={i}>
                              <Avatar
                                sx={{ width: 25, height: 25, mr: 0.7, bgcolor: user.color, fontSize: 15, mb: 0.5 }}
                              >
                                {user.name[0].toUpperCase()}
                              </Avatar>
                            </Tooltip>
                          ))}
                        Activity:
                        {JSON.stringify(rowData.task_activity)}
                        Comments:
                        {JSON.stringify(rowData.task_comments)}
                      </pre>
                    </>
                  );
                }}
              />
            )}
          </Card>
        </Card>
      </Fade>
    </>
  );
}

export default Table;
