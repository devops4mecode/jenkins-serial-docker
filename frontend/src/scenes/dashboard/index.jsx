import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "hooks/useAuthContext";
import { FormattedMessage } from "react-intl";
import { Box, Typography, useTheme, Grid, Select, MenuItem, Button, TextField } from "@mui/material";
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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import "../../css/dashboard.css"

import moment from "moment";

const Dashboard = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const { user } = useAuthContext()

    // Chart
    const [year, setYear] = useState(new Date().getFullYear());

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    const buttonData = [
        { label: 'today', range: 'today' },
        { label: 'yesterday', range: 'yesterday' },
        { label: 'this.week', range: 'this-week' },
        { label: 'last.week', range: 'last-week' },
        { label: 'this.month', range: 'this-month' },
        { label: 'this.year', range: 'this-year' },
        { label: 'all.time', range: 'all-time' },
    ]

    const handleDateRangeChange = (timeRange) => {
        const now = moment();
        let newStartDate, newEndDate;

        switch (timeRange) {
            case 'all-time':
                newStartDate = null; // or your desired start date for all time
                newEndDate = now.toDate();
                break;
            case 'this-year':
                newStartDate = moment().startOf('year').toDate();
                newEndDate = now.toDate();
                break;
            case 'this-month':
                newStartDate = moment().startOf('month').toDate();
                newEndDate = now.toDate();
                break;
            case 'last-week':
                newStartDate = moment().subtract(1, 'week').startOf('isoWeek').toDate();
                newEndDate = moment().subtract(1, 'week').endOf('isoWeek').toDate();
                break;
            case 'this-week':
                newStartDate = moment().startOf('isoWeek').toDate();
                newEndDate = now.toDate();
                break;
            case 'yesterday':
                newStartDate = moment().subtract(1, 'day').startOf('day').toDate();
                newEndDate = moment().subtract(1, 'day').endOf('day').toDate();
                break;
            case 'today':
                newStartDate = now.startOf('day').toDate();
                newEndDate = now.endOf('day').toDate();
                break;
            default:
                newStartDate = null;
                newEndDate = null;
                break;
        }
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }

    const [dashData, setDashData] = useState({
        // Before Chart
        totalGenerated: "",
        totalRedeemed: "",
        // Chart
        monthlyRedeemed: [],
        monthlyGenerated: [],
        // Summary
        overallRedeemedCount: "",
        totalAmountRedeemed: "",
        redeemedCount: [],
        overallGeneratedCount: [],
        mostRedeemed: [],
        topTen: [],
    });

    useEffect(() => {
        let startFrom = startDate;
        if (startDate) startFrom = moment(startDate).format('YYYY-MM-DD');
        const endAt = moment(endDate).format('YYYY-MM-DD')

        const getDashboard = async () => {
            try {
                const { data } = await axios.get(`api/dashboard?year=${year}&startDate=${startFrom}&endDate=${endAt}`, {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` }
                });
                console.log("data is")
                console.log(data)
                setDashData(data)
            } catch (error) {
                console.log(error)
            }
        }
        getDashboard()
    }, [year, startDate, endDate])

    console.log("dashData is")
    console.log(dashData)

    return (
        <Box m="20px">
            {dashData ? (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Header
                            title={<FormattedMessage id="dashboard" />}
                            subtitle={<FormattedMessage id="greeting" />}
                        />
                    </Box>
                    {/* Grid and Chart */}
                    {/* Row 1 */}
                    <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" gridAutoRows="170px" gap="20px" sx={{ pb: 3 }}>
                        <Box gridColumn="span 6" gridRow="span 3" backgroundColor={colors.primary[400]}>
                            <Box mt="25px" p="0 30px" display="flex" flexDirection="column" justifyContent="space-between" >
                                <Box>
                                    <Select
                                        value={year}
                                        label="Year"
                                        onChange={handleYearChange}
                                        style={{
                                            border: '1px solid white',
                                            color: '#6200EE',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    >
                                        <MenuItem value={2023}>2023</MenuItem>
                                        <MenuItem value={2022}>2022</MenuItem>
                                    </Select>
                                </Box>

                                <Box display='flex' flexDirection='row' >
                                    <Box display='flex' flexDirection='column'>
                                        <Box pt='12px' pl='5px'>
                                            <Typography className="graph-header">
                                                {/* Generated */}
                                                <FormattedMessage
                                                    id="revenue.generated"
                                                    values={{ year: `${year}` }}
                                                />
                                            </Typography>
                                        </Box>
                                        <Box pt='5px' pl='5px'>
                                            <Typography className="graph-statistic">
                                                {`RM ${dashData.totalGenerated}`}
                                            </Typography>
                                        </Box>
                                    </Box>


                                    <Box display='flex' flexDirection='column' marginLeft='24px'>
                                        <Box pt='12px' pl='5px'>
                                            <Typography className="graph-header">
                                                {/* Redeemed */}
                                                <FormattedMessage
                                                    id="total.amount.redeemed.year"
                                                    values={{ year: `${year}` }}
                                                />
                                            </Typography>
                                        </Box>
                                        <Box pt='5px' pl='5px'>
                                            <Typography className="graph-statistic">
                                                {`RM ${dashData.totalRedeemed}`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box height="400px" m="-20px 0 0 0">
                                <LineChart isDashboard={true} monthlyGenerated={dashData.monthlyGenerated} monthlyRedeemed={dashData.monthlyRedeemed} />
                            </Box>
                        </Box>
                    </Box>


                    {/* Filter Row */}
                    <Box>
                        <Box className="category">
                            <Box className="apply-filter" display='flex'>
                                <Box className="button-container">
                                    {/* Button For Change Date Range */}
                                    {buttonData.map((button, index) => (
                                        <Button
                                            key={index}
                                            className="filter-button"
                                            startIcon={<CalendarMonthIcon className="iconSize" />}
                                            onClick={() => handleDateRangeChange(button.range)}
                                        >
                                            <FormattedMessage id={button.label} />
                                        </Button>
                                    ))}
                                </Box>
                            </Box>

                            <Box className="date-range" display='flex'>
                                <Box >
                                    <label className="datepicker-text"><FormattedMessage id="start.date" /></label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={date => setStartDate(date)}
                                        dateFormat="dd/mm/yyyy"
                                    />
                                </Box>
                                <Box>
                                    <label className="datepicker-text"><FormattedMessage id="end.date" /></label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={date => setEndDate(date)}
                                        dateFormat="dd/mm/yyyy"
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Start of statbox */}
                    <Grid container spacing={2}>

                        <Grid item xs={6} sm={6} md={6}>
                            <Box className="style-statbox">
                                <StatBox
                                    title={dashData.overallRedeemedCount}
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
                                    title={`RM ${dashData.totalAmountRedeemed}`}
                                    subtitle={<FormattedMessage id="total.amount.redeemed" />}
                                    icon={
                                        <AttachMoneyIcon className="iconSize" />
                                    }
                                />
                            </Box>
                        </Grid>

                    </Grid>


                    <Box className="category">

                        <Box>
                            <Typography className="sub-header">
                                <FormattedMessage id="total.redeemed" />
                            </Typography>
                        </Box>


                        {/* Row 2 */}
                        <Grid container spacing={2}>
                            {dashData.redeemedCount.map((item) => (
                                <Grid item xs={6} sm={6} md={3} key={item._id}>
                                    <Box className="style-statbox">
                                        <StatBox
                                            title={item.count}
                                            subtitle={`RM ${item.amount}`}
                                            icon={<RedeemIcon className="iconSize" />}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>


                        {/* Row 3 */}
                        <Box className="category">

                            <Box>
                                <Typography className="sub-header">
                                    <FormattedMessage id="total.generated" />
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                {dashData.overallGeneratedCount.map((item) => (
                                    <Grid item xs={6} sm={6} md={3} key={item._id}>
                                        <Box className="style-statbox">
                                            <StatBox
                                                title={item.count}
                                                subtitle={`RM ${item.amount}`}
                                                icon={<TrendingUpIcon className="iconSize" />}
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
                                {dashData.mostRedeemed.map((item) => (
                                    <Grid item xs={6} sm={6} md={3} key={item._id}>
                                        <Box className="style-statbox">
                                            <StatBox
                                                title={`${item.percentage.toFixed(2)}%`}
                                                subtitle={`RM ${item.amount}`}
                                                icon={
                                                    <ArrowUpwardIcon sx={{ color: colors.purple[100], fontSize: "23px" }} />
                                                }
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        {/* Row 5 */}
                        <Box className="category">
                            <Box>
                                <Typography className="sub-header">
                                    <FormattedMessage id="top10.account" />
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                {dashData.topTen.map((item) => (
                                    <Grid item xs={6} sm={6} md={3} key={item._id}>
                                        <Box className="style-statbox">
                                            <StatBox
                                                title={item.name}
                                                subtitle={`RM ${item.totalCredit}`}
                                                icon={
                                                    <ArrowUpwardIcon sx={{ color: colors.purple[100], fontSize: "23px" }} />
                                                }
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>


                    <Box className="footer"></Box>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </Box>
    )
}
export default Dashboard
