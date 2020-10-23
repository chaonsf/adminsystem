import request from '@/router/axios';

export const getData = (farmIdStr) => {
    return request({
        url: '/api/mkx-report/report/livestock',
        method: 'get',
        params: {
            farmId: farmIdStr
        }
    })
}