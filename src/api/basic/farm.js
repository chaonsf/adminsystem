import request from '@/router/axios';

export const getList = (current, size, params) => {
    return request({
        url: '/api/mkx-farm/farm/list',
        method: 'get',
        params: {
            ...params,
            current,
            size,
        }
    })
}

export const getDetail = (id) => {
    return request({
        url: '/api/mkx-farm/farm/detail',
        method: 'get',
        params: {
            id
        }
    })
}

export const remove = (ids) => {
    return request({
        url: '/api/mkx-farm/farm/remove',
        method: 'post',
        params: {
            ids,
        }
    })
}

export const add = (row) => {
    return request({
        url: '/api/mkx-farm/farm/submit',
        method: 'post',
        data: row
    })
}

export const update = (row) => {
    return request({
        url: '/api/mkx-farm/farm/submit',
        method: 'post',
        data: row
    })
}

export const getFarmTree = (tenantId) => {
    return request({
        url: '/api/mkx-farm/farm/tree',
        method: 'get',
        params: {
            tenantId,
        }
    })
}

export const getindexList = (params) => {
    return request({
        url: '/api/no-auth/data/home',
        method: 'get',
        params:{
            ...params
        }
    })
}

export const getFlag = (chipNo) => {
    return request({
        url: '/api/no-auth/tracing',
        method: 'get',
        params: {
            chipNo,
        }
    })
}

export const getPhotos = (params) => {
    return request({
        url: '/api/no-auth/tracing/diagram-list',
        method: 'get',
        params: {
            ...params
        }
    })
}

export const getEntryAudit = (params) => {
    return request({
        url: '/api/blade-user/userAuditList',
        method: 'get',
        params:{
            ...params
        }
    })
}

export const putEntryAudit = (id,userId,name,idcard) => {
    return request({
        url: '/api/blade-user/userAudit',
        method: 'put',
        params:{
            id:userId,
            status:id,
            name:name,
            idCard:idcard
        }
    })
}

export const getLocateList = (params) => {
    return request({
        url: '/api/mkxLocate/locate/list',
        method: 'get',
        params:{
            ...params
        }
    })
}
