import moment from 'moment'
let TODAY;
let recordOnSameDay;


const addInDataByDate = (startTime, endTime, taskByDate, date, timerItem, totalSeconds) =>{

    //if there's no date for today, initialize to {}
    let yesterday = TODAY.subtract(1, 'days').format('L');
    taskByDate = taskByDate || {};

    taskByDate[date] = taskByDate[date] || {};
    taskByDate[date][timerItem] = taskByDate[date][timerItem] || { totalTime: 0, detailRecords: [] };
    

    //Pull out the itemData record
    let todayData = taskByDate[date]
    if(recordOnSameDay){
        pushNewTimeRecord(todayData, startTime, endTime, totalSeconds, timerItem)
    }
    else{
        //initialize data for yesterday if no records
        taskByDate[yesterday] = taskByDate[yesterday] || {};
        taskByDate[yesterday][timerItem] = taskByDate[yesterday][timerItem] || { totalTime: 0, detailRecords: [] };

        let yesterdayData = taskByDate[yesterday]
        let [yesterdayRecord, todayRecord] = getTimeRanges(startTime, endTime);
        pushNewTimeRecord(todayData, todayRecord?.start, todayRecord?.end, todayRecord?.totalSeconds, timerItem)
        pushNewTimeRecord(yesterdayData, yesterdayRecord?.start, yesterdayRecord?.end, yesterdayRecord?.totalSeconds, timerItem)

    }

    return taskByDate
}

const pushNewTimeRecord = (data, startTime, endTime, totalSeconds, timerItem) => {
    console.log(totalSeconds)
    data[timerItem].totalTime = data[timerItem].totalTime + totalSeconds;
    data[timerItem].detailRecords.push({startTime: startTime.format('YYYY-MM-DDTHH:mm:ss.sssZ'), endTime: endTime.format('YYYY-MM-DDTHH:mm:ss.sssZ')})
}


export const calculateTimeByDate = (startTime, endTime, totalSeconds, timerItem, taskByDate) => {
    TODAY = endTime.clone();
    let date = endTime.clone().format('L')
    let data = addInDataByDate(startTime, endTime, taskByDate, date, timerItem, totalSeconds)
    console.log(data, "logging data")

    return data;
}


const addDataToday = (todayData, startTime, endTime, date, timerItem) => {
        if(!todayData) todayData = {}
        if(!todayData[timerItem]) todayData[timerItem] = []
        todayData[timerItem].push({endTime: endTime.format('YYYY-MM-DDTHH:mm:ss.sssZ'), startTime: startTime.format('YYYY-MM-DDTHH:mm:ss.sssZ')})
    return todayData
}

export const recordTodayData = (endTime, startTime, totalSeconds, timerItem, todayData) => {
    let date = endTime.format('L')
    let data = {}

    if(!isToday(startTime)){
        let newStartTime = TODAY.startOf('day')
        todayData = {}
        data = addDataToday(todayData, newStartTime, endTime, date, timerItem)
    }
    else{
        data = addDataToday(todayData, startTime, endTime, date, timerItem)
    }
    return data;
}


function isToday(momentDate) {
    return momentDate.isSame(TODAY, 'd');
}


export const updateTodayDataAndTaskData = (totalSeconds, timerItem, taskByDate,dataByToday) => {
    const endTime = moment()
    let startTime = endTime.clone().subtract(totalSeconds, 'second')

    recordOnSameDay = areSameDay(startTime, endTime)

    const dateData =  calculateTimeByDate(endTime, startTime, totalSeconds, timerItem, taskByDate)
    const todayData = recordTodayData(endTime, startTime, totalSeconds, timerItem, dataByToday)

    return [dateData, todayData]
}



function areSameDay(time1, time2) {
    return time1.isSame(time2, 'day');
}

function getTimeRanges(startTime, endTime) {
    // Times span across two different days
    const endOfStartDay = startTime.clone().endOf('day');
    const startOfEndDay = endTime.clone().startOf('day');

    // Calculate the total seconds for each range
    const totalSecondsFirstRange = endOfStartDay.diff(startTime, 'seconds');
    const totalSecondsSecondRange = endTime.diff(startOfEndDay, 'seconds');

    return [
        { start: startTime, end: endOfStartDay, totalSeconds: totalSecondsFirstRange },
        { start: startOfEndDay, end: endTime, totalSeconds: totalSecondsSecondRange }
    ];
}