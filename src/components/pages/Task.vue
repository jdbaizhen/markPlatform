<template>
    <el-container>
        <el-header height="80">
            <breadcrumb :data="searchBreadcrumb"></breadcrumb>
            <el-form :inline="true" :model="taskForm" ref="taskForm" >
                <el-form-item label="">
                    <el-input v-model="taskForm.username" placeholder="账户"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="taskForm.name" placeholder="执行人"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="taskForm.id" placeholder="任务代号"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="taskForm.taskType" placeholder="任务类型"> 
                        <el-option v-for="(item, index) in taskTypes" :label="item.label" :value="item.value" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="taskForm.status" placeholder="选择任务状态">
                        <el-option v-for="item in taskStatus" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="taskForm.personStatus" placeholder="选择人员状态">
                        <el-option v-for="item in personStatus" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker v-model="taskForm.beginTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="起始时间" @change="getTime(0, $event)"></el-date-picker>
                </el-form-item>
                 <el-form-item label="">
                    <el-date-picker v-model="taskForm.endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="终止时间"  @change="getTime(1, $event)"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">查询</el-button>
                    <el-button type="default" @click="resetForm">重置</el-button>
                    <el-button type="success" @click="publishTaskVisible = true" v-show="save_task">发布任务</el-button>
                </el-form-item>    
            </el-form>
        </el-header>
        <el-main>
            <breadcrumb :data="listBreadcrumb"></breadcrumb>
            <el-table
                 v-loading="loading"
                :data="taskTable"
                style="width:100%"
            >
                <el-table-column prop="id" label="#" width="80"></el-table-column>
                <el-table-column prop="username" label="账户" width="150"></el-table-column>
                <el-table-column prop="taskType" label="任务类型" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.taskType == '0'">矩形标注</span>
                        <span v-else-if="scope.row.taskType == '1'">24小图标注</span>
                    </template>
                </el-table-column>
                <el-table-column prop="tName" label="任务名" width="150"></el-table-column>
                <el-table-column prop="count" label="标注数量" width="150"></el-table-column>
                <el-table-column prop="publishTime" label="发布时间" width="220"></el-table-column>
                <el-table-column prop="status" label="任务状态" width="140">
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
                        v-else="scope.row.status == '5'"
                        type="danger"
                        disable-transitions>任务被驳回</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="标注人员" width="150"></el-table-column>
                <el-table-column prop="personStatus" label="人员状态" width="150">
                    <template slot-scope="scope">
                        <el-tag
                        v-if="scope.row.personStatus == '0'"
                        type="success"
                        >在职  
                        </el-tag>
                        <el-tag
                        v-else="scope.row.personStatus == '1'"
                        type="danger"
                        >可移交
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column v-if="update_status" prop="personStatus" label="修改人员状态" width="200" align="center">
                    <template slot-scope="scope">
                         <el-select v-if="scope.row.personStatus == '1'" :label="scope.row.name" :key="scope.row.id" v-model="newTransferPerson"  size="mini" placeholder="移交任务" class="uniftyWidth" @change="changeTransferPerson(scope.row.id)">
                            <el-option v-for=" (item, index) in transferPersonList" :key="item.id" :value="item.id" :label="item.name" ></el-option>
                        </el-select>
                        <el-button v-else-if="scope.row.personStatus=='0'&& scope.row.status =='0'||scope.row.status =='1'||scope.row.status =='2'" size="mini" @click="updatePersonStatus(scope.row.id)" class="uniftyWidth">移交</el-button>
                        <span v-else><i class="el-icon-circle-close-outline"></i></span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="修改任务状态" width="200" align="center">
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.status == 0 || scope.row.status == 1 || scope.row.status == 5" v-model="changeTaskStatus" @change="updateTaskStatus(scope.row.id)" size="mini" placeholder="任务状态" class="uniftyWidth">
                            <el-option value="2">标注完成</el-option>
                        </el-select>
                        <span v-else><i class="el-icon-circle-close-outline"></i></span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" v-show="scope.row.status == '0' || scope.row.status == 5" @click="receiveTask(scope.row.id, scope.row.status)">领取</el-button>
                        <el-button type="text" size="small" v-show="scope.row.status == '1'&&scope.row.taskType== '0'" @click="window.location.href='./index.html'">标注</el-button>
                        <router-link :to="{path:'clothestype',query: {id: scope.row.id}}" v-show="scope.row.status == '1'&&scope.row.taskType== '1'"><el-button type="text" size="small" >标注</el-button></router-link>
                        <router-link :to="{path:'/taskdetail',query: {id: scope.row.id}}"><el-button type="text" size="small" >任务详情</el-button></router-link>
                        <el-button type="text" size="small" @click="deleteTask(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                title="任务发布"
                :visible.sync="publishTaskVisible"
                width="30%"
                center
            >
                <el-form v-model="publishTaskForm" label-position="left" label-width="100px">
                    <el-form-item label="任务名称" required>
                        <el-input v-model="publishTaskForm.name" placeholder="任务名称"></el-input>
                    </el-form-item>
                    <el-form-item label="任务类型" required>
                        <el-select v-model="publishTaskForm.taskType" placeholder="任务类型"> 
                            <el-option v-for="(item, index) in taskTypes" :label="item.label" :value="item.value" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标注数量" required>
                        <el-input v-model="publishTaskForm.count" type="number" placeholder="标注数量"></el-input>
                    </el-form-item>
                    <el-form-item label="标注人员" required>
                        <el-select v-model="publishTaskForm.userId" multiple placeholder="请选择">
                            <el-option v-for="(item, index) in transferPersonList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="publishTaskCancle">取 消</el-button>
                    <el-button type="primary" @click="publishTask">确 定</el-button>
                </span>
            </el-dialog>
        </el-main>
        <el-footer>
            <el-pagination
              @current-change="handleCurrentChange"
              :page-size="10"
              :current-page.sync="taskPage"
              layout="total, prev, pager, next, jumper"
              :total="pageCount"></el-pagination>
        </el-footer>
    </el-container>
