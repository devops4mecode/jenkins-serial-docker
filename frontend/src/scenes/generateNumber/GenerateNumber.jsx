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
// import { DataGrid } from "@mui/x-data-grid";

import { FormattedMessage } from "react-intl";

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
        { label: <FormattedMessage id="serial.number" />, key: 'serialNo' },
        { label: <FormattedMessage id="given.credit" />, key: 'givenCredit' },
        { label: <FormattedMessage id="buyer" />, key: 'remarkName' },
        { label: <FormattedMessage id="buy.date" />, key: 'createdAt' },
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

    // const columns = [
    //     {
    //         field: "serialNo",
    //         headerName: "Serial No",
    //         flex: 1,
    //         headerAlign: "center",
    //         align: "center"
    //     },
    //     {
    //         field: "givenCredit",
    //         headerName: "Given Credit",
    //         flex: 1,
    //         headerAlign: "center",
    //         align: "center"
    //     },
    //     {
    //         field: "remarkName",
    //         headerName: "Remark",
    //         width: 200,
    //         flex: 1,
    //         headerAlign: "center",
    //         align: "center"
    //     },
    //     {
    //         field: "createdAt",
    //         headerName: "SOLD DATE",
    //         flex: 1,
    //         headerAlign: "center",
    //         align: "center"
    //     }
    // ];

    // const getRowId = (row) => row._id;

    return <Box m="20px">
        <Header
            title="GENERATE SERIAL NUMBER"
            subtitle="Generate a New Serial Number to Top Up Credit"
        />
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
                            label={<FormattedMessage id="reload.amount" />}
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
                            label={<FormattedMessage id="reload.quantity" />}
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
                            label={<FormattedMessage id="reload.remark" />}
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
                            <FormattedMessage id="generate.button" />
                        </Button>
                    </Box>

                    {serialsData.length > 0 && (
                        <>
                            <CSVLink data={data} headers={headers} filename={'code.csv'}>
                                <Button variant="contained" color="secondary">
                                    <FormattedMessage id="export.csv" />
                                </Button>
                            </CSVLink>

                            <TableContainer component={Paper} sx={{ mt: 4, textAlign: "center", color: colors.greenAccent[300] }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center"><FormattedMessage id="serial.number" /></TableCell>
                                            <TableCell align="center"><FormattedMessage id="serial.credit" /></TableCell>
                                            <TableCell align="center"><FormattedMessage id="serial.buyer" /></TableCell>
                                            <TableCell align="center"><FormattedMessage id="serial.purchase.date" /></TableCell>
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
                        </>
                    )}
                </form>
            )}
        </Formik>

        {/* {serialsData.length > 0 ? ( */}
        {/* <Box> */}
        {/* <DataGrid */}
        {/* rows={serialsData} */}
        {/* columns={columns} */}
        {/* getRowId={getRowId} */}
        {/* /> */}
        {/* {console.log(serialsData)} */}
        {/* </Box> */}
        {/* ) : null} */}
    </Box>
}

const checkoutSchema = yup.object().shape({
    givenCredit: yup.number().required(<FormattedMessage id="credit.error" />),
    amountToGenerate: yup.number().required(<FormattedMessage id="amount.error" />),
    remarkName: yup.string().required(<FormattedMessage id="remark.error" />),
})

const initialValues = {
    givenCredit: "",
    amountToGenerate: "",
    remarkName: "",
}

export default GenerateNumber