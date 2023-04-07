import { useState } from "react"
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import "react-pro-sidebar/dist/css/styles.css"
import { Box, IconButton, Typography, useTheme } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
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

const Sidebar = () => {

    const { user } = useAuthContext()
    const { logout } = useLogout()

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [selected, setSelected] = useState("Dashboard")

    return (
        <Box sx={{
            "& .pro-sidebar-inner": {
                background: `${colors.primary[400]} !important`
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
                            <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                                <Typography variant="h3" color={colors.grey[100]}>
                                    {user?.username.toUpperCase()}
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {/* USER */}
                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img
                                    alt="profile-user"
                                    width="100px"
                                    height="100px"
                                    src={`../../assets/user.png`}
                                    style={{ cursor: "pointer", borderRadius: "50%" }}
                                />
                            </Box>

                            <Box textAlign="center">
                                <Typography variant="h3" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
                                    Lucky Serial
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[500]} >
                                    
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Menu Items */}
                    <Box paddingLeft={isCollapsed ? undefined : "10%"} >
                        <WebItem
                            title="Dashboard"
                            to="/"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            className="hiddenIcon"
                        />
                        <WebItem
                            title="Generate Serial"
                            to="/generateNumber"
                            icon={<ReceiptOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            className="hiddenIcon"
                        />
                        <WebItem
                            title="All Serial Number"
                            to="/allNumber"
                            icon={<FormatListBulletedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            className="hiddenIcon"
                        />
                        <WebItem
                            title="Unclaimed"
                            to="/unusedNumber"
                            icon={<SixteenMpIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            className="hiddenIcon"
                        />
                        <WebItem
                            title="Redeemed"
                            to="/usedNumber"
                            icon={<ContactsOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            className="hiddenIcon"
                        />
                        <WebItem
                            title="Logout"
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