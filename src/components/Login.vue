<template>
  <div class="Login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="login-boxpositionimg">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form label-width="0px" class="login-form" :model="Loginform" :rules="rules" ref="formdom">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-yonghu" v-model="Loginform.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-suo" v-model="Loginform.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="handlelogin">登录</el-button>
          <el-button type="info" @click="handlermoveform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 登录表单的双向数据绑定
      Loginform: {
        username: "",
        password: ""
      },
      // 表单的验证规则对象
      rules: {
        //   验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        // 验证密码是否合法
        password:[
             { required: true, message: "请输入登录密码", trigger: "blur" },
             { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
      handlermoveform(){
        //   console.log(this.$refs.formdom);
        this.$refs.formdom.resetFields();
      },
    //   表单提交预处理,会检查上面的表单验证规则是否通过，从而返回相对应的布尔值
      handlelogin(){
          this.$refs.formdom.validate((vaild)=>{
            //   console.log(vaild)
            if(vaild === false){
                return;
            }else{
                this.$http.post("login",this.Loginform).then(res=>{
                   let { status } = res.data.meta;
                   if(status != 200){
                       this.$message.error("登录失败")
                       return;
                   }
                    this.$message.success("登录成功") 
                    // 登录成功后吧token值保存一下咯，保存到sessionStorage中，注意啊localStorage是持久保存在浏览器缓存中，cokke和
                    // sessionStorage都是只在浏览器保持会话通信期间有用，也就是浏览器一关缓存数据立即消失
                    let { token } = res.data.data;
                    sessionStorage.setItem("token",token);
                    // 登录成功并保存token值到了sessionStorage中就可以带着缓存中的token请求接下来的接口了，因为token值是代表用户身份验证的唯一标识
                    // 登录成功后编程式导航跳转到Home主页
                    this.$router.push({name:"Home"})
                })
            }
          })
      }
  }
};
</script>

<style scoped lang="less">
.Login-container {
  background-color: #2b4b6b;
  height: 100%;
  .login-box {
    background-color: white;
    width: 450px;
    height: 300px;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -225px;
    .login-boxpositionimg {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      top: -25%;
      transform: translate(-50%);
      background-color: white;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      // 默认form表单样式box-sizing：conetnt；
      box-sizing: border-box;

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>