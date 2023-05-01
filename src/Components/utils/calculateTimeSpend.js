import moment from 'moment'
let TODAY;


const addInDataByDate = (taskByDate, date, timerItem, totalSeconds) =>{
    //if there's no date for today, initialize to {}
    if(!taskByDate[date]){
        taskByDate[date] = {}
        taskByDate[date][timerItem] = 0
    }
    //if there is date for today, check the data
    //today's data, might have timerItem, might not
    let todayData = taskByDate[date]
    //if doesn't have timer Item
    if(!todayData[timerItem]) todayData[timerItem] = 0
    todayData[timerItem] += totalSeconds

    return taskByDate
}

export const calculateTimeByDate = (endTime, startTime, totalSeconds, timerItem, taskByDate) => {
    TODAY = endTime.clone();
    let date = endTime.clone().format('L')
    let data = {}

    if(isToday(startTime)){
        data = addInDataByDate(taskByDate, date, timerItem, totalSeconds)
    }
    else{
        let workTimeToday = Math.round(moment.duration(endTime.diff(TODAY.startOf('day'))).asSeconds())
        let workTimeYesterday = totalSeconds - workTimeToday

        let yesterday = TODAY.subtract(1, 'days').format('L')
        data = addInDataByDate(taskByDate, date, timerItem, workTimeToday)
        data = addInDataByDate(data, yesterday, timerItem, workTimeYesterday)
    }

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

    const dateData =  calculateTimeByDate(endTime, startTime, totalSeconds, timerItem, taskByDate)
    const todayData = recordTodayData(endTime, startTime, totalSeconds, timerItem, dataByToday)

    return [dateData, todayData]
}