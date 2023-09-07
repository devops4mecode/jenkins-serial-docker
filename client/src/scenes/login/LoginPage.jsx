import LoginForm from "./LoginForm"
import { FormattedMessage } from "react-intl";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material"
import '../../css/loginPage.css'


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