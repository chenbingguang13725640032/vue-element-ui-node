<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddcatedialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        show-index
        :data="catelist"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        index-text="#"
        border
        :show-row-hover="false"
        class="treetable"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" @close="addCatedialogclosed" :visible.sync="dialogVisible" width="50%">
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <el-cascader
            clearable
            :options="parentCateList"
            v-model="selectedkeys"
            :props="{ expandTrigger: 'hover',...catshow, checkStrictly: true }"
            @change="handleChangeselect"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      // 查询条件
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      catelist: [],
      total: 0,
      // 为table指定列的定义
      columns: [
        { label: "分类名称", prop: "cat_name" },
        //   表示将当前定义为模板列             表示当前这一列使用模板名称
        { label: "是否有效", type: "template", template: "isok" },
        { label: "排序", type: "template", template: "order" },
        { label: "操作", type: "template", template: "opt" }
      ],
      // 控制分类对话框的显示与隐藏
      dialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      catshow: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 选中的父级分类的id数组
      selectedkeys: []
    };
  },
  created() {
    this.getcatelist();
  },
  methods: {
    // 获取商品分类数据
    getcatelist() {
      this.$http.get(`categories`, { params: this.queryinfo }).then(res => {
        this.catelist = res.data.data.result;
        this.total = res.data.data.total;
      });
    },
    // 监听pagesize改变
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize;
      this.getcatelist();
    },
    // 监听pagenum的改变
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getcatelist();
    },
    // 点击按钮，展示添加分类的对话框
    showaddcatedialog() {
      // 先获取父级分类的数据列表
      this.dialogVisible = true;

      // 再展示出对话框
      this.getParentCateList();
    },

    // 获取父级分类的数据列表
    getParentCateList() {
      this.$http.get("categories", { params: { type: 2 } }).then(res => {
        let { data } = res.data;
        this.parentCateList = data;
        // console.log(this.parentCateList[0].cat_name)
      });
    },
    // 选择项发生变化触发这个函数
    handleChangeselect() {
      console.log(this.selectedkeys);
      // 如果selectedkeys数组中的length大于0，证明选中的父级分类
      // 反正，就说明没有选中任何父级分类
      if(this.selectedkeys.length>0){
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedkeys[this.selectedkeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedkeys.length
        return;
      }else{
          // 父级分类的id
        this.addCateForm.cat_pid = 0;
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击按钮添加新的分类
    addCate(){
      this.$refs.addCateFormRef.validate(vaild=>{
        if(!vaild) return;
        this.$http.post("categories",this.addCateForm).then(res=>{
          console.log(res)
          this.getcatelist();
          this.dialogVisible = false;
          this.$message.success("添加分类成功！")
        })
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCatedialogclosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedkeys = [];
      this.addCateForm.cat_level = 0;
       this.addCateForm.cat_pid = 0;
    }
  }
};
</script>

<style scoped lang="less">
.treetable {
  margin-top: 15px;
}
</style>