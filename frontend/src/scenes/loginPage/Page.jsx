import { Box, Typography, useTheme, useMediaQuery } from "@mui/material"
import Form from "./Form"
import '../../css/loginPage.css'
import { FormattedMessage } from "react-intl";


const LoginPage = () => {

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