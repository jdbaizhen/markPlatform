import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Main from '@/components/pages/Main'
import Task from '@/components/pages/Task'
import TaskDetail from '@/components/pages/TaskDetail'
import Audit from '@/components/pages/Audit'
import Log from '@/components/pages/Log'
import Export from '@/components/pages/Export'
import Employee from '@/components/pages/Employee'
import Photo from '@/components/pages/Photo'
import ClothesType from '@/components/pages/ClothesType'
import ClothesTypeAudit from '@/components/pages/ClothesTypeAudit'
import Users from '@/components/pages/Users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
        {
          path: 'task',
          name: 'Task',
          component: Task 
        },
        {
          path: 'taskdetail',
          name: 'TaskDetail',
          component: TaskDetail
        },
        {
          path: 'audit',
          name: 'Audit',
          component: Audit
        },
        {
          path: '/log',
          name: 'Log',
          component: Log
        },
        {
          path: 'export',
          name: 'Export',
          component: Export
        },
        {
          path: 'employee',
          name: 'Employee',
          component: Employee
        },
        {
          path: 'photo',
          name: 'Photo',
          component: Photo
        },
        {
          path: 'clothestype',
          name: 'ClothesType',
          component: ClothesType
        },
        {
          path: 'clothestypeaudit',
          name: 'ClothesTypeAudit',
          component: ClothesTypeAudit
        },
        {
          path: 'users',
          name: 'Users',
          component: Users
        }                    
      ]
    }
  ]
})
