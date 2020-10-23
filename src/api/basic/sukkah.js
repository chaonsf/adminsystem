import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/mkx-sukkah/sukkah/list',
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
    url: '/api/mkx-sukkah/sukkah/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/mkx-sukkah/sukkah/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/mkx-sukkah/sukkah/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/mkx-sukkah/sukkah/submit',
    method: 'post',
    data: row
  })
}

export const getSukkahTree = (farmId) => {
  return request({
    url: '/api/mkx-sukkah/sukkah/tree',
    method: 'get',
    params: {
      farmId,
    }
  })
}