import request from '@/router/axios';

export const getList = (current, size, params) => {
    return request({
        url: '/api/breed/lairage/list',
        method: 'get',
        params: {
            ...params,
            current,
            size,
        }
    })
}

export const remove = (ids) => {
    return request({
        url: '/api/breed/lairage/remove',
        method: 'post',
        params: {
            ids,
        }
    })
}

export const add = (row) => {
    if (row.photourl) {
        row.photourl = row.photourl.join(';')
    }
    return request({
        url: '/api/breed/lairage/save',
        method: 'post',
        data: row
    })
}

export const update = (row) => {
    return request({
        url: '/api/breed/lairage/submit',
        method: 'post',
        data: row
    })
}