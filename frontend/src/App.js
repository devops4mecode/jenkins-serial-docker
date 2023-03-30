import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar"
import GenerateNumber from "./scenes/generateNumber/GenerateNumber";
import UnusedNumber from "./scenes/numbers/UnusedNumber"
import UsedNumber from "./scenes/numbers/UsedNumber";
import LoginPage from "./scenes/loginPage/Page";
import AllNumber from "./scenes/numbers/AllNumber";
import Line from "./scenes/line";
// import Pie from "./scenes/pie"

// Samuel add
import { useSelector } from "react-redux";
import Layout from "./scenes/layout"
import { useAuthContext } from "hooks/useAuthContext";

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
                            {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
                            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/LoginPage" />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/LoginPage" element={<LoginPage />} />
                            <Route path="/generateNumber" element={<GenerateNumber />} />
                            <Route path="/unusedNumber" element={<UnusedNumber />} />
                            <Route path="/usedNumber" element={<UsedNumber />} />
                            <Route path="/allNumber" element={<AllNumber />} />
                            <Route path="/LoginPage" element={<LoginPage />} />
                            <Route path="/line" element={<Line />} />
                        </Route>
                    </Routes>
                </ThemeProvider>
            </BrowserRouter>
        </ColorModeContext.Provider>
    );
}

export default App;
