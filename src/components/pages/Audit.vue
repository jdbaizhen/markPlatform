<template>
    <el-container>
        <el-header height="80">
            <Breadcrumb :data="searchBreadcrumb"></Breadcrumb>
            <el-form
                :inline="true"
                v-model="auditForm"
            >
                <el-form-item label="">
                    <el-input v-model="auditForm.name" placeholder="任务名称"></el-input>
                </el-form-item>
                <!-- <el-form-item label="">
                    <el-select v-model="auditForm.taskType" placeholder="任务类型"> 
                        <el-option v-for="(item, index) in taskTypes" :label="item.label" :value="item.value" :key="index"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="">
                    <el-input v-model="auditForm.username" placeholder="标注人员"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker v-model="auditForm.beginTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="起始时间" @change="getTime(0, $event)"></el-date-picker>
                </el-form-item>
                 <el-form-item label="">
                    <el-date-picker v-model="auditForm.endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="终止时间"  @change="getTime(1, $event)"></el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="submitForm">查询</el-button>
                    <el-button type="default" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main>
            <Breadcrumb :data="listBreadcrumb"></Breadcrumb>
            <el-table
                v-loading="loading"
                :data="auditTable"
                width="100%"
            >
                <el-table-column prop="id" label="#"></el-table-column>
                <el-table-column prop="taskType" label="任务类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.taskType == '1'">24小图标注</span>
                        <span v-else>矩形标注</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="任务名称"></el-table-column>
                <el-table-column prop="count" label="标记数量"></el-table-column>
                <el-table-column prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column prop="status" label="任务状态">
                    <template slot-scope="scope">
                        <el-tag
                            v-if="scope.row.status == 2"
                            type="success"
                        >
                            已完成
                        </el-tag>
                        <el-tag 
                            v-else
                            type="danger"
                        >
                            未完成
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="标注人员"></el-table-column>
                <el-table-column prop="status" label="修改任务状态">
                    <template slot-scope="scope">
                         <el-select v-model="changeTaskStatus" size="mini" class="uniftyWidth" @change="changeTaskState(scope.row.id)">
                            <el-option value="3">矩形框审核完成</el-option>
                            <el-option v-show="scope.row.taskType != 1" value="0">矩形框任务驳回</el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" v-show="scope.row.taskType != '1'" size="small" @click="goAuditPhoto(scope.row.id)">审 核</el-button>
                        <router-link :to="{path: '/clothestypeaudit', query:{id: scope.row.id}}"><el-button type="text" v-show="scope.row.taskType == '1'" size="small">审 核</el-button></router-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="aduitPage"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="pageCount"></el-pagination>
        </el-footer>
    </el-container>
</template>

<script>
import Breadcrumb from '@/components/component/Breadcrumb.vue'
import { timeFormat, dataFarmat } from '@/utils/util.js'
import { getSession } from '@/utils/session.js'
import { Message } from 'element-ui'
import axios from 'axios'
import url from '@/api/audit.js'
export default {
    data() {
        return {
            loading: false,
            searchBreadcrumb: [
                { path: '/task', name: '任务管理'},
                { path: '/aduit', name: '审核列表'},
                { path: '', name: '搜索'}
            ],
            listBreadcrumb: [
                { path: '/task', name: '任务管理'},
                { path: '/aduit', name: '审核列表'},
                { path: '', name: '列表'}
            ],
            auditForm: {
                name: '',
                username: '',
                taskType: '',
                beginTime: '',
                endTime: '',
                pageIndex: 1
            },
            taskStatusList: [
                { label: '任务驳回', value: 5},
                { label: '审核完成', value: 3},
            ],
            taskTypes: [
                { label: '矩形标注', value: 0 },
                { label: '24小图标注', value: 1 }
            ],
            auditTable: [],
            pageCount: 0,
            aduitPage: 1,
            changeTaskStatus: '',
        }
    },
    components: {
        Breadcrumb
    },
    mounted() {
        let isLogin = getSession('isLogin');
        if(isLogin){
            this.getAuditTable()
        }
    },
    methods: {
        getAuditTable() {
            this.loading = true
            let params = dataFarmat(this.auditForm)
            axios({
                url: url.getAuditTable+'?'+params,
                method: 'get'
            }).then( res => {
                if(res.data.result){
                    let data = JSON.parse(res.data.data)
                    this.pageCount = data.count
                    this.auditTable = data.details
                    this.loading = false
                }else{
                    Message.error(res.data.message)
                    this.loading = false
                }
            })
        },
        getTime(num, date) {
            let time = timeFormat(date)
            if(num == 0){  
                this.auditForm.beginTime = time
            }else if(num == 1){
                this.auditForm.endTime = time
            }
        },
        submitForm() {
            this.auditForm.pageIndex = 1
            this.getAuditTable()
            this.aduitPage = 1
        },
        resetForm() {
            this.auditForm = {
                name: '',
                username: '',
                taskType: '',
                beginTime: '',
                endTime: '',
                pageIndex: 1
            }
        },
        changeTaskState(personId){
            if(confirm('确认更改状态？')){
                let status = this.changeTaskStatus
                let params = dataFarmat({id: personId, status: status})
                axios({
                    url: url.changeTaskStatus,
                    method: 'post',
                    data: params
                }).then( res => {
                    if(res.data.result){
                        Message.success('修改状态成功')
                        this.changeTaskStatus = ''
                        this.getAuditTable()
                    }else{
                        Message.error(res.data.message)
                    }
                })
            }
        },
        handleCurrentChange(val) { 
            this.auditForm.pageIndex = val;
            this.getAuditTable()
        },
        goAuditPhoto(id) {
            window.location.href = "./audit.html?tid=" + id;
        }
    }
}
</script>

<style>
.uniftyWidth{
    width: 100px
}
</style>
