import React from "react"
import axios from "axios"
import { LOCALES } from "../../i18n/locales"
import { useContext, useState, useEffect } from "react"
import { useAuthContext } from "hooks/useAuthContext"
import { useLogout } from "hooks/useLogout"
import { FormattedMessage, useIntl } from "react-intl"
import { Box, IconButton, useTheme, Modal, Typography, Select, MenuItem } from "@mui/material"
import { tokens } from "../../theme"
import InputBase from "@mui/material/InputBase"
import LogoutIcon from '@mui/icons-material/Logout'
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from "@mui/icons-material/Search"
import RedeemIcon from '@mui/icons-material/Redeem';
import LanguageIcon from '@mui/icons-material/Language';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import MobileItem from "./Item"
import logo from '../../assets/logo.png'
import '../../index.css'


const languages = [
    { name: "EN", code: LOCALES.ENGLISH },
    { name: "中文", code: LOCALES.CHINESE },
    { name: "Malay", code: LOCALES.MALAY },
]

const Topbar = (props) => {

    console.log("props.currentLocale is")
    console.log(props.currentLocale)

    //use the theme set up in theme.js
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const { user } = useAuthContext()

    const intl = useIntl();

    // for search 
    const [searchValue, setSearchValue] = useState('')
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(null)


    // for navbar 
    const [nav, setNav] = useState(false)
    const handleClick = () => setNav(!nav)
    const [selected, setSelected] = useState("Dashboard")
    const { logout } = useLogout()
    const toggleNav = () => {
        setNav(!nav)
    }


    // for search
    const handleSearch = async (searchValue) => {
        setOpen(true)
        try {
            const response = await axios.get(`api/serials/detail?serialNo=${searchValue}`, {
                headers: { 'Authorization': `Bearer ${user.accessToken}` }
            })

            const fetchData = await response.data
            setData(fetchData)
            console.log(fetchData)
        } catch (error) {
            console.error(error)
        }
        setSearchValue('')
    }

    // for search result dialog box
    const handleClose = () => {
        setOpen(false)
        setData(null)
    }


    useEffect(() => {
        const handleOutsideClick = (event) => {
            // check if the clicked element is inside the navbar
            if (event.target.closest(".navbar-menuitem")) {
                return;
            }
            // if clicked outside the navbar, close it
            setNav(false);
        };
        // add event listener to document object
        document.addEventListener("mousedown", handleOutsideClick);
        // cleanup function to remove the event listener
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [nav]);



    return (
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"

                p={2}
                sx={{
                    alignItems: "center",
                    background: `${colors.purple[100]} !important`
                }}
            >

                {/* left side navbar */}
                <Box display="flex" sx={{ alignItems: 'center' }}>
                    {/* Menu Button */}
                    <Box
                        sx={{
                            [theme.breakpoints.up("lg")]: {
                                display: "none"
                            },
                        }}
                        onClick={handleClick}>

                        {!nav ? <MenuOutlinedIcon /> : <CloseIcon />}
                    </Box>

                    {/* logo */}
                    <Box display="flex" paddingLeft='5px'>
                        <a href="/">
                            <img src={logo} alt="logo" style={{ width: '50px', height: '50px' }} />
                        </a>
                    </Box>
                </Box>

                {/* right side navbar */}
                <Box
                    display="flex"
                    sx={{
                        alignItems: 'center',
                        justifyContent: { xs: 'flex-end', sm: 'auto' }
                    }}
                >
                    <Box
                        display="flex"
                        paddingRight='5px'
                        sx={{
                            [theme.breakpoints.up("lg")]: {
                                display: "none"
                            },
                        }}>

                        <Box>
                            {/* <LanguageIcon id="language-dropdown" /> */}
                            <Select
                                value={props.currentLocale}
                                onChange={props.handleChange}
                                style={{
                                    border: '1px solid white',
                                    color: 'white',
                                    fontSize: '12px',
                                    height: '40px'
                                }}
                            >
                                {languages.map(({ name, code }) => (
                                    <MenuItem key={code} value={code}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>

                    </Box>

                    {/* Search Bar */}
                    <Box
                        sx={{
                            display: 'flex',
                            bgcolor: '#f2f0f0',
                            borderRadius: '3px',
                            width: { xs: '40%', sm: 'auto' },
                        }}
                    >
                        <InputBase
                            sx={{ ml: 2, flex: 1 }}
                            placeholder={intl.formatMessage({ id: 'search.button.text' })}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <IconButton
                            type="button"
                            sx={{ p: 1 }}
                            onClick={() => handleSearch(searchValue)}>
                            <SearchIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Modal open={open} onClose={handleClose}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: '50vw' }}>
                        {data ? (
                            <Box sx={{ pl: '30%' }}>
                                <Typography variant="h5">
                                    <FormattedMessage id="serial.number" /> : {data.serialNo}
                                </Typography>
                                <Typography variant="h5">
                                    <FormattedMessage id="serial.buyer" /> : {data.remarkName}
                                </Typography>
                                <Typography variant="h5">
                                    <FormattedMessage id="serial.credit" /> : RM{data.givenCredit.toFixed(2)}
                                </Typography>
                                <Typography variant="h5">
                                    <FormattedMessage id="serial.purchase.date" /> : {new Date(data.createdAt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}
                                </Typography>
                                {data.serialStatus ? (
                                    <Typography variant="h5">
                                        <FormattedMessage id="serial.status" />: <span style={{ color: colors.greenAccent[300] }}>UNCLAIMED</span>
                                    </Typography>
                                ) : (
                                    <Typography variant="h5">
                                        <FormattedMessage id="serial.status" />: <span style={{ color: 'red' }}>REDEEMED</span>
                                    </Typography>
                                )}
                                {!data.serialStatus && (
                                    <Typography variant="h5">
                                        <FormattedMessage id="serial.redemption.acc" /> : {data.redemptionAcc}
                                    </Typography>
                                )}
                                {data.serialStatus === false && (
                                    <Typography variant="h5">
                                        <FormattedMessage id="serial.redemption.date" />: {new Date(data.updatedAt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}
                                    </Typography>
                                )}


                            </Box>
                        ) : (
                            <Typography variant="h5"><FormattedMessage id="no.serial" /></Typography>
                        )}
                    </Box>
                </Modal>
            </Box>

            <Box
                sx={{
                    display: nav ? 'block' : 'none',
                }}
                className="navbar-menuitem"
            >
                <MobileItem
                    title={<FormattedMessage id="dashboard" />}
                    to="/"
                    icon={<WidgetsOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    toggleNav={toggleNav}
                />
                <MobileItem
                    title={<FormattedMessage id="generate.serial" />}
                    to="/generateNumber"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    toggleNav={toggleNav}
                />
                <MobileItem
                    title={<FormattedMessage id="all.serial" />}
                    to="/allNumber"
                    icon={<FormatListBulletedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    toggleNav={toggleNav}
                />
                <MobileItem
                    title={<FormattedMessage id="valid.serials" />}
                    to="/unusedNumber"
                    icon={<RedeemIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    toggleNav={toggleNav}
                />
                <MobileItem
                    title={<FormattedMessage id="invalid.serials" />}
                    to="/usedNumber"
                    icon={<ContactsOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    toggleNav={toggleNav}
                />
                <MobileItem
                    title={<FormattedMessage id="logout.button" />}
                    icon={<LogoutIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    toggleNav={toggleNav}
                    logout={logout}
                />
            </Box>

        </Box>


    )
}

export default Topbar;