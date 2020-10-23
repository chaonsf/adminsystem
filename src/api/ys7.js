import request from '@/router/axios';

// export const getToken = () => {
//   return request({
//     url: '/ys7/lapp/token/get?appKey=1ea8a5815b1b4e86b6ae33123b893b77&appSecret=d38c5fcdd75f20204a011dd714e48f8d',
//     method: 'post'
//   })
// }

// export const getToken1 = () => {
//   return axios.post('/ys7/lapp/token/get?appKey=1ea8a5815b1b4e86b6ae33123b893b77&appSecret=d38c5fcdd75f20204a011dd714e48f8d1',{}, {
//     headers: {
//       'Access-Control-Allow-Origin': '*',  //解决cors头问题
//       'Access-Control-Allow-Credentials': 'true', //解决session问题
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
//     }
//   })
// }

export const getToken = () => {
  return request({
    url: '/ys7/lapp/token/get',
    method: 'post',
    params: {
      appKey: "1ea8a5815b1b4e86b6ae33123b893b77",
      appSecret: "d38c5fcdd75f20204a011dd714e48f8d",
    }
  })
}

export const gethlsaddress=(data)=>{
    return request({
      url:'/ys7/lapp/live/address/limited',
      method:'post',
      params:data
    })
}
export const getLiveAddress = (accessToken, source) => {
  // console.info("accessToken=" + accessToken);
  // console.info("source=" + source);
  return request({
    url: '/ys7/lapp/live/address/get',
    method: 'post',
    params: {
      accessToken,
      source
    }
  })
}

export const ptzStart = (accessToken, deviceSerial, direction) => {
  return request({
    url: '/ys7/lapp/device/ptz/start',
    method: 'post',
    params: {
      accessToken,
      deviceSerial,
      channelNo: 1,
      direction,
      speed: 1,
    }
  })
}

export const ptzStop = (accessToken, deviceSerial, direction) => {
  return request({
    url: '/ys7/lapp/device/ptz/stop',
    method: 'post',
    params: {
      accessToken,
      deviceSerial,
      channelNo: 1,
      direction
    }
  })
}


export const ptzStopAll = (accessToken, deviceSerial) => {
  return request({
    url: '/ys7/lapp/device/ptz/stop',
    method: 'post',
    params: {
      accessToken,
      deviceSerial,
      channelNo: 1
    }
  })
}