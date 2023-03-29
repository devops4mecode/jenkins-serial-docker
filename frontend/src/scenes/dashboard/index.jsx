import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { mockTransactions } from "../../data/mockData";
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";

const Dashboard = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
            </Box>

            {/* Grid and Chart */}
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
                {/* Row 1 */}
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="12300"
                        subtitle="Total Redeem Count"
                        icon={
                            <CalculateOutlinedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="12300"
                        subtitle="Total Amount Redeemed"
                        icon={
                            <CalculateOutlinedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="12300"
                        subtitle="Total Redeem Count"
                        icon={
                            <CalculateOutlinedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="12300"
                        subtitle="Total Redeem Count"
                        icon={
                            <CalculateOutlinedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>


                {/* Row 2 */}
                <Box
                    gridColumn="span 8"
                    gridRow="span 3"
                    backgroundColor={colors.primary[400]}
                >
                    <Box
                        mt="25px"
                        p="0 30px"
                        display="flex "
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="600"
                                color={colors.grey[100]}
                            >
                                Revenue Generated
                            </Typography>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color={colors.greenAccent[500]}
                            >
                                RM 10000
                            </Typography>
                        </Box>                        
                    </Box>
                    <Box height="400px" m="-20px 0 0 0">
                        <LineChart isDashboard={true} />
                    </Box>
                </Box>


            </Box>
        </Box>
    )
}

export default Dashboard