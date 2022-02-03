import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Card from "@mui/material/Card";
import useMediaQuery from "@mui/material/useMediaQuery";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import List from "../../components/lists/List";
import { requestHandler } from "../../helpers/requestHandler";
import useFetchData from "../../hooks/useFetchData";

const Board: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let params = useParams();
  const [todo, setTodo] = useState("");
  const [showDetail, setShowDetail] = useState<boolean>(false);
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
    requestHandler({ route: "board/create", type: "post", body: { name: todo } }).then((data) => {
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

  return (
    <>
      <List
        taskId={taskId}
        boards={boards}
        fetchBoards={fetchBoards}
        createBoard={createBoard}
        todo={todo}
        setTodo={setTodo}
      />
      <Card className="sideBar" onMouseOver={() => setShowDetail(true)} onMouseOut={() => setShowDetail(false)}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <CorporateFareIcon />
          <span style={showDetail ? { display: "flex", marginLeft: "10px" } : { display: "none" }}>Detail message</span>
        </div>

        <CorporateFareIcon />
        <CorporateFareIcon />
      </Card>
    </>
  );
};

export default Board;
