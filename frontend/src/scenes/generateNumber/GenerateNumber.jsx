import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik"
import * as yup from "yup"
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header"
import { useState } from "react";

const GenerateNumber = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)")   //for mobile responsive

    const handleFormSubmit = (values) => {
        console.log(typeof values.amount)
        console.log(typeof values.quantity)
        console.log(values)
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

                        <Button variant="contained" color="secondary" onClick={() => setFieldValue("amount",10)}> RM 10 </Button>
                        <Button variant="contained" color="secondary" onClick={() => setFieldValue("amount",30)}> RM 30 </Button>
                        <Button variant="contained" color="secondary" onClick={() => setFieldValue("amount",50)}> RM 50 </Button>
                        <Button variant="contained" color="secondary" onClick={() => setFieldValue("amount",100)}> RM 100 </Button>

                        {/* Reload Amount */}
                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Reload Amount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.amount}
                            name="amount"
                            error={!!touched.amount && !!errors.amount}
                            helperText={touched.amount && errors.amount}
                            sx={{ gridColumn: "span 2" }}
                            InputProps={{readOnly: true}}
                        />

                        {/* Reload Quantity */}
                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Quantity"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.quantity}
                            name="quantity"
                            error={!!touched.quantity && !!errors.quantity}
                            helperText={touched.quantity && errors.quantity}
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
                            value={values.remark}
                            name="remark"
                            error={!!touched.remark && !!errors.remark}
                            helperText={touched.remark && errors.remark}
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
    amount: yup.number().required("buy how much?"),
    quantity: yup.number().required("buy how many?"),
    remark: yup.string().required("who buy?"),
})

const initialValues = {
    amount: "",
    quantity: "",
    remark: "",
}

export default GenerateNumber