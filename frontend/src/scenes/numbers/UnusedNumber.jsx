import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData"
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined"
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined"
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined"
import Header from "../../components/Header";

const UnusedNumber = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const columns = [
        { field: "id", headerName: "ID", flex:1 },
        { field: "serialNumber", headerName: "SERIAL NUMBER", type: "number", headerAlign: "left", align: "left", flex:1 },
        { field: "amount", headerName: "AMOUNT", type: "number", headerAlign: "left", align: "left", flex:1 },
        { field: "quantity", headerName: "QUANTITY", type: "number", headerAlign: "left", align: "left", flex:1 },
        { field: "remark", headerName: "REMARK", flex: 1, cellClassName: "name-column--cell" },
    ]

    return (
        <Box m="20px">
            <Header title="Unused Number" subtitle="Unused Serial Number" />
            <Box m="40px 0 0 0" height="75vh" sx={{
                "& .MuiDataGrid-root": {
                    border: "none"
                },
                "& .MuiDataGrid-cell": {
                    border: "none"
                },
                "& .name-column--cell": {
                    color: colors.greenAccent[300]
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none"
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400]
                },
                "& . MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700]
                }
            }}>
                <DataGrid
                    rows={mockDataTeam}
                    columns={columns}
                />
            </Box>
        </Box>

    )
}

export default UnusedNumber