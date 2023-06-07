import axios from 'axios';
import * as React from 'react'
import { useState, useRef, useEffect } from "react";
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link, useNavigate } from "react-router-dom";
import { AppBar, IconButton, Toolbar, useTheme, InputBase, Menu, MenuItem, Box, Typography, useMediaQuery, Select, Button, Divider, Modal, TableContainer } from "@mui/material";
import { Menu as MenuIcon, Search, Settings } from "@mui/icons-material";
import searchIcon from "../../assets/search.png"
import translateIcon from '../../assets/translate.png'
import hamburgerIcon from '../../assets/hamburger.png'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { FormattedMessage, useIntl } from "react-intl";
import '../../css/global.css'
import '../../css/searchDialog.css'
import CloseIcon from '@mui/icons-material/Close';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';



const Navbar = ({ isSidebarOpen, setIsSidebarOpen, currentLocale, handleChange }) => {
    const intl = useIntl()

    const isNonMediumScreen = useMediaQuery("(min-width: 1024px)")

    const { user } = useAuthContext()
    const [searchValue, setSearchValue] = useState('')
    const [data, setData] = useState(null)
    const [open, setOpen] = useState(false)

    // for search
    const handleSearch = async (searchValue) => {
        const trimSerial = searchValue.replace(/-/g, "")
        try {
            const { data } = await axios.get(`api/serials/detail?serialNo=${trimSerial}`, {
                headers: { 'Authorization': `Bearer ${user.accessToken}` }
            })
            setData(data)
            setOpen(true)
            console.log(data)
        } catch (error) {
            console.error(error)
        }
        setSearchValue('')
    }

    const handleClose = () => {
        setOpen(false)
        setData(null)
    }

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
                        onClick={() => handleSearch(searchValue)}
                    >
                        <img src={searchIcon} alt="search" style={{ width: '1.2rem' }} />
                    </IconButton>
                    <InputBase
                        placeholder={intl.formatMessage({ id: 'search' })}
                        inputProps={{ style: { color: "#88898C" } }}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </Box>

                {/* modal for search */}
                <Box>
                    <Modal open={open} onClose={handleClose}>
                        {data ? (
                            <Box className="search-dialog-box">
                                <Box className='searchBox-header'>
                                    <Box flexGrow={1} paddingLeft="40px" paddingBottom="15px" paddingTop="15px">
                                        <Typography className='header-text'>Serial Number: </Typography>
                                    </Box>
                                    <IconButton>
                                        <CloseIcon onClick={handleClose} />
                                    </IconButton>
                                </Box>

                                <Box className='search-details'>
                                    <TableContainer>
                                        <Table>
                                            <TableBody>
                                                <TableRow className="borderedRow">
                                                    <TableCell className="tableCellWithBorder">
                                                        <FormattedMessage id='generate.buyer' />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography className='searchValue'>{data.remarkName}</Typography>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow className="borderedRow">
                                                    <TableCell className="tableCellWithBorder">
                                                        <FormattedMessage id='serial.credit' />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography className='searchValue'>RM {data.givenCredit.toFixed(2)}</Typography>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow className="borderedRow">
                                                    <TableCell className="tableCellWithBorder">
                                                        <FormattedMessage id='serial.purchase.date' />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography className='searchValue'>{new Date(data.createdAt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</Typography>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow className="borderedRow">
                                                    <TableCell className="tableCellWithBorder">
                                                        <FormattedMessage id='serial.status' />
                                                    </TableCell>
                                                    <TableCell>
                                                        {data.serialStatus ? (
                                                            <Typography className='searchValue' style={{ color: 'green' }}><FormattedMessage id='unclaimed' /></Typography>
                                                        ) : (
                                                            <Typography className='searchValue' style={{ color: 'red' }}><FormattedMessage id='redeemed' /></Typography>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                                {!data.serialStatus && (
                                                    <TableRow className="borderedRow">
                                                        <TableCell className="tableCellWithBorder">
                                                            <FormattedMessage id='redeemed.account' />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography className='searchValue'>{data.redemptionAcc}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}

                                                {data.serialStatus === false && (
                                                    <TableRow className="borderedRow">
                                                        <TableCell className="tableCellWithBorder">
                                                            <FormattedMessage id='redeemed.date' />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography className='searchValue'>{new Date(data.updatedAt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>

                                <Box className='ok-box'>
                                    <Button variant='contained' className='ok-button' onClick={handleClose}>
                                        ok
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box className="search-dialog-box">
                                <Box className='searchBox-header'>
                                    <Box flexGrow={1} paddingLeft="40px" paddingBottom="15px" paddingTop="15px">
                                        <Typography className='header-text'>Serial Number: </Typography>
                                    </Box>
                                    <IconButton>
                                        <CloseIcon onClick={handleClose} />
                                    </IconButton>
                                </Box>

                                <Box className='no-search-details'>
                                    <FormattedMessage id='no.such.record' />
                                </Box>

                                <Box className='no-ok-box'>
                                    <Button variant='contained' className='ok-button' onClick={handleClose}>
                                        ok
                                    </Button>
                                </Box>

                            </Box>
                        )}
                    </Modal>
                </Box>

                <LanguageDropdown />
            </Box>
        </Toolbar>
    </AppBar>
}

export default Navbar