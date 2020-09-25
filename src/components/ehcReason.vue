<template>
  <div>
    <a-modal title="原因分析" :width="900" :visible="reasonExpand" okText="确认" cancelText="取消" @ok="handleOk" @cancel="handleCancel">
      <div id="effectValidate1">
        <a-form layout="horizontal" :autoFormCreate="(form)=>{this.form = form}">
            <a-row>
                <a-col v-for="(item,index) in ehcReason" :key="index">
                    <a-form-item :label="item.label" v-show="item.show != false"
                                 :fieldDecoratorId="item.name" :fieldDecoratorOptions="{rules: [{ required: item.required, message: item.message }]}"
                                 >
                      <a-textarea :placeholder="item.placeholder" v-if="item.type =='textarea'" />
                      <a-select placeholder="请选择" v-if="item.type =='select'" @blur="getQuestionKey()">
                        <a-select-option v-for="option in item.option" :key="option.value">{{option.value}}</a-select-option>
                      </a-select>
                      <a-select placeholder="请先选择问题类型" 
                                v-if="item.type=='showSelect'&&item.name=='questionReason'" 
                                @change="showDetail()">
                        <a-select-option v-for="option in item.option" :key="option.value">{{option.value}}</a-select-option>
                      </a-select>
                      <a-select placeholder="请选择验收人员" 
                                v-if="item.type =='showSelect'&&item.name=='inspected'" 
                                mode="multiple"
                                @search="handleSearch($event, item.searchType)"
                                :defaultActiveFirstOption="false"
                                :showArrow="false"
                                :filterOption="false"
                                :showSearch="true"
                                v-model="inspects">
                        <a-select-option v-for="option in item.option" :key="option.name + '-' + option.user+'-'+option.jobname" >
                          {{option.name}}-{{option.user}}-{{option.jobname}}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <a-button style="position: absolute;bottom: 10px;left: 5%;" @click="delay" type="primary" ghost>待处理</a-button>
      </div>
    </a-modal>  
  </div>
