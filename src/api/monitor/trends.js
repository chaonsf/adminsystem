import request from '@/router/axios';

export const getSoilInfoList = (farmId) => {
    return request({
        url: '/api/monitor/trends/getSoilInfo',
        method: 'get',
        params: {
            farmId,
        }
    })
}

export const getWaterInfoList = (farmId) => {
    return request({
        url: '/api/monitor/trends/getWaterInfo',
        method: 'get',
        params: {
            farmId,
        }
    })
}

export const getAirInfoList = (farmId) => {
    return request({
        url: '/api/monitor/trends/getAirInfo',
        method: 'get',
        params: {
            farmId,
        }
    })
}

export const getTrendsInfoList = (farmId) => {
    return request({
        url: '/api/monitor/trends/getTrendsInfo',
        method: 'get',
        params: {
            farmId,
        }
    })
}

