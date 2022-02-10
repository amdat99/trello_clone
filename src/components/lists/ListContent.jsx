import React, { useEffect } from "react";
import Task from "../Task/Task";
import useFetchData from "../../hooks/useFetchData";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import Inputs from "../inputs/Inputs";

import "../../App.css";

function ListContent({
  todos,
  list,
  setTodos,
  currentResId,
  provided,
  current,
  todo,
  setTodo,
  handleAdd,
  lists,
  setUrl,
}) {
  const {
    data: listData,
    fetchData: fetchTasks,
    error,
    isFetching,
  } = useFetchData({ type: "post", route: "list/all", body: { id: list.id } }, list.id);

  useEffect(() => {
    if (currentResId.id === list.id) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResId, list.id, lists]);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (listData && listData[0]?.tasks) {
      todos[list.id] = listData[0].tasks;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData, lists]);

  if (current.list?.data && current.list.data[0]) {
    console.log(current.list.data[0]);
  }
  return (
    <>
      {todos[list.id] &&
        todos[list.id].map((todo, i) => (
          <Task key={todo.id} todo={todo} setTodos={setTodos} todos={todos} i={i} id={list.id} setUrl={setUrl} />
        ))}
      {provided.placeholder}
      {current.list.data?.id !== list.id && (
        <div
          style={{
            opacity: "0.9",
            position: "relative",
            right: "5px",
          }}
        >
          <Button
            sx={{ textTransform: "none", fontSize: "12px" }}
            size={"small"}
            variant="text"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              current.setList({
                data: listData,
                has_tasks: list.has_tasks,
                rerender: current.list.rerender,
              });
            }}
          >
            Add Todo
          </Button>
        </div>
      )}

      {current.list?.data && current.list.data[0]?.id === list.id && (
        <Box component={"form"} onSubmit={handleAdd}>
          <Inputs type="text" value={todo} handleChange={setTodo} />
          <Box>
            <Button type="submit" variant="contained" size="small">
              Add
            </Button>
            <IconButton
              onClick={() =>
                current.setList({
                  data: null,
                  has_tasks: false,
                  rerender: current.list.rerender,
                })
              }
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );
}

export default ListContent;
