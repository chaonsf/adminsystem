import moment from "moment"
export const tonow=()=>{
     let now=moment().format("YYYY-MM-DD hh:mm:ss")
     return now
}
export const beforeoneday=()=>{
     let yesterday=moment().subtract(24,'hour').format("YYYY-MM-DD hh:mm:ss")
     return yesterday
}
export const beforeoneweek=()=>{
     let oneweek=moment().subtract(7,'day').format("YYYY-MM-DD hh:mm:ss")
     return oneweek
}
export const beforeonemonth=()=>{
    let onemonth=moment().subtract(1,'month').format("YYYY-MM-DD hh:mm:ss")
    return onemonth
}
export const beforethreemonth=()=>{
    let threemonth=moment().subtract(3,'month').format("YYYY-MM-DD hh:mm:ss")
    return threemonth
}
export const beforeoneyear=()=>{
     let oneyear=moment().subtract(1,'year').format("YYYY-MM-DD hh:mm:ss")
     return oneyear
}