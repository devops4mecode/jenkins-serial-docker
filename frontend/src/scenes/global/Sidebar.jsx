import { useState } from "react"
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import "react-pro-sidebar/dist/css/styles.css"
import { Box, IconButton, Typography, useTheme } from "@mui/material"
import { FormattedMessage } from "react-intl"
import { tokens } from "../../theme"
import { useLogout } from "hooks/useLogout"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import SixteenMpIcon from '@mui/icons-material/SixteenMp';
import LogoutIcon from '@mui/icons-material/Logout'
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useAuthContext } from "hooks/useAuthContext"
import '../../index.css'
import WebItem from "./WebItem"
import logo from '../../assets/logo.png'


const Sidebar = () => {

    const { user } = useAuthContext()
    const { logout } = useLogout()

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [selected, setSelected] = useState("Dashboard")

    return (
        <Box sx={{
            width: "370px",
            "& .pro-sidebar-inner": {
                background: `${colors.primary[400]} !important`,
                width: '310px'
            },
            "& .pro-icon-wrapper": {
                backgroundColor: "transparent !important"
            },
            "& .pro-inner-item": {
                padding: "5px 35px 5px 20px !important"
            },
            "& .pro-inner-item:hover": {
                color: "#868dfb !important"
            },
            "& .pro-menu-item.active": {
                color: "#6870fa !important"
            },
            [theme.breakpoints.down("lg")]: {
                display: "none"
            },
            [theme.breakpoints.down("xl")]: {
                width: "410px !important"
            }
        }}>
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                            color: colors.grey[100]
                        }}
                    >
                        {!isCollapsed && (
                            <Box display="flex" justifyContent="space-between" alignItems="center" ml="7px">
                                <a href="/">
                                    <img src={logo} alt="logo" style={{width: '50px', height: '50px'}} />
                                </a>
                                <Typography variant="h3" color={colors.grey[100]}>
                                    {<FormattedMessage id="logo.name" />}
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {/* Menu Items */}
                    <Box paddingLeft={isCollapsed ? undefined : "10%"} >
                        <WebItem
                            title={<FormattedMessage id="dashboard" />}
                            to="/"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            className="hiddenIcon"
                        />
                        <WebItem
                            title={<FormattedMessage id="generate.serial" />}
                            to="/generateNumber"
                            icon={<ReceiptOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            className="hiddenIcon"
                        />
                        <WebItem
                            title={<FormattedMessage id="all.serial" />}
                            to="/allNumber"
                            icon={<FormatListBulletedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            className="hiddenIcon"
                        />
                        <WebItem
                            title={<FormattedMessage id="valid.serials" />}
                            to="/unusedNumber"
                            icon={<SixteenMpIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            className="hiddenIcon"
                        />
                        <WebItem
                            title={<FormattedMessage id="invalid.serials" />}
                            to="/usedNumber"
                            icon={<ContactsOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            className="hiddenIcon"
                        />
                        <WebItem
                            title={<FormattedMessage id="logout.button" />}
                            icon={<LogoutIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            className="hiddenIcon"
                            logout={logout}
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    )
}

export default Sidebar