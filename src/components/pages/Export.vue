<template>
    <el-container>
        <el-header height="80">
            <breadcrumb :data="searchBreadcrumb"></breadcrumb>
            <el-form :inline="true" v-model="exportForm">
                <el-form-item>
                    <el-input v-model="exportForm.username" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="exportForm.name" placeholder="标注人员"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="exportForm.tName" placeholder="任务名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="exportForm.status" placeholder="任务状态">
                        <el-option value="3" label="矩形框审核完成">矩形框审核完成</el-option>
                        <el-option value="5" label="24框标注完成">24框标注完成</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="exportForm.beginTime" type="datetime" placeholder="开始时间" @change="getTime(0,$event)"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="exportForm.endTime" type="datetime" placeholder="结束时间" @change="getTime(0,$event)"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">查询</el-button>
                    <el-button type="default" @click="resetForm">重置</el-button>
                    <el-button type="success"><a @click.stop="exportBegin" download class="export-btn">开始导出</a></el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main>
            <breadcrumb :data="listBreadcrumb"></breadcrumb>
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
                        v-if="scope.row.status == '3'"
                        type="warning"
                        disable-transitions>矩形框审核完成</el-tag>

                        <el-tag
                        v-else-if="scope.row.status == '5'"
                        type="danger"
                        disable-transitions>24框标注完成</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-pagination
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
                { path: '', name: '搜索'}
            ],
            listBreadcrumb: [
                { path: '', name: '批量导出'},
                { path: '', name: '列表'}
            ],
            exportForm: {
                username: '',
                name: '',
                tName: '',
                status: '',
                beginTime: '',
                endTime: '',
                pageIndex: 1
            },
            exportTable: [],
            pageCount: 0,
            exportPage: 1,
            checkedList: [],
            beginExport: '',
            getRowKeys(row) {
                return row.id;
            },
            ip: 'http://127.0.0.1:8888'
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
                status: '',
                beginTime: '',
                endTime: '',
                pageIndex: 1
            }
        },
        handleSelectionChange(val) {
            console.log(val)
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
            let status = this.exportForm.status;
			let url = `${this.ip}/export/exportTask?id=${this.checkedList}&status=${status}`;
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
    text-decoration: none;
    color: #fff;
}
</style>
