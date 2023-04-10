import { Box, Typography, useTheme, useMediaQuery, Button, TextField } from "@mui/material"
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import { useLogin } from "hooks/useLogin"
import { FormattedMessage } from "react-intl";

const Form = () => {

    const { login, error, isLoading } = useLogin()
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    // const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = async (values) => {
        try {
            await login(values)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesLogin}
            validationSchema={loginSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box className="login-field-component" >
                        <TextField
                            label={<FormattedMessage id="login.username" />}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.username}
                            name="username"
                            error={!!touched.username && !!errors.username}
                            helperText={touched.username && errors.username}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label={<FormattedMessage id="login.password" />}
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </Box>

                    <Box className="login-button-component">
                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="login-field-button"
                        >
                            <FormattedMessage id="login.button" />
                        </Button>                        
                    </Box>
                </form>
            )}
        </Formik>
    )
}

const loginSchema = yup.object().shape({
    username: yup.string().required("required"),
    password: yup.string().required("required")
})

const initialValuesLogin = {
    username: "",
    password: ""
}

export default Form