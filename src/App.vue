<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app">
        <router-view/>
      <!-- <img src="./assets/logo.png"> -->
    </div>
  </a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import { URL,DD_CONFIG, DD_GET_USER_INFO,LOGIN } from '@/assets/js/url'
import qs from 'qs'
export default {
  data() {
    return {
      zh_CN,
    }
  },
  created() {
    this.ddLogin()
    this.getUserIP((ip) => {
      sessionStorage.setItem('ip', ip)
    })
  },
  beforeDestroy() {
    sessionStorage.clear()
  },
  methods: {
    ddLogin() {
      this.axios.get(DD_CONFIG, {
        params: {
          url: URL
        }
      }).then((res) => {
        this.ddValidation(res.data.dataList)
      }).catch((err) => {
        console.log(err,'5')
        console.log('验证失败')
      })
    },
    ddValidation(config) {
      const _this = this
      let params = {
        agentId: config.agentId,
        corpId: config.corpId,
        timeStamp: config.timeStamp,
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList: [
          'runtime.permission.requestAuthCode',
          'biz.contact.complexPicker',
          'biz.navigation.setTitle',
          'device.notification.confirm',
          'biz.chat.openSingleChat',
          'biz.clipboardData.setData',
          'device.notification.toast',
          'biz.util.previewImage'
        ]
      }
      dd.config(params)
      dd.ready(() => {
        dd.runtime.permission.requestAuthCode({
          corpId: config.corpId,
          onSuccess: function(res) {
            _this.getDingdingUserInfo(res.code)
          },
          onFail: function(err) {
            console.log(err,'7')        
          }
        })
      })
      dd.error(function(err) {
        console.log('钉钉验证失败1！' +err)
      });
    },
    getDingdingUserInfo(code) {
      this.axios.get(DD_GET_USER_INFO, {
        params: {
          code: code
        }
      }).then((res) => {
        window.sessionStorage.setItem('LYRIC_JOBNUMBER', res.data.jobnumber)
        window.sessionStorage.setItem('LYRIC_NAME', res.data.name)
        window.sessionStorage.setItem('JobName',res.data.position)
        this.login({
          jobnumber: res.data.jobnumber,
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    login(params) {
      dd.device.notification.showPreloader({
        text: "自动登陆中...",
        showIcon: true,
      })
      this.axios.post(LOGIN, qs.stringify(params)).then((res) => {
        dd.device.notification.hidePreloader()
        if(res.data.success == true){
          window.sessionStorage.setItem('CENTERNAME',res.data.obj.CenterName)
          window.sessionStorage.setItem('ROOT',res.data.obj.Root)
          window.sessionStorage.setItem('GROUP',res.data.obj.Group)
          window.sessionStorage.setItem('DEPT', res.data.obj.DeptName)
          window.sessionStorage.setItem('isLogin', 'true')
          this.$router.push('/ecnList')
        }else{
          dd.device.notification.showPreloader({
            text: "您暂无权限访问！",
            showIcon: true,
          })
          console.log(res.data,'error')
        }
      })
    },
    // 获取访问者的ip
    getUserIP(onNewIP) {
      let MyPeerConnection = window.RTCPeerConnection ||
        window.mozRTCPeerConnection || window.webkitRTCPeerConnection
      let pc = new MyPeerConnection({
        iceServers: []
      })

      let noop = () => {}

      let localIPs = {}

      let ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g

      let iterateIP = (ip) => {
        if (!localIPs[ip]) onNewIP(ip)
        localIPs[ip] = true
      }

      pc.createDataChannel('')

      pc.createOffer().then((sdp) => {
        sdp.sdp.split('\n').forEach(function (line) {
          if (line.indexOf('candidate') < 0) return
          line.match(ipRegex).forEach(iterateIP)
        })

        pc.setLocalDescription(sdp, noop, noop)

      }).catch((reason) => {})

      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate
          || !ice.candidate.candidate.match(ipRegex)) return
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
      }
    }
  },
}
</script>

<style lang="less">
  @import url('./assets/style/color');
  html, body, #app{
    width: 100%;
    height: 100%;
    color: rgba(0, 0, 0, .58);
    // -webkit-overflow-scrolling:touch;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    flex-direction: column;
  }
</style>

