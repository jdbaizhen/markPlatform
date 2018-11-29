<template>
  <div class="login-container" id="mydiv">
    <div class="login-form">
      <img :src="logo" alt="">
      <el-input
        class="login-input"
        placeholder="用户名"
        prefix-icon="el-icon-edit"
        v-model="username">
      </el-input>
      <el-input
        class="login-input" 
        placeholder="密码"
        prefix-icon="el-icon-goods"
        type="password"
        v-model="password"
        >
      </el-input>
      <el-button
        type="default"
        size="medium"
        class="login-btn"
        @click="loginUser"
      >
        登   陆
      </el-button>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/images/logo2.png'
import axios from 'axios'
import url from '@/api/login.js'
import { setSession } from '@/utils/session.js'
import { Message } from 'element-ui'
import canvasParticlefrom from '@/utils/canvas-particle.js'
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      logo: logo
    }
  },
  mounted() {
    const config = {
		        vx: 6,	//小球x轴速度,正为右，负为左
		        vy: 6,	//小球y轴速度
		        height: 2,	//小球高宽，其实为正方形，所以不宜太大
		        width: 2,
		        count: 500,		//点个数
		        color: "121, 162, 185", 	//点颜色
		        stroke: "130,255,255", 		//线条颜色
		        dist: 9000, 	//点吸附距离
		        e_dist: 20000, 	//鼠标吸附加速距离
		        max_conn: 10 	//点到点最大连接数
		    }
    canvasParticlefrom.canvasInit(config)
  },
  methods: {
    loginUser() {
      axios({
        url: url.login,
        method: 'post',
        data: {
          admin: this.username, 
          pwd: this.password
        },
        transformRequest: [function (data) {
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
        return ret
       }],
      }).then( res => {
        if(res.data.result){
          let role = JSON.parse(res.data.data)
          let roleArr = []
          role.forEach((value, index) => {
            roleArr.push(value.code)
          })
          setSession('role', roleArr);
          setSession('isLogin',true);
          this.$router.push({path: '/task'});
        }else{
          Message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style>
.login-container{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;
}
.login-form{
  position: absolute;
  left: 50%;
  top: 50%;
  width: 400px;
  height: 280px;
  padding: 35px 50px;
  border: 1px solid rgba(0,245,255,0.7);
  background-color: rgba(0,245,255,0.1);
  box-shadow: 0 0 0 1px hsla(240,0%,100%,.3) inset, 0 .5em 1em rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  transform: translate(-200px,-140px);
}
.login-input{
  margin-top:20px;
  margin-bottom: 5px;
}
.login-btn{
  margin-top: 35px;
  background: rgba(0,245,255,0.5);
  border: none;
  width: 100%;
  height: 40px;
  color: #fff;
}
.login-btn:hover{
  background: rgba(0,238,118,0.5);
  color: #fff;
}
</style>
