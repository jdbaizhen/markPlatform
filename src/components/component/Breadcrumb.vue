<template>
    <el-breadcrumb class="breadcrumb-style" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>当前位置: </el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in data" :key="index" :to="{path: item.path}">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>

export default {
    props: {
        data: Array
    }
}
</script>

<style>
.breadcrumb-style{
    height: 40px;
    color: #fff ！important;
    line-height: 40px;
    /* background: rgba(0,245,255,0.5);
    box-shadow: 0 0 0 1px hsla(240,0%,100%,.3) inset, 0 .3em 1em rgba(0, 0, 0, 0.3); 
    padding: 0 20px;*/
    margin-bottom: 10px;
}
</style>
