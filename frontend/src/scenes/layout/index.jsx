import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from 'scenes/global/Sidebar'
import Topbar from 'scenes/global/Topbar'
import { useGetUserQuery } from 'state/api'
import { useMediaQuery } from '@mui/material'

const Layout = () => {
    const isNonMobile = useMediaQuery("(min-width: 600px)")
    const userId = useSelector((state) => state.global.userId)
    const { data } = useGetUserQuery(userId)

    return (
        <div className='app'>
            <Sidebar
                isNonMobile={isNonMobile}
            />
            <main className='content'>
                <Topbar />
                <Outlet />
            </main>
        </div>
    )
}

export default Layout