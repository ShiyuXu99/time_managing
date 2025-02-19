
export const formatSecondsToHourMinute = (seconds) =>{
    const hour = Math.floor(seconds/3600)
    const minute = Math.floor((seconds%3600) /60)
    return [hour, minute]
}


export const getTitleAndColor = (key)=> {
    let arr = key.split(`(╯°□°）╯︵ ┻━┻`)
    return [arr[0], arr[1]]
}