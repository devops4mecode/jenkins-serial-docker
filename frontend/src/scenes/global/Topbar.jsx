import { Box, IconButton, useTheme, Modal, Typography } from "@mui/material"
import { useContext } from "react"
import { ColorModeContext, tokens } from "../../theme"
import InputBase from "@mui/material/InputBase"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import SearchIcon from "@mui/icons-material/Search"
import { useState } from "react"
import { useAuthContext } from "hooks/useAuthContext"
import axios from "axios"

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
                    <Typography variant="body1">{JSON.stringify(data)}</Typography>
                ) : (
                    <Typography variant="body1">fetch bu dao...</Typography>
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