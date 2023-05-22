import { Box, Typography, useTheme, useMediaQuery } from "@mui/material"
import LoginForm from "./LoginForm"
import '../../css/loginPage.css'
import { FormattedMessage } from "react-intl";


const LoginPage = () => {

    return (
        <Box className="container">
            <Box className="title-component" >
                <Typography className="title-text" >
                    <FormattedMessage id="lucky.serial" />
                </Typography>
            </Box>

            <Box className="login-form-component" >
                <LoginForm />
            </Box>
        </Box>
    )
}

export default LoginPage