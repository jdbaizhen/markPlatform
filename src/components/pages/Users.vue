<template>
<div style="margin-top: 15px;">
  <el-input placeholder="修改姓名" v-model="name" class="input-with-select">
    <el-button slot="append" type="primary" @click="changeName">确定</el-button>
  </el-input>
</div>
    
</template>

<script>
import axios from 'axios'
import { dataFarmat } from '@/utils/util.js'
import { Message } from 'element-ui'
export default {
    data() {
        return{
            name: '',
            id: ''
        }
    },
    mounted() {
        this.getNameInfo()
    },
    methods: {
        getNameInfo() {
            axios({
            url: '/user/showUserInfo',
            method: 'get'
            }).then( res => {
                if(res.data.result){
                    let data = JSON.parse(res.data.data)
                    this.id = data.id
                }else{
                    Message.error(res.data.message)
                }
            })
        },
        changeName() {
            let params = dataFarmat({name: this.name, id: this.id})
            axios({
                url: '/user/updateName',
                method: 'post',
                data: params
            }).then( res => {
                if(res.data.result){
                    Message.success('下次登陆后启用！！！')
                }else{
                    Message.error(res.data.message)
                }
            })
        }
    }
}
</script>

<style>

</style>
