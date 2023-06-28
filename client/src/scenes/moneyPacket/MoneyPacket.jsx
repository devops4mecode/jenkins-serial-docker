import { Box, useMediaQuery } from "@mui/material"
import { useAuthContext } from "../../hooks/useAuthContext"
import Header from "../../components/Header"
import { FormattedMessage } from "react-intl"
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import axios from "axios"
import moment from "moment"

const MoneyPacket = () => {
    const isNonMediumScreen = useMediaQuery("(min-width: 1200px")
    const dataGridWidth = useMediaQuery("(max-width: 1200px");

    const { user } = useAuthContext()

    const [angpao, setAngpao] = useState([])

    const columns = [
        {
            field: 'rowIndex',
            headerName: 'No',
            minWidth: dataGridWidth ? 80 : 90,
        },
        {
            field: 'angpaoID',
            headerName: <FormattedMessage id="angpaoId" />,
            minWidth: dataGridWidth ? 170 : 300,
            editable: false,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'angpao_credit',
            headerName: <FormattedMessage id="angpao_credit" />,
            minWidth: dataGridWidth ? 190 : 200,
            editable: false,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'angpao_owner',
            headerName: <FormattedMessage id="angpao_owner" />,
            cellClassName: "name-column--cell",
            minWidth: dataGridWidth ? 170 : 250,
            editable: false,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'angpao_type',
            headerName: <FormattedMessage id="angpao_type" />,
            type: 'number',
            minWidth: dataGridWidth ? 170 : 230,
            editable: false,
            headerAlign: "center",
            align: "center",
        },
        {
            field: 'createdAt',
            headerName: <FormattedMessage id="createdAt" />,
            valueFormatter: (params) =>
            moment(params.value).format("DD-MM-YYYY h:mm:ss a"),
            type: 'number',
            minWidth: dataGridWidth ? 230 : 270,
            editable: false,
            headerAlign: "center",
            align: "center",
        },
    ]

    useEffect(() => {
        const fetchAllAngpao = async () => {
            if (user) {
                try {
                    const { data } = await axios.get(`api/angpao/all`, {
                        headers: { 'Authorization': `Bearer ${user.accessToken}` }
                    })

                    const angpaoWithIndex = data.map((angpao, index) => ({
                        ...angpao,
                        rowIndex: index + 1
                    }))

                    setAngpao(angpaoWithIndex)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        fetchAllAngpao()
    }, [user])

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }

    return (
        <Box m="20px">
            <Header
                title={<FormattedMessage id="angpowNav" />}
                subtitle={<FormattedMessage id="angpowNav" />}
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
                        color: '#ff7a38'
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: '#ff7a38'
                    },
                    "& .MuiDataGrid-footerContainer": {
                        backgroundColor: '#ff7a38'
                    },
                    // "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    //     color: `'#141414' !important`
                    // },
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
                        columns={columns}
                        rows={angpao}
                        getRowId={(row) => row._id}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 50 } },
                        }}
                        pageSizeOptions={[50]}
                        slots={{
                            toolbar: CustomToolbar,
                        }}
                    />

                </Box>

            </Box>
        </Box>
    )
}

export default MoneyPacket