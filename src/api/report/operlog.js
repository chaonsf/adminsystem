import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/mkx-operlog/operlog/list',
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
    url: '/api/mkx-operlog/operlog/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/mkx-operlog/operlog/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/mkx-operlog/operlog/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/mkx-operlog/operlog/submit',
    method: 'post',
    data: row
  })
}

export const getCity = (ip) => {
  return request({
    url:`/ipquery?ip=${ip}`,
    method:'get'
  })
}

