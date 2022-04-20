import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'

import {postRequest} from './utils/api';
import {putRequest} from './utils/api';
import {getRequest} from './utils/api';
import {deleteRequest} from './utils/api';
import {initMenu} from "./utils/menus";

Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;


//路由导航守卫是为了路由跳转之前做的检查及操作
router.beforeEach((to, from, next) => {
    //判断用户是否登录，没有token，说明没有登录，就不需要初始化刷新菜单
    if (window.sessionStorage.getItem('tokenStr')) {
        //用户如果是登录的就初始化菜单
        initMenu(router, store)
        // 获取当前登录用户基本信息
        if (!window.sessionStorage.getItem('user')) {
            // 如果user信息不存在，访问接口存入用户信息
            return getRequest('/admin/info').then(resp => {
                // 判断用户信息是否存在
                if (resp) {
                    // 存入用户信息
                    window.sessionStorage.setItem('user', JSON.stringify(resp));
                    next();
                }
            })
        }
        //阻断跳转参数，不写无法跳转
        next();
    } else {
        //如果不登陆，就让他去登录页面，判断目标路由是否是登录界面
        if (to.path == '/') {
            // 访问的登录页，直接跳转
            next();
        } else {
            // 访问的其他界面，先登录在跳转到之前想访问但是没进去的页面
            next('/?redirect=' + to.path);
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
