<template>
  <div id="createPro">
    <div
      style="color:red;margin: 10px">
      注：该界面是登记外购件物料丢失、损坏等补料情况，其他情况在此登记的，扣罚50分绩效/次。
    </div>
    <!-- <header>创建问题</header> -->
    <a-form
      layout="horizontal"
      @submit="handleSubmit"
      :autoFormCreate="(form)=>{this.form = form}"
      style="padding: 0 10px 40px 10px;"
    >
      <a-row>
        <a-col v-for="(item,index) in ehwProblem" :key="index">
          <a-form-item
            :label="item.label"
            :fieldDecoratorId="item.name"
            :fieldDecoratorOptions="{rules: [{ required: item.required, message: item.message }]}"
            :help="item.name == 'punish_principal' ? punishText : ''"
          >
            <a-input
              :placeholder="item.message"
              v-if="item.type == 'numInput'"
              type="number"
              :min="0"
            />
            <a-input :placeholder="item.message" v-if="item.type == 'systemValue'" disabled/>
            <a-input
              :placeholder="item.message"
              v-if="item.type =='input'"
              @blur="item.name == 'material_code'?getDataFromSAP($event):null"
            />
            <span v-if="item.name =='punish_supplier'" style="color:red;">注：填写外协供应商</span>
            <a-textarea autosize :placeholder="item.message" v-if="item.type =='textarea'"/>
            <!-- 异常问题描述备注 -->
            <div
              v-if="item.name =='theme'"
              style="color:red;"
            >备注：例：1358-06-01工位，在厂内调试1358-06-01工位时，张三调节RGV小车位置过程中，发现光栅尺的数据与实际偏差10-50mm。</div>
            <div v-if="item.name =='engineering_design_description'" style="color:red;">
              备注：
              例：1358-06-01工位，信和光栅尺（402010000621）损坏，检测数据失准。
              <br>外观：导线走线有拉扯，读数头出较多粉尘、铁屑、尺壳有多处损伤。
              <br>电气：检查光栅尺接线符合电气技术要求，接线正确，接线柱无松动，无漏接（接地也正常）；电源电压5V，电流80mA。之前已正常使用过一段时间了，确认电气无异常，来料无异常。
              <br>机械：用百分表校验，尺身与基准面的平行度、垂直度0.3mm，读数头与车身平行度0.2mm，超过技术安装要求；读数头安装互移动端、尺身安装运动端，也不符合技术要求。
              <br>程序：程序未变更，逻辑正常。
            </div>
            <a-select :placeholder="item.message" allowClear v-if="item.type =='select'">
              <a-select-option v-for="option in item.option" :key="option.value">{{option.value}}</a-select-option>
            </a-select>
            <a-select
              :placeholder="item.message"
              allowClear
              v-if="item.type =='selectEvent'"
              @change="changeSelectValue($event,item.tagName)"
            >
              <a-select-option v-for="option in item.option" :key="option.value">{{option.value}}</a-select-option>
            </a-select>
            <a-select :placeholder="item.message" allowClear v-if="item.type =='select1'">
              <a-select-option v-for="option in item.option" :key="option">{{option}}</a-select-option>
            </a-select>
            <a-select
              :placeholder="item.message"
              v-if="item.type =='comboboxSelect'"
              :showSearch="item.name == 'project_number' ? true : false"
              allowClear
              :mode="item.name =='position_code'?positionCodeMode:item.name == 'jitai_number'?jitaiNumberMode:null"
              @search="item.name =='project_number' ?searchNum($event):''"
              @change="item.name == 'project_number' ?getInput($event):''"
              @dropdownVisibleChange="item.name== 'jitai_number'?selectJiTai($event):''"
            >
              <a-select-option v-for="option in item.option" :key="option">{{option}}</a-select-option>
            </a-select>
            <a-select
              :placeholder="item.message"
              v-if="item.type =='showSelect'"
              :mode="item.name == 'punish_principal'?'combobox':''"
              showSearch
              style="width: 200px"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              @search="handleSearch($event, item.searchType)"
              :notFoundContent="null"
            >
              <a-select-option
                v-for="option in item.option"
                :key="item.name == 'punish_principal'
                                ? option.name + '-' + option.user + '-' + option.deptname
                                : option.name + '-' + option.user + '-' + option.jobname"
              >
                <span
                  v-if="item.name == 'punish_principal'"
                >{{option.name}}-{{option.user}}-{{option.deptname}}</span>
                <span v-else>{{option.name}}-{{option.user}}-{{option.jobname}}</span>
              </a-select-option>
            </a-select>
            <a-date-picker placeholder="请选择时间" :format="dateFormat" v-if="item.type =='date'"/>
          </a-form-item>
        </a-col>
      </a-row>
      <div v-if="!question_id">
        <a-button type="primary" htmlType="submit" class="proBotton" :loading="btnloading">确定</a-button>
      </div>
      <div class="bottomtitle" v-else>
        <a-button class="flexbtn copy" @click="copy" :loading="btnloading">复制</a-button>
        <a-button type="primary" htmlType="submit" class="flexbtn sure" :loading="btnloading">确定</a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import { ehwProblem } from '@/assets/data.js'
