import { useLogout } from "hooks/useLogout"
import { MenuItem } from "react-pro-sidebar"
import { Box, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import '../../index.css'


const WebItem = ({ title, to, icon, selected, setSelected }) => {

    const Navigate = useNavigate()
    const { logout } = useLogout()

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