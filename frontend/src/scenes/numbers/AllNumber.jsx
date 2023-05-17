import axios from "axios";
import moment from "moment"
import { useEffect, useState } from "react";
import { Button, useTheme } from "@mui/material";
import { useAuthContext } from "hooks/useAuthContext";
import { FormattedMessage, useIntl } from "react-intl";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import { tokens } from "../../theme";
import Box from "@mui/material/Box";
import Header from "../../components/Header";
import '../../css/allNumberTable.css'
import DeleteModal from "components/DeleteModal";

// const localizedTextsMap = {
//     toolbarExportCSV: '导出',
//     toolbarFilter: 'Filter',
//     toolbarColumns: 'Columns',
// };

const AllNumber = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const { user } = useAuthContext()
    const intl = useIntl()
    const [serials, setSerials] = useState([])

    const [openModal, setOpenModal] = useState(false)

    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const [selectedRows, setSelectedRows] = useState([]);

    const handleRowSelectionChange = (selectionModel) => {
        setSelectedRows(selectionModel);
    };

    const handleDelete = async () => {

        try {
            const { data } = await axios.delete(`api/serials/delete`, {
                headers: { 'Authorization': `Bearer ${user.accessToken}` },
                data: { serialID: selectedRows }
            })
            window.location.reload()
        } catch (error) {
            console.error(error)
        }
    }

    const handleCancel = () => {
        setOpenModal(false)
    }

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
            headerName: <FormattedMessage id="record.serial.number" />,
            type: "number",
            headerAlign: "center",
            align: "center",
            valueGetter: (params) =>
                formatNumber(params.row.serialNo),
            width: 300,
            xs: 80,
        },
        {
            field: "givenCredit",
            headerName: <FormattedMessage id="record.credit" />,
            type: "number",
            headerAlign: "center",
            align: "center",
            width: 80,
            xs: 100
        },
        {
            field: "remarkName",
            headerName: <FormattedMessage id="record.buyer" />,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center",
            width: 240,
            xs: 100
        },
        {
            field: "createdAt",
            headerName: <FormattedMessage id="record.sold.date" />,
            valueFormatter: (params) =>
                moment(params.value).format("DD-MM-YYYY h:mm:ss a"),
            headerAlign: "center",
            align: "center",
            width: 200,
            xs: 100
        },
        {
            field: "redemptionAcc",
            headerName: <FormattedMessage id="record.redeemer" />,
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
            headerName: <FormattedMessage id="record.redeemed.date" />,
            valueGetter: (params) =>
                params.row.serialStatus ? "---" : moment(params.value).format("DD-MM-YYYY h:mm:ss a"),
            headerAlign: "center",
            align: "center",
            width: 200,
            xs: 100
        },
        {
            field: "serialStatus",
            headerName: <FormattedMessage id="record.status" />,
            valueGetter: (params) =>
                params.row.serialStatus ? "UNCLAIMED" : "REDEEMED",
            cellClassName: (params) =>
                params.value === "REDEEMED" ? "status-redeemed" : "name-column--cell",
            headerAlign: "center",
            align: "center",
            width: 210,
            xs: 100
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

                <Box display='flex' justifyContent='end' paddingBottom='15px'>
                    <Button variant="contained" color="error" onClick={handleOpenModal}>
                        Delete
                    </Button>
                </Box>

                <DataGrid
                    rows={serials}
                    columns={columns}
                    components={{ Toolbar: CustomToolbar }}
                    getRowId={getRowId}
                    checkboxSelection
                    // localeText={localizedTextsMap}
                    disableColumnMenu
                    onRowSelectionModelChange={handleRowSelectionChange}
                />

                <Box className="footer"></Box>
            </Box>

            {openModal && (
                <DeleteModal
                    message='delete.confirmation.message'
                    count={selectedRows.length}
                    onDelete={handleDelete}
                    onCancel={handleCancel}
                    onClose={handleCancel}
                />
            )}

        </Box>

    )
}

export default AllNumber