<template>
  <div>
    <p class="manager_name" v-if="approvalFlag==1">（{{ managerName }}）</p>
    <a-form layout="horizontal" 
            @submit="handleSubmitManager()" 
            :autoFormCreate="(form)=>{this.form1 = form}" 
            style="padding: 25px 10px;"
            v-if="approvalFlag==1">
      <a-row>
        <a-col v-for="(item,index) in managerApproval" :key="index" :class="item.type == 'textarea' ? 'aCol' : 'aCol'" >
          <a-form-item :label="item.label" 
                       :labelCol="item.type == 'textarea' ? { span: 1 } : labelCol" 
                       :wrapperCol="item.type == 'textarea' ? { span: 20 } : wrapperCol"  
                       :fieldDecoratorId="item.name" 
                       :fieldDecoratorOptions="{rules: [{ required: item.required, message: item.message }]}">
            <a-select v-if="item.type == 'select'" :placeholder="item.message">
              <a-select-option v-for="option in item.option" :key="option.value">{{option.value}}</a-select-option>
            </a-select>
            <a-input :placeholder="item.message"  v-if="item.type == 'systemValue'" disabled/>
            <a-textarea autosize v-if="item.type =='textarea'" />
          </a-form-item>
        </a-col>
      </a-row>
      <div class="btn"> 
        <a-button type="danger" :loading='btnloading' 
                  @click="back()" style="margin-right: 20px;"
                  v-if="question_status=='已接收问题'||question_status=='初次审核'">
          回退
        </a-button>
        <a-button type="primary" :loading='btnloading' style="margin-left: 20px;"
          @click="handleSubmitManager()">确定</a-button>
      </div>
    </a-form>
    <a-form layout="horizontal" 
            @submit="handleSubmitIE()" 
            :autoFormCreate="(form)=>{this.form2 = form}" 
            style="padding: 25px 10px;"
            v-if="approvalFlag==2">
      <a-row>
        <a-col v-for="(item,index) in engineerApproval" :key="index" :class="item.type == 'textarea' ? 'aCol' : 'aCol'" >
          <a-form-item :label="item.label" 
                      :labelCol="item.type == 'textarea' ? { span: 2 } : labelCol" 
                      :wrapperCol="item.type == 'textarea' ? { span: 20 } : wrapperCol"  
                      :fieldDecoratorId="item.name" 
                      :fieldDecoratorOptions="{rules: [{ required: item.required, message: item.message }]}">
            <a-select v-if="item.type == 'select'" :placeholder="item.message">
              <a-select-option v-for="option in item.option" :key="option.value">{{option.value}}</a-select-option>
            </a-select>
            <a-input :placeholder="item.message" v-if="item.type == 'systemValue'" disabled/>
            <a-textarea autosize v-if="item.type =='textarea'"/>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="btn"> 
        <a-button type="primary" :loading='btnloading' @click="handleSubmitIE()">确定</a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import { managerApproval, engineerApproval } from '@/assets/data.js'
