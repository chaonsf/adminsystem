import request from '@/router/axios';
import qs from 'qs'
export const zone=(data)=>request({  //有权限获取省市区数据
    url: '/api/zone',
    method: 'GET',
    params:data
})
export const provinceAndcity=(data)=>request({  //不需要权限获取省市区数据
     url: '/api/zone/children',
     method: 'GET',
     params:data
 })

export const listByTime=(data)=>request({  //扶贫列表
     url:'/api/web/poverty',
     method:'get',
     params:data
}) 
export const  helpdetail=(data)=>request({    
     url:`/api/web/poverty/${data}`,
     method:'get',
     params:{}
})
export const helpBusiness=(obj)=>request({
     url:`/api/web/gov/farm/${obj.id}`,
     method:'get',
     params:obj.data
})
export const cameraslist=(data)=>request({
     url:`/api/web/gov/cameras/${data}`,
     method:'get',
     params:{}
})
export const photolist=(data)=>request({
      url:'/api/web/gov/photos',
      method:'get',
      params:data
})
export const statistics=(data)=>request({
     url:'/api/web/poverty/statistics',
     method:'get',
     params:data
})
export const sendMsg=(data)=>request({  //获取验证码
     url:"/api/blade-auth/sms-code",
     method:'get',
     params:data
})
export const adminMsg=()=>request({
      url:'/api/web/gov/admin',
      method:'get',
})
export const changeAdmin=(data)=>request({  
      url:'/api/web/gov/change-admin',
      method:'post',
      params:data
})
export const changePhone=(data)=>request({
     url:"/api/web/gov/change-phone",
     method:'post',
     params:data
})
export const changepassword=(data)=>request({
     url:'/api/web/gov/change-pwd',
     method:'post',
     params:data
})
/* 环保局 */
export const farmlist=(data)=>request({
     url:'/api/web/gov/farm/list',
     method:'get',
     params:data
})
export const testData=(data)=>request({
     url:`/api/web/env/monitor`,
     method:'get',
     params:data
})
export const fenyewatch=(data)=>request({
      url:'/api/web/env/monitor-page',
      method:'get',
      params:data
})
/* 农业局 */
export const varieties=(data)=>request({
      url:"/api/breed/variety/selector",
      method:'get',
      params:data
})
export const dictionary=(data)=>request({
      url:'/api/blade-system/dict/dictionary',
      method:'get',
      params:data
})
export const attribute=(data)=>request({
      url:'/api/mkx-livestock/livestock/property-selector',
      method:'get',
      params:data
})
export const livestockinfarm=(data)=>request({
    url:'/api/web/agriculture/livestock-in-farm',
    method:'get',
    params:data
})
export const status=()=>request({
      url:'/api/mkx-livestock/livestock/status-selector',
      method:'get'
})
export const livestocklist=(data)=>request({
      url:'/api/web/agriculture/livestock-list',
      method:'get',
      params:data
})
export const livestockdetail=(data)=>request({
     url:'/api/web/agriculture/livestock-detail',
     method:'get',
     params:data
})
export const accessbarlists=(data)=>request({
      url:'/api/web/agriculture/oper-list',
      method:'get',
      params:data
})
export const accessbarchart=(data)=>request({
      url:'/api/web/agriculture/oper-statistics',
      method:'get',
      params:data
})
export const helpoorlist=(data)=>request({
      url:'/api/web/agriculture/poverty-list',
      method:'get',
      params:data
})
export const statisticsarea=(data)=>request({
      url:'/api/web/agriculture/oper-statistics-area',
      method:'get',
      params:data
})
export const livestockarea=(data)=>request({
      url:'/api/web/agriculture/livestock-in-area',
      method:'get',
      params:data
})
/* 无害化 */
export const harmlesslist=(data)=>request({
      url:'/api/web/agriculture/harmless-list',
      method:'get',
      params:data
})
export const examine=(data)=>request({
       url:'/api/web/agriculture/harmless-examine',
       method:'post',
       params:data
})
export const harmlessdetailtable=(data)=>request({
      url:'/api/web/agriculture/harmless-detail',
      method:'get',
      params:data
})
/* 保险 */
export const insurancequery=(data)=>request({
       url:'/api/web/insurance',
       method:'get',
       params:data
})
export const subjectlist=(data)=>request({
      url:'/api/web/insurance/assets',
      method:'get',
      params:data
})
export const instatus=()=>request({   //保单查询状态
      url:'/api/web/insurance/ins-status-selector',
      method:'get'
})
export const insexam=(data)=>request({
       url:'/api/web/insurance/ins-examine',
       method:'post',
       params:data
})

export const claimstatus=()=>request({  //理赔状态列表
      url:'/api/web/insurance/claim-status-selector',
      method:'get'
})

export const claimlist=(data)=>request({
      url:'/api/web/insurance/claim-list',
      method:'get',
      params:data
})
export const provedetail=(data)=>request({
      url:'/api/web/insurance/claim-detail',
      method:'get',
      params:data
})
export const claimexam=(data)=>request({
       url:'/api/web/insurance/claim-examine',
       method:'post',
       params:data
})
export const instype=(data)=>request({  //险种
       url:'/api/web/insurance/ins-prod-list',
       method:'get',
       params:data
})
export const shelf=(data)=>request({
      url:'/api/web/insurance/ins-prod-manage',
      method:'post',
      params:data
})
export const insurstatus=()=>request({   //保险产品状态下拉框 上架下架
      url:'/api/web/insurance/ins-prod-status-selector',
      method:'get',
})
export const addinsurance=(data)=>request({
      url:'/api/web/insurance/ins-prod-update',
      method:'post',
      data:qs.stringify(data)

})
export const insurancedetail=(data)=>request({
      url:'/api/web/insurance/ins-prod-detail',
      method:'get',
      params:data
})
/* 商务控制台 */
export const infotype=()=>request({
      url:'/api/web/business-console/information-type-selector',
      method:'get'
})
export const infolist=(data)=>request({
      url:'/api/web/business-console',
      method:'get',
      params:data
})
export const addnew=(data)=>request({
      url:'/api/web/business-console/add',
      method:'post',
      data:qs.stringify(data)
})
export const newdetail=(data)=>request({
      url:'/api/web/business-console/detail',
      method:'get',
      params:data
})
export const dellist=(data)=>request({
      url:'/api/web/business-console/del',
      method:'post',
      params:data
})
export const baselist=(data)=>request({
      url:'/api/web/business-console/farm-locate-list',
      method:'get',
      params:data
})
export const basestatus=()=>request({
      url:'/api/web/business-console/locate-status-selector',
      method:'get'
})
export const entrypass=(data)=>request({
      url:'/api/web/business-console/locate-examine',
      method:'post',
      params:data
})
export const entrydetail=(data)=>request({
      url:'/api/web/business-console/locate-detail',
      method:'get',
      params:data
})