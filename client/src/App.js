
import { useAuthContext } from "../src/hooks/useAuthContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Layout from "./scenes/layout/Layout";
import Dashboard from "./scenes/Dashboard";
import Generate from "./scenes/Generate";
import AllSerial from "./scenes/AllSerial";
import ActiveSerial from "./scenes/ActiveSerial";
import RedeemedSerial from "./scenes/RedeemedSerial";



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
                            <Route index element={<Navigate to="/" />} />


                            <Route path="dashboard" element={ <Dashboard />} />
                            <Route path="generateserial" element={<Generate/> } />
                            <Route path="allSerial" element={<AllSerial/> } />
                            <Route path="activeserial" element={<ActiveSerial/> } />
                            <Route path="redeemedserial" element={<RedeemedSerial/> } />

                        </Route>


                    </Routes>
                </ThemeProvider>
            </BrowserRouter>

        </div>
    );
}

export default App;
