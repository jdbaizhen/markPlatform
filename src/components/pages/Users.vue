<template>
</div>
<el-container>
    <el-header>
        <breadcrumb :data="breadcrumbText"></breadcrumb>
    </el-header>
    <el-container>
        <el-main class="main-table main-mark-info">
            <h3>标注信息管理</h3>
        </el-main>
        <el-aside class="main-table aside-user-info">
            <h3>个人信息管理</h3>
            <el-input placeholder="修改姓名" v-model="name" class="input-with-select">
                <el-button slot="append" type="primary" @click="changeName">确定</el-button>
            </el-input>
        </el-aside>
    </el-container>
</el-container>
</template>

<script>
import axios from 'axios'
import { dataFarmat } from '@/utils/util.js'
import { Message } from 'element-ui'
import Breadcrumb from '@/components/component/Breadcrumb.vue'
export default {
    data() {
        return{
            name: '',
            id: '',
            breadcrumbText: [
                {path: '/users', name: '个人信息管理'}
            ]
        }
    },
    components: {
        Breadcrumb
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
.main-mark-info{
    background: rgba(255,255,255,0.5);
}
.aside-user-info{
    padding: 10px;
    background: rgba(255,255,255,0.5);
}
</style>
