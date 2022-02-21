import React, { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { Fade, LinearProgress, Card } from "@mui/material";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import Panel from "./Panel";
import useFetchData from "../../hooks/useFetchData";

const options = [
  "public_id",
  "description",
  "assigned_users",
  "task_activity",
  "labels",
  "created_by",
  "status",
  "board_name",
  "updated_at",
  "public_id",
  "created_at",
  "list_id",
  "color",
  "due_date",
  "name",
  "deleted_at",
  "image",
  "assigned_users",
  "id",
  "comments",
];
function Table({ orgName, stickyMenu }) {
  const [tableData, setTableData] = useState(null);
  const {
    data: tasks,
    fetchData: fetchTasks,
    error,
  } = useFetchData(
    {
      type: "post",
      route: "task/orgtasks",
      body: { options },
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
      field: "due_date",
      title: "Due date",
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

  const setCacheData = React.useCallback(() => {
    let currentTasks = [];
    if (tasks) {
      tasks.forEach((task) => {
        currentTasks.push({
          id: task.id,
          name: task.name,
          created_by: task.created_by,
          description: task.description,
          board_name: task.board_name,
          created_at: new Date(task.created_at).toLocaleString(),
          updated_at: new Date(task.updated_at).toLocaleString(),
          task_activity: task.task_activity,
          labels: task.labels,
          assigned_users: task.assigned_users,
        });
      });
    }
    setTableData(currentTasks);
  }, [tasks]);

  useEffect(() => {
    if (tasks) {
      setCacheData();
    }
  }, [tasks]);

  return (
    <>
      {!tasks && !error && <LinearProgress sx={{ m: 50 }} />}
      <Fade in={tasks !== null}>
        <Card
          raised
          sx={{
            overflowY: "scroll",
            maxHeight: "90%",
            m: 2,
            ml: stickyMenu ? 27 : 5,
            mt: 7.5,
            bgcolor: "#F2F2F2",
            p: 1,
            pr: 0,
          }}
        >
          <Card>
            {tableData && (
              <MaterialTable
                columns={columns}
                data={tableData}
                title="Org Tasks"
                options={{
                  columnResizable: true,
                  sorting: true,
                  filtering: true,
                  //@ts-ignore
                  cellStyle: {
                    fontSize: 13,
                  },
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
                  return <Panel rowData={rowData} orgName={orgName} />;
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
