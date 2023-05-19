import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext';
import { IntlProvider } from "react-intl";
import { LOCALES } from '../../i18n/locales';
import { messages } from "../../i18n/messages"
import Navbar from '../global/Navbar';
import Sidebar from '../global/Sidebar';
import { Box, useMediaQuery } from '@mui/material';


const Layout = () => {
    const [currentLocale, setCurrentLocale] = useState(getInitialLocal())

    const handleChange = (locale) => {
        setCurrentLocale(locale)
        localStorage.setItem("locale", locale)
    }

    const { user } = useAuthContext()

    function getInitialLocal() {
        // getting stored items
        const savedLocale = localStorage.getItem('locale')
        return savedLocale || LOCALES.ENGLISH
    }

    const isNonMobile = useMediaQuery("(min-width: 1024px)");            //desktop: true, is mobile: false
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <IntlProvider
            messages={messages[currentLocale]}
            locale={currentLocale}
            defaultLocale={LOCALES.ENGLISH}
        >
            <Box display={isNonMobile ? "flex" : "block"}>
                {user && (
                    <Sidebar
                        isNonMobile={isNonMobile}
                        drawerWidth="233px"
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        currentLocale={currentLocale}
                    />
                )}
                <Box flexGrow={1} sx={{ paddingTop: '80px' }}>
                    {user && (
                        <Navbar
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                            currentLocale={currentLocale}
                            handleChange={handleChange}
                        />
                    )}
                    <Outlet />
                </Box>
            </Box>
        </IntlProvider>
    )
}

export default Layout