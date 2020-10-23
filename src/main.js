import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import store from './store';
import { loadStyle } from './util/util'
import * as urls from '@/config/env';
import Element from 'element-ui';
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import VCharts from 'v-charts'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VCharts)
Vue.use(VueQuillEditor, /* { default global options } */)
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: 'oBvDtR6nzWtVchkY4cLHtnah1VVZQKRK'
  })

import waterfall from 'vue-waterfall2'
Vue.use(waterfall)

import VuePreview from 'vue-preview'
Vue.use(VuePreview)

// import VeHistogram from 'v-charts/lib/histogram.common'
// import VeMap from 'v-charts/lib/map.common'
// Vue.component(VeHistogram.name, VeHistogram)
// Vue.component(VeMap.name, VeMap)

import {
    iconfontUrl,
    iconfontVersion
} from '@/config/env';
import i18n from './lang' // Internationalization
import './styles/common.scss';

import basicContainer from './components/basic-container/main'

Vue.use(router)
Vue.use(VueAxios, axios)
Vue.use(Element, {
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(Avue, {
    i18n: (key, value) => i18n.t(key, value)
})
//注册全局容器
Vue.component('basicContainer', basicContainer)
// 加载相关url地址

Object.keys(urls).forEach(key => {
    Vue.prototype[key] = urls[key];
})
Vue.prototype.$msg=(obj)=>{
   Vue.prototype.$message({
       message:obj.msg,
       type:obj.type?obj.type:'error',
        duration:2000
    })
}
Vue.prototype.$popup=(obj)=>{
    Vue.prototype.$confirm(obj.text,obj.title?obj.title:'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(()=>{
         obj.ok()
    }).catch(()=>{
         if(obj.cancel){
             obj.cancel()
         }
    })
}
// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
    loadStyle(iconfontUrl.replace('$key', ele));
})

Vue.config.productionTip = false;
// 使axios支持finally
require('promise.prototype.finally').shim();

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')