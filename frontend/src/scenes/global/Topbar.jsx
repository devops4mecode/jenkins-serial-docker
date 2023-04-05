import { Box, IconButton, useTheme, Modal, Typography } from "@mui/material"
import { useContext } from "react"
import { ColorModeContext, tokens } from "../../theme"
import InputBase from "@mui/material/InputBase"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import SearchIcon from "@mui/icons-material/Search"
import { useState } from "react"
import { useAuthContext } from "hooks/useAuthContext"
import axios from "axios"
import { Menu, MenuItem } from "react-pro-sidebar"
import { useLogout } from "hooks/useLogout"
import { Link, useNavigate } from "react-router-dom"



const Item = ({ title, to, icon, selected, setSelected, className }) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
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
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100]
            }}
            onClick={handleOnClick}
            icon={icon}
            className={className}
        >
            <Typography>{title}</Typography>
            {title !== "Logout" && <Link to={to} />}
        </MenuItem>
    )
}

const Topbar = () => {
    const { user } = useAuthContext()
    //use the theme set up in theme.js
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const colorMode = useContext(ColorModeContext)

    const [searchValue, setSearchValue] = useState('')

    const [open, setOpen] = useState(false)
    const [data, setData] = useState(null)

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

    const handleClose = () => {
        setOpen(false)
        setData(null)
    }

    return (<Box display="flex" justifyContent="space-between" p={2}>

        {/* Menu Button */}
        <MenuOutlinedIcon></MenuOutlinedIcon>



        {/* Search Bar */}
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
            <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            <IconButton type="button" sx={{ p: 1 }} onClick={() => handleSearch(searchValue)}>
                <SearchIcon />
            </IconButton>
        </Box>

        <Modal open={open} onClose={handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: '50vw' }}>
                {data ? (
                    <Box sx={{ pl: '30%' }}>
                        <Typography variant="h5">
                            Serial Number: {data.serialNo}
                        </Typography>
                        <Typography variant="h5">
                            Buyer: {data.remarkName}
                        </Typography>
                        <Typography variant="h5">
                            Credit: {data.givenCredit}
                        </Typography>
                        <Typography variant="h5">
                            Purchase Date: {new Date(data.createdAt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}
                        </Typography>
                        {data.serialStatus ? (
                            <Typography variant="h5">
                                Status: <span style={{ color: colors.greenAccent[300] }}>UNCLAIMED</span>
                            </Typography>
                        ) : (
                            <Typography variant="h5">
                                Status: <span style={{ color: 'red' }}>REDEEMED</span>
                            </Typography>
                        )}
                        {!data.serialStatus && (
                            <Typography variant="h5">
                                Redemption Account: {data.redemptionAcc}
                            </Typography>
                        )}
                        {data.serialStatus === false && (
                            <Typography variant="h5">
                                Redemption Date: {new Date(data.updatedAt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}
                            </Typography>
                        )}


                    </Box>
                ) : (
                    <Typography variant="h5">Entry doesnt exist</Typography>
                )}
            </Box>
        </Modal>


        {/* Icons */}
        <Box display="flex">
            <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? (
                    <DarkModeOutlinedIcon />
                ) : (
                    <LightModeOutlinedIcon />
                )}
            </IconButton>
        </Box>

    </Box>)
}

export default Topbar;