import {
  SELECTBYKEY,
  SHOWDATABYPROJECTNUM,
  SEARCHNAME,
  EHWBuild,
  SHOWEHWEDITDATA,
  getDataFromSAP,
  SERACHPRONUM,
  selectjitaiNumber
} from '@/assets/js/url'
import moment from 'moment'
import qs from 'qs'
export default {
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 16, offset: 1 },
      ehwProblem,
      keys: ['PRIORITY', 'DEPT', 'HAPPEN_NODE', 'JUDGE', 'SUG'],
      dateFormat: 'YYYY-MM-DD',
      inputCon: '',
      jobnumber: '',
      username: '',
      btnloading: false,
      question_status: '',
      question_id: '',
      project_exception_number: '',
      url: '',
      positionCodeMode: null,
      jitaiNumberMode: null,
      punishText: '注：填写范围：人为损坏、物料丢失、其余情况填写无'
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
            if (res.data.obj.length > 0) {
              this.ehwProblem.forEach(val => {
                if (val.searchType == type) {
                  val.option = res.data.obj
                }
              })
            }
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
            this.ehwProblem.forEach(val => {
              if (val.name == 'project_number') {
                val.option = []
                val.option = res.data.obj
              }
            })
          }
        })
    },
    //项目编号输入框事件
    getInput(inputCon) {
      const reg = /^[0-9a-zA-Z]+$/
      if (!reg.test(inputCon)) {
        this.$message.error('请填写正确的项目编号')
        this.form.setFieldsValue({ project_number: '' })
      }
      if (inputCon) {
        this.axios
          .post(
            SHOWDATABYPROJECTNUM,
            qs.stringify({
              project_number: inputCon
            })
          )
          .then(res => {
            if (res.data.success == true) {
              this.ehwProblem.forEach(val => {
                if (val.label == '工位代号') {
                  val.option = []
                }
                if (val.label == '工位代号') {
                  val.option = res.data.obj.position_code
                  if (res.data.obj.position_code.length === 0) {
                    this.positionCodeMode = 'combobox'
                  } else {
                    this.positionCodeMode = null
                  }
                }
              })
            }
          })
      }
    },
    //选择机台号
    selectJiTai(open) {
      if (!open) {
        return
      }
      let station = this.form.getFieldValue('position_code')
      if (station) {
        this.axios
          .post(
            selectjitaiNumber,
            qs.stringify({
              station: station
            })
          )
          .then(res => {
            if (res.data.success == true) {
              this.ehwProblem.forEach(val => {
                if (val.name == 'jitai_number') {
                  val.option = []
                  val.option = res.data.obj
                  if (res.data.obj.length === 0) {
                    this.jitaiNumberMode = 'combobox'
                  } else {
                    this.jitaiNumberMode = null
                  }
                }
              })
            }
          })
      }
    },
    //复制
    copy(e) {
      let _this = this
      e.preventDefault()
      _this.form.validateFields((err, fieldsValue) => {
        if (!err) {
          if (fieldsValue['theme'].length < 30) {
            this.$message.info('请详细填写异常问题描述！')
            return
          }
          this.btnloading = true
          const formData = new FormData()
          const values = {
            ...fieldsValue,
            category_label: '外购件异常提报',
            eh_or_ehq: 'EHW',
            label: 'outside',
            jobnum: _this.jobnumber,
            username: _this.username,
            // 'questioner' : fieldsValue['questioner'] + '-' + this.effect_principle,
            demand_time: fieldsValue['demand_time'].format('YYYY-MM-DD'),
            withdrawa_time: fieldsValue['withdrawa_time'].format('YYYY-MM-DD'),
            root: window.sessionStorage.getItem('ROOT')
          }
          for (var key in values) {
            if (values[key] != undefined) {
              formData.append(key, values[key])
            }
          }
          _this.axios.post(EHWBuild, formData).then(res => {
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
    },
    //获取sap数据
    getDataFromSAP(item) {
      let value = item.target.value
      if (value) {
        this.axios
          .get(getDataFromSAP, {
            params: {
              material_code: value,
              label: 'outside'
            }
          })
          .then(res => {
            if (res.data.success == true && res.data.obj) {
              this.form.setFieldsValue({
                material_description: res.data.obj.material_description,
                stock: res.data.obj.stock
              })
            }
          })
      }
    },
    //确定提交
    handleSubmit(e) {
      let _this = this
      e.preventDefault()
      _this.form.validateFields((err, fieldsValue) => {
        if (!err) {
          if (fieldsValue['theme'].length < 30) {
            this.$message.info('请详细填写异常问题描述！')
            return
          }
          this.btnloading = true
          const formData = new FormData()
          const values = {
            ...fieldsValue,
            category_label: '外购件异常提报',
            eh_or_ehq: 'EHW',
            label: 'outside',
            jobnum: _this.jobnumber,
            username: _this.username,
            demand_time: fieldsValue['demand_time'].format('YYYY-MM-DD'),
            withdrawa_time: fieldsValue['withdrawa_time'].format('YYYY-MM-DD'),
            root: window.sessionStorage.getItem('ROOT')
          }

          for (var key in values) {
            if (values[key] != undefined) {
              formData.append(key, values[key])
            }
          }

          if (_this.question_id) {
            formData.append('id', _this.question_id)
          }

          _this.axios.post(EHWBuild, formData).then(res => {
            if (res.data.success == true) {
              _this.$message.success(res.data.message)
              _this.btnloading = false
              _this.$router.push('/ecnList')
            } else {
              _this.btnloading = false
              _this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    //判断描述是否必填
    changeSelectValue(value, tagName) {
      this.ehwProblem.find(val => {
        if (val.name == tagName) {
          if (value == '完整' || value == '正常') {
            val.required = false
            this.$nextTick(() => {
              this.form.validateFields([tagName], { force: true })
            })
          } else {
            val.required = true
            this.$nextTick(() => {
              this.form.validateFields([tagName], { force: true })
            })
          }
        }
      })
    }
  },
  created() {
    let _this = this
    const jobnumber = window.sessionStorage.getItem('LYRIC_JOBNUMBER')
    _this.username = window.sessionStorage.getItem('LYRIC_NAME')
    _this.jobnumber = jobnumber
    for (let item in _this.keys) {
      _this.axios
        .get(SELECTBYKEY, {
          params: {
            key: _this.keys[item]
          }
        })
        .then(res => {
          _this.ehwProblem.forEach(val => {
            if (val.key == _this.keys[item]) {
              val.option = []
              val.option = val.option.concat(res.data)
            }
            if (val.name == 'questioner' || val.name == 'improve_man') {
              val.option = []
            }
          })
        })
    }
  },
  mounted() {
    this.question_id = this.$route.query.id
    this.project_exception_number = this.$route.query.project_exception_number
    if (this.question_id) {
      this.axios
        .post(
          SHOWEHWEDITDATA,
          qs.stringify({
            id: this.question_id
          })
        )
        .then(res => {
          if (res.data.success == true) {
            this.question_status = res.data.obj.question_status
            // this.ecr_principle = res.data.obj.ecr_principle
            // this.effect_principle = res.data.obj.effect_principle
            const value = {}
            this.ehwProblem.forEach(val => {
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
            this.form.setFieldsValue(value)

            //编辑的时候判断描述为必填
            let nameList = [
              {
                name: 'appearance_analysis',
                tagName: 'appearance_analysis_description'
              },
              { name: 'line_survey', tagName: 'line_survey_description' },
              {
                name: 'mechanical_assembly',
                tagName: 'mechanical_assembly_description'
              },
              {
                name: 'procedural_logic',
                tagName: 'procedural_logic_description'
              },
              {
                name: 'engineering_design',
                tagName: 'engineering_design_description'
              }
            ]
            nameList.forEach(val => {
              if (value[val.name]) {
                this.changeSelectValue(value[val.name], val.tagName)
              }
            })
          } else {
            this.$message.error(res.data.message)
          }
        })
    } else {
      this.question_status = '已接收异常'
      this.form.setFieldsValue({
        priority: '低',
        category_label: '外购件异常（EHW）',
        eh_or_ehq: 'EHW'
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/color');
#createPro {
  header {
    position: relative;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    color: #000;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
  }
}
.ant-alert-info {
  border: none !important;
  background-color: white !important;
}
.ant-alert.ant-alert-no-icon {
  padding: 8px 0 !important;
}
.proBotton {
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

.ant-btn {
  border-radius: 0;
}

.bottomtitle {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-top: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
  background-color: #fff;
  .flexbtn {
    width: 50%;
    height: 40px;
    float: left;
    border-right: 1px solid @border-color;
  }
  .sure {
    color: white;
    background: @default-color;
  }
}
</style>

