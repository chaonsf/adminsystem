

export const calcDate = (date1, date2) => {
    var date3 = date2 - date1;

    var days = Math.floor(date3 / (24 * 3600 * 1000))

    var leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数  
    var hours = Math.floor(leave1 / (3600 * 1000))

    var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数  
    var minutes = Math.floor(leave2 / (60 * 1000))

    var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数  
    var seconds = Math.round(date3 / 1000)
    return {
        leave1,
        leave2,
        leave3,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
    }
}
/**
 * 日期格式化
 */
export function dateFormat(date) {
    let format = 'yyyy-MM-dd hh:mm:ss';
    if (date != 'Invalid Date') {
        var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] :
                        ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }
    return '';

}

export function dateFormatPattern(date, format) {
    if (date != 'Invalid Date') {
        var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] :
                        ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }
    return '';

}
export const padDate=(value)=>{
    return value < 10 ? '0' + value : value;
}
export const today=()=>{
    var date = new Date();
    var year = padDate(date.getFullYear());
    var month = padDate(date.getMonth()+1);
    var yesterday;
     if(date.getDate()!=1){
          yesterday=year + '-' + month + '-' + padDate(date.getDate()-1)
     }else{
         if(month!=1){
             yesterday=year + '-' + padDate(date.getMonth()); + '-' + 30
         }else{
             yesterday=year-1+'12-31'
         }
     }
   var day = padDate(date.getDate());
   var todayTime = year + '-' + month + '-' + day
   var oldyear
   if(month!=12){
       month=padDate(date.getMonth()+2)
        oldyear=year-1+'-'+month+'-01'
   }else{
        oldyear=year+'-01-01'
   }
   
   
  return {todayTime,oldyear,yesterday}
}