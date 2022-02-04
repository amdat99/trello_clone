import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUserStore } from "./store";
import shallow from "zustand/shallow";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import getTheme from "./theme";
import "./App.css";

const Board = React.lazy(() => import("./pages/board/Board"));
const AuthenticationMain = React.lazy(() => import("./pages/authentication/AuthenticationMain"));
const Landing = React.lazy(() => import("./pages/landing/Landing"));
const Reset = React.lazy(() => import("./pages/reset/Reset"));

const App = () => {
  const [user, colorMode] = useUserStore((state) => [state.user, state.colorMode], shallow);
  const theme = createTheme(getTheme(colorMode));

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
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
            <AuthenticationMain />
          )}
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
