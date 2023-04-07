import { Box, Typography } from "@mui/material"
import { useLogout } from "hooks/useLogout"
import { Link, useNavigate } from "react-router-dom"
import { MenuItem } from "react-pro-sidebar"
import '../../index.css'
import { useState } from "react"


const WebItem = ({ title, to, icon, selected, setSelected }) => {

    const { logout } = useLogout()

    const Navigate = useNavigate()

    const handleOnClick = () => {
        if (title === "Logout") {
            logout()
            Navigate('/login')
        } else {
            Navigate(to)
            setSelected(title)
        }
    }

    return (
        <Box className="navbaritem">
            <MenuItem
                active={selected === title}
                onClick={handleOnClick}
                icon={icon}
                className="navItem-style"
            >
                <Typography className="nav-wording">
                    {title}
                </Typography>
                {title !== "Logout" && <Link to={to} />}
            </MenuItem>
        </Box>
    )
}

export default WebItem