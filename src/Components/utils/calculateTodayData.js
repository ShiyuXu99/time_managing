import moment from "moment";
import {getTitleAndColor} from "./generalCalculation";

export const formatTodayGraphData = (data) => {
    let keys = data? Object.keys(data): []
    let dataToday = []

    keys.forEach(item => {
        let arr = item.split(`(╯°□°）╯︵ ┻━┻`)
        let [color, title] = [arr[0], arr[1]]
        let itemList = data[item]
        itemList.forEach(itemData => {
            dataToday.push({
                startDate: itemData.startTime,
                endDate: itemData.endTime,
                title: title,
                color: color
            })
        })
    })

    return dataToday;
}


export const getTodayDoughnutData = (data) => {
    let doughnutData = []
    let todayDate = moment().format('MM/DD/YYYY')
    // data = data? data: {}
    let todayData = data[todayDate]

    let keys = todayData && Object.keys(todayData)
    let labelList = [], backgroundColorList = [], dataNum = []
    keys && keys.forEach(key => {
        const [color, title] = getTitleAndColor(key)
        labelList.push(title)
        backgroundColorList.push(color)
        dataNum.push(Math.floor(todayData[key]/60))
    })

    doughnutData = {
        labels: labelList,
        datasets: [{
            data: dataNum,
            backgroundColor: backgroundColorList
        }]
    }

    return doughnutData;
}

// export const getTotalNum = (data) => {
//     let total = 0
//     if(data){
//         let dataNum = data['datasets'][0]['data']
//         dataNum.forEach(item => total += item)
//     }
//     let hour = Math.floor(total/60)
//     let minutes = total % 60
//     return `${hour}h ${minutes} min`
// }