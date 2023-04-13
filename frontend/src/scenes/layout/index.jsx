import { Outlet } from 'react-router-dom'
import Sidebar from 'scenes/global/Sidebar'
import Topbar from 'scenes/global/Topbar'
import { useMediaQuery } from '@mui/material'
import { useAuthContext } from 'hooks/useAuthContext'

import { IntlProvider } from "react-intl";
import English from "lang/en.json"
import Chinese from "lang/zh.json"
import Malay from "lang/ms.json"



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


const Layout = () => {

    const { user } = useAuthContext()

    const isNonMobile = useMediaQuery("(min-width: 600px)")

    console.log({IntlProvider});

    return (
        <IntlProvider messages={{}} locale="en" defaultLocale="en">
            <div className='app'>

                {user && (<Sidebar isNonMobile={isNonMobile} />)}
                <main className='content'>
                    {user && (<Topbar />)}
                    <Outlet />
                </main>
            </div>
        </IntlProvider>
    )
}

export default Layout