import React from "react";
import Task from "../Task/Task";
import useFetchData from "../../hooks/useFetchData";

function ListContent({ todos, id, setTodos }) {
  const {
    data: tasks,
    fetchData: fetchTasks,
    error: taskError,
  } = useFetchData({ type: "post", route: "task/all", body: { task_id: id.id } }, "list/all");
  return (
    <>
      {todos[id.id] &&
        todos[id.id].map((todo, i) => (
          <Task key={todo.id} todo={todo} setTodos={setTodos} todos={todos} i={i} id={id.id} />
        ))}
    </>
  );
}

export default ListContent;
