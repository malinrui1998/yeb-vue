import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        routes:[]
    },

    //同步
    mutations:{
        initRoutes(state,data){
            state.routes=data;
        }
    },
    //异步
    actions:{

    }
})