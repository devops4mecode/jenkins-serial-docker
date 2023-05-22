import * as React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Box, Button, Divider, Grid, MenuItem, Select, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Header from '../components/Header'
import LineChart from "../components/LineChart"
import totalRedeemCountIcon from '../assets/total-redeem-count.png'
import totalAmountRedeemedIcon from '../assets/total-redeemed-rm.png'
import totalGeneratedIcon from '../assets/total-generated.png'
import totalRedeemedIcon from '../assets/total-redeemed-count.png'
import mostRedeemedIcon from '../assets/most-redeemed.png'
import thirdIcon from '../assets/third.png'
import consolationIcon from '../assets/consolation.png'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import '../css/dashIndex.css'
import '../css/calendar.css'
import moment from 'moment';
import DatePicker from "react-datepicker";


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
                console.log(reportData)
            } catch (error) {
                console.log(error)
            }
        }
        getDashboard()
    }, [startDate, endDate])

    // const CustomInput = ({ value, onClick, onClear }) => (
    //     <Box
    //         sx={{
    //             display: 'flex',
    //             justifyContent: 'space-between',
    //             border: '0.5px solid #A5CDF7',
    //             borderRadius: '0.3rem',
    //             width: '13rem',
    //             height: '2rem',
    //             padding: '0.2rem 0.5rem',
    //             fontSize: '13px',
    //             color: '#474747',
    //             fontWeight: 500,
    //             alignItems: 'center',
    //         }}
    //         onClick={onClick}
    //     >
    //         <CalendarMonthOutlinedIcon sx={{ fontSize: '20px', color: '#2A75EA', marginRight: '4px' }} />
    //         <span style={{}}>{value}</span>
    //         {value && (
    //             <ClearIcon
    //                 sx={{ fontSize: '20px', color: '#999', cursor: 'pointer' }}
    //                 onClick={onClear}
    //             />
    //         )}
    //     </Box>
    // );

    // const handleStartDate = () => {
    //     setStartDate(null)
    // }

    // const handleEndDate = () => {
    //     setEndDate(null)
    // }



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
                        {/* {chartData ? (

                            <Box  height="400px" m="20px 0 0 0">
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

                                <LineChart isDashboard={true} monthlyGenerated={chartData.monthlyGenerated} monthlyRedeemed={chartData.monthlyRedeemed} />
                            </Box>
                        ) : (
                            <div>Loading...</div>
                        )} */}
                    </Grid>

                    <Grid item xs={12} sm={12} md={5} xl={4} >
                        <Box className="default-section">
                            <Box>
                                <Typography className='top-section-title'><FormattedMessage id='total' /></Typography>
                            </Box>
                            <Box className="top-inner-padding">
                                <Box display="flex" className="top-border-bottom">
                                    <Typography><img src={totalRedeemCountIcon} alt="total-generater" className="icon-inside" /></Typography>
                                    <Typography className="top-small-title"><FormattedMessage id='total.count.redeemed' /></Typography>
                                    <Divider className="top-divider" orientation="vertical" flexItem />
                                    <Typography className='small-count'>{reportData.overallRedeemedCount}</Typography>
                                </Box>

                                <Box display="flex" paddingTop={1}>
                                    <Typography><img src={totalAmountRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                    <Typography className="top-small-title"><FormattedMessage id='total.rm.redeemed' /></Typography>
                                    <Divider className="top-divider" orientation="vertical" flexItem />
                                    <Typography className='small-count'>{`RM ${reportData.totalAmountRedeemed}`}</Typography>
                                </Box>
                            </Box>
                        </Box>

                    </Grid>
                </Grid>
            </Box>

            <Box className="default-section">
                <Box className="apply-filter" display='flex'>
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

                {/* <Box>
                    <Box>
                        <label>to</label>
                        <DatePicker selected={startDate}
                            onChange={date => setStartDate(date)}
                            dateFormat="MM/dd/yyyy"
                        />
                    </Box>

                    <Box>
                    </Box>
                </Box> */}
            </Box>


            <Box className="default-section">
                <Box>
                    <Typography className='section-title'><FormattedMessage id='total.generated' /></Typography>
                </Box>

                <Grid container spacing={1} columns={12}>
                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ sm: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 5</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 10</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5 </Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 15</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ xl: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 20</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 30</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 50</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ sm: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 100</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 200</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 300</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 500</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 800</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalGeneratedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 1000</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box className="default-section">
                <Box>
                    <Typography className='section-title'><FormattedMessage id='total.redeemed.count' /></Typography>
                </Box>

                <Grid container spacing={1} columns={12}>
                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ sm: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 5</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 10</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 15</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ xl: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 20</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 30</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 50</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ sm: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 100</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 200</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 300</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 500</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 800</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={totalRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 1000</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box className="default-section">
                <Box>
                    <Typography className='section-title'><FormattedMessage id='most.redeemed.percentage' /></Typography>
                </Box>

                <Grid container spacing={1} columns={12}>
                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ sm: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 5</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 10</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 15</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ xl: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 20</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 30</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 50</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ sm: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 100</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 200</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 300</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 500</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 800</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={mostRedeemedIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> RM 1000</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box className="default-section">
                <Box>
                    <Typography className='section-title'><FormattedMessage id='top10' /></Typography>
                </Box>

                <Grid container spacing={1} columns={12}>
                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ sm: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={thirdIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> 1st</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={thirdIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> 2nd</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={thirdIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> 3rd</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ xl: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={consolationIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> 4th</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={consolationIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> 5th</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={consolationIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> 6th</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3} borderRight={{ sm: "1px solid #e3e4e6" }}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={consolationIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> 7th</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={consolationIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> 8th</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>

                            <Box display="flex" className="border-bottom">
                                <Typography><img src={consolationIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> 9th</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <Box className="inner-padding">
                            <Box display="flex" className="border-bottom">
                                <Typography><img src={consolationIcon} alt="total-generater" className="icon-inside" /></Typography>
                                <Typography className="small-title"> 10th</Typography>
                                <Divider className="divider" orientation="vertical" flexItem />
                                <Typography className='small-count'>5</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default Dashboard