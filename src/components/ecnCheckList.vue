<template>
  <div>
    <a-spin :spinning="spinningShow" tip="加载中。。。">
      <div class="titleShow">
        异常编号为：{{ project_exception_number}}，
        工位代号为：{{position_code}}，
        批次号为：{{batch}}

        <a-button
          style="margin: 10px; float: right;"
          type="primary"
          ghost
          @click="accept">物料接收</a-button>
      </div>

      
      <div class="dataBox">
        <div v-for="(item, index) in dataSource" :key="index">
          <a-checkbox
            v-if="isAccept"
            :value="index"
            style="width: 100%"
            :checked="item.checked"
            @change="onChange"
          />
          <div class="oneData">
            <p>物料编号：{{item.materiel_code}}</p>
            <p>物料描述：{{item.materiel_description}}</p>
            <p>总需求数量：{{item.station_consumption}}</p>
            <p>已领数量：{{item.quantity_received}}</p>
            <p>未领数量：{{item.not_quantity_received}}</p>
            <p>物料计划类型：{{item.materiel_plan_status}}</p>
            <p>物料计划：{{item.materiel_plan}}</p>
            <p>物料计划齐套时间：{{item.materiel_set_time}}</p>
            <p>物料入库时间：{{item.materiel_in_time}}</p>
            <p>接收人：{{item.accepter}}</p>
            <p>接收时间：{{item.acceptTime}}</p>
            <p style="display: flex">
              <label>接收地点：</label>
              <a-input
                v-if="item.editable"
                placeholder="请输入接收地点"
                style="flex: 1"
                v-model="item.acceptAddress"
                @change="addressChange($event, index)"/>
              <label v-else>{{item.acceptAddress}}</label>
            </p>
          </div>
        </div>

        <!-- 操作 -->
        <div class="btn" v-if="isAccept">
          <a-button @click="cancelAccept">取消</a-button>
          <a-button
            type="primary"
            ghost
            @click="sureAccept">确定</a-button>
        </div>
      </div>


      <!-- 历史记录 -->
      <a-card title="历史记录" class="record" v-if="recordList.length>0">
        <div v-for="item in recordList" :key="item.id" class="oneRecord">
          <p>
            <span v-show="item.type == 0">快递单号：</span>
            {{item.express_number}}
            <span class="copy"
              @click="copyExpress(item.express_number)"
              v-show="item.type == 0">复制</span>
          </p>
          <p>时 间： {{item.express_time}}</p>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { CHECKLIST, getAcceptAddress,
  saveMaterialAcceptData, UPDATESTATUS } from '@/assets/js/url'
