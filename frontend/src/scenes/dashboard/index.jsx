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

    // NEW
    const [monthlyGenerated, setMonthlyGenerated] = useState([])
    const [monthlyRedeemed, setMonthlyRedeemed] = useState([])
    const [totalGeneratedThroughYear, setTotalGeneratedThroughYear] = useState(0)
    const [totalRedeemedThroughYear, setTotalRedeemedThroughYear] = useState(0)

    // Chart Data
    useEffect(() => {
        const getChartData = async () => {
            if (user) {
                try {
                    const { data } = await axios.get(`api/dashboard/chartData?year=${year}`, {
                        headers: { 'Authorization': `Bearer ${user.accessToken}` }
                    });
                    setMonthlyGenerated(data?.monthlyGeneratedThroughYear)
                    setMonthlyRedeemed(data?.monthlyRedeemedThroughYear)
                    setTotalGeneratedThroughYear(data?.totalGenerated)
                    setTotalRedeemedThroughYear(data?.totalRedeemed)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        getChartData()
    }, [user, year])

    // Other
    const [totalRedeemedAmount, setTotalRedeemedAmount] = useState(0)
    const [totalRedeemedCount, setTotalRedeemedCount] = useState(0)
    const [redeemedCount, setRedeemedCount] = useState({ '10': 0, '30': 0, '50': 0, '100': 0 })
    const [generatedCount, setGeneratedCount] = useState({ '10': 0, '30': 0, '50': 0, '100': 0 })
    const [mostRedeemedCount, setmostRedeemedCount] = useState({ '10': 0, '30': 0, '50': 0, '100': 0 })
    const [topRedeemUser, setTopRedeemUser] = useState("")

    // NEW
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

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

    // Summary
    useEffect(() => {
        let formattedStart = startDate;
        if (startDate) formattedStart = moment(startDate).format('YYYY-MM-DD');
        const formattedEnd = moment(endDate).format('YYYY-MM-DD')

        const getSummary = async () => {
            if (user) {
                try {
                    const { data } = await axios.get(`api/dashboard/summary?startDate=${formattedStart}&endDate=${formattedEnd}`, {
                        headers: { 'Authorization': `Bearer ${user.accessToken}` }
                    });
                    console.log("this is data summary")
                    console.log(data)
                    setTotalRedeemedAmount(data?.totalAmountRedeemed)
                    setTotalRedeemedCount(data?.overallRedeemedCount)
                    if (data?.redeemedCount.length > 0) {
                        setRedeemedCount(prevCount => {
                            const newRedeemedCount = { ...prevCount }
                            data?.redeemedCount.forEach(({ _id, count }) => {
                                newRedeemedCount[_id] = count
                            })
                            return newRedeemedCount
                        })
                    } else {
                        setRedeemedCount({ '10': 0, '30': 0, '50': 0, '100': 0 })

                    }
                    if (data?.overallGeneratedCount.length > 0) {
                        setGeneratedCount(prevCount => {
                            const newGeneratedCount = { ...prevCount }
                            data?.overallGeneratedCount.forEach(({ _id, count }) => {
                                newGeneratedCount[_id] = count
                            })
                            return newGeneratedCount
                        })
                    } else {
                        setGeneratedCount({ '10': 0, '30': 0, '50': 0, '100': 0 })
                    }
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
        getSummary();
    }, [user, startDate, endDate]);


    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

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

                        <Box display='flex' flexDirection='row'>
                            <Box display='flex' flexDirection='column'>
                                <Box pt='12px' pl='5px'>
                                    <Typography
                                        className="graph-header"
                                    >
                                        {/* Generated */}
                                        <FormattedMessage
                                            id="revenue.generated"
                                            values={{ year: `${year}` }}
                                        />
                                    </Typography>
                                </Box>
                                <Box pt='5px' pl='5px'>
                                    <Typography
                                        className="graph-statistic"
                                    >
                                        {`RM ${totalGeneratedThroughYear}`}
                                    </Typography>
                                </Box>
                            </Box>


                            <Box display='flex' flexDirection='column' marginLeft='24px'>
                                <Box pt='12px' pl='5px'>
                                    <Typography
                                        className="graph-header"
                                    >
                                        {/* Redeemed */}
                                        <FormattedMessage
                                            id="total.amount.redeemed.year"
                                            values={{ year: `${year}` }}
                                        />
                                    </Typography>
                                </Box>
                                <Box pt='5px' pl='5px'>
                                    <Typography
                                        className="graph-statistic"
                                    >
                                        {`RM ${totalRedeemedThroughYear}`}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>


                    </Box>
                    <Box height="400px" m="-20px 0 0 0">
                        <LineChart isDashboard={true} monthlyGenerated={monthlyGenerated} monthlyRedeemed={monthlyRedeemed} />
                    </Box>
                </Box>
            </Box>

            {/* filter row */}
            <Box>
                <Box className="category">
                    <Box className="apply-filter" display='flex'>
                        <Box className="button-container">
                            <Button className="filter-button" startIcon={<CalendarMonthIcon className="iconSize" />} onClick={() => handleDateRangeChange('today')}><FormattedMessage id="today" /></Button>
                            <Button className="filter-button" startIcon={<CalendarMonthIcon className="iconSize" />} onClick={() => handleDateRangeChange('yesterday')}><FormattedMessage id="yesterday" /></Button>
                            <Button className="filter-button" startIcon={<CalendarMonthIcon className="iconSize" />} onClick={() => handleDateRangeChange('this-week')}><FormattedMessage id="this.week" /></Button>
                            <Button className="filter-button" startIcon={<CalendarMonthIcon className="iconSize" />} onClick={() => handleDateRangeChange('last-week')}><FormattedMessage id="last.week" /></Button>
                            <Button className="filter-button" startIcon={<CalendarMonthIcon className="iconSize" />} onClick={() => handleDateRangeChange('this-month')}><FormattedMessage id="this.month" /></Button>
                            <Button className="filter-button" startIcon={<CalendarMonthIcon className="iconSize" />} onClick={() => handleDateRangeChange('this-year')}><FormattedMessage id="this.year" /></Button>
                            <Button className="filter-button" startIcon={<CalendarMonthIcon className="iconSize" />} onClick={() => handleDateRangeChange('all-time')}><FormattedMessage id="all.time" /></Button>
                        </Box>
                    </Box>

                    <Box className="date-range" display='flex'>
                        <Box >
                            <label className="datepicker-text"><FormattedMessage id="start.date" /></label>
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                dateFormat="MM/dd/yyyy"
                            />
                        </Box>
                        <Box>
                            <label className="datepicker-text"><FormattedMessage id="end.date" /></label>
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                dateFormat="MM/dd/yyyy"
                            />
                        </Box>
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