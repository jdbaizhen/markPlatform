<template>
    <el-container>
        <el-header height="80">
            <breadcrumb :data="searchBreadcrumb"></breadcrumb>
            <el-form :inline="true" :model="taskForm" ref="taskForm" >
                <el-form-item label="">
                    <el-input v-model="taskForm.username" placeholder="账户"  size="small" resize="both"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="taskForm.name" placeholder="执行人"  size="small"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="taskForm.id" placeholder="任务代号"  size="small"></el-input>
                </el-form-item>
                <!-- <el-form-item label="">
                    <el-select v-model="taskForm.taskType" placeholder="任务类型"> 
                        <el-option v-for="(item, index) in taskTypes" :label="item.label" :value="item.value" :key="index"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="">
                    <el-select v-model="taskForm.status" placeholder="选择任务状态"  size="small">
                        <el-option v-for="item in taskStatus" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="taskForm.personStatus" placeholder="选择人员状态"  size="small">
                        <el-option v-for="item in personStatus" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker v-model="taskForm.beginTime" type="datetime"  size="small" format="yyyy-MM-dd HH:mm:ss" placeholder="起始时间" @change="getTime(0, $event)"></el-date-picker>
                </el-form-item>
                 <el-form-item label="">
                    <el-date-picker v-model="taskForm.endTime" type="datetime"  size="small" format="yyyy-MM-dd HH:mm:ss" placeholder="终止时间"  @change="getTime(1, $event)"></el-date-picker>
                </el-form-item>
                <el-form-item class='search-btn-group'>
                    <el-button type="primary" @click="submitForm" icon="el-icon-search" size="small"></el-button>
                    <el-button type="warning" @click="resetForm" size="small">重置</el-button>
                    <el-button type="success" @click="publishTaskVisible = true" v-show="save_task" size="small">发布任务</el-button>
                </el-form-item>    
            </el-form>
        </el-header>
        <el-main class="main-table">
            <!-- <breadcrumb :data="listBreadcrumb"></breadcrumb> -->
            <el-table
                 v-loading="loading"
                :data="taskTable"
                style="width:100%"
            >
                <el-table-column prop="id" label="#" ></el-table-column>
                <el-table-column prop="username" label="账户" ></el-table-column>
                <!-- <el-table-column prop="taskType" label="任务类型" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.taskType == '0'">矩形标注</span>
                        <span v-else-if="scope.row.taskType == '1'">24小图标注</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="tName" label="任务名"></el-table-column>
                <el-table-column prop="count" label="标注数量"></el-table-column>
                <el-table-column prop="publishTime" label="发布时间" width="220"></el-table-column>
                <el-table-column prop="status" label="任务状态" >
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
                        <el-select v-if="scope.row.status == 0 || scope.row.status == 1" v-model="changeTaskStatus" @change="updateTaskStatus(scope.row.id)" size="mini" placeholder="任务状态" class="uniftyWidth">
                            <el-option value="2">标注完成</el-option>
                            <el-option v-show="task_verify" value="3">审核完成</el-option>
                        </el-select>
                        <span v-else><i class="el-icon-circle-close-outline"></i></span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" v-show="scope.row.status == '0'" @click="receiveTask(scope.row.id)">领取</el-button> 
                        <el-button type="text" size="small" v-show="scope.row.status == '3' && save_task == true" style="margin-left:0px" @click="repairTask(scope.row.id)">修复</el-button>
                        <el-button type="text" size="small" v-show="scope.row.status == '5' && save_task == true" style="margin-left:0px" @click="repairResult(scope.row.id)">修复结果</el-button>
                        <!-- <el-button type="text" size="small" v-show="scope.row.status == '1'&&scope.row.taskType== '0'" @click="window.location.href='./index.html'">标注</el-button> -->
                        <!-- <router-link :to="{path:'clothestype',query: {id: scope.row.id}}" v-show="scope.row.status == '1'&&scope.row.taskType== '1'"><el-button type="text" size="small" >标注</el-button></router-link> -->
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
                custom-class="dialogs"
            >
                <el-form v-model="publishTaskForm" label-position="left" label-width="100px">
                    <el-form-item label="任务名称" required>
                        <el-input v-model="publishTaskForm.name" placeholder="任务名称"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="任务类型" required>
                        <el-select v-model="publishTaskForm.taskType" placeholder="任务类型"> 
                            <el-option v-for="(item, index) in taskTypes" :label="item.label" :value="item.value" :key="index"></el-option>
                        </el-select>
                    </el-form-item> -->
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
                    <el-button type="warning" @click="publishTaskCancle">取 消</el-button>
                    <el-button type="primary" @click="publishTask">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                :title="`修改结果  负载量:${repairInfo.clothesCapacity}`"
                :visible.sync="recoverMarkVisible"
                width="1240px"
                center
            >   
                <img :src="repairInfo.imgpath" alt="image" width="100%">
                <svg 
					v-show="svgShow"
					width="1200px" :height="svgHeight" 
					version="1.1" xmlns="http://www.w3.org/2000/svg" 
					style="position: absolute;top: 84px;left: 20px;display: block"
				>
					<g v-for="(item,index) in repairInfo.squareInfoList">
						<rect :x="item.x*scale"
							:y="item.y*scale"
							:width="item.w*scale"
							:height="item.h*scale"
							fill="none"
							stroke="yellow"
							strokeWidth="5"
					  />
                       <text :x="item.x*scale + 10"
							  :y="item.y*scale + 20"
                              fill="yellow"
                              @click="changeDifficultType(item.id,item.difficultType)"
                              >
                              衣物类型:{{item.difficultType==0?'确定':'不确定'}}  
                        </text>
					  <polygon
							:points="item.positions?item.positions.map(function(ite, ind){return ite.x*scale+','+ite.y*scale}).join(' '):''"
							stroke="yellow"
							fillOpacity=0.3
							strokeWidth="5"
							fill="none"
						/>
					</g>
				</svg>
                <span slot="footer" class="dialog-footer">
                     <el-select v-model="fuzailiangValue" size="small" placeholder="负载量" class="fuzailiang-style" @change="changeFuZaiLiang">
                        <el-option v-for="(item, index) in fuzaliang" :key="index" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                    <el-button @click="postDifficultType" size="small" class="fixed-submit-btn">修改提交</el-button>

                    <el-button type="danger" size="small" @click="repairDelete">删 除</el-button>
                    <el-button type="success" size="small" @click="repairPass">通 过</el-button>
                    <el-button type="primary" size="small" @click="repairLine">轨 迹</el-button>
                </span>
            </el-dialog>
        </el-main>
        <el-footer>
            <el-pagination
              class="paginations"
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
import urlDetail from '@/api/taskDetail.js'
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
                // { path: '', name: '搜索'}
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
                { label: '审核完成', value: '3' },
                { label: '导出完成', value: '4' },
                { label: '修复完成', value: '5' },
                { label: '修复审核完成', value: '6' },
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
            recoverMarkVisible: false, //修复图片模态框
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
            task_verify: false,
            repairInfo: {
                imgpath: ''
            },
            scale: 0,
            svgShow: true,
            svgHeight: 0,
            currentTid: '', //当前tid 
            difficultInfo: {
                status: 1,
                squareInfoList: [
                    {
                        id: '',
                        difficultType: ''
                    }
                ]
            },
            fuzaliang: [
                { label: '高', value: 'many'},
                { label: '中', value: 'mid'},
                { label: '低', value: 'few'},
            ],
            fuzailiangValue: ''
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
            if(roleString.indexOf('task_verify') != -1){
                this.task_verify = true
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
        receiveTask(personId) {
            let params = dataFarmat({id: personId})
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
        repairTask(id) {
            axios({
                url: `${url.repairTask}?tid=${id}`,
                method: 'get'
            }).then( res => {
                if(res.data.result) {
                    Message.success('修复成功')
                    this.getTaskTable()
                }
            })
        },
        repairResult(id) {
            axios({
                url: `${url.repairTaskResult}?tid=${id}`,
                methods: 'get'
            }).then( res => {
                if(res.data.result) {
                    this.difficultInfo.squareInfoList = []
                    if(res.data.code == '003'){
                        this.repairInfo = {}
                        this.currentTid = ''
                        this.recoverMarkVisible = false;
                        this.getTaskTable()
                    }else{
                        let data = JSON.parse(res.data.data)
                        this.repairInfo = data
                        this.scale = 1200/data.width
                        this.svgHeight = this.scale*data.height  
                        this.currentTid = id
                        this.recoverMarkVisible = true;
                        data.squareInfoList.forEach( (value, index) => {
                            this.difficultInfo.squareInfoList.push({id: value.id, difficultType: value.difficultType})
                        })  
                    }     
                }
            })
        },
        repairPost(url) {
            let tid = this.currentTid
            let imgId = this.repairInfo.imgId
            let params = dataFarmat({tid: tid, imgId: imgId})
            axios({
                    url: url,
                    method: 'post',
                    data: params
                }).then( res => {
                    if(res.data.result){
                        this.repairResult(tid)
                    }else{
                        Message.error(res.data.message)
                    }
                })
        },
        repairDelete() {
            if(confirm('确认删除？')){
                this.repairPost(url.repairDelete)
            }
        },
        repairPass() {
            this.repairPost(url.repairPass)
        },
        //分页函数
        handleCurrentChange(val) { 
            this.taskForm.pageIndex = val;
            this.getTaskTable()
        },
        repairLine() {
            this.svgShow = !this.svgShow
        },
        changeDifficultType(id, type) {
            this.difficultInfoMap(this.repairInfo.squareInfoList, id, type);
            this.difficultInfoMap(this.difficultInfo.squareInfoList, id, type);  
        },
        difficultInfoMap( arr, id, type) {
            arr.map( (value, index) => {
                if(id === value.id){
                    if(type == 0){
                        value.difficultType = 1
                    }else{
                        value.difficultType = 0
                    }      
                }
            })
        },
        //修改负载量
        changeFuZaiLiang() {
            let imgId = this.repairInfo.imgId
            let clothesCapacity = this.fuzailiangValue
            let params = dataFarmat({id: imgId, clothesCapacity: clothesCapacity})
            axios({
                url: urlDetail.fixedClothesCapacity,
                method: 'post',
                data: params
            }).then( res => {
                if( res.data.result ){
                    Message.success('修改负载量成功')
                    this.repairInfo.clothesCapacity = clothesCapacity
                    this.fuzailiangValue = ''
                }
            })
        },
        //修改fixedDifficultType
        postDifficultType() {
            let params = this.difficultInfo
            axios({
                url: urlDetail.fixedDifficultType,
                method: 'post',
                data: params
            }).then( res => {
                if( res.data.result ) {
                    Message.success('修改成功')
                }
            })
        }
    }
}
</script>
<style>
  .uniftyWidth{
      width: 100px;
  }
  .dialogs{
      z-index: 9999 !important;
  }

</style>
