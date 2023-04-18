import { ColorModeContext, useMode } from "./theme";
import { useAuthContext } from "hooks/useAuthContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import GenerateNumber from "./scenes/generateNumber/GenerateNumber";
import UnusedNumber from "./scenes/numbers/UnusedNumber"
import UsedNumber from "./scenes/numbers/UsedNumber";
import LoginPage from "./scenes/loginPage/Page";
import AllNumber from "./scenes/numbers/AllNumber";
import Layout from "./scenes/layout"

function App() {
    const { user } = useAuthContext()
    const [theme, colorMode] = useMode();

    // anthing refer to the theme.js file
    return (
        <ColorModeContext.Provider value={colorMode}>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
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
                                path="/generateNumber"
                                element={user ? <GenerateNumber /> : <Navigate to="/login" />}
                            />
                            <Route
                                path="/unusedNumber"
                                element={user ? <UnusedNumber /> : <Navigate to="/login" />}
                            />
                            <Route
                                path="/usedNumber"
                                element={user ? <UsedNumber /> : <Navigate to="/login" />}
                            />
                            <Route
                                path="/allNumber"
                                element={user ? <AllNumber /> : <Navigate to="/login" />}
                            />
                        </Route>
                    </Routes>
                </ThemeProvider>
            </BrowserRouter>
        </ColorModeContext.Provider>
    );
}

export default App;
