// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import '@/assets/style/reset.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.use(Antd);

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

Vue.prototype.axios = axios

Vue.config.productionTip = false

axios.interceptors.request.use(function (config) {
  
  // 统一添加参数
  //   if(config.method === 'post'){
  //     config.data = qs.stringify({
  //       ...config.data,
  //       ipAddress: ipAddress,
  //       tag:tag
  //     })
  //   }else if(config.method === 'get'){
  //     config.params = {
  //       ipAddress: ipAddress,
  //       tag:tag,
  //       ...config.params
  //     }
  //   }
  // return config
  
  //处理请求前代码
  if (config.url != 'http://183.234.204.230:8085/WorkStat/dingtalk/config'
   && config.url != 'http://183.234.204.230:8085/WorkStat/dingtalk/user/info') {
    let ipAddress = sessionStorage.getItem('ip')
    config.headers = {
      'ipAddress': ipAddress,
      'tag': 'mobile',
      ...config.headers
    }
  }
  return config
}, function (error) {
  //一些事情伴随着错误
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