</template>
<script>
import Breadcrumb from '@/components/component/Breadcrumb.vue'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import url from '@/api/task.js'
import { dataFarmat, timeFormat } from '@/utils/util.js'
import { getSession } from '@/utils/session.js'
export default {
    name: 'Task',
    data () {
        return {
            loading: false,
            searchBreadcrumb: [
                { path: '/task', name: '任务管理'},
                { path: '/task', name: '任务列表'},
                { path: '', name: '搜索'}
            ],
            listBreadcrumb: [
                { path: '/task', name: '任务管理'},
                { path: '/task', name: '任务列表'},
                { path: '', name: '列表'}
            ],
            taskForm: {
                username: '',
                name: '',
                id: '',
                taskType: '',
                status: '',
                personStatus: '',
                beginTime: '',
                endTime: '',
                pageIndex: '1'
            },
            taskStatus: [
                { label: '未领取', value: '0' },
                { label: '处理中', value: '1' },
                { label: '标注完成', value: '2' },
                { label: '任务驳回', value: '5' },
                { label: '审核完成', value: '3' },
                { label: '导出完成', value: '4' },
            ],
            personStatus: [
                { label: '在职', value: '0' },
                { label: '移交', value: '1' },
            ],
            taskTable: [],
            pageCount: 0,  //总条数
            taskPage: 1, //当前页
            transferPersonList: [], //在职人员列表
            newTransferPerson: '', //被派发人员
            changeTaskStatus: '', //修改后的任务状态
            publishTaskVisible: false, //发布任务模态框
            publishTaskForm: {  
                name: '',
                taskType: '',
                count: '',
                userId: []
            },
            taskTypes: [
                { label: '矩形标注', value: 0 },
                { label: '24小图标注', value: 1 }
            ],      
            update_status: false,
            save_task: false,      
        }
    },
    components: {
        Breadcrumb
    },
    mounted() {
        let roleString = getSession('role')
        let isLogin = getSession('isLogin')
        if(roleString){
            if(roleString.indexOf('update_status') != -1){
                this.update_status = true
            }
            if(roleString.indexOf('save_task') != -1){
                this.save_task = true
            }
        }  
        if(isLogin){
            this.getTaskTable()
            this.getTransferPerson()
        }  
    },
    methods: {
        //发布任务
        publishTask() {
            let params = dataFarmat(this.publishTaskForm)
            axios({
                url: url.publishTask,
                method: 'post',
                data: params
            }).then( res => {
                if(res.data.result){
                    this.publishTaskCancle()
                    this.getTaskTable()
                }else{
                    Message.error(res.data.message)
                }
            })
        },
        publishTaskCancle() {
            this.publishTaskVisible = false
            this.publishTaskForm = {  
                name: '',
                count: '',
                userId: []
            }   
        },
        //领取任务
        receiveTask(personId, taskStatus) {
            let params = dataFarmat({id: personId, status: taskStatus})
            axios({
                url: url.receiveTask,
                method: 'post',
                data: params
            }).then( res => {
                if(res.data.result){
                    Message.success('任务领取成功')
                    this.getTaskTable()
                }else{
                    Message.error('任务领取失败')
                }
            })
        },
        //删除任务
        deleteTask(person) {
            let params = dataFarmat({id: person.id})
            if(confirm('确定要删除此任务吗？')){
                if(person.status == 4){
                    axios({
                        url: url.deleteTask,
                        method: 'post',
                        data: params
                    }).then( res => {
                        if(res.data.result){
                            Message.success('任务删除成功')
                            this.getTaskTable()
                        }else{
                            Message.error('任务删除失败')
                        }
                    })
                }else{
                    Message.error('仅可以删除已导出任务')
                }
            }           
        },
        //获取列表
        getTaskTable() {
            this.loading = true
            let params = dataFarmat(this.taskForm)
            axios({
                url: url.getTaskList+'?'+params,
                method: 'get'
            }).then( res => {
                if(res.data.result){
                    let taskData = JSON.parse(res.data.data)
                    let pageCount = Number(taskData.count)
                    let taskTable = taskData.details
                    this.pageCount = pageCount
                    this.taskTable = taskTable
                    this.loading = false
                }else{
                    Message.error(res.data.message)
                }
            })
        },
        getTime(num, date) {
            let time = timeFormat(date)
            if(num == 0){  
                this.taskForm.beginTime = time
            }else if(num == 1){
                this.taskForm.endTime = time
            }
        },
        //模糊查询
        submitForm() {
            this.taskForm.pageIndex = 1
            this.getTaskTable()
            this.taskPage = 1
        },
        resetForm() {
           this.taskForm = {
                username: '',
                name: '',
                id: '',
                status: '',
                taskType: '',
                personStatus: '',
                beginTime: '',
                endTime: '',
                pageIndex: '1'
           }
        },
        //获取在职人员列表
        getTransferPerson() {
            axios({
                url: url.getTransferPerson,
                method: 'get'
            }).then( res => {
                if(res.data.result){
                    let transferPersonList = JSON.parse(res.data.data)
                    this.transferPersonList = transferPersonList
                }else{
                    Message.error('获取在职人员列表失败')
                }
            })
        },
        //重新派发任务
        changeTransferPerson(taskId) {
            if(confirm('确认移交任务？')){
                let uid = this.newTransferPerson;
                let params = dataFarmat({ id: taskId, uid: uid});
                axios({
                    url: url.changeTransferPerson,
                    method: 'post',
                    data: params
                }).then( res => {
                    if(res.data.result){
                        this.getTaskTable()
                        this.newTransferPerson = ''
                    }else{
                        Message.error('移交任务失败')
                    }
                })
            }     
        },
        //移交函数
        updatePersonStatus(taskId) {
            if(confirm('确认移交？')){
                let params = dataFarmat({id: taskId})
                axios ({
                    url: url.updatePersonStatus,
                    method: 'post',
                    data: params
                }).then( res => {
                    if(res.data.result){
						this.getTaskTable()
					}else{
						Message.error('修改状态失败');
					}
                })
			}	
        },
        //修改任务状态
        updateTaskStatus(personId) {
            if(confirm('确认修改任务状态？')){
                let status = this.changeTaskStatus
                let params = dataFarmat({status: status, id: personId})
                axios({
                    url: url.updateTaskStatus,
                    method: 'post',
                    data: params
                }).then( res => {
                    if(res.data.result){
                        Message.success('任务状态修改成功')
                        this.changeTaskStatus = ''
                        this.getTaskTable()
                    }else{
                        Message.error(res.data.message)
                    }
                })
            }
        },
        //分页函数
        handleCurrentChange(val) { 
            this.taskForm.pageIndex = val;
            this.getTaskTable()
        }
    }
}
</script>
<style>
  .uniftyWidth{
      width: 100px;
  }
</style>
