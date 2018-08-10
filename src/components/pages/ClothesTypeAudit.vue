<template>
    <el-container>
        <el-header class="clothes-header">
            <div class="img-count-size">
                <el-tag>图片数: {{imgSize.imgCount}}</el-tag>
            </div>
            <div class="submit-type">
                <el-tag v-for="(item, index) in imgSize.imgInfo" :key="index">{{item.featureType}}</el-tag>
                <el-button type="success" size="mini" @click="passImage">通过</el-button>
                <el-button type="danger" size="mini" @click="rejectImage">驳回</el-button>
            </div> 
            <div class="slider-container">
                <el-slider class="slider-control" :min="sliderOption.min" :max="sliderOption.max" v-model="sliderOption.initvalue" @change="changeImgSize"></el-slider>
            </div>
            
            <!-- <el-button type="default">上一张</el-button>
            <el-button type="default">上一张</el-button> -->
            
        </el-header>
        <el-main class="clothes-main">
            <img :src="imgSize.imgpath" :width="imgSize.imgWidth" :height="imgSize.imgHeight" class="img-border-info">
        </el-main>
    </el-container>
</template>

<script>
import axios from 'axios'
import img from '@/assets/images/o98k.jpg'
import url from '@/api/clothestype.js'
import { dataFarmat } from '@/utils/util.js'
import { Message, Loading } from 'element-ui'
export default {
    data() {
        return {
            loading: {
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            },
            taskId: 'undefined',
            sliderOption: {
                initvalue: 250,
                max: 500,
                min: 25,
            },
            imgSize: {
                imgId: 'undefined',
                imgCount: 100,
                imgpath: img,
                imgWidth: 960,
                imgHeight: 720,
                imgInfo: [],
            }
        }
    },
    created() {
        let taskId = this.$route.query.id
        this.taskId = taskId
        this.getImage()
    },
    methods: {
        getImage() {
            const loading = this.$loading(this.loading);
            let taskId = this.taskId
            axios({
                url: `${url.auditSquare}?tid=${taskId}`,
                method: 'get'
            }).then( res => {
                if(res.data.result && res.data.code != '007'){
                    let data = JSON.parse(res.data.data)
                    this.imgSize = {
                        imgId: data.squareImageId,                       
                        imgpath: data.squareImagePath,
                        imgCount: data.countPage,
                        imgInfo: data.clothesFeatureList,
                        imgWidth: 960,
                        imgHeight: 720
                    }
                    loading.close()
                }else if(res.data.result && res.data.code == '007'){
                    this.imgSize = {
                        imgpath: img,
                        imgInfo: [],
                        imgCount: 0,
                        imgWidth: 960,
                        imgHeight: 720
                    }
                    loading.close()
                }else{
                    Message.error(res.data.message)
                    loading.close()
                }
            })
        },
        passImage() {
            let imgId = this.imgSize.imgId
            let feature = this.imgSize.imgInfo
            let newFeature = []
            feature.forEach((value,index) => {
                newFeature.push(value.featureId)
            })
            let params = dataFarmat({squareImageId: imgId, featureId: newFeature})
            axios({
                url: url.auditPassSquare,
                method: 'post',
                data: params
            }).then( res => {
               if(res.data.result){
                   this.getImage()
               }else{
                   Message.error(res.data.message)
               }
            })
        },
        rejectImage() {
            let imgId = this.imgSize.imgId
            let params = dataFarmat({ squareImageId: imgId})
            if(confirm('确认驳回？')){
                axios({
                    url: url.auditRejectSquare,
                    method: 'post',
                    data: params
                }).then( res => {
                    if(res.data.result){
                        Message.success('驳回成功')
                        this.getImage()
                    }else{
                        Message.error(res.data.message)
                    }
                })
            }       
        },
        changeImgSize() {
            let sliderValue = this.sliderOption.initvalue
            let width = 320/100*sliderValue
            let height = 270/100*sliderValue
            this.imgSize.imgWidth = width
            this.imgSize.imgHeight = height
        }
    }
}
</script>

<style>
.clothes-header{
    text-align: center;
    line-height: 60px;
}
.img-count-size{
    float: left;
    height: 60px;
    line-height: 60px;
    padding: 0px 20px;
    font-size: 22px;
}
.submit-type{
    text-align: left;
    min-width: 300px;
    float: left;
}
.slider-container{
    float: left;
    margin: 10px 20px;
    height: 40px;
    width: 300px;
}
.clothes-type{
    height: 40px;
    width: 450px;
}
.clothes-main{
    position: fixed;
    top: 140px;
    bottom: 50px;
    overflow-y: scroll;
}
.clothes-main::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
    visibility: hidden;
}
.clothes-main::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
    visibility: hidden;
}
.clothes-main::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
    visibility: hidden;
}
.img-border-info{
    border: 5px solid yellow;
}
.img-border-success{
    border: 5px solid green;
}
.img-border-error{
    border: 5px solid red;
}
</style>
