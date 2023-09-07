import { Box, TextField, Button, useMediaQuery, FormLabel } from "@mui/material";
import Header from "../../components/Header";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import '../../css/changePassword.css';
import { useState } from "react";
import { FormattedMessage } from "react-intl";

// Testing New
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";

const ChangePassword = () => {

    const { user } = useAuthContext()

    const isNonMediumScreen = useMediaQuery("(min-width: 1200px)")
    const isLaptop = useMediaQuery("(min-width: 768px)")
    const [success, setSuccess] = useState(null)

    const Navigate = useNavigate()

    const handleSave = async (values) => {
        try {
            const { data } = await axios.patch(`/api/users/update`, values, {
                headers: { 'Authorization': `Bearer ${user.accessToken}` }
            })
            // Navigate('/successchangepassword')
            console.log(data)
            console.log('success')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box m="1.5rem 1.5rem">
            <Header title={<FormattedMessage id="change.password" />} />

            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="160px"
                gap="20px"
                sx={{
                    "& > div": { gridColumn: isNonMediumScreen ? undefined : "span 12" }
                }}
            >
                <Box
                    gridColumn="span 12"
                    backgroundColor="#FFFFFF"
                    height="fit-content"
                    p="1rem"
                    borderRadius="0.55rem"
                >
                    <Formik
                        onSubmit={handleSave}
                        initialValues={initialValuesToChange}
                        validationSchema={passwordSchema}
                    >
                        {({ errors, touched }) => (
                            <Form className="form">
                                <Box className="field">
                                    <FormLabel className="label"><FormattedMessage id="current.password" /></FormLabel>
                                    <Field
                                        name="currentPassword"
                                        as={TextField}
                                        sx={{ width: isNonMediumScreen ? '30%' : isLaptop ? '40%' : 'auto' }}
                                        InputProps={{ style: { height: "2.5rem" } }}
                                    />
                                    {errors.currentPassword && touched.currentPassword ? (
                                        <div className="error">{errors.currentPassword}</div>
                                    ) : null}
                                </Box>

                                <Box className="field">
                                    <FormLabel className="label"><FormattedMessage id="new.password" /></FormLabel>
                                    <Field
                                        name="newPassword"
                                        as={TextField}
                                        sx={{ width: isNonMediumScreen ? '30%' : isLaptop ? '40%' : 'auto' }}
                                        InputProps={{ style: { height: "2.5rem" } }}
                                    />
                                    {errors.newPassword && touched.newPassword ? (
                                        <div className="error">{errors.newPassword}</div>
                                    ) : null}
                                </Box>

                                <Box className="field">
                                    <FormLabel className="label"><FormattedMessage id="confirm.password" /></FormLabel>
                                    <Field
                                        name="confirmPassword"
                                        as={TextField}
                                        sx={{ width: isNonMediumScreen ? '30%' : isLaptop ? '40%' : 'auto' }}
                                        InputProps={{ style: { height: "2.5rem" } }}
                                    />
                                    {errors.confirmPassword && touched.confirmPassword ? (
                                        <div className="error">{errors.confirmPassword}</div>
                                    ) : null}
                                </Box>

                                <Box paddingTop='1rem'>
                                    <Button
                                        variant="contained"
                                        className="save-button"
                                        type="submit"
                                    >
                                        <FormattedMessage id="save" />
                                    </Button>
                                </Box>

                            </Form>
                        )}
                    </Formik>
                </Box>
            </Box>
        </Box >
    )
}

const initialValuesToChange = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
}

const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required(<FormattedMessage id="current.empty" />),
    newPassword: yup.string().required(<FormattedMessage id="new.empty" />),
    confirmPassword: yup.string().required(<FormattedMessage id="confirm.empty" />).oneOf([yup.ref('newPassword'), null], <FormattedMessage id="confirm.failed" />)
})

export default ChangePassword