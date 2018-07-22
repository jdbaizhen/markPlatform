// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Input, Button, Icon, Container, Header, Main, Footer, Menu, MenuItem, Submenu, Form, FormItem, Select, Option, DatePicker, Table, TableColumn } from 'element-ui'

Vue.config.productionTip = false
Vue.use(Input)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(TableColumn)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
