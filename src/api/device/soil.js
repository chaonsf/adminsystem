import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/device/sensor/soil/list',
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
    url: '/api/device/sensor/soil/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/device/sensor/soil/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/device/sensor/soil/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/device/sensor/soil/submit',
    method: 'post',
    data: row
  })
}
