<template>
<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item index="0" class="logo-container">
      <img :src="logo" alt="">
  </el-menu-item>
  <el-submenu index="1">
    <template slot="title">任务管理</template>
    <el-menu-item index="1-1">任务列表</el-menu-item>
    <el-menu-item index="1-2">审核列表</el-menu-item>
  </el-submenu>
  <el-menu-item index="2">矩形标注</el-menu-item>
  <el-menu-item index="3">多边形标注</el-menu-item>
  <el-menu-item index="4">批量导出</el-menu-item>
  <el-submenu index="5">
    <template slot="title">图片库管理</template>
    <el-menu-item 
      v-for="(item, index) in machineList" 
      :key="index"
      :index="item.number">
      {{item.label}}
    </el-menu-item>
  </el-submenu>
  <el-menu-item index="7" class="nav-admin">注销</el-menu-item>
  <el-menu-item index="6" class="nav-admin">用户</el-menu-item>
</el-menu>
</template>
<script>
import logo from '@/assets/images/logo2.png'
export default {
    data() {
      return {
        activeIndex: '1-1',
        logo: logo,
        machineList: [
            { label: '一号机', number: '5-1'},
            { label: '二号机', number: '5-2'},
            { label: '三号机', number: '5-3'},
            { label: '四号机', number: '5-4'},
            { label: '五号机', number: '5-5'},
        ]
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
}
</script>
<style>
.logo-container{
    margin-right: 30% !important;
}
.nav-admin{
    float: right !important;
    width: 50px;
    text-align: center;
    padding: 0;
}
</style>
