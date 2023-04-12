import axios from "axios";
import moment from "moment"
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { useAuthContext } from "hooks/useAuthContext";
import { FormattedMessage } from "react-intl";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { tokens } from "../../theme";
import Box from "@mui/material/Box";
import Header from "../../components/Header";
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
            width: 300,
            xs: 100,
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
            width: 230,
            xs: 100
        },
        {
            field: "createdAt",
            headerName: "SOLD DATE",
            valueFormatter: (params) =>
                moment(params.value).format("YYYY-MM-DD h:mm:ss a"),
            headerAlign: "center",
            align: "center",
            width: 230,
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
            width: 230,
            xs: 100
        },
        {
            field: "updatedAt",
            headerName: "REDEEMED DATE",
            valueGetter: (params) =>
                params.row.serialStatus ? "---" : moment(params.value).format("YYYY-MM-DD h:mm:ss a"),
            headerAlign: "center",
            align: "center",
            width: 230,
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
            width: 230,
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
            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                    "& .name-column--cell": {
                        color: colors.greenAccent[300]
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none"
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

                <Box className="footer"></Box>
            </Box>
        </Box>

    )
}

export default AllNumber