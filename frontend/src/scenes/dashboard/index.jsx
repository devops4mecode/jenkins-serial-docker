import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useAuthContext } from "hooks/useAuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Dashboard = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const { user } = useAuthContext()
    const [count, setCount] = useState({ 10: 0, 30: 0, 50: 0, 100: 0 })
    const [redeemedCount, setRedeemedCount] = useState({ '10': 0, '30': 0, '50': 0, '100': 0, total: 0 })


    useEffect(() => {
        const getTotalRedeemedCount = async () => {
            if(user) {
                try {
                    const response = await axios.get(`api/serials/falseCount`, {
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
                    const response = await axios.get(`api/serials/totalGenerated`, {
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
                    const response = await axios.get(`api/serials/redeemedSerialCount`, {
                        headers: {'Authorization': `Bearer ${user.accessToken}`}
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

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
            </Box>

            {/* Grid and Chart */}
            {/* Row 1 */}
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px" sx={{ pb: 3 }}>
                <Box gridColumn="span 12" gridRow="span 3" backgroundColor={colors.primary[400]}>
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
                                RM 7
                            </Typography>
                        </Box>
                    </Box>
                    <Box height="400px" m="-20px 0 0 0">
                        <LineChart isDashboard={true} />
                    </Box>
                </Box>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px" sx={{ pb: 3 }}>
                <Box gridColumn="span 6" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={count.total}
                        subtitle="Total Redeem Count"
                        icon={
                            <CallReceivedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 6" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="RM 7"
                        subtitle="Total Amount Redeemed"
                        icon={
                            <AttachMoneyIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
            </Box>

            {/* Row 2 */}
            <Box display="grid" sx={{ pb: 3, pl: 2 }}>
                <Typography variant="h4"
                    fontWeight="600"
                    color={colors.grey[100]}
                >
                    Total Redeemed
                </Typography>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px" sx={{ pb: 3 }}>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={redeemedCount[10]}
                        subtitle="RM 10"
                        icon={
                            <AddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={redeemedCount[30]}
                        subtitle="RM 30"
                        icon={
                            <AddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={redeemedCount[50]}
                        subtitle="RM 50"
                        icon={
                            <AddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={redeemedCount[100]}
                        subtitle="RM100"
                        icon={
                            <AddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
            </Box>

            {/* Row 3 */}
            <Box display="grid" sx={{ pb: 3, pl: 2 }}>
                <Typography variant="h4"
                    fontWeight="600"
                    color={colors.grey[100]}
                >
                    Total Generated
                </Typography>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px" sx={{ pb: 3 }}>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={count['10']}
                        subtitle="RM 10"
                        icon={
                            <AttachMoneyIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={count['30']}
                        subtitle="RM 30"
                        icon={
                            <AttachMoneyIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={count['50']}
                        subtitle="RM 50"
                        icon={
                            <AttachMoneyIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={count['100']}
                        subtitle="RM100"
                        icon={
                            <AttachMoneyIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
            </Box>

            {/* Row 4 */}
            <Box display="grid" sx={{ pb: 3, pl: 2 }}>
                <Typography variant="h4"
                    fontWeight="600"
                    color={colors.grey[100]}
                >
                    Most Redeemed
                </Typography>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px" sx={{ pb: 3 }}>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="7%"
                        subtitle="RM 10"
                        icon={
                            <ArrowUpwardIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="7%"
                        subtitle="RM 30"
                        icon={
                            <ArrowUpwardIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="7%"
                        subtitle="RM 50"
                        icon={
                            <ArrowUpwardIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title="7%"
                        subtitle="RM100"
                        icon={
                            <ArrowUpwardIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default Dashboard