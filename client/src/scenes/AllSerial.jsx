import axios from "axios";
import moment from "moment"
import { useEffect, useState } from "react";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import { useAuthContext } from "../hooks/useAuthContext";
import { FormattedMessage, useIntl } from "react-intl";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import Box from "@mui/material/Box";
import Header from "../components/Header";
import '../css/allNumberTable.css'
import DeleteModal from '../components/DeleteModal'

// const localizedTextsMap = {
//     toolbarExportCSV: '导出',
//     toolbarFilter: 'Filter',
//     toolbarColumns: 'Columns',
// };

const AllNumber = () => {

    const isNonMediumScreen = useMediaQuery("(min-width: 1200px)")

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
            headerName: <FormattedMessage id="serial.number" />,
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
            headerName: <FormattedMessage id="serial.credit" />,
            type: "number",
            headerAlign: "center",
            align: "center",
            width: 80,
            xs: 100
        },
        {
            field: "remarkName",
            headerName: <FormattedMessage id="serial.buyer" />,
            cellClassName: "name-column--cell",
            headerAlign: "center",
            align: "center",
            width: 240,
            xs: 100
        },
        {
            field: "createdAt",
            headerName: <FormattedMessage id="serial.purchase.date" />,
            valueFormatter: (params) =>
                moment(params.value).format("DD-MM-YYYY h:mm:ss a"),
            headerAlign: "center",
            align: "center",
            width: 200,
            xs: 100
        },
        {
            field: "redemptionAcc",
            headerName: <FormattedMessage id="redeemed.account" />,
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
            headerName: <FormattedMessage id="redeemed.date" />,
            valueGetter: (params) =>
                params.row.serialStatus ? "---" : moment(params.value).format("DD-MM-YYYY h:mm:ss a"),
            headerAlign: "center",
            align: "center",
            width: 200,
            xs: 100
        },
        {
            field: "serialStatus",
            headerName: <FormattedMessage id="serial.status" />,
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

                <Box display='flex' justifyContent='end' paddingBottom='15px'>
                    <Button variant="contained" color="error" onClick={handleOpenModal}>
                        <FormattedMessage id="delete" />
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
                </Box>

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