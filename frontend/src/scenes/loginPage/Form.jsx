import { Box, Typography, useTheme, useMediaQuery, Button, TextField } from "@mui/material"
import { useState } from "react";
import { tokens } from "../../theme";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { setLogin } from "state";

const loginSchema = yup.object().shape({
    username: yup.string().required("required"),
    password: yup.string().required("required")
})

const initialValuesLogin = {
    username: "",
    password: ""
}

const Form = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    // const [pageType, setPageType] = useState("login");
    // const { palette } = useTheme();
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    // const isLogin = pageType === "login";

    // const login = async (values, onSubmitProps) => {
    //     const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(values),
    //     });
    //     const loggedIn = await loggedInResponse.json();
    //     onSubmitProps.resetForm();
    //     if (loggedIn) {
    //         dispatch(
    //             setLogin({
    //                 user: loggedIn.user,
    //                 token: loggedIn.token,
    //             })
    //         );
    //         navigate("/home");
    //     }
    // };

    // const handleFormSubmit = async (values, onSubmitProps) => {
    //     if (isLogin) await login(values, onSubmitProps);
    // };

    const handleFormSubmit = (values) => {
        console.log(values)
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
                setFieldValue,
                resetForm,
            }) => (
                <form>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                    >
                        <TextField
                            label="Username"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.username}
                            name="username"
                            error={!!touched.username && !!errors.username}
                            helperText={touched.username && errors.username}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            label="Password"
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

                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                backgroundColor: colors.blueAccent[700],
                                color: `${colors.grey[100]} !important`
                            }}
                        >
                            {"LOGIN"}
                        </Button>
                        <Typography

                            sx={{
                                textDecoration: "underline",
                                color: `${colors.grey[100]} !important`
                            }}
                        >
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default Form