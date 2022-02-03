import React, { useState } from "react";
import { Todo } from "../models";
import { AiFillEdit, AiFillDelete, AiOutlinePullRequest } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import "./styles.css";
import { Draggable } from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<object>>;
  todos: object;
  i: number;
  id: string;
};
function Task({ todo, setTodos, todos, i, id }: Props) {
  const [onEdit, setOnEdit] = useState(false);
  const [editTodo, setEditTodo] = useState(todo.todo);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDone = (id: number) => {
    // setTodos(
    //   todos.map((todo) => {
    //     if (todo.id === id) {
    //       todo.isDone = true;
    //     }
    //     return todo;
    //   })
    // );
  };

  const revertDone = (id: number) => {
    // setTodos(
    //   todos.map((todo) => {
    //     todo.id === id ? (todo.isDone = false) : (todo.isDone = todo.isDone);
    //     return todo;
    //   })
    // );
  };
  const handleDelete = (taskId: number) => {
    const currentTodo = todos[id].filter((todo) => todo.id !== taskId);
    setTodos({ ...todos, [id]: currentTodo });
  };

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
        <Draggable draggableId={todo.id.toString()} index={i}>
          {(provided) => (
            <form
              className="todos__single"
              onSubmit={(e) => handleEdit(e)}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {onEdit ? (
                <input ref={inputRef} type="text" value={editTodo} onChange={(e) => setEditTodo(e.target.value)} />
              ) : (
                <span className="todos__single--text">{todo.todo}</span>
              )}
              <div>
                <span className="icon" onClick={() => handleDone(todo.id)}>
                  <MdDone className={todo.isDone === true ? "done" : ""} />
                </span>
                {todo.isDone && (
                  <span className="icon" onClick={() => revertDone(todo.id)}>
                    <AiOutlinePullRequest />
                  </span>
                )}
                <span
                  className="icon"
                  onClick={() => {
                    setOnEdit(!onEdit);
                    inputRef.current?.focus();
                  }}
                >
                  <AiFillEdit />
                </span>
                <span className="icon" onClick={() => handleDelete(todo.id)}>
                  <AiFillDelete />
                </span>
              </div>
              {onEdit && <button type="submit">Edit</button>}
            </form>
          )}
        </Draggable>
      )}
    </>
  );
}

export default Task;
