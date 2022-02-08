import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
// import Slide from "@mui/material/Slide";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DragDropContext, Droppable, DropResult, Draggable } from "react-beautiful-dnd";
import useFetchData from "../../hooks/useFetchData";
import { requestHandler } from "../../helpers/requestHandler";
import ListContent from "./ListContent";
import { CreateVal, Board, User, List as ListType, Task } from "../models";
import { CurrentListId } from "../../pages/board/Board";
import "../../App.css";

type Props = {
  setCurrentResId: ({ id: string, rerender: number }) => void;
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  currentResId: { id: string; rerender: number };
  stickyMenu: boolean;
  createValue: CreateVal;
  handleAdd: (e: React.FormEvent) => void;
  current: {
    board: Board;
    setBoard: (board: Board) => void;
    list: CurrentListId;
    setList: (list: CurrentListId) => void;
  };
};
const List = ({ todo, setTodo, stickyMenu, createValue, handleAdd, currentResId, setCurrentResId, current }: Props) => {
  const [todos, setTodos] = useState({});
  const [listData, setListData] = useState([]);

  const {
    data: board,
    fetchData: fetchLists,
    error,
  } = useFetchData(
    { type: "post", route: "board/all", body: current.board && { id: current.board.id } },
    current.board.id
  );

  const min1000 = useMediaQuery("(min-width:1000px)");
  const min700 = useMediaQuery("(min-width:700px)");

  useEffect(() => {
    const getLists = () => {
      let currentLists = [];
      if (board && board[0]?.lists) {
        board[0].lists.forEach((list: { id: any }) => {
          //push list data to todos (todos is used as a map to render lists aand tasks)
          setTodos((prevTodos) => ({ ...prevTodos, [list.id]: [] }));
          currentLists.push(list);
        });
        setListData(currentLists);
      }
      if (error?.errors === "no lists found") {
        setTodos({});
        setListData([]);
      }
    };
    getLists();
  }, [board, error, current.board]);

  useEffect(() => {
    if (current.board) {
      fetchLists();
    }
    //es-lint-disable-next-line
  }, [current.board, current.list.rerender]);

  useEffect(() => {
    const createList = () => {
      if (createValue?.name) {
        const id = (Math.random() / Math.random()).toString();
        let currentListsData = listData;
        currentListsData.push({ id, name: createValue.name });
        requestHandler({
          type: "post",
          route: "list/create",
          body: { board_id: current.board.id, name: createValue.name, lists: JSON.stringify(currentListsData), id },
        }).then((response) => {
          if (response === "list created successfully") {
            fetchLists();
          } else {
            alert(response?.errors ? response.errors : "no data found");
          }
        });
      }
    };
    createList();
  }, [current.list.rerender]);

  // handles all drag and drop of tasks and lists and db updates
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return; // if not dragged to destination then return
    //@ts-ignore
    Array.prototype.insert = function (index: number, item: Task) {
      this.splice(index, 0, item);
    };
    if (source.droppableId === "board") {
      // for list drag and drop
      const sourceData: ListType = listData[source.index];
      const destinationData: ListType = listData[destination.index];
      let currentLists: any = listData;
      // splice current todo to new index and remove duplqicate
      currentLists.insert(destination.index - 1, destinationData);
      setListData([...new Set(currentLists)]);

      // update list map json
      // requestHandler({
      //   type: "put",
      //   route: "list/dragupdate",
      //   body: {
      //     id: draggableId,
      //     board_id: current.board.id,
      //     lists: JSON.stringify([...new Set(currentLists)]),
      //   },
      // }).then((response) => {
      //   if (response !== "lists updated successfully") {
      //     //rollack local index changes if request fails
      //     currentLists.insert(destination.index, sourceData);
      //     setListData([...new Set(currentLists)]);
      //     alert(response?.errors ? response.errors : "no data found");
      //   } else {
      //     fetchLists();
      //   }
      // });
    } else {
      const prevId: string = source.droppableId;
      const nextId: string = destination.droppableId;
      const sameList = nextId === prevId;
      // currentTodo is data of task being moved
      const currentTodo: ListType = todos[prevId].slice(source.index, source.index + 1)[0];
      // splice currentTodo to destination list
      const onInsert = (id: string) => {
        todos[id].insert(destination.index, currentTodo);
      };
      onInsert(nextId);
      // remove currentTodo from source list (if in the same list new element will be added after source index,which is then removed)
      const onSlice = (id: string) => {
        if (!sameList) {
          todos[id].splice(source.index, 1);
        } else {
          todos[id].splice(source.index + 1, 1);
        }
      };
      onSlice(prevId);
      //update list_id of task in database and update task map json
      requestHandler({
        type: "put",
        route: "task/update",
        body: {
          id: currentTodo.id,
          list_id: nextId,
          prev_listid: prevId,
          tasks: JSON.stringify(todos[nextId]),
          prev_tasks: JSON.stringify(todos[prevId]),
        },
      }).then((response) => {
        if (response !== "task updated successfully") {
          //rollack local changes if request fails
          onInsert(prevId);
          onSlice(nextId);
          console.log(response?.errors ? response.errors : "no re2 found");
        } else {
          //triggers requessts only for the lists where where changes made
          setCurrentResId({ id: nextId, rerender: 1 });
          setCurrentResId({ id: prevId, rerender: 2 });
        }
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box m={2} ml={stickyMenu && min700 ? 27 : 4} width={min1000 ? (stickyMenu ? "95%" : "105%") : "95%"}>
        <Typography variant="h4" color={"white"} sx={{ ml: 0.8 }}>
          {current.board ? current.board?.name : "Board"}
        </Typography>

        {/* <button onClick={handleAdd} className="input_submit">
          Add
        </button> */}
        <div>
          {/* <Slide direction="down" in={list} mountOnEnter unmountOnExit> */}
          <Droppable droppableId="board" type="ROW" direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="container ">
                {listData.length &&
                  listData.map((list, i) => (
                    <Draggable key={list.id} draggableId={list.id.toString()} index={i}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`todos hide-scroll`}
                        >
                          <Droppable key={list?.id} droppableId={list?.id} type="COLUMN" direction="vertical">
                            {(provided, _snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{ display: "flex", flexDirection: "column" }}
                              >
                                <Typography sx={{ opacity: 0.95 }}>{list.name}</Typography>
                                <ListContent
                                  list={list}
                                  current={current}
                                  lists={listData}
                                  todo={todo}
                                  setTodo={setTodo}
                                  handleAdd={handleAdd}
                                  todos={todos}
                                  setTodos={setTodos}
                                  currentResId={currentResId}
                                  provided={provided}
                                />
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
              </div>
            )}
          </Droppable>
          {/* </Slide> */}
        </div>
      </Box>
    </DragDropContext>
  );
};

export default List;
