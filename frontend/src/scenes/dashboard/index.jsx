import { Box, Button, IconButton, Typography, useTheme, Grid } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useAuthContext } from "hooks/useAuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import RedeemIcon from '@mui/icons-material/Redeem';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import "../../css/dashboard.css"

const Dashboard = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const { user } = useAuthContext()
    const [count, setCount] = useState({ 10: 0, 30: 0, 50: 0, 100: 0, total: 0 })
    const [redeemedCount, setRedeemedCount] = useState({ '10': 0, '30': 0, '50': 0, '100': 0, total: 0 })
    const [redeemedAmount, setRedeemedAmount] = useState(0)


    useEffect(() => {
        const getTotalRedeemedCount = async () => {
            if (user) {
                try {
                    const response = await axios.get(`api/dashboard/falseCount`, {
                        headers: { 'Authorization': `Bearer ${user.accessToken}` }
                    });
                    setCount(prevCount => {
                        const newCount = { ...prevCount };
                        newCount.total = response.data[0].count;
                        return newCount;
                    });
                } catch (error) {
                    console.log(error)
                }
            }
        }

        getTotalRedeemedCount()
    }, [user])

    useEffect(() => {
        const getTotalGeneratedCount = async () => {
            if (user) {
                try {
                    const response = await axios.get(`api/dashboard/totalGenerated`, {
                        headers: { 'Authorization': `Bearer ${user.accessToken}` }
                    })
                    setCount(prevCount => {
                        const newCount = { ...prevCount }
                        response.data.forEach(({ _id, count }) => {
                            newCount[_id] = count
                        })
                        return newCount
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        }

        getTotalGeneratedCount()
    }, [user])

    useEffect(() => {
        const getRedeemedSerialCount = async () => {
            if (user) {
                try {
                    const response = await axios.get(`api/dashboard/redeemedSerialCount`, {
                        headers: { 'Authorization': `Bearer ${user.accessToken}` }
                    })
                    setRedeemedCount(prevCount => {
                        const newCount = { ...prevCount }
                        response.data.forEach(({ _id, count }) => {
                            newCount[_id] = count
                        })
                        return newCount
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        }

        getRedeemedSerialCount()
    }, [user])

    useEffect(() => {
        const totalAmountRedeemed = async () => {
            if (user) {
                try {
                    const response = await axios.get(`/api/dashboard/totalAmount`, {
                        headers: { 'Authorization': `Bearer ${user.accessToken}` }
                    })
                    const total = response.data[0].sum
                    setRedeemedAmount(total)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        totalAmountRedeemed()
    }, [user])

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
            </Box>

            {/* Grid and Chart */}
            {/* Row 1 */}
            <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" gridAutoRows="140px" gap="20px" sx={{ pb: 3 }}>
                <Box gridColumn="span 6" gridRow="span 3" backgroundColor={colors.primary[400]}>
                    <Box mt="25px" p="0 30px" display="flex " justifyContent="space-between" alignItems="center">
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
                                {`RM ${redeemedAmount}`}
                            </Typography>
                        </Box>
                    </Box>
                    <Box height="400px" m="-20px 0 0 0">
                        <LineChart isDashboard={true} />
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={6}>
                    <Box className="style-statbox">
                        <StatBox
                            title={count.total}
                            subtitle="Total Redeem Count"
                            icon={
                                <TrendingDownIcon className="iconSize" />
                            }
                        />
                    </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                    <Box className="style-statbox">
                        <StatBox
                            title={`RM ${redeemedAmount}`}
                            subtitle="Total Amount Redeemed"
                            icon={
                                <AttachMoneyIcon className="iconSize" />
                            }
                        />
                    </Box>
                </Grid>
            </Grid>




            {/* Row 2 */}
            <Box className="category">
                <Box>
                    <Typography className="sub-header">
                        Total Redeemed
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox">
                            <StatBox
                                title={redeemedCount[10]}
                                subtitle="RM 10"
                                icon={
                                    <RedeemIcon className="iconSize" />
                                }
                            />
                        </Box>
                    </Grid>


                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox">
                            <StatBox
                                title={redeemedCount[30]}
                                subtitle="RM 30"
                                icon={
                                    <RedeemIcon className="iconSize" />
                                }
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox">
                            <StatBox
                                title={redeemedCount[50]}
                                subtitle="RM 50"
                                icon={
                                    <RedeemIcon className="iconSize" />
                                }
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox">
                            <StatBox
                                title={redeemedCount[100]}
                                subtitle="RM100"
                                icon={
                                    <RedeemIcon className="iconSize" />
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>



            {/* Row 3 */}
            <Box className="category">
                <Box>
                    <Typography className="sub-header">
                        Total Generated
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox">
                            <StatBox
                                title={count['10']}
                                subtitle="RM 10"
                                icon={
                                    <TrendingUpIcon className="iconSize" />
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox">
                            <StatBox
                                title={count['30']}
                                subtitle="RM 30"
                                icon={
                                    <TrendingUpIcon className="iconSize" />
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox">
                            <StatBox
                                title={count['50']}
                                subtitle="RM 50"
                                icon={
                                    <TrendingUpIcon className="iconSize" />
                                }
                            />

                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox"><StatBox
                            title={count['100']}
                            subtitle="RM100"
                            icon={
                                <TrendingUpIcon  className="iconSize" />
                            }
                        />
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Row 4 */}
            <Box className="category">
                <Box>
                    <Typography className="sub-header">
                        Most Redeemed
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox">
                            <StatBox
                                title="7%"
                                subtitle="RM 10"
                                icon={
                                    <ArrowUpwardIcon sx={{ color: colors.purple[100], fontSize: "23px" }} />
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox">
                            <StatBox
                                title="7%"
                                subtitle="RM 30"
                                icon={
                                    <ArrowUpwardIcon sx={{ color: colors.purple[100], fontSize: "23px" }} />
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox">
                            <StatBox
                                title="7%"
                                subtitle="RM 50"
                                icon={
                                    <ArrowUpwardIcon sx={{ color: colors.purple[100], fontSize: "23px" }} />
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                        <Box className="style-statbox">
                            <StatBox
                                title="7%"
                                subtitle="RM100"
                                icon={
                                    <ArrowUpwardIcon sx={{ color: colors.purple[100], fontSize: "23px" }} />
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    )
}

export default Dashboard