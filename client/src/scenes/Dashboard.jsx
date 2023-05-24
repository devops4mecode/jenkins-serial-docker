import * as React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Box, Button, Divider, Grid, MenuItem, Select, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Header from '../components/Header'
import LineChart from "../components/LineChart"
import totalRedeemCountIcon from '../assets/total-redeem-count.png'
import percentageIcon from '../assets/percentage.png'
import totalAmountRedeemedIcon from '../assets/total-redeemed-rm.png'
import totalGeneratedIcon from '../assets/total-generated.png'
import totalRedeemedIcon from '../assets/total-redeemed-count.png'
import calculatorIcon from '../assets/calculator.png'
import thirdIcon from '../assets/third.png'
import consolationIcon from '../assets/consolation.png'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import '../css/dashIndex.css'
import "react-datepicker/dist/react-datepicker.css"
import '../css/calendar.css'
import moment from 'moment';
import DatePicker from 'react-datepicker';

const Dashboard = () => {
    const { user } = useAuthContext()

    // Chart
    const [year, setYear] = useState(new Date().getFullYear());

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const [chartData, setChartData] = useState({
        // Before Chart
        totalGenerated: "",
        totalRedeemed: "",
        // Chart
        monthlyRedeemed: [],
        monthlyGenerated: [],
    })

    useEffect(() => {
        const getChart = async () => {
            try {
                const { data } = await axios.get(`api/dashboard/chart?${year}`, {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` }
                });
                setChartData(data)
            } catch (error) {
                console.log(error)
            }
        }
        getChart()
    }, [year])

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
                newStartDate = null;
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

    const [reportData, setReportData] = useState({
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
                const { data } = await axios.get(`api/dashboard/summary?startDate=${startFrom}&endDate=${endAt}`, {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` }
                });

                setReportData(data)
            } catch (error) {
                console.log(error)
            }
        }
        getDashboard()
    }, [startDate, endDate])

    const CustomInput = React.forwardRef(({ value, onClick, onClear }, ref) => (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                border: '0.5px solid #A5CDF7',
                borderRadius: '0.3rem',
                width: '13rem',
                height: '2rem',
                padding: '0.2rem 0.5rem',
                fontSize: '13px',
                color: '#474747',
                fontWeight: 500,
                alignItems: 'center',
            }}
            onClick={onClick}
        >
            <CalendarMonthOutlinedIcon sx={{ fontSize: '20px', color: '#2A75EA', marginRight: '4px' }} />
            <span style={{}}>{value}</span>
            {value && (
                <ClearIcon
                    sx={{ fontSize: '20px', color: '#999', cursor: 'pointer' }}
                    onClick={onClear}
                />
            )}
        </Box>
    ));

    const handleStartDate = () => {
        setStartDate(null)
    }

    const handleEndDate = () => {
        setEndDate(null)
    }


    return (
        <Box m="1.5rem 1.5rem">

            <Box>
                <Header
                    title={<FormattedMessage id="dashboard" />}
                    subtitle={<FormattedMessage id="dash.text" />}
                />
            </Box>

            <Box className="top-default-section">

                <Grid container spacing={1} columns={12}>
                    <Grid item xs={12} sm={12} md={7} xl={8} >
                        {chartData ? (

                            <Box height="400px" m="20px 0 0 0">
                                <Box>
                                    <Select
                                        value={year}
                                        label="Year"
                                        onChange={handleYearChange}
                                        style={{
                                            border: '1px solid #6200EE15',
                                            color: '#6200EE',
                                            fontSize: '14px',
                                            height: '35px'
                                        }}
                                    >
                                        <MenuItem value={2023}>2023</MenuItem>
                                        <MenuItem value={2022}>2022</MenuItem>
                                    </Select>
                                </Box>

                                <LineChart isDashboard={true} monthlyGenerated={chartData.monthlyGenerated} monthlyRedeemed={chartData.monthlyRedeemed} />
                            </Box>
                        ) : (
                            <div>Loading...</div>
                        )}
                    </Grid>

                    <Grid item xs={12} sm={12} md={5} xl={4} >
                        <Box className="topRight">

                            <Box className="default-section">
                                <Box>
                                    <Typography className='top-section-title'><FormattedMessage id='total' /></Typography>
                                </Box>
                                <Box className="top-inner-padding">
                                    <Box display="flex" className="top-border-bottom">
                                        <Typography><img src={totalAmountRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                        <Typography className="top-small-title"><FormattedMessage id='total.amount.generated' /></Typography>
                                        <Divider className="top-divider" orientation="vertical" flexItem />
                                        <Typography className='top-small-count'>{`RM ${chartData.totalGenerated}`}</Typography>
                                    </Box>

                                    <Box display="flex" paddingTop={1}>
                                        <Typography><img src={totalRedeemCountIcon} alt="total-generater" className="icon-inside" /></Typography>
                                        <Typography className="top-small-title"><FormattedMessage id='total.amount.redeemed' /></Typography>
                                        <Divider className="top-divider" orientation="vertical" flexItem />
                                        <Typography className='top-small-count'>{`RM ${chartData.totalRedeemed}`}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                    </Grid>
                </Grid>
            </Box>

            <Box className="default-section">
                <Box className="section-container" >
                    <Box className="button-container">
                        {/* Button For Change Date Range */}
                        {buttonData.map((button, index) => (
                            <Button
                                key={index}
                                className="filter-button"
                                startIcon={<CalendarMonthOutlinedIcon className="iconSize" />}
                                onClick={() => handleDateRangeChange(button.range)}
                            >
                                <FormattedMessage id={button.label} />
                            </Button>
                        ))}
                    </Box>

                </Box>
                <Grid container className="gridFilter" justifyContent="center">
                    <Grid item>
                        <label className='calendar-label'><FormattedMessage id='start.date' /></label>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                            customInput={<CustomInput onClear={handleStartDate} />}
                        />
                    </Grid>
                    <Grid item>
                        <label className='calendar-label'><FormattedMessage id='end.date' /></label>
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            dateFormat="dd/MM/yyyy"
                            customInput={<CustomInput onClear={handleEndDate} />}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box className="default-section">
                {/* <Box>
                    <Typography className='top-section-title'><FormattedMessage id='total' /></Typography>
                </Box> */}
                <Grid container columns={12}>
                    <Grid item xs={12} sm={6} md={6} xl={6} borderRight={{sm: "1px solid #e3e4e6" }}>
                        <Box className="mainDataSection" sx={{ justifyContent: { xs: 'center', md: 'end' } }}>
                            <Box className="mainTextSection">
                                <img src={calculatorIcon} alt="total-generater" className="icon-inside" />
                            </Box>
                            <Box className="mainTextSection">
                                <Typography className="main-small-count"><FormattedMessage id='total.count.redeemed' /></Typography>
                                <Typography className='main-small-title'>{reportData.overallRedeemedCount}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} xl={6}>
                        <Box className="mainDataSection" sx={{ justifyContent: { xs: 'center', md: 'start' } }}>
                            <Box className="mainTextSection">
                                <img src={totalRedeemCountIcon} alt="total-generater" className="icon-inside" />
                            </Box>
                            <Box className="mainTextSection">
                                <Typography className="main-small-count"><FormattedMessage id='total.rm.redeemed' /></Typography>
                                <Typography className='main-small-title'>{reportData.totalAmountRedeemed}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box className="big-default-section">
                <Grid container spacing={2} columns={12}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                        <Box className="default-section">
                            <Box>
                                <Typography className='section-title'><FormattedMessage id='total.generated' /></Typography>
                            </Box>

                            <Grid container spacing={1} columns={12}>
                                <Grid item xs={12} sm={6} md={6} lg={6} borderRight={{ sm: "1px solid #e3e4e6" }}>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 5</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[0]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 10</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[1]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 15</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[2]?.count}</Typography>
                                        </Box>
                                    </Box>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 20</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[3]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 30</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[4]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 50</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[5]?.count}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 100</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[6]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 200</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[7]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 300</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[8]?.count}</Typography>
                                        </Box>
                                    </Box>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 500</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[9]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 800</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[10]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalGeneratedIcon} alt="total-generated" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 1000</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.overallGeneratedCount[11]?.count}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                        <Box className="default-section">
                            <Box>
                                <Typography className='section-title'><FormattedMessage id='total.redeemed.count' /></Typography>
                            </Box>

                            <Grid container spacing={1} columns={12}>
                                <Grid item xs={12} sm={6} md={6} lg={6} borderRight={{ sm: "1px solid #e3e4e6" }}>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 5</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[0]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 10</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[1]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 15</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[2]?.count}</Typography>
                                        </Box>
                                    </Box>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 20</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[3]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 30</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[4]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 50</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[5]?.count}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 100</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[6]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 200</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[7]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 300</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[8]?.count}</Typography>
                                        </Box>
                                    </Box>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 500</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[9]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 800</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[10]?.count}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={totalRedeemedIcon} alt="total-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 1000</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.redeemedCount[11]?.count}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box className="big-default-section">
                <Grid container spacing={2} columns={12}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                        <Box className="default-section">
                            <Box>
                                <Typography className='section-title'><FormattedMessage id='most.redeemed.percentage' /></Typography>
                            </Box>

                            <Grid container spacing={1} columns={12}>
                                <Grid item xs={12} sm={6} md={6} lg={6} borderRight={{ sm: "1px solid #e3e4e6" }}>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 5</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[0]?.percentage.toFixed(2)} %</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 10</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[1]?.percentage.toFixed(2)} %</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 15</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[2]?.percentage.toFixed(2)} %</Typography>
                                        </Box>
                                    </Box>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 20</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[3]?.percentage.toFixed(2)} %</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 30</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[4]?.percentage.toFixed(2)} %</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 50</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[5]?.percentage.toFixed(2)} %</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 100</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[6]?.percentage.toFixed(2)} %</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 200</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[7]?.percentage.toFixed(2)} %</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 300</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[8]?.percentage.toFixed(2)} %</Typography>
                                        </Box>
                                    </Box>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 500</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[9]?.percentage.toFixed(2)} %</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 800</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[10]?.percentage.toFixed(2)} %</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={percentageIcon} alt="most-redeemed" className="icon-inside" /></Typography>
                                            <Typography className="small-title"> RM 1000</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.mostRedeemed[11]?.percentage.toFixed(2)} %</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
                        <Box className="default-section">
                            <Box>
                                <Typography className='section-title'><FormattedMessage id='top10' /></Typography>
                            </Box>

                            <Grid container spacing={1} columns={12}>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={thirdIcon} alt="top10" className="icon-inside" /></Typography>
                                            <Typography className="top10-small-title"> 1st</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.topTen[0]?.name}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={thirdIcon} alt="top10" className="icon-inside" /></Typography>
                                            <Typography className="top10-small-title"> 2nd</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.topTen[1]?.name}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={thirdIcon} alt="top10" className="icon-inside" /></Typography>
                                            <Typography className="top10-small-title"> 3rd</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.topTen[2]?.name}</Typography>
                                        </Box>
                                    </Box>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={consolationIcon} alt="top10" className="icon-inside" /></Typography>
                                            <Typography className="top10-small-title"> 4th</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.topTen[3]?.name}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={consolationIcon} alt="top10" className="icon-inside" /></Typography>
                                            <Typography className="top10-small-title"> 5th</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.topTen[4]?.name}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={consolationIcon} alt="top10" className="icon-inside" /></Typography>
                                            <Typography className="top10-small-title"> 6th</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.topTen[5]?.name}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={consolationIcon} alt="top10" className="icon-inside" /></Typography>
                                            <Typography className="top10-small-title"> 7th</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.topTen[6]?.name}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={consolationIcon} alt="top10" className="icon-inside" /></Typography>
                                            <Typography className="top10-small-title"> 8th</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.topTen[7]?.name}</Typography>
                                        </Box>

                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={consolationIcon} alt="top10" className="icon-inside" /></Typography>
                                            <Typography className="top10-small-title"> 9th</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.topTen[8]?.name}</Typography>
                                        </Box>
                                    </Box>
                                    <Box className="inner-padding">
                                        <Box display="flex" className="border-bottom">
                                            <Typography><img src={consolationIcon} alt="top10" className="icon-inside" /></Typography>
                                            <Typography className="top10-small-title"> 10th</Typography>
                                            <Divider className="divider" orientation="vertical" flexItem />
                                            <Typography className='small-count'>{reportData.topTen[9]?.name}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default Dashboard