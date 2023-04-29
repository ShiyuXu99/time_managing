import moment from 'moment'
import {projectFirestore} from "../firebase/config";

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

const calculateTimeByDate = (endTime, startTime,totalSeconds, timerItem, taskByDate) => {
    let date = endTime.format('L')
    let data = {}

    if(isToday(startTime)){
        data = addInDataByDate(taskByDate, date, timerItem, totalSeconds)
    }
    else{
        let workTimeToday = Math.round(moment.duration(endTime.diff(moment().startOf('day'))).asSeconds())
        let workTimeYesterday = totalSeconds - workTimeToday

        let yesterday = endTime.subtract(1, 'days').format('L')
        data = addInDataByDate(taskByDate, date, timerItem, workTimeToday)
        data = addInDataByDate(data, yesterday, timerItem, workTimeYesterday)
    }

    return data;
}

export const recordToData = (hour, minute, second, timerItem, taskData, taskByDate) => {
    let totalSeconds = Number(hour) * 3600 + Number(minute) * 60 + Number(second)
    let endTime = moment()
    let startTime = endTime.clone().subtract(totalSeconds, 'second')

    if(!taskData[timerItem]) taskData[timerItem] = []
    taskData[timerItem].push({endTime: endTime.format(), startTime: startTime.format()})

    return [taskData, calculateTimeByDate(endTime, startTime, totalSeconds, timerItem, taskByDate)]
}


const TODAY = moment()
const YESTERDAY = TODAY.clone().subtract(1, 'days').startOf('day');


function isToday(momentDate) {
    return momentDate.isSame(TODAY, 'd');
}
function isYesterday(momentDate) {
    return momentDate.isSame(YESTERDAY, 'd');
}
// function isWithinAWeek(momentDate) {
//     return momentDate.isAfter(A_WEEK_OLD);
// }
// function isTwoWeeksOrMore(momentDate) {
//     return !isWithinAWeek(momentDate);
// }