import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/device/camera/dome/list',
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
    url: '/api/device/camera/dome/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/device/camera/dome/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/device/camera/dome/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/device/camera/dome/submit',
    method: 'post',
    data: row
  })
}

export const getFarmCameras = () => {
  return request({
    url: '/api/device/camera/dome/getFarmCameras',
    method: 'get'
  })
}

