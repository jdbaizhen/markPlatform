// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/common.css'
import promise from 'es6-promise'
import { Input, Button, Icon, Container, CheckboxGroup, CheckboxButton, Header, Main, Aside, Footer, Menu, MenuItem, Submenu, Form, FormItem, Select, Option, DatePicker, Table, TableColumn, Tag, Pagination, Loading, Dialog, Breadcrumb, BreadcrumbItem, Checkbox, Collapse, CollapseItem, Slider, OptionGroup } from 'element-ui'

promise.polyfill()

Vue.config.productionTip = false
Vue.use(Input)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
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
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Loading)
Vue.use(Dialog)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Checkbox)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Slider)
Vue.use(OptionGroup)
Vue.use(CheckboxGroup)
Vue.use(CheckboxButton)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
