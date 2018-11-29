<template>
    <el-container>
        <el-header height="80">
            <breadcrumb :data="searchBreadcrumb"></breadcrumb>
            <el-form :inline="true" v-model="taskDetailForm">
                <el-form-item label="">
                    <el-input v-model="taskDetailForm.imgname" placeholder="图片名" size="small"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="taskDetailForm.status" placeholder="任务状态" size="small">
                        <el-option v-for="(item, index) in imgStatus" :key="index" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="taskDetailForm.clothesCapacity" placeholder="负载量" size="small">
                        <el-option v-for="(item, index) in clothesCapacity" :key="index" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" size="small" @click="submitForm">查询</el-button>
                    <el-button type="default" size="small" @click="resetForm">重置</el-button>
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
                <el-table-column prop="clothesCapacity" label="负载量"></el-table-column>
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
                            >矩形进行中
                        </el-tag>
                        <el-tag
                            v-else-if="scope.row.status == '2'"
                            >矩形标注完成
                        </el-tag>
                        <el-tag
                            v-else-if="scope.row.status == '3'"
                            >矩形审核完成
                        </el-tag>
                        <el-tag
                            v-else-if="scope.row.status == '4'"
                            type="warning"
                            >24切割完成
                        </el-tag>
                        <el-tag
                            v-else-if="scope.row.status == '5'"
                            type="warning"
                            >24标注完成
                        </el-tag>
                        <el-tag
                            v-else-if="scope.row.status == '6'"
                            type="warning"
                            >24审核完成
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column props="status" label="操作">
                    <template slot-scope="scope">
                       <!-- <router-link :to="{path: '/clothestypeaudit', query:{id: scope.row.id}}"><el-button type="primary" v-if="scope.row.status == '4'" size="small">审核</el-button></router-link>-->
                        <el-button type="warning" v-if="scope.row.status == '3' && scope.row.tStatus == '4'" @click="taskAdjust(scope.row.id)" size="small">切割</el-button>
                        <el-button type="danger" v-if="scope.row.status == '4' || scope.row.status == '5'" @click="deleteAdjustPic(scope.row.id)" size="small">删除</el-button>
                        <el-button type="primary" v-if="scope.row.status == '5' || scope.row.status == '4' || look_detail" @click="interimDetail(scope.row.id)" size="small">查看详情</el-button>
                        <!--<el-button type="default" size="small" v-else disabled>暂无可操作事项</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                :title="`类型提示：${tipClothesTypes}`"
                :visible.sync="showImageVisiable"
                width="1240px"
            >
                <img :src="showImageInfo.imgpath" alt="image" width="100%">
                <svg
                  v-show="svgShow"
                  width="1200px" :height="svgHeight"
                  version="1.1" xmlns="http://www.w3.org/2000/svg"
                  style="position: absolute;top: 84px;left: 20px;display: block"
                  v-for="(item,index) in showImageInfo.squareInfoList"
                >
					<g>
						<rect :x="item.x*scale"
							:y="item.y*scale"
							:width="item.w*scale"
							:height="item.h*scale"
							fill="none"
							stroke="yellow"
							strokeWidth="5"
					  />
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
                    <el-button @click="showImage(showImageInfo.preImgId)">上一张</el-button>
                    <el-button @click="showImageCancel">取 消</el-button>
                    <el-button type="primary" @click="toggoleSvg">轨 迹</el-button>
                    <el-button @click="showImage(showImageInfo.nextImgId)">下一张</el-button>
                </span>
            </el-dialog>
            <el-dialog
                :title="`类型提示：${tipClothesTypes}`"
                :visible.sync="interimDetailVisiable"
                width= "90%"
            >
                <ul class="interim-container">
                    <li v-for="(item, index) in interimArr" :key="index">
                        <img :src="item.squareImagePath" alt="" @click="changeSquareId(item.squareImageId)" :class="item.squareImageId===squareImageId? 'checkedSquare' : ''">
                        <div class="feature-conatiner">
                            <p v-for="(ite, ind) in item.clothesTypeList">
                                <span>{{ite.clothesType}}--></span>
                                <span v-for="(ie, id) in ite.clothesFeatureList">
                                    {{ie.featureType}}
                                </span>
                            </p>
                        </div>
                    </li>
                </ul>
                <span slot="footer" class="dialog-footer">
                    <el-select
                        v-model="clothesChose"
                        multiple
                        size="mini"
                        placeholder="请选择衣物类型"
                        class="clothes-type"
                    >
                        <el-option-group
                            v-for="(item, index) in clothesTypeOne"
                            :key="item.clothesId"
                            :label="item.clothesType"
                        >
                            <el-option
                                v-for="(ite, ind) in item.clothesFeatureList"
                                :key="ite.featureId"
                                :label="ite.featureType"
                                :value="ite.featureId"
                            ></el-option>
                        </el-option-group>
                    </el-select>
                    <el-button type="info" size="mini" @click="passFixedSquareImage">修改</el-button>
                    <el-button type="success" size="mini" v-show="search_detail" @click="completeFixedSquareImage">完成</el-button>
                    <el-button type="success" size="mini" v-show="taskdetail_label_finish" @click="completeFixedOfStudent">完成</el-button>
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
  data () {
    return {
      loading: false,
      svgShow: true,
      searchBreadcrumb: [
        // { path: '/task', name: '任务管理'},
        { path: '/task', name: '任务列表'},
        { path: '/taskdetail', name: '任务详情'}
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
        clothesCapacity: '',
        id: '',
        pageIndex: 1
      },
      imgStatus: [
        { label: '未标注', value: 0 },
        { label: '进行中', value: 1 },
        { label: '标注完成', value: 2 },
        { label: '审核完成', value: 3 },
        { label: '切割完成', value: 4 },
        { label: '切割审核完成', value: 5 }
      ],
      clothesCapacity: [
        { label: 'few', value: 'few' },
        { label: 'mid', value: 'mid' },
        { label: 'many', value: 'many' }
      ],
      taskDetailTable: [],
      pageCount: 0,
      taskDetailPage: 1,
      showImageVisiable: false, // 查看大图
      showImageInfo: {
        height: '',
        width: '',
        imgId: '',
        imgpath: '',
        nextImgId: '',
        preImgId: ''
      },
      scale: 0,
      svgHeight: 0,
      interimDetailVisiable: false,
      interimArr: [],
      clothesTypeOne: [],
      clothesChose: [],
      squareImageId: null,
      tid: null,
      interimClothesTypes: [],
      search_detail: false,
      look_detail: false,
      taskdetail_label_finish: false
    }
  },
  components: {
    Breadcrumb
  },
  created () {
    let href = window.location.href
    let personId = href.indexOf('id') === -1 ? '' : href.substring(href.indexOf('id') + 3)
    this.taskDetailForm.id = personId
  },
  mounted () {
    let isLogin = getSession('isLogin')
    if (isLogin) {
      this.getTaskDetailTable()
      this.getClothesTypeOne()
    }
    let roleString = getSession('role')
    if (roleString) {
      if (roleString.indexOf('search_detail') !== -1) {
        this.search_detail = true
      }
	  if (roleString.indexOf('look_detail') !== -1) {
        this.look_detail = true
      }
      if (roleString.indexOf('taskdetail_label_finish') !== -1) {
        this.taskdetail_label_finish = true
      }
    }
  },
  computed: {
    'tipClothesTypes': function () {
      return this.interimClothesTypes.join(' , ')
    }
  },
  methods: {
    getClothesTypeOne () {
      axios({
        url: url.clothesTypeOne,
        method: 'get'
      }).then(res => {
        if (res.data.result) {
          let clothesTypeOne = JSON.parse(res.data.data)
          this.clothesTypeOne = clothesTypeOne
        }
      })
    },
    changeSquareId (id) {
      this.squareImageId = id
    },
    passFixedSquareImage () {
      let squareImageId = this.squareImageId
      let clothesChose = this.clothesChose
      let params = dataFarmat({squareImageId, featureId: clothesChose})
      axios({
        url: url.passFixedSquare,
        method: 'post',
        data: params
      }).then(res => {
        if (res.data.result) {
          this.clothesChose = []
          this.interimDetail(this.tid)
        }
      })
    },
    getTaskDetailTable () {
      this.loading = true
      let params = dataFarmat(this.taskDetailForm)
      axios({
        url: url.getTaskDetailTable + '?' + params,
        method: 'get'
      }).then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          this.pageCount = data.count
          this.taskDetailTable = data.details
          this.loading = false
        } else {
          Message.error(res.data.message)
        }
      })
    },
    submitForm () {
      this.taskDetailForm.pageIndex = 1
      this.getTaskDetailTable()
      this.taskDetailPage = 1
    },
    resetForm () {
      this.taskDetailForm.imgname = ''
      this.taskDetailForm.status = ''
      this.taskDetailForm.clothesCapacity = ''
      this.taskDetailForm.pageIndex = 1
    },
    handleCurrentChange (val) {
      this.taskDetailForm.pageIndex = val
      this.getTaskDetailTable()
    },
    showImage (imgId) {
      let tid = this.taskDetailForm.id
      let params = dataFarmat({tid: tid, imgId: imgId})
      axios({
        url: url.getImagePath + '?' + params,
        method: 'get'
      }).then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          this.showImageInfo = data
          this.scale = 1200 / data.width
          this.svgHeight = this.scale * data.height
          this.showImageVisiable = true
          this.interimClothesTypes = data.clothesTypes
        } else {
          Message.error(res.data.message)
        }
      })
    },
    showImageCancel () {
      this.showImageVisiable = false
    },
    toggoleSvg () {
      this.svgShow = !this.svgShow
    },
    // 图片切割
    taskAdjust (id) {
      axios({
        url: `${url.taskAdjust}?id=${id}`,
        method: 'get'
      }).then(res => {
        if (res.data.result) {
          Message.success('切割成功')
          this.getTaskDetailTable()
        }
      })
    },
    // 查看详情
    interimDetail (id) {
      if (id !== 'undefined') this.tid = id
      axios({
        url: `${url.interimDetail}?tid=${id}`,
        method: 'get'
      }).then(res => {
        if (res.data.result) {
          let data = JSON.parse(res.data.data)
          this.interimClothesTypes = data.clothesTypes
          this.interimArr = data.squareImages
          this.interimDetailVisiable = true
        }
      })
    },
    deleteAdjustPic (id) {
      let params = dataFarmat({'tid': id})
      if (confirm('确认删除？')) {
        axios({
          url: url.deleteAdjustSquare,
          method: 'post',
          data: params
        }).then(res => {
          if (res.data.result) {
            Message.success('删除成功')
            this.getTaskDetailTable()
          } else {
            Message.error(res.data.message)
          }
        })
      }
    },
    completeFixedSquareImage () {
      let id = this.tid
      let params = dataFarmat({id: id})
      if (confirm('确认完成该图？')) {
        axios({
          url: url.fixedComplete,
          method: 'post',
          data: params
        }).then(res => {
          if (res.data.result) {
            this.getTaskDetailTable()
            this.interimDetailVisiable = false
          }
        })
      }
    },
    completeFixedOfStudent () {
      let id = this.tid
      let params = dataFarmat({tid: id})
      if (confirm('确认完成该图？')) {
        axios({
          url: url.fixedCompleteStudent,
          method: 'post',
          data: params
        }).then(res => {
          if (res.data.result) {
            this.getTaskDetailTable()
            this.interimDetailVisiable = false
          }
        })
      }
    }
  }
}
</script>

<style>
.interim-container{
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    width: 100%;
}
.interim-container li{
    position: relative;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 16.3%;
    padding-right: 0.3%;
}
.interim-container li img{
    width: 100%;
}
.feature-conatiner{
    position: absolute;
    bottom: 5px;
    left: 0px;
    right: 1.8%;
    padding-left: 10px;
    background: rgba(0,0,0,.5);
    color: #fff;
}
.feature-conatiner p {
    margin: 0px;
    height: 30px;
    line-height: 30px;
}
.checkedSquare{
    box-sizing: border-box;
    border: 5px solid red;
}
</style>
