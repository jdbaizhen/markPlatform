<template>
    <el-container>
        <el-header height="80">
            <breadcrumb :data="searchBreadcrumb"></breadcrumb>  
            <el-form v-model="logForm" :inline="true">
                 <el-form-item label="">
                    <el-input v-model="logForm.username" placeholder="标注人员" size="small"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="logForm.taskLogTid" placeholder="任务编号" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="logForm.taskLogOperate" placeholder="任务状态" size="small">
                        <el-option v-for="(item, index) in taskStatus" :key="index" :value="item" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker v-model="logForm.beginTime" type="datetime" size="small" format="yyyy-MM-dd HH:mm:ss" placeholder="起始时间" @change="getTime(0, $event)"></el-date-picker>
                </el-form-item>
                 <el-form-item label="">
                    <el-date-picker v-model="logForm.endTime" type="datetime" size="small" format="yyyy-MM-dd HH:mm:ss" placeholder="终止时间"  @change="getTime(1, $event)"></el-date-picker>
                </el-form-item>
                <el-form-item label="" class="search-btn-group">
                    <el-button type="primary" icon="el-icon-search" size="small" @click="submitForm"></el-button>
                    <el-button type="warning" size="small" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main-table">
            <!-- <breadcrumb :data="listBreadcrumb"></breadcrumb>   -->
            <el-table
                v-loading="loading"
                :data="logTable"
                width="100%"
            >
                <el-table-column label="任务编号" prop="task.id"></el-table-column>
                <el-table-column label="任务状态" prop="taskLogOperate"></el-table-column>
                <el-table-column label="修改时间" prop="taskLogTime"></el-table-column>
                <el-table-column label="标注人员" prop="userInfo.name"></el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-pagination
              class="paginations"
              @current-change="handleCurrentChange"
               :current-page.sync="logPage"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="pageCount"></el-pagination>
        </el-footer>
    </el-container>
</template>

<script>
import Breadcrumb from '@/components/component/Breadcrumb'
import { Message } from 'element-ui'
import { timeFormat, dataFarmat } from '@/utils/util.js'
import { getSession } from '@/utils/session.js'
import axios from 'axios'
import url from '@/api/log.js'
export default {
    data() {
        return {
            loading: false,
            searchBreadcrumb: [
                {path: '/task', name: '任务管理'},
                {path: '/log', name: '日志'},
                // {path: '', name: '搜索'},
            ],
            listBreadcrumb: [
                {path: '/task', name: '任务管理'},
                {path: '/log', name: '日志'},
                {path: '', name: '列表'},
            ],
            logForm: {
                username: '',
                taskLogTid: '',
                taskLogOperate: '',
                beginTime: '',
                endTime: '',
                pageIndex: 1
            },
            taskStatus: [
                '任务发布', '任务驳回', '任务完成', '审核完成','任务转移'
            ],
            logTable: [],
            pageCount: 0,
            logPage: 1
        }
    },
    components: {
        Breadcrumb
    },
    mounted() {
        let isLogin = getSession('isLogin');
        if(isLogin){
            this.getLogTable()
        }  
    },
    methods: {
        getLogTable() {
            this.loading = true
            let params = dataFarmat(this.logForm)
            axios({
                url: url.getLogTable+'?'+params,
                method: 'get'
            }).then( res => {
                if(res.data.result){
                    let data = JSON.parse(res.data.data)
                    this.pageCount = data.count
                    this.logTable = data.details
                    this.loading = false
                }else{
                    Message.error(res.data.message)
                }
            })
        },
        getTime(num, date) {
            let time = timeFormat(date)
            if(num == 0){  
                this.logForm.beginTime = time
            }else if(num == 1){
                this.logForm.endTime = time
            }
        },
        submitForm() {
            this.logForm.pageIndex = 1
            this.getLogTable()
            this.logPage = 1
        },
        resetForm() {
            this.logForm = {
                username: '',
                taskLogTid: '',
                taskLogOperate: '',
                beginTime: '',
                endTime: '',
                pageIndex: 1
            }
        },
        handleCurrentChange(val) { 
            this.logForm.pageIndex = val;
            this.getLogTable();
        }
    }
}
</script>

<style>

</style>
