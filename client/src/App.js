
import { useAuthContext } from "../src/hooks/useAuthContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Layout from "./scenes/layout/Layout";
import Dashboard from "./scenes/Dashboard";
import Generate from "./scenes/luckySerial/Generate";
import AllSerial from "./scenes/luckySerial/AllSerial";
import ActiveSerial from "./scenes/luckySerial/ActiveSerial";
import RedeemedSerial from "./scenes/luckySerial/RedeemedSerial";
import LoginPage from "./scenes/login/LoginPage"
import MoneyPacket from "./scenes/moneyPacket/MoneyPacket";

function App() {
    const mode = useSelector((state) => state.global.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    const { user } = useAuthContext()

    return (
        <div className="App">

            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            {/* <Route index element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} /> */}
                            <Route index element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />

                            <Route
                                path="/login"
                                element={!user ? <LoginPage /> : <Navigate to="/" />}
                            />

                            <Route path="dashboard" element={user ? <Dashboard /> : <Navigate to='/login' />} />
                            <Route path="generateserial" element={user ? <Generate /> : <Navigate to='/' />} />
                            <Route path="allSerial" element={user ? <AllSerial /> : <Navigate to='/' />} />
                            <Route path="activeserial" element={user ? <ActiveSerial /> : <Navigate to='/' />} />
                            <Route path="redeemedserial" element={user ? <RedeemedSerial /> : <Navigate to='/' />} />
                            <Route path="moneypacket" element={user ? <MoneyPacket /> : <Navigate to='/' />} />

                        </Route>
                    </Routes>
                </ThemeProvider>
            </BrowserRouter>

        </div>
    );
}

export default App;
