import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
// import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
// import { MdDone } from "react-icons/md";
import { Task as TaskProps } from "../models";
import "./styles.css";

type Props = {
  todo: TaskProps;
  setTodos: React.Dispatch<React.SetStateAction<object>>;
  todos: object;
  i: number;
  id: string;
  setUrl: (taskId: string) => void;
};
function Task({ todo, setTodos, todos, i, id, setUrl }: Props) {
  const [onEdit, setOnEdit] = useState(false);
  const [editTodo, setEditTodo] = useState(todo.name);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // const handleDelete = (taskId: number) => {
  //   const currentTodo = todos[id].filter((todo) => todo.id !== taskId);
  //   setTodos({ ...todos, [id]: currentTodo });
  // };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    todos[id].forEach((todoData) => {
      if (todoData.id === todo.id) {
        todoData.todo = editTodo;
        todoData.isDone = false;
      }
    });

    setOnEdit(false);
  };

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [onEdit]);
  return (
    <>
      {todo?.id && todo?.id !== undefined && (
        <Draggable draggableId={todo.id.toString()} index={i} key={i}>
          {(provided, _snapshot) => (
            <form
              key={i}
              onClick={() => setUrl(todo.id.toString())}
              onSubmit={(e) => handleEdit(e)}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Card className="todos__single">
                {onEdit ? (
                  <input ref={inputRef} type="text" value={editTodo} onChange={(e) => setEditTodo(e.target.value)} />
                ) : (
                  <Typography variant="body2" sx={{ wordWrap: "break-word" }} className="todos__single--text">
                    {todo.name}
                  </Typography>
                )}
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  {todo?.assigned_users &&
                    todo.assigned_users.map((user) => (
                      <Tooltip title={user.name} placement="bottom" key={user.name}>
                        <Avatar
                          sx={{
                            width: 20,
                            height: 20,
                            ml: 0.2,
                            bgcolor: user.color,
                            fontSize: 15,
                            mb: 0.5,
                            opacity: 0.88,
                          }}
                        >
                          {user.name[0].toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    ))}
                  {/* <span className="icon" onClick={() => handleDone(parseInt(todo.id))}>
                    <MdDone className={todo.status !== "" ? "done" : ""} />
                  </span> */}
                  {/* {todo. && (
                  <span className="icon" onClick={() => revertDone(todo.id)}>
                    <AiOutlinePullRequest />
                  </span>
                )} */}
                  {/* <span
                    className="icon"
                    onClick={() => {
                      setOnEdit(!onEdit);
                      inputRef.current?.focus();
                    }}
                  >
                    <AiFillEdit />
                  </span> */}
                  {/* <span className="icon" onClick={() => handleDelete(parseInt(todo.id))}>
                    <AiFillDelete />
                  </span> */}
                </Box>
                {onEdit && <button type="submit">Edit</button>}
              </Card>
            </form>
          )}
        </Draggable>
      )}
    </>
  );
}

export default Task;
