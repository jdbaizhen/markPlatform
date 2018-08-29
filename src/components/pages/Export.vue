<template>
    <el-container>
        <el-header height="80">
            <breadcrumb :data="searchBreadcrumb"></breadcrumb>
            <el-form :inline="true" v-model="exportForm">
                <el-form-item>
                    <el-input v-model="exportForm.username" placeholder="账号" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="exportForm.name" placeholder="标注人员" size="small"></el-input>
                </el-form-item>
                <!-- <el-form-item label="">
                    <el-select v-model="exportForm.taskType" placeholder="任务类型" size="small"> 
                        <el-option v-for="(item, index) in taskTypes" :label="item.label" :value="item.value" :key="index"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-input v-model="exportForm.tName" placeholder="任务名称" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="exportForm.status" placeholder="任务状态" size="small">
                        <el-option v-for="(item, index) in statusExport" :label="item.label" :value="item.value" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="exportForm.beginTime" type="datetime" size="small" placeholder="开始时间" @change="getTime(0,$event)"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="exportForm.endTime" type="datetime" size="small" placeholder="结束时间" @change="getTime(0,$event)"></el-date-picker>
                </el-form-item>
                <el-form-item class="search-btn-group">
                    <el-button type="primary" @click="submitForm" size="small" icon="el-icon-search"></el-button>
                    <el-button type="warning" @click="resetForm" size="small">重置</el-button>
                    <el-button type="success" class="export-btn" size="small"><a @click.stop="exportBegin" download class="export-a">开始导出</a></el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main-table">
            <!-- <breadcrumb :data="listBreadcrumb"></breadcrumb> -->
            <el-table 
                v-loading="loading"
                :data="exportTable"
                :row-key="getRowKeys"
                width="100%"
                ref="multipleTable"
                @selection-change="handleSelectionChange"
            >
                <el-table-column  type="selection" :reserve-selection="true"></el-table-column>
                <el-table-column label="#" prop="id"></el-table-column>
                <el-table-column label="账号" prop="username"></el-table-column>
                <el-table-column label="任务名称" prop="tName"></el-table-column>
                <el-table-column label="图片数量" prop="count"></el-table-column>
                <el-table-column label="标注人员" prop="name"></el-table-column>
                <el-table-column label="发布时间" prop="publishTime"></el-table-column>
                <el-table-column label="任务状态" prop="id">
                    <template slot-scope="scope">
                        <el-tag
                        v-if="scope.row.status == '0'"
                        type="danger"
                        disable-transitions>未领取任务</el-tag>
                        <el-tag
                        v-else-if="scope.row.status == '1'"
                        type="info"
                        disable-transitions>正在标注</el-tag>
                         <el-tag
                        v-else-if="scope.row.status == '2'"
                        disable-transitions>标注完成</el-tag>
                         <el-tag
                        v-else-if="scope.row.status == '3'"
                        type="warning"
                        disable-transitions>审核完成</el-tag>
                         <el-tag
                        v-else-if="scope.row.status == '4'"
                        type="success"
                        disable-transitions>导出完成</el-tag>
                         <el-tag
                        v-else-if="scope.row.status == '5'"
                        type="success"
                        disable-transitions>修复完成</el-tag>
                        <el-tag
                        v-else-if="scope.row.status == '6'"
                        type="success"
                        disable-transitions>修复审核完成</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-pagination
              class="paginations"
              @current-change="handleCurrentChange"
              :current-page.sync="exportPage"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="pageCount"></el-pagination>
        </el-footer>
    </el-container>
</template>

<script>
import Breadcrumb from '@/components/component/Breadcrumb.vue'
import axios from 'axios'
import { Message } from 'element-ui'
import url from '@/api/export.js'
import { dataFarmat, timeFormat } from '@/utils/util.js'
import { getSession } from '@/utils/session.js'
export default {
    data() {
        return {
            loading: false,
            btnloading: false,
            searchBreadcrumb: [
                { path: '', name: '批量导出'},
                // { path: '', name: '搜索'}
            ],
            listBreadcrumb: [
                { path: '', name: '批量导出'},
                { path: '', name: '列表'}
            ],
            taskTypes: [
                { label: '矩形标注', value: 0 },
                { label: '24小图标注', value: 1 }
            ], 
            statusExport: [
                { label: '审核完成', value: 3},
                { label: '修复审核完成', value: 6},
            ], 
            exportForm: {
                username: '',
                name: '',
                tName: '',
                status: 3,
                beginTime: '',
                endTime: '',
                taskType: 0,
                pageIndex: 1,
            },
            exportTable: [],
            pageCount: 0,
            exportPage: 1,
            checkedList: [],
            getRowKeys(row) {
                return row.id;
            },
            ip: 'http://192.168.3.84:8666'
        }
    },
    components: {
        Breadcrumb
    },
    mounted() {
        let isLogin = getSession('isLogin');
        if(isLogin){
            this.getExportTable()
        }
    },
    methods: {
        getExportTable() {
            this.loading = true
            let params = dataFarmat(this.exportForm)
            axios({
                url: url.getExportTable+'?'+params,
                method: 'get'
            }).then( res => {
                if(res.data.result){
                    let data = JSON.parse(res.data.data)
                    this.pageCount = data.count
                    this.exportTable = data.details
                    this.loading = false
                }else{
                    Message.error(res.data.message)
                }
            })         
        },
         getTime(num, date) {
            let time = timeFormat(date)
            if(num == 0){  
                this.exportForm.beginTime = time
            }else if(num == 1){
                this.exportForm.endTime = time
            }
        },
        submitForm() {
             this.exportForm.pageIndex = 1
             this.getExportTable()
             this.exportPage = 1
        },
        resetForm() {
            this.exportForm = {
                username: '',
                name: '',
                tName: '',
                taskType: 0,
                status: '',
                beginTime: '',
                endTime: '',
                pageIndex: 1
            }
        },
        handleSelectionChange(val) { 
            this.btnloading =false; 
            this.checkedList = []
            if(val.length!==0){
                val.forEach((item, index) => {
                    this.checkedList.push(item.id)
                })
            }
        },
        handleCurrentChange(val) { 
            this.exportForm.pageIndex = val;
            this.getExportTable()
        },
        exportBegin() {
            if(this.btnloading){
                return;
            }
			let url = `${this.ip}/export/checkTask?id=${this.checkedList}&status=${this.exportForm.status}`;
            window.location.href = url;
			console.log(url)
            this.btnloading = true
            this.checkedList = []
        }
    }
}
</script>

<style>
.export-btn{
    padding: 0px 10px;
}
.export-a{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    width: 80px;
    text-decoration: none;
    color: #fff;
}
</style>
