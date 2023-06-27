import { Box, useMediaQuery } from "@mui/material"
import { useAuthContext } from "../../hooks/useAuthContext"
import Header from "../../components/Header"
import { FormattedMessage } from "react-intl"
import { DataGrid } from "@mui/x-data-grid"

const MoneyPacket = () => {
    const isNonMediumScreen = useMediaQuery("(min-width: 1200px")

    const { user } = useAuthContext()

    const columns = [
        // {
        //     field: 'rowIndex',
        //     headerName: 'No',
        //     flex: 1,
        //     minWidth: 90,
        // },
        {
            field: 'id',
            headerName: 'ID',
            width: 90
        },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
          },
    ]

    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    // put in useeffect for row index

    // const [userList, setUserList] = useState([])
    
    // const angpowIndex = data.map((user, index) => ({
    //     ...user,
    //     rowIndex: index + 1
    // }))
    // setUserList(angpowIndex)

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

                <DataGrid
                    rows={rows}
                    columns={columns}
                />

                </Box>

            </Box>
        </Box>
    )
}

export default MoneyPacket