import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUserStore } from "./store";
import Lottie from "react-lottie-player";
import shallow from "zustand/shallow";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// export const UserContext = React.createContext({});
import NotFound from "./pages/notFound/NotFound";
import getTheme from "./theme";
import rocket from "./assets/rocket.json";
import "./App.css";

const Board = React.lazy(() => import("./pages/board/Board"));
const AuthenticationMain = React.lazy(() => import("./pages/authentication/AuthenticationMain"));
const Landing = React.lazy(() => import("./pages/landing/Landing"));
const Reset = React.lazy(() => import("./pages/reset/Reset"));

const App = () => {
  const [user, colorMode] = useUserStore((state) => [state.user, state.colorMode], shallow);
  const theme = createTheme(getTheme(colorMode));

  console.log(useUserStore);

  //For reference:
  // const [currentCacheData, setCurrentCacheData] = useState({});
  // const value = useMemo(() => ({ currentCacheData, setCurrentCacheData }), [currentCacheData]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense
          fallback={
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Lottie style={{ width: "125px", height: "124px", marginTop: "20%" }} loop animationData={rocket} play />
            </div>
          }
        >
          {user ? (
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/board" element={<Board />}>
                <Route path=":orgName" element={<Board />} />
                <Route element={<Landing />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<AuthenticationMain />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
