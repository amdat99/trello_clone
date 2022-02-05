import React, { useEffect } from "react";
import Task from "../Task/Task";
import LinearProgress from "@mui/material/LinearProgress";
import useFetchData from "../../hooks/useFetchData";

function ListContent({ todos, list, setTodos, currentResId, rerender }) {
  const {
    data: tasks,
    fetchData: fetchTasks,
    error: taskError,
    isFetching,
  } = useFetchData({ type: "post", route: "task/all", body: { list_id: list.id } }, list.id);

  useEffect(() => {
    if (currentResId.id === list.id) {
      console.log("runs");
      fetchTasks();
    }
  }, [currentResId, rerender]);

  useEffect(() => {
    if (list.has_tasks) {
      fetchTasks();
    }
  }, []);

  useEffect(() => {
    if (tasks) {
      todos[list.id] = tasks;
    }
  }, [tasks]);

  return (
    <>
      {isFetching && <LinearProgress sx={{ m: 1 }} />}
      {todos[list.id] &&
        todos[list.id].map((todo, i) => (
          <Task key={todo.id} todo={todo} setTodos={setTodos} todos={todos} i={i} id={list.id} />
        ))}
    </>
  );
}

export default ListContent;
