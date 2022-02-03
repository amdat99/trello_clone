import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUserStore } from "./store";
import shallow from "zustand/shallow";

// import { ThemeProvider } from "@mui/material/styles";
import "./App.css";

const Board = React.lazy(() => import("./pages/board/Board"));
const Authentication = React.lazy(() => import("./pages/authentication/Authentication"));
const Landing = React.lazy(() => import("./pages/landing/Landing"));
const Reset = React.lazy(() => import("./pages/reset/Reset"));

const App: React.FC = () => {
  const user = useUserStore((state) => state.user, shallow);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        {user ? (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/board" element={<Board />}>
              <Route path=":orgName" element={<Board />} />
            </Route>
          </Routes>
        ) : (
          <Authentication />
        )}
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
