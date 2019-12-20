import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login.vue"
import Home from "../components/Home.vue"
import Welcome from "../components/Welcome.vue"
import Users from "../components/users/Users.vue"
import Rights from "../components/power/Rights.vue"
import Roles from "../components/power/Roles.vue"
import Cate from "../components/goods/Cate.vue"
import Params from "../components/goods/Params.vue"
Vue.use(VueRouter)

const routes = [
  { path: "/", redirect: "/Login" },
  { path: "/Login", component: Login, name: "Login" },
  {
    path: "/Home", component: Home, name: "Home", redirect: "/Welcome", children: [
      { path: "/Welcome", component: Welcome },
      { path: "/Users", component: Users },
      { path: "/Rights", component: Rights },
      { path: "/Roles", component: Roles },
      { path: "/categories", component: Cate },
      { path: "/params", component: Params }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // to代表将要访问的路径
  // from 代表从哪个路径跳转而来
  // next是一个函数，表示放行
  // next()放行 ， next('/Login')表示强制跳转到Login页
  if (to.path === "/Login") {
    // 用户访问登录页，不需要做权限控制直接放行
    next();
    return;
  } else {
    let token = sessionStorage.getItem("token");
    // 如果token不存在就证明你没有登录，那既然你没有登录就该让你强制跳转到登录页面
    if (!token) {
      next("/Login");
      return;
    }
    // 如果存在就直接放行
    next()
  }
})

export default router
