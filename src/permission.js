/**
 * 全站权限配置
 *
 */
import router from './router/router'
import store from './store'
import { validatenull } from '@/util/validate'
import { getToken ,setToken} from '@/util/auth'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import Storage from "@/util/storage"
import { format } from 'date-fns'
const storage=new Storage
NProgress.configure({ showSpinner: false });
const lockPage = store.getters.website.lockPage; //锁屏页
router.beforeEach((to, from, next) => {
    //缓冲设置
    if (to.meta.keepAlive === true && store.state.tags.tagList.some(ele => {
        return ele.value === to.fullPath;
    })) {
        to.meta.$keepAlive = true;
    } else {
        NProgress.start()
        if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
            to.meta.$keepAlive = true;
        } else {
            to.meta.$keepAlive = false;
        }
    }
    const url = window.location.pathname
    const meta = to.meta || {};
    let token=storage.getItem('ynyuserinfo')
    
    if(token){
        store.commit('SET_TOKEN', token.accessToken);
        store.commit('SET_USERIFNO', token);
        if(!from.name){
            store. commit('DEL_ALL_TAG');
        }
        store.commit('CLEAR_LOCK');

     // let map= store.getters.tagWel
     // router.push({ path: map.value });
  /*       let param={
            username:'admin',
            password:'admin',
            type: "account",
            grantType:'password'
        }
        console.log("map:",map)
        store.dispatch("LoginByUsername",param).then(res=>{
            router.push({ path: map.value });
        }) */

    }
    if (getToken()) {
        if (store.getters.isLock && to.path != lockPage) { //如果系统激活锁屏，全部跳转到锁屏页
            next({ path: lockPage })
        } else if (to.path === '/login') { //如果登录成功访问登录页跳转到主页
            next({ path: '/' })
        } else {
            //如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
            if (store.getters.token.length === 0) {
                store.dispatch('FedLogOut').then(() => {
                   // next({ path: '/login' })
                   window.location.href='https://ynyiot.com/#/'
                })
            } else {
                const value = to.query.src || to.fullPath;
                const label = to.query.name || to.name;
                const meta = to.meta || router.$avueRouter.meta || {};
                const i18n = to.query.i18n;
                if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
                    store.commit('ADD_TAG', {
                        label: label,
                        value: value,
                        params: to.params,
                        query: to.query,
                        meta: (() => {
                            if (!i18n) {
                                return meta
                            }
                            return {
                                i18n: i18n
                            }
                        })(),
                        group: router.$avueRouter.group || []
                    });
                }
                next()
            }
        }
    }else if(url === '/dataView'){
        if( meta.isAuth === false ){
            next()
        }else{
            next('/dataView')
        }
    } else {
        if (meta.isAuth === false) {
            next()
        }else{
          // next('/login')
           if(process.env.NODE_ENV=='development'){
             next('/login')
           }else{
               window.location.href='https://ynyiot.com/#/' 
           }
          
        }
    }
})

router.afterEach(() => {
    NProgress.done();
    let title = store.getters.tag.label;
    let i18n = store.getters.tag.meta.i18n;
    title = router.$avueRouter.generateTitle(title, i18n)
    //根据当前的标签也获取label的值动态设置浏览器标题
    router.$avueRouter.setTitle(title);
});
