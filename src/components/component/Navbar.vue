<template>
<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item index="0" class="logo-container">
      <img :src="logo" alt="">
  </el-menu-item>
  <el-submenu index="1">
    <template slot="title">任务管理</template>
    <router-link to="/task" tag="li"><el-menu-item index="1-1">任务列表</el-menu-item></router-link>
    <router-link to="/audit" tag="li"><el-menu-item index="1-2">审核列表</el-menu-item></router-link>
    <router-link to="/log" tag="li" v-show="task_log_search"><el-menu-item index="1-3">日志列表</el-menu-item></router-link>
  </el-submenu>
  <el-menu-item index="2" onclick="window.location.href='./index.html'">矩形标注</el-menu-item>
  <el-menu-item index="3" onclick="window.location.href='./index2.html'">多边形标注</el-menu-item>
  <el-menu-item index="4" @click="goPages('Export')" v-show="batch_export">批量导出</el-menu-item>
  <el-submenu index="5" v-show="check_picture">
    <template slot="title">图片库管理</template>
    <el-menu-item 
      v-for="(item, index) in machineList" 
      :key="index"
      :index="item.number"
      @click="goPhotos(index+1)"
      >
      {{item.label}}
    </el-menu-item>
  </el-submenu>
  <el-menu-item index="7" class="nav-admin" @click="logout">注销</el-menu-item>
  <el-menu-item index="6" class="nav-admin">{{admin}}</el-menu-item>
</el-menu>
</template>
<script>
import logo from '@/assets/images/logo2.png'
import { Message } from 'element-ui'
import axios from 'axios'
import url from '@/api/login.js'
import { getSession, removeSession } from '@/utils/session.js'
export default {
    data() {
      return {
        activeIndex: '1-1',
        logo: logo,
        admin: '用户',
        machineList: [
            { label: '一号机', number: '5-1'},
            { label: '二号机', number: '5-2'},
            { label: '三号机', number: '5-3'},
            { label: '四号机', number: '5-4'},
            { label: '五号机', number: '5-5'},
        ],
        check_picture: false,
        batch_export: false,
        task_log_search: false 
      };
    },
    mounted() {
      let isLogin = getSession('isLogin')
      let roleString = getSession('role')
      if(roleString.indexOf('check_picture') != -1){
        this.check_picture = true
      }
      if(roleString.indexOf('batch_export') != -1){
        this.batch_export = true
      }
      if(roleString.indexOf('task_log_search') != -1){
        this.task_log_search = true
      }   
      if(isLogin){    
      }else{
        this.$router.push({path: '/login'})
      }
      this.getNameInfo()
    },
    methods: {
      getNameInfo() {
        axios({
          url: url.getName,
          method: 'get'
        }).then( res => {
          if(res.data.result){
            let data = JSON.parse(res.data.data)
            this.admin = data.name
          }else{
            Message.error(res.data.message)
          }
        })
      },
      handleSelect(key, keyPath) {
        
      },
      logout() {
        removeSession('role')
        removeSession('isLogin')
        this.$router.push({name: 'Login'}) 
      },
      goPages(pathName) {
        this.$router.push({name: pathName})
      },
      goPhotos(index) {
        this.$router.push({name: 'Photo', query: { machine: index}}) 
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
