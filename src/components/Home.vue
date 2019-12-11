<template>
  <el-container class="Home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="rightbox">
        <img src="../assets/logo.png" alt />
        <span>Vue商品后台管理系统</span>
      </div>
      <el-button type="info" @click="handleout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="ischeckout?'64px':'200px'">
        <div class="toggle-button" @click="handleshow">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          router
          :default-active="activepath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          :unique-opened="true"
          :collapse="ischeckout"
          :collapse-transition="false"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id.toString()" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.icon"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="sessionpath('/' + subitem.path)"
            >
              <template slot="title">
                <!--二级菜单的图标 -->
                <i class="el-icon-menu"></i>
                <!-- 二级菜单的文本 -->
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menulist: [],
      iconlist: [
        "iconfont icon-yonghuguanli",
        "iconfont icon-quanxianguanli",
        "iconfont icon-shangpinguanli",
        "iconfont icon-dingdanguanli",
        "iconfont icon-zhandianshujutongji"
      ],
      ischeckout: false,
      //element-ui里面的导航菜单二级菜单的高亮flag，只需路径就被激活
      activepath: ""
    };
  },
  created() {
    this.getmentlist();
    this.activepath = sessionStorage.getItem("path");
  },

  methods: {
    //   退出按钮逻辑
    handleout() {
      sessionStorage.clear();
      this.$router.push({ name: "Login" });
    },
    // 获取菜单列表
    getmentlist() {
      this.$http.get("menus").then(res => {
        this.menulist = res.data.data.map((item, i) => {
          item.icon = this.iconlist[i];
          return item;
        });
      });
    },
    // 点击菜单控制折叠与展开
    handleshow() {
      this.ischeckout = !this.ischeckout;
    },
    // 保存链接的激活状态
    sessionpath(path) {
      this.activepath = path;
      sessionStorage.setItem("path", path);
    }
  }
};
</script>

<style scoped lang="less">
.Home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .rightbox {
    display: flex;
    align-items: center;
    margin-left: -20px;
    img {
      width: 40px;
      height: 50px;
    }
    span {
      padding-left: 10px;
      color: white;
    }
  }
  .el-button {
    padding: 0;
    height: 40px;
    width: 80px;
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.el-menu {
  border-right: none;
  .el-submenu {
    .iconfont {
      padding-right: 8px;
    }
  }
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>