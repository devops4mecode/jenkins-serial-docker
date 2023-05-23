import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { FormattedMessage } from "react-intl";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../components/Header";


const UnusedNumber = () => {

    const isNonMediumScreen = useMediaQuery("(min-width: 1200px)")

    const { user } = useAuthContext()
    const [serials, setSerials] = useState([])
    const serialStatus = true

    useEffect(() => {
        const fetchAllSerials = async () => {
            if (user) {
                try {
                    const response = await axios.get(`api/serials/status?serialStatus=${serialStatus}`, {
                        headers: { 'Authorization': `Bearer ${user.accessToken}` }
                    });
                    setSerials(response.data);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchAllSerials();
    }, [user]);

    function formatNumber(num) {
        const formatted = num.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, '');
        const sections = [];

        for (let i = 0; i < formatted.length; i += 4) {
            sections.push(formatted.substr(i, 4));
        }

        return sections.join('-');
    }

    const columns = [
        {
            field: "serialNo",
            headerName: <FormattedMessage id="serial.number" />,
            type: "number",
            headerAlign: "center",
            align: "center",
            valueGetter: (params) =>
                formatNumber(params.row.serialNo),
            width: 370
        },
        {
            field: "givenCredit",
            headerName: <FormattedMessage id="serial.credit" />,
            type: "number",
            headerAlign: "center",
            align: "center",
            width: 250
        },
        {
            field: "remarkName",
            headerName: <FormattedMessage id="serial.buyer" />,
            width: 250,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center"
        },
        {
            field: "createdAt",
            headerName: <FormattedMessage id="serial.purchase.date" />,
            valueFormatter: (params) =>
                moment(params.value).format("DD-MM-YYYY h:mm:ss a"),
            width: 370,
            headerAlign: "center",
            align: "center"
        },
    ]

    const getRowId = (row) => row._id

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarExport />
            </GridToolbarContainer>
        )
    }
    // sx={{
    //     "& .name-column--cell": {
    //         color: '#2E7C67'
    //     },
    //     "& .MuiDataGrid-columnHeaders": {
    //         backgroundColor: '#a4a9fc'
    //     },
    //     "& .MuiDataGrid-footerContainer": {
    //         backgroundColor: '#a4a9fc'
    //     },
    //     "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
    //         color: `'#141414' !important`
    //     },
    // }}


    return (
        <Box m="20px">
            <Header
                title={<FormattedMessage id="valid.serial" />}
                subtitle={<FormattedMessage id="valid.serial" />}
            />

            <Box
                mt="5px"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="160px"
                gap="20px"
                sx={{
                    "& > div": { gridColumn: isNonMediumScreen ? undefined : "span 12" },
                    "& .name-column--cell": {
                        color: '#2E7C67'
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: '#a4a9fc'
                    },
                    "& .MuiDataGrid-footerContainer": {
                        backgroundColor: '#a4a9fc'
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `'#141414' !important`
                    },
                }}
            >
                <Box
                    gridColumn="span 12"
                    height="70vh"
                    backgroundColor="#FFFFFF"
                    borderRadius="0.55rem"
                    className="defaultSection"
                >
                    <DataGrid
                        rows={serials}
                        columns={columns}
                        components={{ Toolbar: CustomToolbar }}
                        getRowId={getRowId}
                        disableColumnMenu
                    />
                </Box>
            </Box>
            <Box className="footer"></Box>

        </Box >
    )
}

export default UnusedNumber