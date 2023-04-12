import * as yup from "yup";
import { useLogin } from "hooks/useLogin"
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material"
import { Formik } from "formik";
import { FormattedMessage } from "react-intl";
import { useState } from "react";


const Form = () => {

    const { login, isLoading } = useLogin()
    const [error, setError] = useState(null)

    const handleFormSubmit = async (values) => {
        try {
            await login(values)
        } catch (error) {
            setError(error.message);
        }
    }

    const handleCloseErrorDialog = () => {
        setError(null)
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

                    <Dialog open={Boolean(error)} onClose={handleCloseErrorDialog}>
                        <DialogTitle>
                            Error
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                These credentials do not match our records.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseErrorDialog}>ok</Button>
                        </DialogActions>
                    </Dialog>
                </form>
            )}
        </Formik>
    )
}

const loginSchema = yup.object().shape({
    username: yup.string().required(<FormattedMessage id="login.username.error" />),
    password: yup.string().required(<FormattedMessage id="login.password.error" />)
})

const initialValuesLogin = {
    username: "",
    password: ""
}

export default Form