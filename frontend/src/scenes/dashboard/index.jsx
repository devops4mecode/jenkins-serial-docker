import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "hooks/useAuthContext";
import { FormattedMessage } from "react-intl";
import { Box, Typography, useTheme, Grid } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import LineChart from "../../components/LineChart";
import RedeemIcon from '@mui/icons-material/Redeem';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import "../../css/dashboard.css"

const Dashboard = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const { user } = useAuthContext()
    const [totalRedeemedAmount, setTotalRedeemedAmount] = useState(0)
    const [totalRedeemedCount, setTotalRedeemedCount] = useState(0)
    const [redeemedCount, setRedeemedCount] = useState({ '10': 0, '30': 0, '50': 0, '100': 0 })
    const [generatedCount, setGeneratedCount] = useState({ '10': 0, '30': 0, '50': 0, '100': 0 })
    const [mostRedeemedCount, setmostRedeemedCount] = useState({ '10': 0, '30': 0, '50': 0, '100': 0 })
    const [topRedeemUser, setTopRedeemUser] = useState("")

    useEffect(() => {
        const getSerialsData = async () => {
            if (user) {
                try {
                    const { data } = await axios.get(`api/dashboard/serialsData`, {
                        headers: { 'Authorization': `Bearer ${user.accessToken}` }
                    });
                    setTotalRedeemedAmount(data?.totalAmountRedeemed)
                    setTotalRedeemedCount(data?.overallRedeemedCount)
                    setRedeemedCount(prevCount => {
                        const newRedeemedCount = { ...prevCount }
                        data?.redeemedCount.forEach(({ _id, count }) => {
                            newRedeemedCount[_id] = count
                        })
                        return newRedeemedCount
                    })
                    setGeneratedCount(prevCount => {
                        const newRedeemedCount = { ...prevCount }
                        data?.overallGeneratedCount.forEach(({ _id, count }) => {
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
                    setTopRedeemUser(data?.topRedeemUser)
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
                    subtitle={<FormattedMessage id="greeting" />}
                />
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

            <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={6}>
                    <Box className="style-statbox">
                        <StatBox
                            title={totalRedeemedCount}
                            subtitle={<FormattedMessage id="total.redeem.count" />}
                            icon={
                                <TrendingDownIcon className="iconSize" />
                            }
                        />
                    </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                    <Box className="style-statbox">
                        <StatBox
                            title={`RM ${totalRedeemedAmount}`}
                            subtitle={<FormattedMessage id="total.amount.redeemed" />}
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
                        <FormattedMessage id="total.redeemed" />
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {Object.keys(redeemedCount).map((key) => (
                        <Grid item xs={6} sm={6} md={3} key={key}>
                            <Box className="style-statbox">
                                <StatBox
                                    title={redeemedCount[key]}
                                    subtitle={`RM ${key}`}
                                    icon={<RedeemIcon className="iconSize" />}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Row 3 */}
            <Box className="category">
                <Box>
                    <Typography className="sub-header">
                        <FormattedMessage id="total.generated" />
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {Object.keys(generatedCount).map((key) => (
                        <Grid item xs={6} sm={6} md={3} key={key}>
                            <Box className="style-statbox">
                                <StatBox
                                    title={`${generatedCount[key]}`}
                                    subtitle={`RM ${key}`}
                                    icon={
                                        <TrendingUpIcon className="iconSize" />
                                    }
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Row 4 */}
            <Box className="category">
                <Box>
                    <Typography className="sub-header">
                        <FormattedMessage id="most.redeemed" />
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {Object.keys(mostRedeemedCount).map((key) => (
                        <Grid item xs={6} sm={6} md={3} key={key}>
                            <Box className="style-statbox">
                                <StatBox
                                    title={`${mostRedeemedCount[key].toFixed(2)}%`}
                                    subtitle={`RM ${key}`}
                                    icon={
                                        <ArrowUpwardIcon sx={{ color: colors.purple[100], fontSize: "23px" }} />
                                    }
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Row 4 */}
            <Box className="category">
                <Box>
                    <Typography className="sub-header">
                        <FormattedMessage id="top10.account" />
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {Object.keys(topRedeemUser).map((key) => (
                        <Grid item xs={6} sm={6} md={3} key={key}>
                            <Box className="style-statbox">
                                <StatBox
                                    title={topRedeemUser[key]._id}
                                    subtitle={`RM ${topRedeemUser[key].totalGivenCredit}`}
                                    icon={
                                        <ArrowUpwardIcon sx={{ color: colors.purple[100], fontSize: "23px" }} />
                                    }
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>


            <Box className="footer"></Box>
        </Box >
    )
}

export default Dashboard