import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { tokens } from "../../theme";
import Header from "../../components/Header";
import moment from "moment"
import { useAuthContext } from "hooks/useAuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import '../../css/allNumberTable.css'

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
            width: 250,
            xs: "100px"
        },
        {
            field: "givenCredit",
            headerName: "CREDIT",
            type: "number",
            headerAlign: "center",
            align: "center",
            width: 100,
            xs: 100
        },
        {
            field: "remarkName",
            headerName: "WHO BUY",
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center",
            width: 200,
            xs: 100
        },
        {
            field: "createdAt",
            headerName: "SOLD DATE",
            valueFormatter: (params) =>
                moment(params.value).format("YYYY-MM-DD h:mm:ss a"),
            headerAlign: "center",
            align: "center",
            width: 200,
            xs: 100
        },
        {
            field: "redemptionAcc",
            headerName: "WHO USE",
            valueGetter: (params) =>
                params.row.redemptionAcc || "----",
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center",
            width: 200,
            xs: 100
        },
        {
            field: "updatedAt",
            headerName: "REDEEMED DATE",
            valueGetter: (params) =>
                params.row.serialStatus ? "---" : moment(params.value).format("YYYY-MM-DD h:mm:ss a"),
            headerAlign: "center",
            align: "center",
            width: 200,
            xs: 100
        },
        {
            field: "serialStatus",
            headerName: "STATUS",
            valueGetter: (params) =>
                params.row.serialStatus ? "UNCLAIMED" : "REDEEMED",
            cellClassName: (params) =>
                params.value === "REDEEMED" ? "status-redeemed" : "name-column--cell",
            headerAlign: "center",
            align: "center",
            width: 200,
            xs: 100
        },
    ]

    const getRowId = (row) => row._id

    return (
        <Box m="20px">
            <Header
                title={<FormattedMessage id="all.serial" />}
                subtitle={<FormattedMessage id="all.serial" />}
            />
            {/* <Box m="0px 0 0 0" height="70vh" width='100%' sx={{ */}
            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
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