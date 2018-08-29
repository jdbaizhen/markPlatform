<template>
    <el-container>
        <el-header height="80">
            <breadcrumb :data="searchBreadcrumb"></breadcrumb>
            <el-form :inline="true" v-model="taskDetailForm">
                <el-form-item label="">
                    <el-input v-model="taskDetailForm.imgname" placeholder="图片名" size="small"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="taskDetailForm.status" size="small">
                        <el-option v-for="(item, index) in imgStatus" :key="index" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class='search-btn-group'>
                    <el-button type="primary" @click="submitForm" size="small" icon="el-icon-search"></el-button>
                    <el-button type="warning" @click="resetForm" size="small">重置</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main class="main-table">
            <!-- <breadcrumb :data="listBreadcrumb"></breadcrumb> -->
            <el-table
                :data="taskDetailTable"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                style="width:100%"
            >
                <el-table-column prop="id" label="#"></el-table-column>
                <el-table-column prop="imgname" label="图片名"></el-table-column>
                <!-- <el-table-column prop="clothesCapacity" label="负载量"></el-table-column> -->
                <el-table-column prop="imgpath" label="图片展示">
                    <template slot-scope="scope">
                        <img :src="scope.row.imgpath" alt="image" width="40%" @click="showImage(scope.row.imgId)">
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="图片状态">
                    <template slot-scope="scope">
                        <el-tag
                            v-if="scope.row.status == '0'"
                            type="danger"
                            >未标注
                        </el-tag>
                        <el-tag
                            v-else-if="scope.row.status == '1'"
                            type="info"
                            >进行中
                        </el-tag>
                        <el-tag
                            v-else-if="scope.row.status == '2'"
                            type="success"
                            >标注完成
                        </el-tag>
                        <el-tag
                            v-else-if="scope.row.status == '3'"
                            type="success"
                            >审核完成
                        </el-tag>
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
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" size="small" @click="handleDeleteImg(scope.row.id)">删 除</el-button>
                    </template>      
                </el-table-column>
            </el-table>
            <el-dialog
                :title="`负载量：${showImageInfo.clothesCapacity}`"
                :visible.sync="showImageVisiable"
                width="1240px"
            >
                <img :src="showImageInfo.imgpath" alt="image" width="100%">
                <svg 
					v-show="svgShow"
					width="1200px" :height="svgHeight" 
					version="1.1" xmlns="http://www.w3.org/2000/svg" 
					style="position: absolute;top: 84px;left: 20px;display: block"
				>
					<g v-for="(item,index) in showImageInfo.squareInfoList">
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
                    <el-select v-model="fuzailiangValue" placeholder="负载量" class="fuzailiang-style" @change="changeFuZaiLiang">
                        <el-option v-for="(item, index) in fuzaliang" :key="index" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                    <el-button @click="postDifficultType" class="fixed-submit-btn">修改提交</el-button>

                    <el-button @click="showImage(showImageInfo.preImgId)">上一张</el-button>
                    <el-button type="danger" @click="deletePic" v-show="deleteImageRole">删 除</el-button>
                    <el-button type="primary" @click="toggoleSvg">轨 迹</el-button>
                    <el-button @click="showImage(showImageInfo.nextImgId)">下一张</el-button>
                </span>
            </el-dialog>
        </el-main>
        <el-footer>
            <el-pagination
              class="paginations"
              @current-change="handleCurrentChange"
              :current-page.sync="taskDetailPage"
              :page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="pageCount"></el-pagination>
        </el-footer>
    </el-container>
</template>

