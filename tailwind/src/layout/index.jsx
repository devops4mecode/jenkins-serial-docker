import { Outlet } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import Navbar from '../global/Navbar'


const Layout = () => {

    const { user } = useAuthContext()

    return (
        <div className='app'>
            {/* {user && (<Navbar/>)} */}
            <main className='content'>
                {/* {user && (<Topbar />)} */}
                {user && (<Navbar />)}
                <Outlet />
            </main>
        </div>
    )
}

export default Layout