<template>
    <el-container>
        <el-header class="main-style-header">
            <breadcrumb :data="breadcrumb"></breadcrumb>
        </el-header>
        <el-container class="containers"> 
            <el-header class="main-style-header">
                <el-button type="danger" icon="el-icon-delete" v-loading.fullscreen.lock="loading" size="mini" @click="submitPhoto(0)"></el-button>
                <span class="main-style-info">剩余{{pictureInfo.countPage}}张图片</span>
                <el-button type="success" size="mini" v-loading.fullscreen.lock="loading" @click="submitPhoto(1)">通过</el-button>
            </el-header> 
            <el-container>
                <el-main class="photo-container">
                    <img :src="pictureInfo.imgpath" alt="image" width="100%">
                </el-main>
                <el-aside class="delete-info-container">
                    <h3>删除量统计</h3>
                    <el-collapse>
                         <el-collapse-item v-for="(item, index) in deletePhotoList" :key="index" :title="`${item.deviceNumber}号机`" :name="index">
                            <div>今日删除量:  {{item.todayDeleteCount}}</div>
                            <div>累计删除量:  {{item.totalDeleteCount}}</div>
                        </el-collapse-item>
                    </el-collapse>
                </el-aside>
            </el-container>   
        </el-container>     
    </el-container>
</template>

<script>
import Breadcrumb from '@/components/component/Breadcrumb'
import ok from '@/assets/images/o98k.jpg'
import { dataFarmat } from '@/utils/util.js'
import axios from 'axios'
import url from '@/api/photo.js'
import { Message } from 'element-ui'
export default {
    data() {
        return {
            machine: 0,
            loading: false,
            breadcrumb: [],
            pictureInfo: {
                imgpath: ok,
				countPage: 0,
				nextImgId: '',
				imgId: ''
            },
            deletePhotoList: []
        }
    },
     components: {
        Breadcrumb
    },
    watch: {
        '$route' (to, from) {
            this.machine = to.query.machine
            this.breadcrumb = [{ path: '', name: `${to.query.machine}号图片库` }]
            this.initPhoto()
        }  
    },
    mounted() {
        let machine = this.$route.query.machine
        this.machine = machine
        this.breadcrumb = [{ path: '', name: `${machine}号图片库` }]
        this.initPhoto()
    },
    methods: {
        initPhoto() {
            this.loading = true
            let num = this.machine
            axios({
                url: `${url.init}?deviceNumber=${num}`,
                method: 'get'
            }).then( res => {
                if(res.data.result){
                    let pictureInfo = JSON.parse(res.data.data)
                    if(pictureInfo == null){
                        this.pictureInfo = {
                            imgpath: ok,
							countPage: 0,
							nextImgId: '',
							imgId: ''
                        }
                    }else{
                        this.pictureInfo = pictureInfo
                    }
                    this.deletePhotoCount()
                    this.loading = false
                }
            })
        },
        submitPhoto(num) {
            if(num == 0){
                if(confirm('确认删除？')){
                    this.postPhoto(url.pictureDelete)
                }
            }else{
                this.postPhoto(url.picturePass)
            }
        },
        postPhoto(path) {
            this.loading = true
            let deviceNumber = this.machine
            let imageId = this.pictureInfo.imgId
            let nextImageId = this.pictureInfo.nextImgId
            let params = dataFarmat({deviceNumber: deviceNumber, imageId: imageId, nextImageId: nextImageId})
            axios({
                url: path,
                method: 'post',
                data: params
            }).then( res => {
                if(res.data.result){
                    if(res.data.code == '003'){
                        Message.success(res.data.message)
                        this.pictureInfo = {
                            imgpath: ok,
							countPage: 0,
							nextImgId: '',
							imgId: ''
                        }
                    }else{
                        let pictureInfo = JSON.parse(res.data.data)
                        this.pictureInfo = pictureInfo
                    }
                    this.deletePhotoCount()
                    this.loading = false
                }else{
                    Message.error(res.data.message)
                }
            })
        },
        deletePhotoCount() {
            axios({
                url: url.deletePhotoCount,
                method: 'get'
            }).then( res => {
                if(res.data.result){
                    let data = JSON.parse(res.data.data)
                    this.deletePhotoList = data.deleteCountList
                }else{
                    Message.error(res.data.message)
                }
            })
        }
    }
}
</script>

<style>
.containers{
    background: #fff;
}
.photo-container{
    padding-top: 0px
}
.main-style-header{
    height: 40px !important;
    line-height: 40px;
    text-align: center
}
.main-style-header .main-style-info{
    display: inline-block;
    padding: 0px 50px;
}
.delete-info-container{
    width: 360px;
    padding: 0px 20px 20px 20 px;
}
.delete-info-container h3{
    margin: 0px 0px 15px 0px;
}
.delete-info-container i{
    line-height: 49px;
}

</style>