import { approvalEHW, backManagerApproval, IEApproval, SHOWEHWEDITDATA } from '@/assets/js/url'
import qs from 'qs'
export default {
  data () {
    return {
      labelCol: {},
      wrapperCol: {},
      jobnumber: '',
      username: '',
      job: '',
      approvalFlag: '',
      projectNumber: '',
      projectId: '',
      btnloading: false,
      question_status: '',
      managerName: '',
      managerApproval,
      engineerApproval
    }
  },
  methods: {
    //确定提交
    handleSubmitManager (e) {
      let _this = this
      this.form1.validateFields((err, fieldsValue) => {
        if (!err) {
          this.btnloading = true
          const formData = new FormData()
          const values = {
            ...fieldsValue,
            "id": this.projectId,
            "project_number": this.projectNumber,
            "label": '外网',
            "outsideName": this.username + '-' + this.jobnumber + '-' + this.job
          }
          for (var key in values) {
            if (values[key]) {
              formData.append(key, values[key])
            }
          }
          formData.append('outRoot', window.sessionStorage.getItem('ROOT'))
          formData.append('outGroup', window.sessionStorage.getItem('GROUP'))
          _this.axios.post(approvalEHW, formData).then((res) => {
            if (res.data.success == true) {
              _this.$message.success(res.data.message)
              _this.$router.push('ecnList')
            } else {
              _this.$message.error(res.data.message)
              _this.btnloading = false
            }
          })
        }
      })
    },
    handleSubmitIE (e) {
      let _this = this
      this.form2.validateFields((err, fieldsValue) => {
        if (!err) {
          this.btnloading = true
          const formData = new FormData()
          const values = {
            ...fieldsValue,
            "id": this.projectId,
            "label": '外网',
            "outsideName": this.username + '-' + this.jobnumber + '-' + this.job
          }
          for (var key in values) {    
            formData.append(key, values[key])
          }
          formData.append('root', window.sessionStorage.getItem('ROOT'))
          formData.append('group', window.sessionStorage.getItem('GROUP'))
          _this.axios.post(IEApproval, formData).then((res) => {
            if (res.data.success == true) {
              _this.$message.success(res.data.message)
              _this.$router.push('ecnList')
            } else {
              _this.$message.error(res.data.message)
              _this.btnloading = false
            }
          })
        }
      })
    },
    back () {
      let _this = this
      dd.device.notification.prompt({
        message: '回退原因？',
        title: '提示',
        buttonLabel: ['确定', '取消'],
        onSuccess: function (result) {
          if (result.buttonIndex == 0) {
            let backReason = result.value
            _this.backRoll(backReason)
          } 
        },
        onFail: function (err) {}
      })
    },
    backRoll (reason) {
      const formData = new FormData()
      const values = {
            "id": this.projectId,
            "project_number": this.projectNumber,
            "label": '外网-审核',
            "reason": reason,
            "outsideName": this.username + '-' + this.jobnumber + '-' + this.job
          }
      for (var key in values) {    
        formData.append(key, values[key])
      }
      this.axios.post(backManagerApproval, formData).then((res) => {
        if (res.data.success == true) {
          this.$message.success(res.data.message);
          this.$router.push('ecnList')
        } else {
          this.$message.error(res.data.message);
          this.btnloading = false
        }
      })
    }
  },
  created () {
    this.jobnumber = window.sessionStorage.getItem('LYRIC_JOBNUMBER')
    this.username = window.sessionStorage.getItem('LYRIC_NAME')
    this.job = window.sessionStorage.getItem('JobName')
  },
  mounted () {
    this.approvalFlag = this.$route.query.flag
    this.projectNumber = this.$route.query.proNum
    this.projectId = this.$route.query.id
    this.question_status = this.$route.query.status
    if (this.projectId) {
      this.axios.post(SHOWEHWEDITDATA, qs.stringify({
        id: this.projectId
      })).then(res => {
        if (res.data.success == true) {
          const value = {}
          if (this.approvalFlag == 1) {
            this.managerName = res.data.mava.manager
            if (this.managerName.length == 0 || this.managerName == null) {
              this.managerName = '无项目经理'
            }
            this.managerApproval.forEach(val => {
              for (let item in res.data.obj) {
                if (res.data.obj[item]) {
                  if (val.name == item && val.type == 'date') {
                    value[item] = moment(res.data.obj[item], this.dateFormat)
                  } else if (val.name == item) {
                    value[item] = res.data.obj[item]
                  }
                }
              }
            })
            this.form1.setFieldsValue(value)
          } else if (this.approvalFlag == 2) {
            this.engineerApproval.forEach(val => {
              for (let item in res.data.obj) {
                if (res.data.obj[item]) {
                  if (val.name == item && val.type == 'date') {
                    value[item] = moment(res.data.obj[item], this.dateFormat)
                  } else if (val.name == item) {
                    value[item] = res.data.obj[item]
                  }
                }
              }
            })
            this.form2.setFieldsValue(value)
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style>
  .ant-alert-info{
    border: none; 
    background-color: white;
  }
  .ant-alert.ant-alert-no-icon{
    padding: 8px 0
  }
  .btn{
    width: 100%;
    text-align: center;
    /* float: right; */
    /* margin: 20px 0 0 42%; */
    /* width: 300px; */
  }
  .manager_name {
    position: absolute;
    /* top: 10px; */
    left: 12px;
    color: black;
  }
</style>