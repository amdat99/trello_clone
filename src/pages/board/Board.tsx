import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import List from "../../components/lists/List";
import { requestHandler } from "../../helpers/requestHandler";
import useFetchData from "../../hooks/useFetchData";

const Board: React.FC = () => {
  const navigate = useNavigate();
  let params = useParams();
  let orgName = params.orgName;

  useEffect(() => {
    let notMounted = false;
    const checkOrg = () => {
      requestHandler({ route: "org/enter", type: "post", body: { name: orgName } }).then((data) => {
        if (data !== "entered organisation successfully") {
          navigate("/");
          alert("error entering org");
        }
      });
    };
    if (!notMounted) checkOrg();
    return () => {
      notMounted = true;
    };
  }, []);

  return <List />;
};

export default Board;
