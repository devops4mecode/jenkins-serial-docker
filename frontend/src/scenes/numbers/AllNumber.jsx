import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData"
import Header from "../../components/Header";
import DownloadIcon from '@mui/icons-material/Download';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import moment from "moment"

// TESTING
import { useAuthContext } from "hooks/useAuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const AllNumber = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const { user } = useAuthContext()

    const [serials, setSerials] = useState([])

    useEffect(() => {
        const fetchAllSerials = async () => {
            if (user) {
                try {
                    const response = await axios.get(`api/serials/all`, {
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
        return num.toLocaleString('en-US', { maximumFractionDigits: 0 }).toString().replace(/,/g, '')
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
            flex: 1
        },
        {
            field: "givenCredit",
            headerName: "CREDIT",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1
        },
        {
            field: "remarkName",
            headerName: "WHO BUY",
            flex: 1,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center"
        },
        {
            field: "createdAt",
            headerName: "SOLD DATE",
            valueFormatter: (params) =>
                moment(params.value).format("YYYY-MM-DD h:mm:ss a"),
            flex: 1,
            headerAlign: "center",
            align: "center"
        },
        {
            field: "redemptionAcc",
            headerName: "WHO USE",
            valueGetter: (params) =>
                params.row.redemptionAcc || "----",
            flex: 1,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center"
        },
        {
            field: "updatedAt",
            headerName: "REDEEMED DATE",
            valueGetter: (params) =>
                params.row.serialStatus ? "---" : moment(params.value).format("YYYY-MM-DD h:mm:ss a"),
            flex: 1,
            headerAlign: "center",
            align: "center"
        },
        {
            field: "serialStatus",
            headerName: "Serial Number Status",
            valueGetter: (params) =>
                params.row.serialStatus ? "UNCLAIMED" : "REDEEMED",
            cellClassName: (params) =>
                params.value === "REDEEMED" ? "status-redeemed" : "name-column--cell",
            flex: 1,
            headerAlign: "center",
            align: "center"
        },
    ]

    const getRowId = (row) => row._id

    return (
        <Box m="20px">
            <Header title="All Serial Number" subtitle="All Serial Number" />
            <Box m="40px 0 0 0" height="75vh" sx={{
                "& .MuiDataGrid-root": {
                    // border: "none"
                },
                "& .name-column--cell": {
                    color: colors.greenAccent[300]
                },

                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none"
                },
                "& .MuiDataGrid-virtualScroller": {
                    // backgroundColor: colors.primary[400]
                },
                "& .MuiDataGrid-footerContainer": {
                    backgroundColor: colors.blueAccent[700]
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`
                },
                "& .status-redeemed": {
                    color: "red",
                },
            }}>
                <DataGrid
                    rows={serials}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    getRowId={getRowId}
                />
            </Box>
        </Box>

    )
}

export default AllNumber