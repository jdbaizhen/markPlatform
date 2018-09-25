<template>
    <div class="upload-container">
        <el-upload
        drag
        action="/img/image"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传zip/rar压缩文件</div>
        </el-upload>
    </div>
</template>

<script>
import {Message} from 'element-ui'
export default {
    data(){
        return{

        }
    },
    methods: {
        handleBeforeUpload: function(file){
            let size = Math.round(file.size/1024/1024);
            let fileName = file.name;
            let fileType = fileName.substring(fileName.indexOf('.')+1);
            if(fileType != 'zip' && fileType != 'rar'){
                Message.error('只能上传zip/rar类型的压缩文件');
                return false;
            }
            if(size > 25){
                Message.error('上传文件不能大于25MB');
                return false;
            } 
        },
        handleSuccess(res, file) {
            if(res.result){
                Message.success(res.message)
            }
        },
        handleError(err){
            Message.error('上传失败，请确定压缩包内只存在jpg/png文件')
        }
    }
}
</script>

<style>
.upload-container{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
</style>
