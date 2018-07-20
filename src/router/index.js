import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Main from '@/components/pages/Main'
import Task from '@/components/pages/Task'
import TaskDetail from '@/components/pages/TaskDetail'

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
        }        
      ]
    }
  ]
})
