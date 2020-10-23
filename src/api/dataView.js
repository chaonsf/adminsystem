import request from '@/router/axios';

export const gettrendsInfo = (farmId) => {
    return request({
      url: '/api/no-auth/tracing/getTrendsInfo',
      method: 'get',
      params: {
        farmId,
      }
    })
}

export const getDetail = (id) => {
    return request({
      url: '/api/no-auth/tracing/farm-detail',
      method: 'get',
      params: {
        id,
      }
    })
}