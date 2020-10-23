import request from '@/router/axios';

export const getAirInfoList = (farmId) => {
  return request({
    url: '/api/monitor/trends/getAirInfo',
    method: 'get',
    params: {
      farmId,
    }
  })
}

