<template>
  <div>
    <a-modal title="效果验证" :width="900" :visible="closeExpand"  okText="确认" cancelText="取消" @ok="handleOk" @cancel="handleCancel">
      <p v-if="chiefName" style="position: absolute;top: 18px;left: 120px;">责任人：{{ chiefName }}</p>
      <div id="effectValidate">
        <a-form layout="horizontal" :autoFormCreate="(form)=>{this.form = form}">
            <a-row>
                <a-col v-for="(item,index) in ehcClose" :key="index">
                    <a-form-item :label="item.label" v-show="item.show != false" 
                                 :fieldDecoratorId="item.name" :fieldDecoratorOptions="{rules: [{ required: item.required, message: item.message }]}"
                                 >
                        <a-select placeholder="请选择" v-if="item.type =='select'">
                            <a-select-option v-for="option in item.option" :key="option.value">{{option.value}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
      </div>
      <a-table :columns="columns" :data-source="data">
      </a-table>
    </a-modal>  
  </div>
</template>
<script>
import {ehcClose} from '@/assets/data'
import {SELECTBYKEY,SEARCHNAME,EHCEFFECT,GETEHCDATA} from '@/assets/js/url'
import moment from 'moment'
const columns = [
  {
    title: '改善结果',
    dataIndex: 'improveResult',
    key: 'improveResult'
  },
  {
    title: '无法解决需协助',
    dataIndex: 'needCoordinate',
    key: 'needCoordinate'
  },
  {
    title: '关闭人',
    dataIndex: 'closerName',
    key: 'closerName'
  },
  {
    title: '关闭时间',
    dataIndex: 'closeTime',
    key: 'closeTime'
  }
]
const data = []
export default {
  data() {
    return {
      moment,
      ehcClose,
      jobnumber: '',
      name: '',
      position: '',
      root: '',
      problemShow: false,
      chief: [],
      chiefName: '',
      columns,
      data
    }
  },
  props: ['closeExpand','effectId'],
  created () {
    let _this = this
    _this.jobnumber = window.sessionStorage.getItem('LYRIC_JOBNUMBER')
    _this.name = window.sessionStorage.getItem('LYRIC_NAME')
    _this.position = window.sessionStorage.getItem('POSITION')
    _this.root = window.sessionStorage.getItem('ROOT')
  },
  mounted () {
    this.axios.get(GETEHCDATA, {params: {
      jobnum: this.jobnumber,
      username: window.sessionStorage.getItem('LYRIC_NAME'),
      jobname: window.sessionStorage.getItem('POSITION'),
      label: 'out',
      root: window.sessionStorage.getItem('ROOT'),
      group: window.sessionStorage.getItem('GROUP'),
      id: this.effectId
    }}).then(res => {
        if(res.data.success == true) {
          this.chief = res.data.obj.chief
          this.chiefName = res.data.obj.chiefName.join(',')
          this.data = res.data.obj.effectListBean
          // this.form.setFieldsValue({
          //     'improveResult': res.data.obj.effectBean.improveResult,
          //     'needCoordinate': res.data.obj.effectBean.needCoordinate
          // })
        } else {
            this.$message.error(res.data.message)
        }
    })
  },
  watch: {
    closeExpand (val) {
      if (val == true) {
        this.axios.get(GETEHCDATA, {params: {
          jobnum: this.jobnumber,
          username: window.sessionStorage.getItem('LYRIC_NAME'),
          jobname: window.sessionStorage.getItem('POSITION'),
          label: 'out',
          root: window.sessionStorage.getItem('ROOT'),
          group: window.sessionStorage.getItem('GROUP'),
          id: this.effectId
        }}).then(res=>{
            if(res.data.success == true) {
              this.chief = res.data.obj.chief
              this.chiefName = res.data.obj.chiefName.join(',')
              this.data = res.data.obj.effectListBean
              // this.form.setFieldsValue({
              //     'improveResult': res.data.obj.effectBean.improveResult,
              //     'needCoordinate': res.data.obj.effectBean.needCoordinate
              // })
            } else {
              this.$message.error(res.data.message)
            }
        })
      }
    }
  },
  methods: {
    handleOk(e) {
      if (this.chief.indexOf(this.jobnumber) == -1 && this.root != 'admin') {
        this.$message.error('只有上述责任人可以填写')
      } else {
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
            formData.append('id', _this.effectId)
            _this.axios.post(EHCEFFECT, formData).then((res)=>{
              if (res.data.success == true) {
                _this.$message.success(res.data.message)
                this.form.resetFields()
                this.data = []
                this.chief = []
                this.chiefName = ''
                this.$emit('getExpand',false)
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        })
      }
    },
    handleCancel(e) {
      //props双向数据绑定，将改变的值传给父组件
      this.form.resetFields()
      this.data = []
      this.chief = []
      this.chiefName = ''
      this.$emit('getExpand',false)
    },
  },
}
</script>