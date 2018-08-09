<template>
    <el-container>
        <el-header class="clothes-header">
             <div class="slider-container">
                <el-slider class="slider-control" :min="sliderOption.min" :max="sliderOption.max" v-model="sliderOption.initvalue" @change="changeImgSize"></el-slider>
            </div>
            <el-tag class="img-count-size">图片数: {{imgSize.imgCount}}</el-tag>
            <!-- <el-button type="default">上一张</el-button>
            <el-button type="default">上一张</el-button> -->
            <div class="submit-type">
                <el-select
                    v-model="clothesChose"
                    multiple 
                    :loading="selectLoading"
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
                <el-button type="success" @click="submitClothesType">提交</el-button>
            </div> 
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
            selectLoading: false,
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
            clothesTypeOne: [],
            clothesChose: [],
            imgSize: {
                imgId: 'undefined',
                imgCount: 100,
                imgpath: img,
                imgWidth: 960,
                imgHeight: 720
            }
        }
    },
    created() {
        let taskId = this.$route.query.id
        this.taskId = taskId
        this.getClothesTypeOne()
        this.getImage()
    },
    methods: {
        getClothesTypeOne() {
            this.selectLoading = true
            axios({
                url: url.clothesTypeOne,
                method: 'get'
            }).then( res => {
                if(res.data.result) {
                    let clothesTypeOne = JSON.parse(res.data.data)
                    this.clothesTypeOne = clothesTypeOne
                    this.selectLoading = false
                }
            })
        },
        getImage() {
            const loading = this.$loading(this.loading);
            let taskId = this.taskId
            axios({
                url: `${url.getSquareImg}?tid=${taskId}`,
                method: 'get'
            }).then( res => {
                if(res.data.result && res.data.code != '007'){
                    let data = JSON.parse(res.data.data)
                    this.imgSize = {
                        imgId: data.squareImageId,                       
                        imgpath: data.squareImagePath,
                        imgCount: data.countPage,
                        imgWidth: 960,
                        imgHeight: 720
                    }
                    loading.close()
                }else if(res.data.result && res.data.code == '007'){
                    this.imgSize = {
                        imgpath: img,
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
        submitClothesType() {
            let featureId = this.clothesChose
            let imgId = this.imgSize.imgId
            let params = dataFarmat({featureId: featureId, squareImageId: imgId})
            axios({
                url: url.submitSquare,
                method: 'post',
                data: params
            }).then( res => {
                if(res.data.result){
                    this.clothesChose = []
                    this.getImage()
                }else{
                    Message.error(res.data.message)
                }
            })
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
}
.img-count-size{
    width: 200px;
    height: 40px;
    line-height: 40px;
    padding: 0px 20px;
    font-size: 18px;
}
.submit-type{
    float: right;
}
.slider-container{
    float: left;
    height: 40px;
    width: 450px;
    line-height: 40px;
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
