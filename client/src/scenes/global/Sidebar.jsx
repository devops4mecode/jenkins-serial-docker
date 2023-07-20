import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, SwipeableDrawer, Typography, useMediaQuery, useTheme } from '@mui/material'
import * as React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import dashboardIcon from "../../assets/dashboard.png"
import generateIcon from '../../assets/generate-serial.png'
import allIcon from '../../assets/all-serial.png'
import unclaimedIcon from '../../assets/claimed-serial.png'
import claimedIcon from '../../assets/unclaimed.png'
import logoutIcon from '../../assets/logout.png'
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import { FormattedMessage } from 'react-intl';
import '../../css/global.css'
import Logo from '../../assets/logo.png'
import { useLogout } from '../../hooks/useLogout';
const Sidebar = ({
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile,
}) => {
    const sidebarRef = useRef(null);
    const { pathname } = useLocation()
    const [active, setActive] = useState("")
    const navigate = useNavigate()
    const theme = useTheme()
    const { logout } = useLogout()
    const handleLogout = () => {
        logout()
        navigate('/login')
    }
    useEffect(() => {
        setActive(pathname.substring(1))
    }, [pathname]);
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!isNonMobile && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isNonMobile, setIsSidebarOpen]);
    useEffect(() => {
        if (isNonMobile) {
            setIsSidebarOpen(true);
        }
    }, [isNonMobile, setIsSidebarOpen]);
    const handleOpenClose = () => {
        if (!isNonMobile) {
            setIsSidebarOpen(false)
        }
    }
    const navItems = [
        {
            text: "Dashboard",
            translationKey: "dashboardNav",
            image: <img src={dashboardIcon} alt="dashboard" width="25" height="25" />
        },
        {
            text: "Generate Serial",
            translationKey: "generateSerialNav",
            image: <img src={generateIcon} alt="receipt" width="25" height="25" />
        },
        {
            text: "All Serial",
            translationKey: "allSerialNav",
            image: <img src={allIcon} alt="numbers" width="25" height="25" />
        },
        {
            text: "Active Serial",
            translationKey: "unclaimedSerialNav",
            image: <img src={unclaimedIcon} alt="report" width="25" height="25" />
        },
        {
            text: "Redeemed Serial",
            translationKey: "claimedSerialNav",
            image: <img src={claimedIcon} alt="user" width="25" height="25" />
        },
        {
            text: "Logout",
            translationKey: "logoutNav",
            image: <img src={logoutIcon} alt="setting" width="25" height="25" />,
        }
    ]
    const DrawerContent = () => {
        return (
            <Box>
                <List>
                    {navItems.map(({ text, image, translationKey, onClick }) => {
                        if (!image) {
                            return (
                                <Typography key={text}>
                                    {text}
                                </Typography>
                            )
                        }
                        const lcText = text.toLowerCase().replace(/\s+/g, '')
                        return (
                            <ListItem key={text} disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        if (onClick) {
                                            onClick(); // Call the onClick handler (logout function)
                                        }
                                        if (lcText === 'logout') {
                                            handleLogout()
                                        } else {
                                            navigate(`/${lcText}`);
                                        }
                                        setActive(lcText)
                                    }}
                                    style={{
                                        fontSize: '1rem',
                                        backgroundColor: active === lcText ? "#ffffff" : "transparent",
                                        color: active === lcText ? 'black' : "#474747",
                                        borderRadius: active === lcText ? '0.55rem' : 'none',
                                        margin: "0.3rem 1rem"
                                    }}
                                >
                                    {image}
                                    <ListItemText primary={<FormattedMessage id={translationKey} />} style={{ marginLeft: '1rem', fontSize: '12px' }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Box>
        )
    }
    return (
        <Box component="nav">
            {isSidebarOpen && (
                <Drawer
                    open={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onClick={handleOpenClose}
                    variant="permanent"
                    anchor='left'
                    ref={sidebarRef}
                    sx={{
                        width: drawerWidth,
                        "& .MuiDrawer-paper": {
                            color: theme.palette.secondary[200],
                            backgroundColor: "#fafafa",
                            boxSizing: "border-box",
                            borderWidth: isNonMobile ? 0 : "2px",
                            width: drawerWidth,
                            flexShrink: 0,
                        },
                        "& .MuiTypography-root": {
                            fontSize: '14px'
                        }
                    }}
                >
                    <Box width="100%">
                        <Box m="1.5rem 2rem 1rem 2rem" >
                            <Box color="#4385EA">
                                {!isNonMobile && (
                                    <Box className='flexBetween' gap="0.5rem">
                                        <Typography>
                                            <img src={Logo} alt="Logo" style={{ width: "50px", height: "50px" }} onClick={() => { navigate(`/dashboard`) }} />
                                        </Typography>
                                        <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                            <ChevronLeftOutlinedIcon />
                                        </IconButton>
                                    </Box>
                                )}
                                {isNonMobile && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography>
                                            <img src={Logo} alt="Logo" style={{ width: "50px", height: "50px" }} onClick={() => { navigate(`/dashboard`) }} />
                                        </Typography>
                                        <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                            <ChevronLeftOutlinedIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <DrawerContent />
                    </Box>
                </Drawer>
            )}
        </Box>
    )
}
export default Sidebar