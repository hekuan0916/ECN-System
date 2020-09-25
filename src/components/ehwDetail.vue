<template>
  <div id="ECNdetail">
      <div v-if="backReason"
        style="background: #f6f3f3;padding: 10px;font-size: 18px;">
        回退原因：{{backReason}}
      </div>
      <div class="detailCon">
        <div>
          <p class="detailTitle"><b>节点：</b></p>
          <a-steps direction="vertical" :current="activeStep" size="small">
            <a-step title="已接收问题"/>
            <a-step title="审核"/>
            <!-- <a-step title="二次审核"/>
            <a-step title="最终审核" /> -->
            <a-step title="工单处理" />
            <a-step title="物料寄送"/>
            <a-step title="物料退库"/>
            <a-step title="初判结果"/>
            <a-step title="物料追踪"/>
            <!-- <a-step title="品质判定"/> -->
            <a-step title="关闭"/>
          </a-steps>
        </div>

        <div class="nameLine">
          <p class="detailTitle"><b>责任人：</b></p>
          <a-step class="nameDetail" v-for="(item,index) in mavaList" :key="index" :title="item.name"/>
        </div>

        <div class="mobileLine">
          <p class="detailTitle"><b>时间:</b></p>
          <a-step class="moblie" v-for="(item,index) in mavaList" :key="index"  :title="item.time"/>
        </div>
      </div>
  </div>
</template>

<script>
import {showEHWDetailInfo} from '@/assets/js/url'
import qs from 'qs'
export default {
  data () {
    return {
      activeStep: 0,
      mavaList : [],
      backReason: '',
    }
  },
  mounted(){
    this.detailData(this.$route.query.id)
  },
  methods:{
    detailData(id){
      this.axios.post(showEHWDetailInfo,qs.stringify({
        question_id : id
      })).then(res=>{
        if(res.data.success) {
          this.activeStep = res.data.obj.length - 1
          this.mavaList = res.data.obj  
          this.backReason = res.data.obj_two.backReason
        }else{
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