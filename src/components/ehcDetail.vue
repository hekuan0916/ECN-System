<template>
  <div id="ECNdetail">
      <div class="detailCon">
        <div>
          <p class="detailTitle"><b>节点：</b></p>
          <a-steps direction="vertical" :current="activeStep" size="small">
            <a-step title="已接收问题"/>
            <a-step title="原因分析" />
            <a-step title="关闭"/>
          </a-steps>
        </div>
        <div class="nameLine">
          <p class="detailTitle"><b>责任人：</b></p>
          <a-step class="nameDetail" style="width: 170px"
            v-for="(item,index) in mavaList" :key="index" :title="item.name"/>
        </div>
        <div class="mobileLine">
          <p class="detailTitle"><b>时间:</b></p>
          <a-step class="moblie" v-for="(item,index) in mavaList" :key="index"  :title="item.time"/>
        </div>
      </div>
  </div>
</template>

<script>
import {SHOWEHCINFO} from '@/assets/js/url'
import qs from 'qs'
export default {
  data () {
    return {
      activeStep: 0,
      mavaList : []
    }
  },
  mounted(){
    this.detailData(this.$route.query.id)
  },
  methods:{
    detailData(id){
      this.axios.post(SHOWEHCINFO, qs.stringify({
        id: id
      })).then(res => {
        if (res.data.success) {
          if (res.data.obj.length == 3 && res.data.obj[2].time.length != 0) {
            this.activeStep = res.data.obj.length
          } else {
            this.activeStep = res.data.obj.length - 1
          }
          this.mavaList = res.data.obj
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}

</script>

<style lang='less' scoped>
  #ECNdetail{
    width: 100%;
    height: 100%;
    background-color : #fff;
    overflow: scroll;
    header {
      position: relative;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      color: #000;
      text-align: center;
      border-bottom: 1px solid #e6e6e6;
      .meetingRoomList-btn {
        position: absolute;
        right: 15px;
        top: 10px;
      }
    }
    .detailCon{
      // padding: 50px 10px;
      display: -webkit-box;
    //   display: flex;
      margin: 40px auto;
      width: 360px;
      text-align: center;
      .mobileLine{
        margin-left:3px; 
      }
    }
    .nameDetail, .moblie{
      height: 48px;
    }
  }
</style>