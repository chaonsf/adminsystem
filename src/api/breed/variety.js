import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/breed/variety/list',
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
    url: '/api/breed/variety/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/breed/variety/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/breed/variety/submit',
    method: 'post',
    data: row
  })
}

export const getVariety = (id) => {
  return request({
    url: '/api/breed/variety/detail',
    method: 'get',
    params: {
      id
    }
  })
}

