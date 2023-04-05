import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import GenerateNumber from "./scenes/generateNumber/GenerateNumber";
import UnusedNumber from "./scenes/numbers/UnusedNumber"
import UsedNumber from "./scenes/numbers/UsedNumber";
import LoginPage from "./scenes/loginPage/Page";
import AllNumber from "./scenes/numbers/AllNumber";
import Line from "./scenes/line";
// import Pie from "./scenes/pie"
import Layout from "./scenes/layout"
import { useAuthContext } from "hooks/useAuthContext";

import { IntlProvider } from "react-intl";
import English from "lang/en.json"
import Chinese from "lang/zh.json"
import Malay from "lang/ms.json"
import { useState } from "react";

const local = navigator.language

console.log(local)


let lang;
if (local === "en" || local === "en-US") {
    lang = English
} else {
    if (local === "zh") {
        lang = Chinese
    } else {
        lang = Malay
    }
}

function App() {
    const { user } = useAuthContext()
    const [theme, colorMode] = useMode();

    const [locale, setLocale] = useState(local)
    const [messages, setMessages] = useState(lang)

    // anthing refer to the theme.js file
    return (
        <IntlProvider locale={locale} messages={Chinese}>
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
                                <Route
                                    path="/line"
                                    element={user ? <Line /> : <Navigate to="/login" />}
                                />
                            </Route>
                        </Routes>
                    </ThemeProvider>
                </BrowserRouter>
            </ColorModeContext.Provider>
        </IntlProvider>
    );
}

export default App;
