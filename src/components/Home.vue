<template>
  <div class="Home-container">
      <el-button type="info" @click="handleout">退出</el-button>
  </div>
</template>

<script>
export default {
    name:"Home",
    methods:{
        handleout(){
            sessionStorage.clear();
            this.$router.push({name:"Login"});
        }
    }
}
</script>

<style scoped lang="less">

</style>