import request from '@/router/axios';

export const getList = (current, size, params) => {
    return request({
        url: '/api/mkx-warninglog/warninglog/list',
        method: 'get',
        params: {
            ...params,
            current,
            size,
        },
    })
}

export const remove = (ids) => {
    return request({
        url: '/api/mkx-warninglog/warninglog/remove',
        method: 'post',
        params: {
            ids,
        }
    })
}

export const markRead = (ids) => {
    return request({
        url: '/api/mkx-warninglog/warninglog/markRead',
        method: 'post',
        params: {
            ids,
        }
    })
}

export const getDifList = () => {
    return request({
        url:"/api/mkx-warninglog/warninglog/count-by-warn-type",
        method:'get'
    })
}

