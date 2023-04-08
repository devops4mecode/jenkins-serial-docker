import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";
import { CSVLink } from 'react-csv'
import { tokens } from "theme";
import { Formik } from "formik"
import * as yup from "yup"
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header"
import { useState } from "react";
import { useAuthContext } from "hooks/useAuthContext";
import axios from "axios";
import { useTheme } from "@emotion/react";
import CreditButton from "components/CreditButton";
// import { DataGrid } from "@mui/x-data-grid";
import CreditTextField from "../../components/TextField";
import '../../css/generateNumber.css'

const GenerateNumber = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const { user } = useAuthContext()
    const isNonMobile = useMediaQuery("(min-width:600px)")   //for mobile responsive
    const [serialsData, setSerialsData] = useState([])

    const handleFormSubmit = async (values) => {
        try {
            const response = await axios.post('api/serials/generate', values, {
                headers: { 'Authorization': `Bearer ${user.accessToken}` },
            })

            const datagriddata = response.data.serials
            console.log("datagrid data:", datagriddata)

            const da = datagriddata.map(dgd => ({
                _id: dgd._id,
                serialNo: dgd.serialNo,
                givenCredit: dgd.givenCredit,
                remarkName: dgd.remarkName,
                createdAt: dgd.createdAt
            }))

            setSerialsData(da)

        } catch (error) {
            console.log(error)
        }
    }

    const headers = [
        { label: 'Serial Number', key: 'serialNo' },
        { label: 'Given Credit', key: 'givenCredit' },
        { label: 'Buyer', key: 'remarkName' },
        { label: 'Buy Date', key: 'createdAt' },
    ];

    const data = serialsData.map(serialData => {
        return {
            serialNo: serialData.serialNo,
            givenCredit: serialData.givenCredit,
            remarkName: serialData.remarkName,
            createdAt: new Date(serialData.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
            }),
        };
    });

    return <Box m="20px">
        <Header title="GENERATE SERIAL NUMBER" subtitle="Top Up Credit" />

        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        className="credit-button-component"
                    >
                        <CreditButton onClick={() => setFieldValue("givenCredit", 10)} title="RM10" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 30)} title="RM30" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 50)} title="RM50" />
                        <CreditButton onClick={() => setFieldValue("givenCredit", 100)} title="RM100" />
                    </Box>

                    <Box
                        className="credit-field-component"
                    >

                        {/* Reload Amount */}
                        <CreditTextField
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
                            InputProps={{ readOnly: true, }}
                            sx={{ gridColumn: "span 2" }}
                        />

                        {/* Reload Quantity */}
                        <CreditTextField
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
                            InputProps={{ readOnly: false }}
                            sx={{ gridColumn: "span 2" }}
                        />

                        {/* Remark */}
                        <CreditTextField
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
                            InputProps={{ readOnly: false }}
                            sx={{ gridColumn: "span 2" }}
                        />
                    </Box>

                    <Box
                        className="generate-button-component"
                    >
                        <Button
                            className="generate-button-text"
                            type="submit"
                            variant="contained"
                        >
                            GENERATE
                        </Button>
                    </Box>

                    {serialsData.length > 0 && (
                        <>
                            <TableContainer component={Paper} sx={{ mt: 4, textAlign: "center", color: colors.greenAccent[300] }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Serial Number</TableCell>
                                            <TableCell align="center">Given Credit</TableCell>
                                            <TableCell align="center">Buyer</TableCell>
                                            <TableCell align="center">Buy Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {serialsData.map((serialData) => (
                                            <TableRow key={serialData._id}>
                                                <TableCell align="center" sx={{ color: colors.greenAccent[300] }}>{serialData.serialNo}</TableCell>
                                                <TableCell align="center" sx={{ color: colors.greenAccent[300] }}>{serialData.givenCredit}</TableCell>
                                                <TableCell align="center" sx={{ color: colors.greenAccent[300] }}>{serialData.remarkName}</TableCell>
                                                <TableCell align="center" sx={{ color: colors.greenAccent[300] }}>{new Date(serialData.createdAt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box display="flex"
                                mt="20px"
                                sx={{
                                    justifyContent: {
                                        xs: "end",
                                    },
                                }}>
                                <CSVLink data={data} headers={headers} filename={'code.csv'}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{
                                            fontSize: {
                                                xs: "12px",
                                                lg: "18px"
                                            },
                                        }}>
                                        Export to CSV
                                    </Button>
                                </CSVLink>
                            </Box>
                        </>
                    )}
                </form>
            )}
        </Formik>
    </Box>
}

const checkoutSchema = yup.object().shape({
    givenCredit: yup.number().required("This field must not be empty."),
    amountToGenerate: yup.number().required("This field must not be empty."),
    remarkName: yup.string().required("This field must not be empty."),
})

const initialValues = {
    givenCredit: "",
    amountToGenerate: "",
    remarkName: "",
}

export default GenerateNumber