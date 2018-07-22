<template>
    <el-form-item>
        <el-button type="primary" @click="$emit('submitForm')">查询</el-button>
        <el-button type="default" @click="$emit('resetForm')">重置</el-button>
    </el-form-item>     
</template>

<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        
    }
}
</script>

<style>

</style>
