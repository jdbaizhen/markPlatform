<template>
    <el-container>
        <el-header height="80">
            <breadcrumb :data="searchBreadcrumb"></breadcrumb>  
            <el-form v-model="EmployeeForm" :inline="true">
                 <el-form-item label="">
                    <el-input v-model="EmployeeForm.username" placeholder="用户名" size="small"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="EmployeeForm.name" placeholder="姓名" size="small"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="EmployeeForm.teacherName" placeholder="审核人员" size="small"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="EmployeeForm.telephone" placeholder="联系电话" size="small"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker v-model="EmployeeForm.beginTime" type="datetime" size="small" format="yyyy-MM-dd HH:mm:ss" placeholder="起始时间" @change="getTime(0, $event)"></el-date-picker>
                </el-form-item>
                 <el-form-item label="">
                    <el-date-picker v-model="EmployeeForm.endTime" type="datetime" size="small" format="yyyy-MM-dd HH:mm:ss" placeholder="终止时间"  @change="getTime(1, $event)"></el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" size="small" @click="submitForm">查询</el-button>
                    <el-button type="default" size="small" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main-table">
            <!-- <breadcrumb :data="listBreadcrumb"></breadcrumb>   -->
            <el-table
                v-loading="loading"
                :data="EmployeeTable"
                width="100%"
            >
                <el-table-column label="用户编号" prop="id"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="用户姓名" prop="name"></el-table-column>
                <el-table-column label="联系方式" prop="telephone"></el-table-column>
                <el-table-column label="更新时间" prop="updateTime"></el-table-column>
                <el-table-column label="审核人员" prop="teacherName"></el-table-column>
                <el-table-column label="注册时间" prop="registerTime"></el-table-column>
                <el-table-column label="更换审核人员" prop="" width="120">
                    <template slot-scope="scope">
                        <el-select size="mini" v-model="scope.row.teacherName" :value="scope.row.id" :key="scope.row.id" :label="scope.row.teacherName" @change="AduitPersonHandle(scope.row.id, $event)" placeholder="审核人员修改">
                            <el-option v-for="(item, index) in AduitPerson" :label="item.name" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-pagination
              class="paginations"
              @current-change="handleCurrentChange"
               :current-page.sync="EmployeePage"
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
import url from '@/api/employee.js'
export default {
    data() {
        return {
            loading: false,
            searchBreadcrumb: [
                {path: '/employee', name: '人员管理'},
               
            ],
            EmployeeForm: {
                username: '',
                name: '',
                teacherName: '',
                telephone: '',
                beginTime: '',
                endTime: '',
                pageIndex: 1
            },
            EmployeeTable: [],
            AduitPerson: [],
            auditCurrentPerson: '',
            pageCount: 0,
            EmployeePage: 1
        }
    },
    components: {
        Breadcrumb
    },
    mounted() {
        let isLogin = getSession('isLogin');
        if(isLogin){
            this.getTeacherArr()
            this.getEmployeeTable()
        }  
    },
    methods: {
        getEmployeeTable() {
            this.loading = true
            let params = dataFarmat(this.EmployeeForm)
            axios({
                url: url.getStudentList+'?'+params,
                method: 'get'
            }).then( res => {
                if(res.data.result){
                    let data = JSON.parse(res.data.data)
                    this.pageCount = data.count
                    this.EmployeeTable = data.details
                    this.loading = false
                }else{
                    Message.error(res.data.message)
                }
            })
        },
        getTeacherArr() {
            axios({
                url: url.getTeacherList,
                method: 'get'
            }).then( res => {
                if(res.data.result){
                    let data = JSON.parse(res.data.data);
                    this.AduitPerson = data
                }else{
                    Message.error(res.data.message)
                }
            })
        },
        AduitPersonHandle(id, event) {
            let params = dataFarmat({id: id, tid: event})
            axios({
                url: url.updateTeacher,
                method: 'post',
                data: params
            }).then( res => {
                if(res.data.result){
                    Message.success('审核人员修改成功')
                    this.getEmployeeTable()
                }else{
                    Message.error(res.data.message)
                }
            })
        },
        getTime(num, date) {
            let time = timeFormat(date)
            if(num == 0){  
                this.EmployeeForm.beginTime = time
            }else if(num == 1){
                this.EmployeeForm.endTime = time
            }
        },
        submitForm() {
            this.EmployeeForm.pageIndex = 1
            this.getEmployeeTable()
        },
        resetForm() {
            this.EmployeeForm = {
                username: '',
                taskLogTid: '',
                taskLogOperate: '',
                beginTime: '',
                endTime: '',
                pageIndex: 1
            }
        },
        handleCurrentChange(val) { 
            this.EmployeeForm.pageIndex = val;
            this.getEmployeeTable();
        }
    }
}
</script>

<style>

</style>