</template>
<script>
import {ehcReason} from '@/assets/data'
import {SELECTBYKEY, SAVEEHCREASON, GETEHCDATA, SEARCHNAME} from '@/assets/js/url'
import moment from 'moment'
export default {
  data() {
    return {
      moment,
      ehcReason,
      jobnumber: '',
      name: '',
      position: '',
      problemShow: false,
      inspects: '',
    }
  },
  props: ['reasonExpand','effectId'],
  mounted(){
    let _this = this
    _this.jobnumber = window.sessionStorage.getItem('LYRIC_JOBNUMBER')
    _this.name = window.sessionStorage.getItem('LYRIC_NAME')
    _this.position = window.sessionStorage.getItem('JobName')
    this.axios.get(SELECTBYKEY, {params: {
      key: 'QUESTION_TYPE'
    }}).then(res => {
      _this.ehcReason.forEach(val => {
        if (val.key == 'QUESTION_TYPE') {
          val.option = []
          val.option = val.option.concat(res.data)
        }
      })
    })
    this.axios.get(GETEHCDATA, {params: {
      jobnum: this.jobnumber,
      username: window.sessionStorage.getItem('LYRIC_NAME'),
      jobname: window.sessionStorage.getItem('JobName'),
      label: 'out',
      root: window.sessionStorage.getItem('ROOT'),
      group: window.sessionStorage.getItem('GROUP'),
      id: this.effectId
    }}).then(res => {
      if(res.data.success == true){
        this.form.setFieldsValue({
          'questionReason': res.data.obj.reasonBean.questionReason,
          'strategy': res.data.obj.reasonBean.strategy,
          'questionType': res.data.obj.reasonBean.questionType,
        })
        if (res.data.obj.reasonBean.inspected) {
          this.form.setFieldsValue({
            'inspected': res.data.obj.reasonBean.inspected.split(',')
          })
        }
      } else {
        this.$message.error(res.data.message)
      }
    })
  },
  methods: {
    getQuestionKey () {
      this.axios.get(SELECTBYKEY, {params: {
        key: this.form.getFieldValue('questionType')
      }}).then(res => {
        this.ehcReason.forEach(val => {
          if(val.name == 'questionReason'){
            val.option = []
            val.option = val.option.concat(res.data)
          }
        })
      })
    },
    showDetail () {
      this.axios.get(SELECTBYKEY, {params: {
        key: this.form.getFieldValue('questionType')
      }}).then(res => {
        for (let i in res.data) {
          if (this.form.getFieldValue('questionReason') == res.data[i].value) {
            this.$message.info(res.data[i].annotation)
          }
        }
      })
    },
    handleSearch (value, type) {
      this.axios.get(SEARCHNAME, {params:{
        username : value
      }}).then(res => {
        if(res.data.success == true){
          this.ehcReason.forEach(val => {
            if (val.searchType == type) {
              val.option = res.data.obj
            }
          })
        }
      })
    },
    handleOk (e) {
      let _this = this
      e.preventDefault()
      _this.form.validateFields((err, fieldsValue) => {
        if (!err) {
          const formData = new FormData();
          const values = {
            ...fieldsValue,
          }
          for(var key in values){
              if(values[key] != undefined){
                  formData.append(key, values[key])
              }
          }
          formData.append('jobnum', _this.jobnumber)
          formData.append('username', _this.name)
          formData.append('jobname', _this.position)
          formData.append('label', 'out')
          formData.append('root', window.sessionStorage.getItem('ROOT'))
          formData.append('group', window.sessionStorage.getItem('GROUP'))
          formData.append('delay', false)
          formData.append('id', this.effectId)
          let arr = formData.get('inspected')
          arr = arr.split(',')
          for (let i in arr) {
              arr[i] = arr[i].split('-')[1]
          }
          let inspectedArray = arr.join(',')
          formData.append('inspectedArray', inspectedArray)
          console.log(formData.get('jobname'))
          _this.axios.post(SAVEEHCREASON, formData).then((res) => {
            if (res.data.success == true) {
              _this.$message.success(res.data.message);
              this.form.resetFields()
              this.$emit('getExpand', false)
            } else {
              this.$message.error(res.data.message);
            }
          })
        }
      })
    },
    handleCancel (e) {
      this.form.resetFields()
      this.$emit('getExpand', false)
    },
    delay (e) {
      let _this = this
      e.preventDefault()
      _this.form.validateFields((err, fieldsValue) => {
        if (!err) {
          const formData = new FormData()
          const values = {
            ...fieldsValue,
          }
          for(var key in values){
              if(values[key] != undefined){
                  formData.append(key, values[key])
              }
          }
          formData.append('jobnum', _this.jobnumber)
          formData.append('username', _this.name)
          formData.append('jobname', _this.position)
          formData.append('label', 'out')
          formData.append('root', window.sessionStorage.getItem('ROOT'))
          formData.append('group', window.sessionStorage.getItem('GROUP'))
          formData.append('delay', true)
          formData.append('id', this.effectId)
          _this.axios.post(SAVEEHCREASON, formData).then((res) => {
            if (res.data.success == true) {
              _this.$message.success(res.data.message)
              this.form.resetFields()
              this.$emit('getExpand',false)
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
  },
  watch: {
    reasonExpand (val) {
      if (val == true) {
        this.axios.get(SELECTBYKEY, {params: {
          key: 'QUESTION_TYPE'
        }}).then(res => {
          _this.ehcReason.forEach(val => {
            if (val.key == 'QUESTION_TYPE') {
              val.option = []
              val.option = val.option.concat(res.data)
            }
          })
        })
        this.axios.get(GETEHCDATA, {params: {
          jobnum: this.jobnumber,
          username: window.sessionStorage.getItem('LYRIC_NAME'),
          jobname: window.sessionStorage.getItem('JobName'),
          label: 'out',
          root: window.sessionStorage.getItem('ROOT'),
          group: window.sessionStorage.getItem('GROUP'),
          id: this.effectId
        }}).then(res => {
          if(res.data.success == true){
            this.form.setFieldsValue({
              'questionReason': res.data.obj.reasonBean.questionReason,
              'strategy': res.data.obj.reasonBean.strategy,
              'questionType': res.data.obj.reasonBean.questionType,
            })
            if (res.data.obj.reasonBean.inspected) {
              this.form.setFieldsValue({
                'inspected': res.data.obj.reasonBean.inspected.split(',')
              })
            }
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    inspects (val) {
      if (typeof(val) == 'object' && val.length > 3) {
        val.pop()
        this.$message.error('最多选择三名验收人')
      }
    }
  }
}
</script>