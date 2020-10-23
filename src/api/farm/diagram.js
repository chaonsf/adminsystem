import request from '@/router/axios';

export const loadmore = (params, current) => {
    return request({
        url: '/api/mkx-diagram/diagram/list',
        method: 'get',
        params: {
            current,
            ...params,
        }
    })
}

export const getWeather = (ip) => {
    return request({
        // url:`/simpleWeather/query?city=${address}&key=4a0148118ccae393ea421519c76c2207`,
        url:`/s6/weather/now?location=${ip}&key=3032e1e99c9c4a06b0c07263db9c4751`,
        method:'get'
    })
}

export const getFarms = () => {
    return request({
        url:"/api/mkx-farm/farm/getFarms",
        method:'get'
    })
}

export const PostCopy = (params) => {
    return request({
        url:"/api/mkx-warn/warnsetting/copy",
        method:'post',
        params:{
            ...params
        }
    })
}