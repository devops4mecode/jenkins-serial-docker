import { useLogout } from "hooks/useLogout"
import { Box, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { MenuItem } from "react-pro-sidebar"
import '../../index.css'



const MobileItem = ({ title, to, icon, selected, setSelected, toggleNav }) => {

    const { logout } = useLogout()

    const Navigate = useNavigate()

    const handleOnClick = () => {
        if (title.props.id === "logout.button" || title === "Logout") {
            logout()
            Navigate('/login')
        } else {
            Navigate(to)
            setSelected(title)
            toggleNav()
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

export default MobileItem