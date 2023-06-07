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
            editable: false,
            flex: 2,
        },
        {
            field: "givenCredit",
            headerName: <FormattedMessage id="record.credit" />,
            type: "number",
            headerAlign: "center",
            align: "center",
            editable: false,
            flex: 2,
        },
        {
            field: "remarkName",
            headerName: <FormattedMessage id="record.buyer" />,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center",
            editable: false,
            flex: 2,
        },
        {
            field: "createdAt",
            headerName: <FormattedMessage id="record.sold.date" />,
            valueFormatter: (params) =>
                moment(params.value).format("DD-MM-YYYY h:mm:ss a"),
            headerAlign: "center",
            align: "center",
            editable: false,
            flex: 2,
        },
        {
            field: "redemptionAcc",
            headerName: <FormattedMessage id="record.redeemer" />,
            valueGetter: (params) =>
                params.row.redemptionAcc || "----",
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center",
            editable: false,
            flex: 2,
        },
        {
            field: "updatedAt",
            headerName: <FormattedMessage id="record.redeemed.date" />,
            valueGetter: (params) =>
                params.row.serialStatus ? "---" : moment(params.value).format("DD-MM-YYYY h:mm:ss a"),
            headerAlign: "center",
            align: "center",
            editable: false,
            flex: 2,
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
            editable: false,
            flex: 2,
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
                mt="5px"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="160px"
                gap="20px"
                sx={{
                    "& > div": { gridColumn: isNonMediumScreen ? undefined : "span 12" }
                }}
            >
                <Box
                    gridColumn="span 12"
                    height="fit-content"
                    p="2rem"
                    sx={{
                        width: '100%',
                        "& .name-column--cell": {
                            color: '#94e2cd'
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: '#a4a9fc',
                            borderBottom: "none"
                        },
                        "& .MuiDataGrid-footerContainer": {
                            backgroundColor: '#a4a9fc'
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `'#141414' !important`
                        },
                        "& .status-redeemed": {
                            color: "red",
                        },
                    }}
                >
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
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'createdAt', sort: 'desc' }],
                            },
                        }}
                        checkboxSelection
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
        </Box>
    )
}

export default AllNumber