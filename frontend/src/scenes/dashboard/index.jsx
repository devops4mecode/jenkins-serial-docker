import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useAuthContext } from "hooks/useAuthContext";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { FormattedMessage } from "react-intl";

const Dashboard = () => {

    const { user } = useAuthContext()
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [totalRedeemedAmount, setTotalRedeemedAmount] = useState(0)
    const [totalRedeemedCount, setTotalRedeemedCount] = useState(0)
    const [redeemedCount, setRedeemedCount] = useState({ '10': 0, '30': 0, '50': 0, '100': 0 })
    const [generatedCount, setGeneratedCount] = useState({ '10': 0, '30': 0, '50': 0, '100': 0 })
    const [mostRedeemedCount, setmostRedeemedCount] = useState({ '10': 0, '30': 0, '50': 0, '100': 0 })

    useEffect(() => {
        const getSerialsData = async () => {
            if (user) {
                try {
                    const { data } = await axios.get(`api/dashboard/serialsData`, {
                        headers: { 'Authorization': `Bearer ${user.accessToken}` }
                    });
                    setTotalRedeemedAmount(data?.totalAmountRedeemed[0].sum)
                    setTotalRedeemedCount(data?.totalRedeemedCount[0].count)
                    setRedeemedCount(prevCount => {
                        const newRedeemedCount = { ...prevCount }
                        data?.redeemedSerialCount.forEach(({ _id, count }) => {
                            newRedeemedCount[_id] = count
                        })
                        return newRedeemedCount
                    })
                    setGeneratedCount(prevCount => {
                        const newRedeemedCount = { ...prevCount }
                        data?.totalGeneratedCount.forEach(({ _id, count }) => {
                            newRedeemedCount[_id] = count
                        })
                        return newRedeemedCount
                    })
                    setmostRedeemedCount(prevCount => {
                        const newRedeemedCount = { ...prevCount }
                        data?.mostRedeemed.forEach(({ _id, percentage }) => {
                            newRedeemedCount[_id] = percentage
                        })
                        return newRedeemedCount
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        }
        getSerialsData()
    }, [user])

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header
                    title={<FormattedMessage id="dashboard" />}
                    subtitle="Welcome to your Dashboard"
                />
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
                                <FormattedMessage id="revenue.generated" />
                            </Typography>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color={colors.greenAccent[500]}
                            >
                                {`RM ${totalRedeemedAmount}`}
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
                        title={totalRedeemedCount}
                        subtitle={<FormattedMessage id="total.redeem.count" />}
                        icon={
                            <CallReceivedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 6" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={`RM ${totalRedeemedAmount}`}
                        subtitle={<FormattedMessage id="total.amount.redeemed" />}
                        icon={
                            <AttachMoneyIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
            </Box>

            {/* Row 2 - Total Redeemed*/}
            <Box display="grid" sx={{ pb: 3, pl: 2 }}>
                <Typography variant="h4"
                    fontWeight="600"
                    color={colors.grey[100]}
                >
                    <FormattedMessage id="total.redeemed" />
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

            {/* Row 3 - Total Generated*/}
            <Box display="grid" sx={{ pb: 3, pl: 2 }}>
                <Typography variant="h4"
                    fontWeight="600"
                    color={colors.grey[100]}
                >
                    <FormattedMessage id="total.generated" />
                </Typography>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px" sx={{ pb: 3 }}>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={generatedCount['10']}
                        subtitle="RM 10"
                        icon={
                            <AttachMoneyIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={generatedCount['30']}
                        subtitle="RM 30"
                        icon={
                            <AttachMoneyIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={generatedCount['50']}
                        subtitle="RM 50"
                        icon={
                            <AttachMoneyIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={generatedCount['100']}
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
                    <FormattedMessage id="most.redeemed" />
                </Typography>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px" sx={{ pb: 3 }}>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={`${mostRedeemedCount['10'].toFixed(2)}%`}
                        subtitle="RM 10"
                        icon={
                            <ArrowUpwardIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={`${mostRedeemedCount['30'].toFixed(2)}%`}
                        subtitle="RM 30"
                        icon={
                            <ArrowUpwardIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={`${mostRedeemedCount['50'].toFixed(2)}%`}
                        subtitle="RM 50"
                        icon={
                            <ArrowUpwardIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                        }
                    />
                </Box>
                <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
                    <StatBox
                        title={`${mostRedeemedCount['100'].toFixed(2)}%`}
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