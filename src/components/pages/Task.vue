<template>
    <el-container>
        <el-header>
            <el-form :inline="true" :model="taskForm" ref="taskForm" size="mini">
                <el-form-item label="账户">
                    <el-input v-model="taskForm.username" placeholder="账户"></el-input>
                </el-form-item>
                <el-form-item label="执行人">
                    <el-input v-model="taskForm.name" placeholder="执行人"></el-input>
                </el-form-item>
                <el-form-item label="任务状态">
                    <el-select v-model="taskForm.status" placeholder="选择任务状态">
                        <el-option v-for="item in taskStatus" :key="item.value" :value="item.label">{{item.label}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="人员状态">
                    <el-select v-model="taskForm.personStatus" placeholder="选择人员状态">
                        <el-option v-for="item in personStatus" :key="item.value" :value="item.value">{{item.label}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="起始时间">
                    <el-date-picker v-model="taskForm.beginTime" type="datetime" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                 <el-form-item label="终止时间">
                    <el-date-picker v-model="taskForm.endTime" type="datetime" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('taskForm')">查询</el-button>
                    <el-button type="default" @click="resetForm('taskForm')">重置</el-button>
                </el-form-item>    
            </el-form>
        </el-header>
        <el-main>
            <el-table
                :data="taskTable"
                style="width:100%"
                :row-class-name="tableRowClassName"
            >
                <el-table-column prop="id" label="#"></el-table-column>
                <el-table-column prop="username" label="账户"></el-table-column>
                <el-table-column prop="tName" label="任务名"></el-table-column>
                <el-table-column prop="count" label="标注数量"></el-table-column>
                <el-table-column prop="publishTime" label="发布时间"></el-table-column>
                <el-table-column prop="status" label="任务状态"></el-table-column>
                <el-table-column prop="name" label="标注人员"></el-table-column>
                <el-table-column prop="personStatus" label="人员状态"></el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>
<script>
import SearchTable from '@/components/component/SearchTable'
export default {
    name: 'Task',
    data () {
        return {
            taskForm: {
                username: '',
                name: '',
                status: '',
                personStatus: '',
                beginTime: '',
                endTime: ''
            },
            taskStatus: [
                { label: '未领取', value: '0' },
                { label: '处理中', value: '1' },
                { label: '标注完成', value: '2' },
                { label: '审核完成', value: '3' },
                { label: '导出完成', value: '4' },
            ],
            personStatus: [
                { label: '在职', value: '0' },
                { label: '移交', value: '1' },
            ],
            taskTable: [
                { id: '1', username: 'student1', tName: 'task1', count: '1', publishTime: '2018-08-20 12:33:23', status: '1', name:'白振', personStatus: '0', },
                { id: '1', username: 'student1', tName: 'task1', count: '1', publishTime: '2018-08-20 12:33:23', status: '0', name:'白振', personStatus: '0', },
                { id: '1', username: 'student1', tName: 'task1', count: '1', publishTime: '2018-08-20 12:33:23', status: '4', name:'白振', personStatus: '0', },
                { id: '1', username: 'student1', tName: 'task1', count: '1', publishTime: '2018-08-20 12:33:23', status: '2', name:'白振', personStatus: '0', },
                { id: '1', username: 'student1', tName: 'task1', count: '1', publishTime: '2018-08-20 12:33:23', status: '3', name:'白振', personStatus: '0', },
            ]
                             
        }
    },
    components: {
        SearchTable
    },
    methods: {
        submitForm(formName) {
           console.log(this.taskForm);
        },
        resetForm(formName) {
           console.log(this.$refs[formName]);
        },
        tableRowClassName({row, rowIndex}) {
            if (row.status == 0) {
                return 'default-row';
            } else if (row.status == 1) {
                return 'info-row';
            } else if (row.status == 2) {
                return 'warning-row';
            } else if (row.status == 3) {
                return 'blue-row';
            } else if (row.status == 4) {
                return 'success-row';
            }
            return 'error-row';
        }
    }
}
</script>
<style>
  .el-table .default-row{
    background: #fff;
  }
  .el-table .info-row{
    background: rgba(144,147,153,.4);
  }
  .el-table .warning-row {
    background: rgba(230,162,60,.4);
  }
  .el-table .blue-row {
    background: rgba(64,158,255,.4);
  }
  .el-table .success-row {
    background: rgba(103,194,58,.4);
  }
  .el-table .error-row {
    background: rgba(245,108,108,.4);
  }
</style>
