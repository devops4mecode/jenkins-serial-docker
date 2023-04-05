import React, { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout"
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const { user } = useAuthContext()
    const { logout } = useLogout()
    const Navigate = useNavigate()

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const [nav, setNav] = useState(false)
    const handleClick = () => setNav(!nav)

    const handleLogoutClick = () => {
        logout()
        Navigate('/login')
    }

    return (
        <div className='w-screen h-[80px] z-10 bg-zinc-200 fixed drop-shadow-lg'>
            <div className="px-2 flex justify-between items-center w-full h-full">
                <div className="md:hidden" onClick={handleClick}>
                    {!nav ? <MenuIcon className="w-5" /> : <CloseIcon className="w-5" />}

                </div>

                <div className="flex items-center">
                    <h1 className="text-3xl font-bold mr-4 sm:text-4xl"> Lucky Serial </h1>

                    <ul className="hidden md:flex">
                        <li>
                            <a color={colors.greenAccent[200]} href="/">Dashboard</a>
                        </li>
                        <li>
                            <a class="text-blue-500 hover:text-blue-800" href="/GenerateNumber">Generate Number</a>
                        </li>
                        <li>
                            <a class="text-blue-500 hover:text-blue-800" href="/AllNumber">All Number</a>
                        </li>
                        <li>
                            <a class="text-blue-500 hover:text-blue-800" href="/UsedNumber">Redeemed Number</a>
                        </li>
                        <li>
                            <a class="text-blue-500 hover:text-blue-800" href="/UnusedNumber">Unclaimed Number</a>
                        </li>
                    </ul>

                </div>

                <div className="hidden md:flex pr-4">
                    <button className="px-5 py-1" onClick={handleLogoutClick}>
                        Logout
                    </button>
                </div>


            </div>

            <ul className={!nav ? 'hidden' : 'absolute bg-zinc-200 w-full px-8'}>
                <li className="border-b-2 border-zinc-300 w-full">
                    <a color={colors.greenAccent[200]} href="/">Dashboard</a>
                </li>
                <li className="border-b-2 border-zinc-300 w-full">
                    <a class="text-blue-500 hover:text-blue-800" href="/GenerateNumber">Generate Number</a>
                </li>
                <li className="border-b-2 border-zinc-300 w-full">
                    <a class="text-blue-500 hover:text-blue-800" href="/AllNumber">All Number</a>
                </li>
                <li className="border-b-2 border-zinc-300 w-full">
                    <a class="text-blue-500 hover:text-blue-800" href="/UsedNumber">Redeemed Number</a>
                </li>
                <li className="border-b-2 border-zinc-300 w-full">
                    <a class="text-blue-500 hover:text-blue-800" href="/UnusedNumber">Unclaimed Number</a>
                </li>
                <div className="flex flex-col my-4">
                    <button className="bg-transparent text-indigo-600 px-8 py-3 mb-4" onClick={handleLogoutClick}>
                        Logout
                    </button>
                </div>
            </ul>

        </div>
    )
}

export default Navbar