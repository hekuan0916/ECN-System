<template>
  <a-form
    layout="horizontal"
    @submit="handleSubmit"
    :autoFormCreate="(form)=>{this.form = form}"
    style="padding: 0px 0px;"
  >
    <a-row>
      <a-col v-for="(item, index) in ehcProblem" :key="index">
        <a-form-item
          :label="item.label"
          v-show="item.show != false"
          :fieldDecoratorId="item.name"
          :fieldDecoratorOptions="{rules: [{ required: item.required, message: item.message }]}"
        >
          <a-textarea
            autosize
            :placeholder="item.message"
            v-if="item.type =='textarea'"
            :disabled="disabled"
          />
          <a-input :placeholder="item.message" v-if="item.type =='input'" :disabled="disabled"/>
          <!-- 异常问题描述备注 -->
          <span
            v-if="item.name =='theme'"
            style="color:red; margin-left: 0px;"
          >例：2144-01-03工位，传送带在按下停止按钮后不停止，需修改</span>
          <a-select :placeholder="item.message" allowClear v-if="item.type =='select'">
            <a-select-option v-for="option in item.option" :key="option.value">{{option.value}}</a-select-option>
          </a-select>
          <a-select
            :placeholder="item.message"
            v-if="item.type =='comboboxSelect'"
            :disabled="disabled"
            :mode="item.name =='positionCode' ? positionCodeMode : null"
            :showSearch="item.name == 'projectNumber' ? true : false"
            allowClear
            @search="item.name =='projectNumber' ? searchNum($event) : ''"
            @change="item.name == 'projectNumber' ? getInputNum($event) : item.name=='positionCode'"
          >
            <a-select-option v-for="option in item.option" :key="option">{{option}}</a-select-option>
          </a-select>
          <a-select
            :placeholder="item.message"
            v-if="item.type =='showSelect'"
            :disabled="disabled"
            showSearch
            :style="item.name == 'concern' ? null : 'width: 200px;'"
            :mode="item.name == 'concern' ? 'multiple' : 'default'"
            :defaultActiveFirstOption="false"
            :showArrow="false"
            :filterOption="false"
            @search="handleSearch($event, item.searchType)"
            :notFoundContent="null"
          >
            <a-select-option
              v-for="option in item.option"
              :key="option.name + '-' + option.user+'-'+option.jobname"
            >{{option.name}}-{{option.user}}-{{option.jobname}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <div class="btn">
      <!-- <a-button @click="copy('question',$event)" :loading='btnloading' v-if="question_id">复制</a-button> -->
      <a-button type="primary" htmlType="submit" :loading="btnloading">确定</a-button>
    </div>
  </a-form>
</template>

<script>
import { ehcProblem } from '@/assets/data.js'
import {
  SERACHPRONUM,
  SELECTBYKEY,
  SHOWDATABYPROJECTNUM,
  SEARCHNAME,
  GETEHCDATA,
  CREATEEHC,
  GETLAST
} from '@/assets/js/url'
import moment from 'moment'
import qs from 'qs'
export default {
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 16, offset: 1 },
      ehcProblem,
      keys: ['DEPT', 'HAPPEN_NODE_EHC'],
      dateFormat: 'YYYY-MM-DD',
      question_id: '',
      inputCon: '',
      btnloading: false,
      projectNumber: '',
      disabled: false,
      positionCodeMode: null
    }
  },
  methods: {
    //改善负责人搜索事件
    handleSearch(value, type) {
      this.axios
        .get(SEARCHNAME, {
          params: {
            username: value
          }
        })
        .then(res => {
          if (res.data.success == true) {
            this.ehcProblem.forEach(val => {
              if (val.searchType == type) {
                val.option = res.data.obj
              }
            })
          }
        })
    },
    //项目编号模糊搜索
    searchNum(item) {
      const len = item.length
      if (len < 3) {
        return
      }
      this.axios
        .post(
          SERACHPRONUM,
          qs.stringify({
            project_num: item
          })
        )
        .then(res => {
          if (res.data.obj.length > 0) {
            this.ehcProblem.forEach(val => {
              if (val.name == 'projectNumber') {
                val.option = []
                val.option = res.data.obj
              }
            })
          }
        })
    },
    //项目编号输入框事件
    getInputNum(inputCon) {
      const reg = /^[0-9a-zA-Z]+$/
      if (!reg.test(inputCon) && open) {
        this.$message.error('请填写正确的项目编号')
        this.form.setFieldsValue({ projectNumber: '' })
      }
      if (inputCon) {
        let positionCode = this.form.getFieldValue('positionCode')
        this.axios
          .post(
            SHOWDATABYPROJECTNUM,
            qs.stringify({
              project_number: inputCon
            })
          )
          .then(res => {
            if (res.data.success == true) {
              this.projectNumber = inputCon
              positionCode && this.getPosition(positionCode)
              this.ehcProblem.forEach(val => {
                if (val.label == '工位代号') {
                  val.option = res.data.obj.position_code
                  this.positionCodeList = res.data.obj.position_code
                }
              })
            }
          })
      }
    },
    // 获取工位代号
    getPosition(value) {
      let isOldCode = this.IsInArray(this.positionCodeList, value)
      if (value && this.projectNumber == '') {
        this.$message.error('请先填写正确的项目编号')
        this.form.setFieldsValue({ positionCode: '' })
      } else if (!isOldCode && this.positionCodeList.length > 0) {
        const reg = new RegExp(this.projectNumber + '-00-[0-9]{2}')
        if (!reg.test(value)) {
          this.$message.error('请填写正确的工位代号')
          this.form.setFieldsValue({ positionCode: '' })
        }
      } else {
        const regs = new RegExp(this.projectNumber + '-[0-9]{2}-[0-9]{2}')
        if (!regs.test(value)) {
          this.$message.error('请填写正确的工位代号')
          this.form.setFieldsValue({ positionCode: '' })
        }
      }
    },
    // 判断选择的工位代号是否在工位代号数组里面
    IsInArray(arr, val) {
      var testStr = arr
      return testStr.indexOf(val) != -1
    },
    //确定提交
    handleSubmit(e) {
      let _this = this
      e.preventDefault()
      _this.form.validateFields((err, fieldsValue) => {
        if (!err) {
          if (fieldsValue['theme'].length < 30) {
            this.$message.info('请详细填写异常问题描述！（大于30个字）')
            return
          }
          this.btnloading = true
          const formData = new FormData()
          const editFileFormData = new FormData()
          const values = {
            ...fieldsValue,
            label: 'out',
            jobnum: _this.jobnumber,
            username: _this.username,
            jobname: _this.position
          }
          for (var key in values) {
            if (values[key] != undefined) {
              formData.append(key, values[key])
            }
          }
          let arr = formData.get('concern')
          if (arr) {
            arr = arr.split(',')
            for (let i in arr) {
              arr[i] = arr[i].split('-')[1]
            }
            let concernArray = arr.join(',')
            formData.append('concernArray', concernArray)
          }
          if (this.question_id) [formData.append('id', this.question_id)]
          _this.axios.post(CREATEEHC, formData).then(res => {
            this.btnloading = false
            if (res.data.success == true) {
              _this.$message.success(res.data.message)
              _this.$router.push('ecnList')
            } else {
              _this.$message.error(res.data.message)
              setTimeout(function() {
                window.location.reload()
              }, 2000)
            }
          })
        }
      })
    }
  },
  created() {
    this.jobnumber = window.sessionStorage.getItem('LYRIC_JOBNUMBER')
    this.username = window.sessionStorage.getItem('LYRIC_NAME')
    this.position = window.sessionStorage.getItem('JobName')
    for (let item in this.keys) {
      this.axios
        .get(SELECTBYKEY, {
          params: {
            key: this.keys[item]
          }
        })
        .then(res => {
          this.ehcProblem.forEach(val => {
            if (val.key == this.keys[item]) {
              val.option = res.data
            }
          })
        })
    }
  },
  mounted() {
    const root = window.sessionStorage.getItem('ROOT')
    const jobnumber = window.sessionStorage.getItem('LYRIC_JOBNUMBER')
    const group = window.sessionStorage.getItem('GROUP')
    this.question_id = this.$route.query.id
    if (this.question_id) {
      this.axios
        .get(GETEHCDATA, {
          params: {
            jobnum: this.jobnumber,
            username: window.sessionStorage.getItem('LYRIC_NAME'),
            jobname: window.sessionStorage.getItem('JobName'),
            label: 'out',
            root: root,
            group: group,
            id: this.question_id
          }
        })
        .then(res => {
          if (res.data.success == true) {
            const questionBean = res.data.obj.questionBean
            questionBean.concern =
              questionBean.concern && questionBean.concern.split(',')
            this.form.setFieldsValue(questionBean)
            // this.isCopy = root == ('admin' || this.jobnumber === questionBean.creator)
            //     && questionBean.questionStatus == '已接收问题' ? true : false
          } else {
            this.$message.error(res.data.message)
          }
        })
    } else {
      this.axios
        .get(GETLAST, {
          params: {
            jobnum: this.jobnumber
          }
        })
        .then(res => {
          if (res.data.success == true) {
            const params = {
              ...res.data.obj,
              questioner:
                this.username + '-' + this.jobnumber + '-' + this.position,
              abnormalPresentationDepartment: sessionStorage.getItem('DEPT'),
              concern: res.data.obj.concern
                ? res.data.obj.concern.split(',')
                : []
            }
            this.form.setFieldsValue(params)
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-alert-info {
  border: none;
  background-color: white;
}
.ant-alert.ant-alert-no-icon {
  padding: 8px 0;
}
.btn {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-top: 1px solid #e6e6e6;
  background-color: #1890ff;
}
</style>

