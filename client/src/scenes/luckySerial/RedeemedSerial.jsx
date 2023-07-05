import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext";
import { FormattedMessage } from "react-intl";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import { Box, useMediaQuery } from "@mui/material";
import Header from "../../components/Header";

const UsedNumber = () => {

    const isNonMediumScreen = useMediaQuery("(min-width: 1200px)")
    const dataGridWidth = useMediaQuery("(max-width: 1200px");

    const { user } = useAuthContext()
    const [serials, setSerials] = useState([])
    const serialStatus = false

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
            minWidth: dataGridWidth ? 270 : 350,
        },
        {
            field: "givenCredit",
            headerName: <FormattedMessage id="serial.credit" />,
            type: "number",
            headerAlign: "center",
            align: "center",
            minWidth: dataGridWidth ? 70 : 200,
        },
        {
            field: "remarkName",
            headerName: <FormattedMessage id="serial.buyer" />,
            minWidth: dataGridWidth ? 210 : 200,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center"
        },
        {
            field: "createdAt",
            headerName: <FormattedMessage id="serial.purchase.date" />,
            valueFormatter: (params) =>
                moment(params.value).format("DD-MM-YYYY h:mm:ss a"),
            minWidth: dataGridWidth ? 240 : 250,
            headerAlign: "center",
            align: "center"
        },
        {
            field: "redemptionAcc",
            headerName: <FormattedMessage id="redeemed.account" />,
            minWidth: dataGridWidth ? 210 : 250,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center"
        },
        {
            field: "updatedAt",
            headerName: <FormattedMessage id="redeemed.date" />,
            valueFormatter: (params) =>
                moment(params.value).format("DD-MM-YYYY h:mm:ss a"),
            width: 250,
            minWidth: dataGridWidth ? 30 : 90,
            headerAlign: "center",
            align: "center"
        }
    ]

    const getRowId = (row) => row._id

    serials.sort((a, b) => {
        const dateA = moment(a.createdAt)
        const dateB = moment(b.createdAt)

        if (dateB.isSame(dateA, 'second')) {
            const updatedAtA = moment(a.updatedAt)
            const updatedAtB = moment(b.updatedAt)
            return updatedAtB - updatedAtA;
        }

        return dateB - dateA
    })

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarExport />
            </GridToolbarContainer>
        )
    }

    return (
        <Box m="20px">
            <Header
                title={<FormattedMessage id="invalid.serial" />}
                subtitle={<FormattedMessage id="invalid.serial" />}
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
                        slots={{ Toolbar: CustomToolbar }}
                        getRowId={getRowId}
                        disableColumnMenu
                    />

                    <Box className="footer"></Box>
                </Box>
            </Box>
        </Box>

    )
}

export default UsedNumber