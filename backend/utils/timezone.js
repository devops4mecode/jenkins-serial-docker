const moment = require('moment-timezone');

// Set TimeZone to UTC+8
moment.tz.setDefault('Asia/Singapore')

const startTime = moment().startOf('day').toDate()
const timeNow = moment().toDate()
const endTime = moment().endOf('day').toDate();
const yearStart = moment().startOf('year').toDate()
const yearEnd = moment().endOf('year').toDate()

// Convert Time To Start Of Day Date Time
const convertDayStart = (date) => {
    return moment(date).startOf('day').toDate();
}

// Convert Time To End Of Day Date Time
const convertDayEnd = (date) => {
    return moment(date).endOf('day').toDate();
}

const convertYearStart = (year) => {
    return moment(year).startOf('year').toDate()
}

const convertYearEnd = (year) => {
    return moment(year).endOf('year').toDate()
}

const convertExpiryTime = (mins) => {
    return moment().add(mins, 'minutes').toDate()
}

const setAngpaoID = (str) => `A${moment().format('MMDD')}${str.slice(-6)}`;

module.exports = {
    startTime,
    timeNow,
    endTime,
    yearStart,
    yearEnd,
    convertDayStart,
    convertDayEnd,
    convertYearStart,
    convertYearEnd,
    convertExpiryTime,
    setAngpaoID,
};
