import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import List from "../../components/lists/List";
import { requestHandler } from "../../helpers/requestHandler";
import useFetchData from "../../hooks/useFetchData";
import useMousePosition from "../../hooks/useMousePosition";

const Board: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { x, y } = useMousePosition();
  let params = useParams();
  const [todo, setTodo] = useState("");
  const [createValue, setCreateValue] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showCtxMenu, setCtxShowMenu] = useState(false);

  const { data: boards, fetchData: fetchBoards } = useFetchData(
    {
      type: "post",
      route: "board/all",
    },
    "board/all"
  );

  let orgName = params.orgName;
  const taskId = searchParams.get("task");

  const createBoard = () => {
    requestHandler({ route: "board/create", type: "post", body: { name: createValue } }).then((data) => {
      if (data === "board created successfully") {
        fetchBoards();
      } else {
        alert(data?.errors ? data.errors : "no data found");
      }
    });
  };

  useEffect(() => {
    let notMounted = false;
    const checkOrgAndFetchBoards = () => {
      requestHandler({ route: "org/enter", type: "post", body: { name: orgName } }).then((data) => {
        if (data !== "entered organisation successfully") {
          navigate("/");
          alert("error entering org");
        } else {
          fetchBoards();
        }
      });
    };
    if (!notMounted) checkOrgAndFetchBoards();
    return () => {
      notMounted = true;
    };
  }, []);

  const onShowCtxMenu = () => {
    setPosition({ x, y });
    setCtxShowMenu(true);
  };

  return (
    <div
      className="background"
      onDoubleClick={onShowCtxMenu}
      onClick={() => (showCtxMenu ? setCtxShowMenu(false) : () => {})}
      style={{
        backgroundImage:
          "url(" +
          "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      }}
    >
      <List
        taskId={taskId}
        boards={boards}
        fetchBoards={fetchBoards}
        createBoard={createBoard}
        todo={todo}
        position={position}
        showCtxMenu={showCtxMenu}
        setTodo={setTodo}
        stickyMenu={stickyMenu}
        createValue={createValue}
        setCreateValue={setCreateValue}
      />
      <Card
        onClick={() => setStickyMenu(!stickyMenu)}
        className={stickyMenu ? "sideBar1" : "sideBar"}
        onMouseOver={() => setShowDetail(true)}
        onMouseOut={() => setShowDetail(false)}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <CorporateFareIcon />
          <span style={showDetail || stickyMenu ? { display: "flex", marginLeft: "10px" } : { display: "none" }}>
            Detail message
          </span>
        </div>

        <CorporateFareIcon />
        <CorporateFareIcon />
      </Card>
    </div>
  );
};

export default Board;