<script>
import Breadcrumb from '@/components/component/Breadcrumb.vue'
import { dataFarmat } from '@/utils/util.js'
import { getSession } from '@/utils/session.js'
import axios from 'axios'
import url from '@/api/taskDetail.js'
import { Message } from 'element-ui'
export default {
    name: 'TaskDetail',
    data() {
        return {
            loading: false,
            svgShow: true,
            searchBreadcrumb: [
                // { path: '/task', name: '任务管理'},
                { path: '/task', name: '任务列表'},
                { path: '/taskdetail', name: '任务详情'},
                // { path: '', name: '搜索'}
            ],
            listBreadcrumb: [
                { path: '/task', name: '任务管理'},
                { path: '/task', name: '任务列表'},
                { path: '/taskdetail', name: '任务详情'},
                { path: '', name: '列表'}
            ],
            taskDetailForm: {
                imgname: '',
                status: '',
                id: '',
                pageIndex: 1
            },
            imgStatus: [
                { label: '未标注', value: 0 },
                { label: '进行中', value: 1 },
                { label: '标注完成', value: 2 },
                { label: '审核完成', value: 3 },
            ],
            taskDetailTable: [],
            pageCount: 0,
            taskDetailPage: 1,
            showImageVisiable: false, //查看大图
            showImageInfo: {
                height: '',
                width: '',
                imgId: '',
                imgpath: '',
                nextImgId: '',
                preImgId: '',
                clothesCapacity: ''
            },
            scale: 0,
            svgHeight: 0,
            deleteImageRole: false,
            lastImage: true,
            difficultInfo: {
                status: 0,
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
    created() {
        let href = window.location.href
        let personId = href.indexOf('id') === -1 ? '': href.substring(href.indexOf('id')+3)
        this.taskDetailForm.id = personId    
    },
    mounted() {
        let isLogin = getSession('isLogin');
        let roleString = getSession('role');
        if(roleString.indexOf('taskdetail_delete') != -1){
            this.deleteImageRole = true
        }
        if(isLogin){
            this.getTaskDetailTable()
        }
    },
    methods: {
        getTaskDetailTable() {
            this.loading = true
            let params = dataFarmat(this.taskDetailForm)
            axios({
                url: url.getTaskDetailTable+'?'+params,
                method: 'get'
            }).then( res => {
                if(res.data.result){
                    let data = JSON.parse(res.data.data)
                    this.pageCount = data.count
                    this.taskDetailTable = data.details
                    this.loading = false
                }else{
                    Message.error(res.data.message)
                }       
            })
        },
        submitForm() {
            this.taskDetailForm.pageIndex = 1
            this.getTaskDetailTable()
            this.taskDetailPage = 1
        },
        resetForm() {
            this.taskDetailForm.imgname = ''
            this.taskDetailForm.status = ''
            this.taskDetailForm.pageIndex = 1
        },
        handleCurrentChange(val) {
            this.taskDetailForm.pageIndex = val
            this.getTaskDetailTable()
        },
        showImage(imgId) {
            if(this.lastImage){
                let tid = this.taskDetailForm.id
                let params = dataFarmat({tid: tid, imgId: imgId})
                axios({
                    url: url.getImagePath+'?'+params,
                    method: 'get'
                }).then( res => {
                    if(res.data.result){
                        if(res.data.code == '007'){
                            this.lastImage = false
                        }
                        if(res.data.code == '001'){
                            this.difficultInfo.squareInfoList = []
                            this.showImageInfo = {
                                height: '',
                                width: '',
                                imgId: '',
                                imgpath: '',
                                nextImgId: '',
                                preImgId: ''
                            }
                            this.showImageVisiable = false     
                            Message.info(res.data.message)
                        }else{
                            let data = JSON.parse(res.data.data)
                            this.difficultInfo.squareInfoList = []
                            this.showImageInfo = data
                            this.scale = 1200/data.width
                            this.svgHeight = this.scale*data.height
                            this.showImageVisiable = true
                            data.squareInfoList.forEach( (value, index) => {
                                this.difficultInfo.squareInfoList.push({id: value.id, difficultType: value.difficultType})
                            })     
                        } 
                        this.getTaskDetailTable()   
                    }else{
                        Message.error(res.data.message)
                    }
                })
            }else{
                this.showImageInfo = {
                    height: '',
                    width: '',
                    imgId: '',
                    imgpath: '',
                    nextImgId: '',
                    preImgId: ''
                }
                this.difficultInfo.squareInfoList = []
                this.showImageVisiable = false     
                Message.info('已经是最后一张图片')
                this.lastImage = true
            }
        },
        showImageCancel() {
            this.showImageVisiable = false
        },
        toggoleSvg() {
            this.svgShow = !this.svgShow
        },
        deletePic() {
            let tid = this.taskDetailForm.id
            let imgId = this.showImageInfo.imgId
            let nextImgId = this.showImageInfo.nextImgId
            if(confirm('确认删除？')){
                axios({
                    url: `${url.deleteImage}?imgId=${imgId}&tid=${tid}`,
                    method: 'get'
                }).then( res => {
                    if(res.data.result){
                        Message.success('删除成功')
                        this.showImage(nextImgId)
                    }else{
                        Message.error(res.data.message)
                    }
                })
            }
        },
        handleDeleteImg(id) {
            let tid = this.taskDetailForm.id
            let params = dataFarmat({tid: tid,tdId: id})
            if(confirm('确定要删除吗？')){
                axios({
                    url: url.handleDeleteImg,
                    method: 'post',
                    data: params
                }).then( res => {
                    if(res.data.result){
                        this.getTaskDetailTable()
                    }else{
                        Message.error(res.data.message)
                    }
                })
            }      
        },
        changeDifficultType(id, type) {
            this.difficultInfoMap(this.showImageInfo.squareInfoList, id, type);
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
            let imgId = this.showImageInfo.imgId
            let clothesCapacity = this.fuzailiangValue
            let params = dataFarmat({id: imgId, clothesCapacity: clothesCapacity})
            axios({
                url: url.fixedClothesCapacity,
                method: 'post',
                data: params
            }).then( res => {
                if( res.data.result ){
                    Message.success('修改负载量成功')
                    this.showImageInfo.clothesCapacity = clothesCapacity
                    this.fuzailiangValue = ''
                }
            })
        },
        //修改fixedDifficultType
        postDifficultType() {
            let params = this.difficultInfo
            axios({
                url: url.fixedDifficultType,
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
.fuzailiang-style{
    float: left;
}
.fixed-submit-btn{
    float: left;
}
</style>
