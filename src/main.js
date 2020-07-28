import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import './config/axios-config'

//https://zhuanlan.zhihu.com/p/36259799
//https://www.npmjs.com/package/vue-table-with-tree-grid?activeTab=readme
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

//全局注册组件
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
