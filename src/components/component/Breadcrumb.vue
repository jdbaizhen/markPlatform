<template>
    <el-breadcrumb class="breadcrumb-style">
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
    line-height: 40px;
    background: #bbdaf7;
    padding: 0 20px;
    margin-bottom: 20px;
}
</style>
