import * as React from 'react'
import { useState, useRef, useEffect } from "react";
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link, useNavigate } from "react-router-dom";
import { AppBar, IconButton, Toolbar, useTheme, InputBase, Menu, MenuItem, Box, Typography, useMediaQuery, Select, Button, Divider } from "@mui/material";
import { Menu as MenuIcon, Search, Settings } from "@mui/icons-material";
import searchIcon from "../../assets/search.png"
import translateIcon from '../../assets/translate.png'
import hamburgerIcon from '../../assets/hamburger.png'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { FormattedMessage, useIntl } from "react-intl";
import '../../css/global.css'




const Navbar = ({ isSidebarOpen, setIsSidebarOpen, currentLocale, handleChange }) => {
    const intl = useIntl()

    const isNonMediumScreen = useMediaQuery("(min-width: 1024px)")

    const LanguageDropdown = () => {
        const ref = useRef(null)
        const [anchorEl, setAnchorEl] = useState(null)
        const [isOpen, setIsOpen] = useState(false)

        const languageButtonStyle = {
            // flexGrow: 1,
            backgroundColor: '#92adf0',
            color: 'white'
        }

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget)
            setIsOpen(!isOpen)
        }

        const handleClose = () => {
            setAnchorEl(null)
            setIsOpen(false)
        }

        useEffect(() => {
            const handleOutsideClick = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    handleClose()
                }
            }

            document.addEventListener("mousedown", handleOutsideClick)

            return () => {
                document.removeEventListener("mousedown", handleOutsideClick)
            }
        }, [ref])


        return (
            <Box className='flexBetween' ref={ref} gap="1.5rem">
                <Box
                    className='flexBetween'
                    backgroundColor="#ffffff"
                    borderRadius="9px"
                    gap="1.5rem"
                    p={isNonMediumScreen ? "0.5rem " : "0.3rem"}
                >
                    {isNonMediumScreen ? (
                        <Box className='flexBetween' onClick={handleClick}>
                            <img src={translateIcon} alt="translate" style={{ width: '1.2rem', marginRight: '0.5rem' }} />
                            <Box className='flexBetween' style={{ width: '2rem', justifyContent: 'center' }}>
                                {isOpen ? <KeyboardArrowUpIcon style={{ color: '#707070' }} onClick={() => handleClick()} /> : <KeyboardArrowDownIcon style={{ color: '#707070' }} onClick={() => handleClose()} />}
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            className='flexBetween' onClick={handleClick}>
                            <Box>
                                <img src={translateIcon} alt="translate" style={{ width: '1.2rem', marginRight: '0.5rem' }} />
                            </Box>
                            <Box>
                                {isOpen ? <KeyboardArrowUpIcon style={{ color: '#707070' }} onClick={() => handleClick()} /> : <KeyboardArrowDownIcon style={{ color: '#707070' }} onClick={() => handleClose()} />}
                            </Box>
                        </Box>
                    )}

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <Box className='flexBetween' flexDirection='column' >
                            <Button
                                style={currentLocale === 'en' ? languageButtonStyle : { ...languageButtonStyle, backgroundColor: '#ffffff', cursor: 'not-allowed', color: 'black' }}
                                onClick={(e) => handleChange(e.target.value)}
                                disabled={currentLocale === 'en'}
                                value="en"
                            >
                                En
                            </Button>
                            <Button
                                style={currentLocale === 'zh' ? languageButtonStyle : { ...languageButtonStyle, backgroundColor: '#ffffff', cursor: 'not-allowed', color: 'black' }}
                                onClick={(e) => handleChange(e.target.value)}
                                disabled={currentLocale === 'zh'}
                                value="zh"
                            >
                                Zh
                            </Button>
                            <Button
                                style={currentLocale === 'ms' ? languageButtonStyle : { ...languageButtonStyle, backgroundColor: '#ffffff', cursor: 'not-allowed', color: 'black' }}
                                onClick={(e) => handleChange(e.target.value)}
                                disabled={currentLocale === 'ms'}
                                value="ms"
                            >
                                Ms
                            </Button>
                        </Box>
                    </Menu>
                </Box>
            </Box>
        )
    }


    return <AppBar
        sx={{
            position: "fixed",
            width: "100%",
            boxShadow: "none",
            backgroundColor: "#6200EE15",
            p: "0.5rem"
        }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* left side */}
            <Box className='flexBetween' sx={{ marginLeft: isNonMediumScreen && isSidebarOpen ? '233px' : '0' }}>

                {/* open close sidebar */}
                {/* <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <MenuIcon style={{ color: '#ffffff' }} />
                </IconButton> */}

                <Typography>
                    <img src={hamburgerIcon} alt="hamburger" style={{ width: "20px", height: "20px" }} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                </Typography>

                <Box className='flexBetween' color="#4385EA">
                    <Box display="flex" alignItems="center" gap="0.5rem">
                        <Typography variant='h4' fontWeight="bold">
                        </Typography>
                    </Box>
                </Box>

            </Box>


            {/* right side */}
            <Box className='flexBetween' gap="1rem" >

                {/* search */}
                <Box
                    className='flexBetween'
                    backgroundColor="#ffffff"
                    borderRadius="9px"
                    gap={isNonMediumScreen ? "0.5rem" : "0"}
                    p={isNonMediumScreen ? "0.1rem 1.5rem" : "0 0rem"}       //top&bottom, left&right
                >
                    <IconButton
                        type='button'
                    // onClick={handleSearch}
                    >
                        <img src={searchIcon} alt="search" style={{ width: '1.2rem' }} />
                    </IconButton>
                    <InputBase
                        placeholder={intl.formatMessage({ id: 'search' })}
                        inputProps={{ style: { color: "#88898C" } }}
                    // value={searchValue}
                    // onChange={(e) => setSearchValue(e.target.value)}
                    />
                </Box>

                <LanguageDropdown />
            </Box>
        </Toolbar>
    </AppBar>
}

export default Navbar