import request from '@/router/axios';

export const getList = (current, size, params) => {
    return request({
        url: '/api/mkx-livestock/livestock/list',
        method: 'get',
        params: {
            ...params,
            current,
            size,
        }
    })
}

export const getUpdate = (row) => {
    return request({
        url: '/api/mkx-livestock/livestock/update',
        method: 'get',
        params:row
    })
}