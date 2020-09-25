<template>
  <div id="ECNdetail">
    <!-- <header>
      详情
    </header> -->
      <div class="detailCon">
        <div>
          <p class="detailTitle"><b>节点：</b></p>
          <a-steps direction="vertical" :current="activeStep" size="small">
            <a-step title="已接收异常"/>
            <a-step title="工程已出图"/>
            <a-step title="已接收图纸"/>
            <a-step title="物料齐套" />
            <a-step title="物料寄送" v-if="timeList.length>5" />
            <a-step title="物料接收" v-if="timeList.length>5" />
            <a-step title="异常关闭"/>
          </a-steps>
        </div>

        <div class="nameLine">
          <p class="detailTitle"><b>责任人：</b></p>
          <a-step class="nameDetail" v-for="(item,index) in mavaList" :key="index" :title="item.username"/>
        </div>

        <div class="mobileLine">
          <p class="detailTitle"><b>联系方式：</b></p>
          <a-step class="moblie" v-for="(item,index) in mavaList" :key="index"  :title="item.mobile"/>
        </div>

        <div class="mobileLine">
          <p class="detailTitle"><b>时间:</b></p>
          <a-step class="moblie" v-for="(item,index) in timeList" :key="index"  :title="item.time" :description="item.title"/>
        </div>
      </div>

      <a-table v-if="effectList.length >0" :columns="effectColumns" :dataSource="effectList" :pagination='{defaultPageSize: 5}' :scroll="{ x: 800}" bordered style="margin-top:50px" />
  </div>
</template>

<script>
import {DETAILDATA} from '@/assets/js/url'
import qs from 'qs'
export default {
  data () {
    return {
      activeStep: 0,
      mavaList : [],
      timeList: [],
      effectColumns : [
        {
            title: '序号',
            width: 80,
            dataIndex: 'number',
        },
        {
            title: '确认日期',
            dataIndex: 'improvement_results_completion_time',
            width: 150
        },
        {
            title: '装配及调试情况',
            dataIndex: 'improvement_situation',
        },
        {
            title: '确认人',
            dataIndex: 'temporary_confirmer',
            width: 100
        },
        {
            title: '状态（未完成/NG/OK）',
            dataIndex: 'improvement_results',
            width: 200
        },
      ],
      effectList: []
    }
  },
  created(){
    this.detailData()

  },
  methods:{
    detailData(){
      let _this = this
      _this.axios.post(DETAILDATA,qs.stringify({
        id : _this.$route.query.id
      })).then(res=>{
        switch(res.data.fixed){
          case '已接收异常':
            _this.activeStep = 1
            break; 
          case '工程已出图':
            _this.activeStep = 2
            break; 
          case '已接收图纸':
            _this.activeStep = 3
            break; 
          case '物料齐套':
            _this.activeStep = 4
            break; 
          case '物料寄送':
            _this.activeStep = 5
            break; 
          case '物料接收':
            _this.activeStep = 6
            break; 
          case '关闭':
            _this.activeStep = 7
            break; 
        }
        res.data.obj.timeList.forEach((val,index) => {
            if(val.time){
              if(res.data.obj.timeList.length >5){
                switch(index){
                  case 0:
                  val.title = '(问题发起时间)'
                  break; 
                  case 1:
                  val.title = '(实际出图时间)'
                  break; 
                  case 2:
                  val.title = '(实际接收图纸时间)'
                  break; 
                  case 3:
                  val.title = '(实际齐套时间)'
                  break; 
                  case 4:
                  val.title = '(物料寄送时间)'
                  break; 
                  case 5:
                  val.title = '(物料接收时间)'
                  break; 
                  case 6:
                  val.title = '(关闭时间)'
                  break; 
                }
              }else{
                  switch(index){
                  case 0:
                  val.title = '(问题发起时间)'
                  break; 
                  case 1:
                  val.title = '(实际出图时间)'
                  break; 
                  case 2:
                  val.title = '(实际接收图纸时间)'
                  break; 
                  case 3:
                  val.title = '(实际齐套时间)'
                  break; 
                  case 4:
                  val.title = '(关闭时间)'
                  break; 
              }
            }
          }
        });
       
        _this.mavaList = res.data.obj.personList
        _this.timeList = res.data.obj.timeList
        _this.effectList = res.data.obj.effectList
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