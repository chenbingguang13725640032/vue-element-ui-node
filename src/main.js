import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from "axios"
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
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
Vue.filter("dateFormat",function(originVal){
  let dt = new Date(originVal);
  let y = dt.getFullYear()
  let m = (dt.getMonth() + 1 + "").padStart(2,"0")
  let d = (dt.getDate() + "").padStart(2,"0")
  let hh = (dt.getHours() + "").padStart(2,"0")
  let mm = (dt.getMinutes() + "").padStart(2,"0")
  let ss = (dt.getSeconds() + "").padStart(2,"0")
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.component("tree-table",TreeTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
