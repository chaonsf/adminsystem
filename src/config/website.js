/**
 * 全局配置文件
 */
import {getToken} from "@/util/auth"
export default {
  title: "壹农源智慧供应链管理平台",
  indexTitle: '智慧供应链管理平台',
  clientId: 'mkxweb', // 客户端id
  clientSecret: 'mkx_secret1', // 客户端密钥
  tenantMode: false, // 是否开启租户模式
  logo: "S",
  key: 'MKXWEB',//配置主键,目前用于存储
  lockPage: '/lock',
  tokenTime: 6000,
  uploadUrl:'/api/alioss/imgupload',
  header:{
      'Blade-Auth':'bearer '+ getToken()
   },
  //http的status默认放行不才用统一处理的,
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children'
    }
  }
}
