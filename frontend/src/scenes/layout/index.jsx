import { Outlet } from 'react-router-dom'
import Sidebar from 'scenes/global/Sidebar'
import Topbar from 'scenes/global/Topbar'
import { useMediaQuery } from '@mui/material'
import { useAuthContext } from 'hooks/useAuthContext'

const Layout = () => {

    const { user } = useAuthContext()

    const isNonMobile = useMediaQuery("(min-width: 600px)")

    return (
        <div className='app'>
            {user && (<Sidebar isNonMobile={isNonMobile} />)}
            <main className='content'>
                {user && (<Topbar />)}
                <Outlet />
            </main>
        </div>
    )
}

export default Layout