import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droppable, DragDropContext } from "react-beautiful-dnd";
import { Fade, LinearProgress, Card, Button, Avatar, Tooltip, Typography } from "@mui/material";
import Inputs from "../inputs/Inputs";
import TaskModal from "../taskModal/TaskModal";
import Task from "../Task/Task";
import useFetchData from "../../hooks/useFetchData";
import { List as ListType } from "../models";

const options = [
  "public_id",
  "description",
  "assigned_users",
  "task_activity",
  "labels",
  "created_by",
  "status",
  "board_name",
  "color",
  "updated_at",
  "public_id",
  "created_at",
  "list_id",
  "name",
  "deleted_at",
  "image",
  "assigned_users",
  "id",
  "comments",
];

function Archive({ orgName, boardName, taskId, position, onShowCtxMenu, user }) {
  const navigate = useNavigate();
  const [currentTasks, setCurrentTasks] = useState(null);
  const [filter, setFilter] = useState("");
  const {
    data: tasks,
    fetchData: fetchTasks,
    error,
  } = useFetchData(
    {
      type: "post",
      route: "task/orgtasks",
      body: { options, suspended: true },
    },
    "archive/task"
  );
  useEffect(() => {
    fetchTasks();
  }, [orgName]);

  useEffect(() => {
    if (tasks) {
      setCurrentTasks(tasks);
    }
  }, [tasks]);

  const setUrl = (taskId: string) => {
    navigate(`/board/${orgName}?board=${boardName}&view=a${taskId ? `&task=${taskId}` : ""}`);
  };

  const filterTasks = (tasks: any) => {
    return currentTasks.filter((task) => {
      return task.name?.toLowerCase().includes(filter.toLowerCase());
    });
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return; // if not dragged to destination then return
    const nextId: string = destination.droppableId;
    //@ts-ignore
    Array.prototype.insert = function (index: number, item: Task) {
      this.splice(index, 0, item);
    };
    // currentTodo is data of task being moved
    const currentTodo: ListType = currentTasks.slice(source.index, source.index + 1)[0];
    // splice currentTodo to destination list
    const onInsert = (id: string) => {
      let index = source.index > destination.index ? destination.index : destination.index + 1;
      currentTasks.insert(index, currentTodo);
    };
    onInsert(nextId);
    const index = source.index > destination.index ? source.index + 1 : source.index;
    currentTasks.splice(index, 1, 0);
  };

  return (
    <Card raised sx={{ overflowY: "scroll", maxHeight: "90%", m: 2, ml: 5, mt: 7.5, bgcolor: "#F2F2F2", p: 1, pr: 0 }}>
      {taskId && (
        <TaskModal
          taskId={taskId}
          setUrl={setUrl}
          position={position}
          user={user}
          todos={currentTasks}
          setCurrentResId={fetchTasks}
          onShowCtxMenu={onShowCtxMenu}
          archive={true}
        />
      )}
      <Typography>Archived Tasks</Typography>
      <Fade in={tasks !== null}>
        <Card sx={{ p: 1, flexWrap: "wrap", width: "45%" }}>
          <Inputs type="search" size="small" value={filter} handleChange={setFilter} sx={{ mb: 1 }} label="search" />
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={"archive"} type="COLUMN" direction="vertical">
              {(provided, _snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {currentTasks &&
                    currentTasks[0]?.name &&
                    filterTasks(currentTasks).map((todo, i) => (
                      <div key={todo.id}>
                        <Task
                          setTaskDragging={() => {}}
                          todo={todo}
                          setTodos={() => {}}
                          todos={tasks}
                          i={i}
                          id={"1"}
                          setUrl={setUrl}
                        />
                      </div>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Card>
      </Fade>
    </Card>
  );
}

export default Archive;
