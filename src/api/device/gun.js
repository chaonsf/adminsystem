import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/device/camera/gun/list',
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
    url: '/api/device/camera/gun/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/device/camera/gun/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/device/camera/gun/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/device/camera/gun/submit',
    method: 'post',
    data: row
  })
}

export const getFarmCameras = () => {
  return request({
    url: '/api/device/camera/gun/getFarmCameras',
    method: 'get'
  })
}

