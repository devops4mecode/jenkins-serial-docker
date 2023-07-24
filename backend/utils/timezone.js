const moment = require('moment-timezone');

// Set TimeZone to UTC+8
moment.tz.setDefault('Asia/Singapore')

// Convert Time To Start Of Day Date Time
const convertDayStart = (date) => {
    return moment(date).startOf('day').toDate()
}

// Convert Time To End Of Day Date Time
const convertDayEnd = (date) => {
    return moment(date).endOf('day').toDate()
}

const convertYearStart = (year) => {
    return moment(year).startOf('year').toDate()
}

const convertYearEnd = (year) => {
    return moment(year).endOf('year').toDate()
}

const getMonthStart = () => {
    return moment().startOf('month').toDate()
}

const subtractDays = (count) => {
    return moment().subtract(count, 'days').toDate()
}

const getMonthEnd = () => {
    return moment().endOf('month').toDate()
}

module.exports = {
    convertDayStart,
    convertDayEnd,
    convertYearStart,
    convertYearEnd,
    getMonthStart,
    getMonthEnd,
    subtractDays,
};
