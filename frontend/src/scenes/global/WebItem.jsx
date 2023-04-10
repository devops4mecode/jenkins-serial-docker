import { Box, Typography } from "@mui/material"
import { useLogout } from "hooks/useLogout"
import { Link, useNavigate } from "react-router-dom"
import { MenuItem } from "react-pro-sidebar"
import '../../index.css'
import { useState } from "react"
import { useIntl } from 'react-intl'




const WebItem = ({ title, to, icon, selected, setSelected }) => {
    
    const Navigate = useNavigate()
    const { logout } = useLogout()
    
    const intl = useIntl()

    const handleOnClick = () => {
        

        if (title.props.id === "logout.button" || title === "Logout") {
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
                {title.props.id !== "logout.button" && <Link to={to} />}
            </MenuItem>
        </Box>
    )
}

export default WebItem