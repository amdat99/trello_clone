import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { requestHandler } from "../../helpers/requestHandler";

function Reset() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email || !token) {
      navigate("/");
    }
  }, [email, token]);

  console.log("email", email, "token", token);
  return <div></div>;
}

export default Reset;
