import React, { useEffect } from "react";
import Task from "../Task/Task";
import LinearProgress from "@mui/material/LinearProgress";
import useFetchData from "../../hooks/useFetchData";

function ListContent({ todos, list, setTodos, currentResId }) {
  const {
    data: tasks,
    fetchData: fetchTasks,
    isFetching,
  } = useFetchData({ type: "post", route: "task/all", body: { list_id: list.id } }, list.id);

  useEffect(() => {
    if (currentResId.id === list.id) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResId, list.id]);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tasks) {
      todos[list.id] = tasks;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, list.id]);

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
