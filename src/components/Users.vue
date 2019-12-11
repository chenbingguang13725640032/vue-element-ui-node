<template>
  <div class="User-container">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="params.query" clearable @clear="getuserlist">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handledisplay">添加用户</el-button>
        </el-col>
      </el-row>
      <hr />
      <!-- 用户列表区 -->
      <el-table :data="userlist" style="width: 100%" border>
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- eleui中的作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="handleswitchchange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showsetDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeuserid(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <hr />
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="handlecleardialog">
      <!-- 内容主体区域 -->
      <el-form :model="ruleForm" :rules="ruleFormrules" ref="ruleFormref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogVisible2"
      width="30%"
      @close="handlecleardialog2"
    >
      <el-form :model="setForm" ref="setFormref" :rules="setFormrules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="setForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="setForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="setForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="adduser2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    // 验证邮箱的正则表达式
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 验证手机号的正则表达式
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      userlist: [],
      params: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      total: 0,
      // 控制添加用户框的显示与隐藏
      dialogVisible: false,
      // 添加用户的表单数据
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户的表单验证规则对象
      ruleFormrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 控制用户修改框的显示隐藏
      dialogVisible2: false,
      // 查询到的用户信息对象
      setForm: {},
      // 修改表单的验证规则对象
      setFormrules: {
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getuserlist();
  },
  methods: {
    getuserlist() {
      this.$http.get("users", { params: this.params }).then(res => {
        this.userlist = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    // 监听eleui中的pagesize改变时触发的事件处理函数
    handleSizeChange(newSize) {
      console.log(newSize);
      this.params.pagesize = newSize;
      this.getuserlist();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newpage) {
      console.log(newpage);
      this.params.pagenum = newpage;
      this.getuserlist();
    },
    // 监听switch开关的状态改变
    handleswitchchange(userinfoobj) {
      console.log(userinfoobj);
      this.$http
        .put(`users/${userinfoobj.id}/state/${userinfoobj.mg_state}`)
        .then(res => {
          let { status } = res.data.meta;
          if (status != 200) {
            // 服务端错误的话，就不要把userinfoobj的状态存起来了，吧他的状态改回之前的状态
            userinfoobj.mg_state = !userinfoobj.mg_state;
            this.$message.error("修改状态失败");
            return;
          }
          this.$message.success("修改状态成功");
        });
    },
    // 点击添加用户按钮让模态窗口展示
    handledisplay() {
      this.dialogVisible = true;
    },
    // 监听添加用户对话框的关闭事件
    handlecleardialog() {
      this.$refs.ruleFormref.resetFields();
    },
    // 点击按钮添加新用户
    adduser() {
      this.$refs.ruleFormref.validate(vaild => {
        if (vaild === false) {
          return;
        }
        // 表示表单预验证通过，发起请求
        this.$http.post("users", this.ruleForm).then(res => {
          this.dialogVisible = false;
          // 重新获取用户列表数据
          this.getuserlist();
          this.$message.success("添加用户成功");
        });
      });
    },
    // 点击修改操作
    showsetDialog(id) {
      this.$http.get(`users/${id}`).then(res => {
        this.setForm = res.data.data;
        this.dialogVisible2 = true;
      });
    },
    // 监听修改用户对话框的关闭事件
    handlecleardialog2() {
      this.$refs.setFormref.resetFields();
    },
    // 修改用户信息并提交
    adduser2() {
      this.$refs.setFormref.validate(vaild => {
        if (vaild != true) {
          this.$message.error("请填写正确的用户信息");
          return;
        }
        this.$http
          .put(`users/${this.setForm.id}`, {
            email: this.setForm.email,
            mobile: this.setForm.mobile
          })
          .then(res => {
            this.setForm = res.data.data;
            this.dialogVisible2 = false;
            this.$message.success("修改用户信息成功!~");
          });
      });
    },
    // 根据id删除用户信息
    removeuserid(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          this.$http
            .delete(`users/${id}`)
            .then(res => {
              this.getuserlist();
            })
            .catch(err => {
              this.$message.error("删除失败");
            });
          this.$message.success("删除用户成功");
        })
        .catch(err => {
          this.$message.info("已取消删除");
        });
    }
  }
};
</script>

<style scoped lang="less">
</style>