import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Navbar from "./global/Navbar";
import { useAuthContext } from "./hooks/useAuthContext";
import { CssBaseline } from "@mui/material";
import Layout from "./layout";
import { ThemeProvider } from "@emotion/react";
import LoginPage from "./pages/loginPage/Page"
import Dashboard from "./pages/dashboard";
import GenerateNumber from "./pages/numbers/GenerateNumber";
import UnusedNumber from "./pages/numbers/UnusedNumber";
import UsedNumber from "./pages/numbers/UsedNumber";
import AllNumber from "./pages/numbers/AllNumber";

function App() {
  const { user } = useAuthContext()
  return (
    // <>
    //   <Navbar />
    // </>

    <BrowserRouter>
      {/* <ThemeProvider> */}
      <CssBaseline />
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/GenerateNumber"
            element={user ? <GenerateNumber /> : <Navigate to="/login" />}
          />
          <Route
            path="/UnusedNumber"
            element={user ? <UnusedNumber /> : <Navigate to="/login" />}
          />
          <Route
            path="/UsedNumber"
            element={user ? <UsedNumber /> : <Navigate to="/login" />}
          />
        </Route>
        <Route
          path="/AllNumber"
          element={user ? <AllNumber /> : <Navigate to="/login" />}
        />
      </Routes>
      {/* </ThemeProvider> */}
    </BrowserRouter>
  );
}

export default App;
