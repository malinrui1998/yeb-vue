import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

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
//比如：用户没有登录 而是直接通过修改浏览器 url 来访问网页，这种操作无疑是不安全的。
//路由导航守卫可以让我们对用户要跳转的路由做一次检查，符合条件后放行，不符合条件则强制用户跳转登录页面。
//路由导航守卫，to：跳转的目标路径 from：上一次所在的的路径 next：跳转的启动器，没有next无法完成跳转
router.beforeEach((to, from, next) => {
    //判断用户是否登录，没有token，说明没有登录，就不需要初始化刷新菜单
    if (window.sessionStorage.getItem('tokenStr')) {
        // 获取当前登录用户基本信息
        // if (!window.sessionStorage.getItem('user')) {// 如果user信息不存在，访问接口存入用户信息
        //     return getRequest('/admin/info').then(data => {
        //         // 判断用户信息是否存在
        //         if (data) {
        //             // 存入用户信息
        //             window.sessionStorage.setItem('user', JSON.stringify(data));
        //             next();
        //         }
        //     })
        // }
        //用户如果是登录的就初始化菜单
        initMenu(router, store)
        //阻断跳转参数，不写无法跳转
        next();
    } else {
        //如果不登陆，就让他去登录页面，判断目标路由是否是登录界面
        if (to.path === '/') {
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
