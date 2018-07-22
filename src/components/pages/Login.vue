<template>
  <div class="login-container">
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
        v-model="password">
      </el-input>
      <el-button
        type="success"
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
import logo from '@/assets/images/logo.png'
import axios from 'axios'
import url from '@/api/login.js'
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      logo: logo
    }
  },
  created () {
    this.setAxiosHeaders()
  },
  methods: {
    setAxiosHeaders() {
      axios.interceptors.request.use(
        config => {
          config.headers['Content-Type'] = 'application/json;'
          return config
        },
        err => {
            return Promise.reject(err)
      })
    },
    loginUser() {
      axios({
        url: url.login,
        method: 'post',
        data: {
          admin: this.username, 
          pwd: this.password
        }
      }).then( res => {
        console.log(res);
      })
    },
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.login-container{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: url('../../assets/images/login-bg.jpg');
  background-size: 100% 100%;
  text-align: center;
}
.login-form{
  position: absolute;
  left: 50%;
  top: 50%;
  width: 400px;
  height: 280px;
  background: rgba(255,255,255,0.15);
  padding: 35px 50px;
  border-radius: 12px;
  transform: translate(-200px,-140px);
}
.login-input{
  margin-top:20px;
  margin-bottom: 5px;
}
.login-btn{
  margin-top: 35px;
  width: 100%;
  height: 40px;
}
</style>