import qs from 'qs'
export default {
  data() {
    return {
      dataSource: [],
      catchData: [],
      recordList: [],
      iconLoading: false,
      project_exception_number: '',
      position_code: '',
      batch: '',
      currentUser: null,
      spinningShow: false,
      isAccept: false,
      acceptAddressList: []
    }
  },
  methods: {
    // 展示数据
    showList() {
      this.axios.post(CHECKLIST, {
        EHCode: this.$route.query.EHCode,
        id: this.$route.query.id,
        label: 'outside'
      }).then(res => {
        this.spinningShow = false
        if (res.data.success) {
          this.recordList = res.data.mava ? res.data.mava : []
          this.dataSource = res.data.obj.list_show
          this.catchData = this.dataSource.map(item => ({ ...item }))
          this.project_exception_number =
            res.data.obj.project_exception_number
          this.position_code = res.data.obj.position_code
          this.batch = res.data.obj.batch
        }
      })
    },

    // 是否选中
    onChange(e) {
      let dataSource = this.dataSource
      dataSource.find((val, index) => {
        if (index === e.target.value) {
          val.checked = e.target.checked
          if (!e.target.checked) {
            val.editable = false
            val.accepter = ''
            val.acceptTime = ''
            val.acceptAddress = ''
          }
        }
        e.target.checked && this.getAcceptAddress()
      })
      this.dataSource = [...dataSource]
    },

    // 物料接收
    accept() {
      this.isAccept = true
      this.dataSource.map(val=> {
        val.checked = true
      })
      this.getAcceptAddress()
    },

    // 获取接收地点
    getAcceptAddress() {
      this.axios.get(getAcceptAddress, {params: {
        EHCode: this.$route.query.EHCode,
        projectNum: this.$route.query.projectNum,
        label: 'outside'
      }}).then(res => {
        if (res.data.success && res.data.obj.length >0) {
          this.acceptAddressList = res.data.obj
          this.fillData()      
        }
      })
    },

    // 填充数据
    fillData() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
      let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      this.currentUser = sessionStorage.getItem('LYRIC_JOBNUMBER')
      let dataSource = this.dataSource
      dataSource.forEach((val, index) => {
        if (val.checked) {
          this.acceptAddressList.find(acceptAdd => {
            if (val.materiel_code == acceptAdd.materiel_code) {
              val.acceptAddress = acceptAdd.acceptAddress
            }
          })
          val.editable = true
          val.accepter = sessionStorage.getItem('LYRIC_NAME')
          val.acceptTime = `${year}-${month}-${day}`
        }
      })
      this.dataSource = [...dataSource]
    },

    // 修改接收地址
    addressChange(e, key) {
      let value = e.target.value
      let dataSource = this.dataSource
      dataSource.map((val, index) => {
        if (key === index) {
          val.acceptAddress = value
        }
      })
      this.dataSource = [...dataSource]
    },

    // 取消
    cancelAccept() {
      this.isAccept = false
      this.dataSource = this.catchData
    },

    // 确定
    sureAccept() {
      let isQualified = true
      let selectedRow = this.dataSource.filter(val => val.checked === true)
      selectedRow.map(val => {
        val.question_id = this.$route.query.id
        val.accepterJobnum = this.currentUser
        if (!val.acceptAddress &&
          (val.materiel_plan !== '待退货' &&
          val.materiel_plan !== '标记删除')) {
          return isQualified = false
        }
      })
      if (selectedRow.length === 0) {
        this.$message.error('请选择数据')
        return
      } else if (!isQualified) {
        this.$message.error('接收地点不能为空')
        return
      }
      this.axios.post(saveMaterialAcceptData, selectedRow).then(res => {
        if (res.data.success) {
          this.showList()
          this.isAccept = false
          let allHaveName = true
          this.dataSource.map(val => {
            if (!val.accepter &&
              (val.materiel_plan !== '待退货' &&
              val.materiel_plan !== '标记删除')) {
              return allHaveName = false
            }
          })
          if (allHaveName && this.$route.query.status === '物料寄送') this.sureChain()
        }
      })
    },

    // 复制订单号
    copyExpress(number) {
      dd.biz.clipboardData.setData({
        text: number, //要复制粘贴板的内容
        onSuccess: function(result) {
          dd.device.notification.toast({
            text: '复制成功' //提示信息
          })
        },
        onFail: function() {
          dd.device.notification.toast({
            text: '复制失败' //提示信息
          })
        }
      })
    },
    // 更新状态
    sureChain() {
      this.iconLoading = true
      let params = {
        id: this.$route.query.id,
        status: '物料接收'
      }
      this.axios.post(UPDATESTATUS, qs.stringify(params)).then(res => {
        this.iconLoading = false
        if (res.data.success) {
          this.$message.success(res.data.message)
        } else {
          this.$message.error('操作失败')
        }
      })
    }
  },
  mounted() {
    this.showList()
  }
}
</script>

<style lang="less">
@import url('../assets/style/color');
.ant-card-body {
  padding: 12px;
}
p {
  margin-bottom: 0.4em;
}
.titleShow {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  line-height: 25px;
  padding: 0 10px;
  border-top: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
  background-color: #fff;
  color: @default-color;
  font-size: 16px;
}
.record {
  margin: 13px 0;
  .oneRecord {
    border-bottom: 1px solid @border-color;
    padding: 4px 0;
    .copy {
      float: right;
      color: #ec500f;
    }
  }
}
.dataBox {
  padding: 108px 0 20px 0;
  height: 100%;
  .ant-checkbox {
    padding-left: 8px;
  }
  .btn {
    margin-top: 20px;
    text-align: center;
  }
  .oneData {
    border-bottom: 1px solid @border-color;
    padding: 5px 10px;
    p {
      font-weight: bold;
    }
  }
}
</style>

