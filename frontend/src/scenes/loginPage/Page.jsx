import { Box, Typography, useTheme, useMediaQuery } from "@mui/material"
import Form from "./Form"
import { tokens } from "../../theme";
import '../../css/loginPage.css'
import { FormattedMessage } from "react-intl";

const LoginPage = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)")

    return (
        <Box className="container">
            <Box className="title-component" >
                <Typography className="title-text" >
                    <FormattedMessage id="logo.name" />
                </Typography>
            </Box>

            <Box className="login-form-component" >
                <Form />
            </Box>
        </Box>
    )
}

export default LoginPage