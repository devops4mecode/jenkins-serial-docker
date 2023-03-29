import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar"
import GenerateNumber from "./scenes/generateNumber/GenerateNumber";
import UnusedNumber from "./scenes/numbers/UnusedNumber"
import UsedNumber from "./scenes/numbers/UsedNumber";
// import Pie from "./scenes/pie"

function App() {
    const [theme, colorMode] = useMode();

    // anthing refer to the theme.js file
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {/* CssBaseline = reset css to default */}
                <CssBaseline />
                <div className="app">
                    <Sidebar/>
                    <main className="content">
                        <Topbar />
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/unusedNumber" element={<UnusedNumber />} />
                            <Route path="/usedNumber" element={<UsedNumber />} />
                            <Route path="/generateNumber" element={<GenerateNumber />} />
                            {/* <Route path="/pie" element={<Pie />} /> */}
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
