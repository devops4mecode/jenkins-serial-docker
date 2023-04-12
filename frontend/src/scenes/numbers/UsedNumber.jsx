import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { tokens } from "../../theme";
import Header from "../../components/Header";
import moment from "moment";
import { useAuthContext } from "hooks/useAuthContext";
import { useEffect, useState } from "react"
import axios from "axios";
import { FormattedMessage } from "react-intl";

const UsedNumber = () => {

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


    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

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
            headerName: "SERIAL NUMBER",
            type: "number",
            headerAlign: "center",
            align: "center",
            valueGetter: (params) =>
                formatNumber(params.row.serialNo),
            width: 300
        },
        {
            field: "givenCredit",
            headerName: "CREDIT",
            type: "number",
            headerAlign: "center",
            align: "center",
            width: 200
        },
        {
            field: "remarkName",
            headerName: "WHO BUY",
            width: 250,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center"
        },
        {
            field: "createdAt",
            headerName: "SOLD DATE",
            valueFormatter: (params) =>
                moment(params.value).format("YYYY-MM-DD h:mm:ss a"),
            width: 250,
            headerAlign: "center",
            align: "center"
        },
        {
            field: "redemptionAcc",
            headerName: "WHO USE",
            width: 250,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center"
        },
        {
            field: "updatedAt",
            headerName: "REDEEMED DATE",
            valueFormatter: (params) =>
                moment(params.value).format("YYYY-MM-DD h:mm:ss a"),
            width: 250,
            headerAlign: "center",
            align: "center"
        }
    ]

    const getRowId = (row) => row._id

    return (
        <Box m="20px">
            <Header
                title={<FormattedMessage id="invalid.serials" />}
                subtitle={<FormattedMessage id="invalid.serials" />}
            />
            <Box height="70vh" width='100%' sx={{
                "& .name-column--cell": {
                    color: colors.greenAccent[300]
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                },
                "& .MuiDataGrid-footerContainer": {
                    backgroundColor: colors.blueAccent[700]
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`
                },
            }}>
                <DataGrid
                    rows={serials}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={getRowId}
                />

                <Box className="footer"></Box>
            </Box>
        </Box>

    )
}

export default UsedNumber