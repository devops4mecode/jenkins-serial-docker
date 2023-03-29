import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData"
import Header from "../../components/Header";
import DownloadIcon from '@mui/icons-material/Download';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';

const AllNumber = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    function formatNumber(num) {
        return num.toLocaleString('en-US', {maximumFractionDigits: 0}).toString().replace(/,/g,'')
    }

    const columns = [
        // { field: "id", headerName: "ID", flex:1, headerAlign: "center", align: "center", sortable: false, filter: false },
        { field: "serialNo", headerName: "SERIAL NUMBER", type: "number", headerAlign: "center", align: "center", valueGetter: (params) => formatNumber(params.row.serialNo), flex:1 },
        { field: "givenCredit", headerName: "CREDIT", type: "number", headerAlign: "center", align: "center", flex:1 },
        { field: "remarkName", headerName: "WHO BUY", flex: 1, cellClassName: "name-column--cell", headerAlign: "center", align: "center" },
        { field: "createdAt", headerName: "SOLD DATE", flex: 1, headerAlign: "center", align: "center"},
        { field: "redemptionAcc", headerName: "WHO USE", flex: 1, cellClassName: "name-column--cell", headerAlign: "center", align: "center" },
        { field: "updatedAt", headerName: "REDEEMED DATE", flex: 1, headerAlign: "center", align: "center"}
        // { field: "serialStatus", headerName: "Serial Number Status", flex: 1, cellClassName: "name-column--cell", headerAlign: "center", align: "center" },
    ]

    return (
        <Box m="20px">
            <Header title="Used Serial Number" subtitle="Used Serial Number" />
            <Box m="40px 0 0 0" height="75vh" sx={{
                "& .MuiDataGrid-root": {
                    // border: "none"
                },
                "& .MuiDataGrid-cell": {
                    // border: "none"
                },
                "& .name-column--cell": {
                    color: colors.greenAccent[300]
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    // borderBottom: "none"
                },
                "& .MuiDataGrid-virtualScroller": {
                    // backgroundColor: colors.primary[400]
                },
                "& .MuiDataGrid-footerContainer": {
                    // borderTop: "none",
                    backgroundColor: colors.blueAccent[700]
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`
                },
                // "& .MuiCheckbox-root": {
                //     color: `${colors.greenAccent[200]} !important`
                // }
            }}>
                <DataGrid
                    rows={mockDataTeam}
                    columns={columns}
                    components={{Toolbar: GridToolbar}}
                    // checkboxSelection
                />
            </Box>
        </Box>

    )
}

export default AllNumber