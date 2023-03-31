import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik"
import * as yup from "yup"
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header"
import { useState } from "react";
import { useAuthContext } from "hooks/useAuthContext";
import axios from "axios";

const GenerateNumber = () => {
    const { user } = useAuthContext()
    const isNonMobile = useMediaQuery("(min-width:600px)")   //for mobile responsive

    const handleFormSubmit = async (values) => {
        try {
            const response = await axios.post('api/serials/generate', values, {
                headers: { 'Authorization': `Bearer ${user.accessToken}` },
            })

            const fetchData = response.data

            // This fetchData is named "serials" and it is an object of arrays
            console.log("fetchData is")
            console.log(fetchData)
        } catch (error) {
            console.log(error)
        }
    }

    return <Box m="20px">
        <Header title="GENERATE SERIAL NUMBER" subtitle="Generate a New Serial Number to Top Up Credit" />

        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
                        }}
                    >

                        <Button variant="contained" color="secondary" onClick={() => setFieldValue("givenCredit", 10)}> RM 10 </Button>
                        <Button variant="contained" color="secondary" onClick={() => setFieldValue("givenCredit", 30)}> RM 30 </Button>
                        <Button variant="contained" color="secondary" onClick={() => setFieldValue("givenCredit", 50)}> RM 50 </Button>
                        <Button variant="contained" color="secondary" onClick={() => setFieldValue("givenCredit", 100)}> RM 100 </Button>

                        {/* Reload Amount */}
                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Reload Amount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.givenCredit}
                            name="givenCredit"
                            error={!!touched.givenCredit && !!errors.givenCredit}
                            helperText={touched.givenCredit && errors.givenCredit}
                            sx={{ gridColumn: "span 2" }}
                            InputProps={{ readOnly: true }}
                        />

                        {/* Reload Quantity */}
                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Quantity"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.amountToGenerate}
                            name="amountToGenerate"
                            error={!!touched.amountToGenerate && !!errors.amountToGenerate}
                            helperText={touched.amountToGenerate && errors.amountToGenerate}
                            sx={{ gridColumn: "span 2" }}
                        />

                        {/* Remark */}
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Remark"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.remarkName}
                            name="remarkName"
                            error={!!touched.remarkName && !!errors.remarkName}
                            helperText={touched.remarkName && errors.remarkName}
                            sx={{ gridColumn: "span 2" }}
                        />
                    </Box>

                    <Box display="flex" justifyContent="end" mt="20px">
                        <Button type="submit" color="secondary" variant="contained">
                            GENERATE
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    </Box>
}

const checkoutSchema = yup.object().shape({
    givenCredit: yup.number().required("buy how much?"),
    amountToGenerate: yup.number().required("buy how many?"),
    remarkName: yup.string().required("who buy?"),
})

const initialValues = {
    givenCredit: "",
    amountToGenerate: "",
    remarkName: "",
}

export default GenerateNumber