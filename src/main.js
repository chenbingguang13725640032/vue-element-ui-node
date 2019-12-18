import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from "axios"
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// axios拦截器
axios.interceptors.request.use(config=>{
  config.headers['Authorization'] = sessionStorage.getItem("token");
  // 在最后必须return config;这是固定语法
  return config;
})
Vue.prototype.$http = axios;

// 导入全局样式表
import "./assets/css/global.css"
// 导入阿里字体图标库
import "./assets/css/iconfont.css"
import TreeTable from "vue-table-with-tree-grid"
Vue.config.productionTip = false
Vue.component("tree-table",TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
