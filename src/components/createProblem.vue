<template>
  <div id="createPro">
    <!-- <header>创建异常</header> -->
    <a-form
      layout="horizontal"
      @submit="handleSubmit"
      :autoFormCreate="
        form => {
          this.form = form
        }
      "
      style="padding: 10px 10px 40px 10px;" 才
    >
      <a-row>
        <a-col v-for="(item, index) in addProblemData" :key="index">
          <a-form-item
            :label="item.label"
            v-show="item.show != false"
            :fieldDecoratorId="item.name"
            :fieldDecoratorOptions="{
              rules: [{ required: item.required, message: item.message }]
            }"
          >
            <a-input
              :placeholder="item.message"
              v-if="item.type == 'input'"
              :disabled="disabled"
            />
            <a-input
              :placeholder="item.message"
              v-if="item.type == 'selectLabel'"
              disabled
            />
            <span v-if="item.name == 'category_label'" style="color:red;">
              注：外购件物料丢失、损坏等补料情况，请在EHW界面登记，在此界面登记的属违规行为，处罚50分绩效/次。
            </span>
            <a-textarea
              autosize
              :placeholder="item.message"
              v-if="item.type == 'textarea'"
              :disabled="disabled"
            />
            <!-- 异常问题描述备注 -->
            <span v-if="item.name == 'theme'" style="color:red;"
              >例：1364-01-28工位，底部底板零件200000437371，由于安装孔位打偏，导致无法安装，需重新打孔</span
            >
            <a-select
              :placeholder="item.message"
              allowClear
              v-if="item.type == 'select'"
              @change="
                item.name == 'occurrence_node'
                  ? changeOccurrence_node($event, project_number)
                  : item.name == 'synchro_project'
                  ? synchroProject($event)
                  : null
              "
              :disabled="item.name == 'improve_plan' ? disabled1 : disabled"
            >
              <a-select-option
                v-for="option in item.option"
                :key="option.value"
                >{{ option.value }}</a-select-option
              >
            </a-select>
            <a-select
              :placeholder="item.message"
              allowClear
              v-if="item.type == 'select1'"
              :disabled="disabled"
            >
              <a-select-option v-for="option in item.option" :key="option">{{
                option
              }}</a-select-option>
            </a-select>
            <!-- 重大异常备注 -->
            <span v-if="item.name == 'abnormity_grade'" style="color:red"
              >重大异常：出现结构撞机或改善物料成本≥1万元</span
            >
            <!-- 是否需要厂内组装备注 -->
            <span v-if="item.name == 'is_assembly'" style="color:red;">
              改善后,零件可以组装成机构类的异常,必须厂内组装后再发往现场
            </span>
            <a-select
              :placeholder="item.message"
              v-if="item.type == 'comboboxSelect'"
              :disabled="disabled"
              :mode="
                item.name === 'batch'
                  ? 'multiple'
                  : item.name == 'position_code'
                  ? positionCodeMode
                  : null
              "
              :showSearch="item.name == 'project_number' ? true : false"
              allowClear
              @search="item.name == 'project_number' ? searchNum($event) : ''"
              @change="
                item.name == 'project_number'
                  ? getInput($event)
                  : item.name == 'position_code'
                  ? getSNCodeFromSAP($event)
                  : ''
              "
              @blur="
                positionCodeMode === 'combobox' &&
                  item.name == 'position_code' &&
                  getSNCodeFromSAP($event)
              "
            >
              <a-select-option v-for="option in item.option" :key="option">{{
                option
              }}</a-select-option>
            </a-select>
            <a-select
              :placeholder="item.message"
              v-if="item.type == 'showSelect'"
              :disabled="
                item.name == 'improve_man' ? improveDisabled : disabled
              "
              :showSearch="item.name == 'improve_man' ? isCanChange : true"
              style="width: 200px"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              @search="handleSearch($event, item.searchType)"
              :notFoundContent="null"
            >
              <a-select-option
                v-for="option in item.option"
                :key="option.name + '-' + option.user + '-' + option.jobname"
                >{{ option.name }}-{{ option.user }}-{{
                  option.jobname
                }}</a-select-option
              >
            </a-select>
            <a-date-picker
              placeholder="请选择时间"
              :format="dateFormat"
              v-if="item.type == 'date'"
              :disabled="disabled"
            />

            <!-- 只有编辑的时候才可以  而且只有root为users 或 group包含users  -->
            <a-select
              :placeholder="item.message"
              allowClear
              v-if="item.type == 'usersselect'"
              :disabled="usersSelectdisabled"
            >
              <a-select-option
                v-for="option in item.option"
                :key="option.value"
                >{{ option.value }}</a-select-option
              >
            </a-select>
            <a-date-picker
              placeholder="请选择时间"
              :disabledDate="
                item.name == 'improve_plan_upload_time' ? disabledDate : null
              "
              v-if="item.type == 'usersdate'"
              :disabled="usersdisabled"
            />
            <a-input
              v-if="item.type == 'inputusers'"
              disabled
              :placeholder="item.message"
            />

            <!-- 只有状态为已接收异常和关闭的时候才可以  而且只有root为userpmo 或 group包含userpmo  -->
            <a-select
              :placeholder="item.message"
              allowClear
              v-if="item.type == 'userpmoSelect'"
              @select="selectRepeat"
              :disabled="userpmoSelectdisabled"
            >
              <a-select-option
                v-for="option in item.option"
                :key="option.value"
                >{{ option.value }}</a-select-option
              >
            </a-select>
            <a-input
              v-if="item.type == 'userpmoInput'"
              :disabled="userpmoSelectdisabled"
              :placeholder="item.message"
            />

            <!-- 选择省份和城市 -->
            <a-select
              v-if="item.type == 'selectProvince'"
              :placeholder="item.message"
              showSearch
              :filterOption="filterOption"
              @change="handleProvinceChange"
            >
              <a-select-option
                v-for="item in provinceData"
                :value="item.name"
                :key="item.id"
                >{{ item.name }}</a-select-option
              >
            </a-select>
            <a-select
              v-if="item.type == 'selectCity'"
              :placeholder="item.message"
            >
              <a-select-option v-for="city in cityData" :key="city">{{
                city
              }}</a-select-option>
            </a-select>
            <a-input-number
              placeholder="请输入"
              v-if="item.type == 'numInput'"
              :min="1"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <div class="bottomtitle" v-if="isUse">
        <a-button
          class="flexbtn copy"
          v-if="question_id"
          @click="copy('question', $event)"
          :loading="btnloading"
          >复制</a-button
        >
        <a-button
          type="primary"
          htmlType="submit"
          :class="[question_id ? 'flexbtn' : 'sure']"
          :loading="btnloading"
          >确定</a-button
        >
      </div>
    </a-form>
  </div>
</template>

<script>
import { addProblemData } from '@/assets/data.js'
import {
  SELECTBYKEY,
  SHOWDATABYPROJECTNUM,
  SEARCHNAME,
  QUESTIONBUILD,
  UPDATEQUESTIONDATA,
  EDITQUESTION,
  SHOWQUESTIONDATA,
  findDQEPerson,
  SERACHPRONUM,
  getSNCodeFromSAP,
  getImproveMan,
  SHOWPROVINCE,
  SHOWCITY,
  getBatchFromSAP,
  SHOWFORMDATA
} from '@/assets/js/url'
import moment from 'moment'
import qs from 'qs'
export default {
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 16, offset: 1 },
      addProblemData,
      keys: [
        'PRIORITY',
        'DEPT',
        'EXCEPTION_POINT',
        'PRO_LINE',
        'HAPPEN_NODE',
        'BAD_CATE'
      ],
      dateFormat: 'YYYY-MM-DD',
      fileList: [],
      inputCon: '',
      // jobnum : '',
      // ejobnum: '',
      jobnumber: '',
      username: '',
      btnloading: false,
      isUse: true,
      question_status: '',
      question_id: '',
      project_exception_number: '',
      url: '',
      project_number: '',
      usersdisabled: true,
      usersSelectdisabled: true,
      userpmoSelectdisabled: true,
      disabled: false,
      improveDisabled: false,
      disabled1: false,
      positionCodeMode: null,
      jitaiNumberMode: null,
      batchMode: 'multiple',
      isCanChange: true,
      remark: '',
      provinceData: [],
      cityData: [],
      isCounts: ''
    }
  },
  methods: {
    //sn码点击事件
    getSNCodeFromSAP (value) {
      if (value) {
        this.getImproveMan(this.project_number, value)
        this.axios
          .post(getSNCodeFromSAP, {
            position_code: value,
            label: 'outside'
          })
          .then(res => {
            if (res.data.success == true && res.data.obj) {
              this.addProblemData.find(val => {
                if (val.name == 'sn_code') {
                  val.option = res.data.obj
                }
              })
            }
          })
      }
    },
    //选择发生节点
    changeOccurrence_node (value, proNum) {
      let improve_man = this.form.getFieldValue('improve_man')
      this.getCityData(this.remark, value)
      this.isCanChange = !value
        ? false
        : value && value.indexOf('厂内') != -1 && improve_man
        ? false
        : true
      let reg = /^9/
      this.addProblemData.find(val => {
        if (val.name == 'sn_code') {
          if (
            (value == '厂内组装' || value == '厂内调试') &&
            !reg.test(proNum)
          ) {
            val.required = true
            this.$nextTick(() => {
              this.form.validateFields(['sn_code'], { force: true })
            })
          } else {
            val.required = false
            this.$nextTick(() => {
              this.form.validateFields(['sn_code'], { force: true })
            })
          }
        }
      })
    },
    //选择时间限制
    disabledDate (current) {
      // Can not select days before today and today
      return (
        current < moment().startOf('day') || current > moment().add(0, 'day')
      )
    },
    //改善负责人搜索事件
    handleSearch (value, type) {
      this.axios
        .get(SEARCHNAME, {
          params: {
            username: value
          }
        })
        .then(res => {
          if (res.data.success == true) {
            if (res.data.obj.length > 0) {
              this.addProblemData.forEach(val => {
                if (val.searchType == type) {
                  val.option = res.data.obj
                }
              })
            }
          }
        })
    },
    //项目编号模糊搜索
    searchNum (item) {
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
            this.addProblemData.forEach(val => {
              if (val.name == 'project_number') {
                val.option = []
                val.option = res.data.obj
              }
            })
          }
        })
    },
    //项目编号输入框事件
    getInput (inputCon) {
      const reg = /^[0-9a-zA-Z]+$/
      let position_code = this.form.getFieldValue('position_code')
      if (!reg.test(inputCon)) {
        this.$message.error('请填写正确的项目编号')
        this.form.setFieldsValue({ project_number: '' })
      }
      this.project_number = inputCon
      if (inputCon && position_code) {
        this.getImproveMan(inputCon, position_code)
      }
      if (inputCon) {
        this.getBatchFromSAP(inputCon)
        this.axios
          .post(
            SHOWDATABYPROJECTNUM,
            qs.stringify({
              project_number: inputCon
            })
          )
          .then(res => {
            if (res.data.success == true) {
              this.remark = res.data.obj.remark
              this.changeOccurrence_node(
                this.form.getFieldValue('occurrence_node'),
                inputCon
              )
              this.addProblemData.forEach(val => {
                if (
                  res.data.obj.remark &&
                  res.data.obj.remark.indexOf('media') != -1
                ) {
                  if (val.name == 'improve_plan') {
                    val.show = true
                    val.required = true
                    this.$nextTick(() => {
                      this.form.validateFields(['improve_plan'], {
                        force: true
                      })
                    })
                  }
                } else {
                  if (
                    val.name == 'improve_plan' ||
                    val.name == 'improve_plan_time' ||
                    val.name == 'improve_plan_upload_time' ||
                    val.name == 'improve_plan_result' ||
                    val.name == 'improve_plan_result_time'
                  ) {
                    val.show = false
                    val.required = false
                    this.$nextTick(() => {
                      this.form.validateFields(['improve_plan'], {
                        force: true
                      })
                    })
                  }
                }
                if (
                  val.label == '改善负责人' ||
                  val.label == '工位代号' ||
                  val.label == '批次'
                ) {
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
    // 根据项目号获取批次
    getBatchFromSAP (num) {
      let batchList = []
      this.axios
        .get(getBatchFromSAP, {
          params: {
            project_number: num,
            label: 'outside'
          }
        })
        .then(res => {
          if (res.data.success) {
            batchList = res.data.obj
            this.addProblemData.find(val => {
              if (val.name === 'batch') {
                val.option = batchList
              }
            })
          }
        })
    },
    // 获取所有的省份
    getAllProvince () {
      this.axios
        .get(showProvince, {
          params: {
            name: ''
          }
        })
        .then(res => {
          if (res.data.success) {
            this.provinceData = res.data.obj
          }
        })
    },
    // 搜索模糊匹配获取省份
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 根据选择的省份获取城市
    handleProvinceChange (value, option) {
      this.axios
        .get(showCity, {
          params: {
            pid: option.data.key
          }
        })
        .then(res => {
          if (res.data.success) {
            this.cityData = res.data.obj
            this.form.setFieldsValue({ city: '' })
          }
        })
    },
    // 获取城市地址
    getCityData (tag, node) {
      tag = 're-city'
      this.addProblemData.map(val => {
        if (
          val.name == 'province' ||
          val.name == 'city' ||
          val.name == 'customer_name'
        ) {
          if (
            tag &&
            node &&
            tag.indexOf('city') != -1 &&
            (node.indexOf('厂外') != -1 || node == '质保期维护')
          ) {
            this.getAllProvince()
            val.show = true
            val.required = true
          } else {
            val.show = false
            val.required = false
          }
        }
      })
    },
    // 改善负责人选项
    getImproveMan (project_number, station_number) {
      const reg = new RegExp(project_number + '-[0-9]{2}-[0-9]{2}')
      if (project_number && station_number) {
        if (!reg.test(station_number)) {
          this.$message.error('请填写正确的工位代号')
          this.form.setFieldsValue({ position_code: '' })
          return
        }
        this.axios
          .get(getImproveMan, {
            params: {
              project_number: project_number,
              station_number: station_number,
              label: 'outside'
            }
          })
          .then(res => {
            if (res.data.obj.length > 0) {
              let value =
                res.data.obj[0].name +
                '-' +
                res.data.obj[0].user +
                '-' +
                res.data.obj[0].jobname
              this.form.setFieldsValue({ improve_man: value })
            }
          })
      }
    },
    //选择不是/重复异常事件
    selectRepeat (val) {
      this.addProblemData.find(item => {
        if (val == '重复异常' && item.name == 'same_project_exception_number') {
          item.required = true
        } else if (
          val == '不是异常' &&
          item.name == 'same_project_exception_number'
        ) {
          item.required = false
        }
      })
    },
    //复制
    copy (type, e) {
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
            question_status: _this.question_status,
            label: 'outside',
            outside_number: _this.jobnumber,
            outside_name: _this.username,
            fold_id: 1,
            // 'questioner' : fieldsValue['questioner'] + '-' + this.effect_principle,
            // 'improve_man' : fieldsValue['improve_man'] + '-' + this.ecr_principle,
            drawing_time_required_time: fieldsValue[
              'drawing_time_required_time'
            ]
              ? fieldsValue['drawing_time_required_time'].format('YYYY-MM-DD')
              : null,
            part_requirement_time: fieldsValue['part_requirement_time'].format(
              'YYYY-MM-DD'
            )
          }
          for (var key in values) {
            if (values[key] != undefined) {
              if (
                key == 'improve_plan_upload_time' ||
                key == 'improve_plan_time'
              ) {
                values[key] = values[key].format('YYYY-MM-DD')
              }
              formData.append(key, values[key])
            }
          }
          //如果是效果验证重新创建的传多一个copy
          if (type == 'effect') {
            formData.append('copy', 'effect')
            formData.append(
              'project_exception_number',
              this.project_exception_number
            )
          }
          _this.axios.post(QUESTIONBUILD, formData).then(res => {
            if (res.data.success == true) {
              _this.$message.success(res.data.message)
              _this.$router.push('ecnList')
              _this.findDQEPerson(res.data.obj)
            } else {
              _this.$message.error(res.data.message)
              setTimeout(function () {
                window.location.reload()
              }, 2000)
            }
          })
        }
      })
    },
    //确定提交
    handleSubmit (e) {
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
            drawing_time_required_time: fieldsValue[
              'drawing_time_required_time'
            ]
              ? fieldsValue['drawing_time_required_time'].format('YYYY-MM-DD')
              : null,
            part_requirement_time: fieldsValue['part_requirement_time'].format(
              'YYYY-MM-DD'
            ),
            question_status: _this.question_status,
            label: 'outside',
            outside_number: _this.jobnumber,
            outside_name: _this.username,
            fold_id: 1
          }

          for (var key in values) {
            if (values[key] != undefined) {
              if (
                key == 'improve_plan_upload_time' ||
                key == 'improve_plan_time'
              ) {
                values[key] = values[key].format('YYYY-MM-DD')
              }
              formData.append(key, values[key])
            }
          }

          if (_this.question_id) {
            formData.append('id', _this.question_id)
            formData.append(
              'project_exception_number',
              _this.project_exception_number
            )
            _this.url = UPDATEQUESTIONDATA
          } else {
            _this.url = EDITQUESTIONCONFIRM
          }
          _this.axios.post(_this.url, formData).then(res => {
            if (res.data.success == true) {
              _this.$message.success(res.data.message)
              _this.btnloading = false
              _this.$router.push('/ecnList')
              if (!_this.question_id) {
                _this.findDQEPerson(res.data.obj)
              }
            } else {
              _this.btnloading = false
              _this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    findDQEPerson (obj) {
      this.axios
        .get(findDQEPerson, {
          params: {
            project_number: obj.project_number,
            id: obj.id,
            label: 'mobile'
          }
        })
        .then(res => {
          console.log(res.data)
        })
    },
    // 是否同步项目号
    synchroProject (value) {
      this.addProblemData.find(val => {
        if (val.name == 'synchro_number') {
          if (value == '是') {
            val.show = true
            val.required = true
          } else if (value == '否') {
            val.show = false
            val.required = false
            this.$message.error(
              '如不清楚是否同步请对接项目经理或者项目总工，后续发现同步问题将追责绩效处罚。'
            )
          } else {
            val.show = false
            val.required = false
          }
        }
      })
    }
  },
  created () {
    let _this = this
    _this.isCounts = _this.$route.query.isCounts
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
          _this.addProblemData.forEach(val => {
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
    if (_this.isCounts == true) {
      _this.addProblemData.find(val => {
        if (val.name == 'change_num_effect') {
          val.show = true
        }
      })
    } else {
      _this.addProblemData.find(val => {
        if (val.name == 'change_num_effect') {
          val.show = false
        }
      })
    }
  },
  mounted () {
    const root = window.sessionStorage.getItem('ROOT')
    const group = window.sessionStorage.getItem('GROUP')
    const jobnumber = window.sessionStorage.getItem('LYRIC_JOBNUMBER')
    const jobName = window.sessionStorage.getItem('JobName')
    this.question_id = this.$route.query.id
    this.project_exception_number = this.$route.query.project_exception_number
    if (this.question_id) {
      this.axios
        .post(
          SHOWQUESTIONDATA,
          qs.stringify({
            id: this.question_id
          })
        )
        .then(res => {
          if (res.data.success == true) {
            this.question_status = res.data.obj.question_status
            this.isUse =
              root == 'admin' ||
              jobnumber == this.$route.query.creator ||
              jobnumber == res.data.obj.effect_principle ||
              group.indexOf('userimprove') != -1 ||
              root == 'userpmo' ||
              group.indexOf('usershowpic') != -1 ||
              group.indexOf('userpmo') != -1 ||
              group.indexOf('userQuestionEdit') != -1
                ? true
                : false
            this.disabled =
              root == 'admin' ||
              jobnumber == this.$route.query.creator ||
              jobnumber == res.data.obj.effect_principle ||
              group.indexOf('userQuestionEdit') != -1
                ? false
                : true
            this.improveDisabled =
              root == 'admin' || group.indexOf('userQuestionEdit') != -1
                ? false
                : true
            this.disabled1 =
              root == 'admin' ||
              jobnumber == this.$route.query.creator ||
              jobnumber == res.data.obj.effect_principle ||
              group.indexOf('usershowpic') != -1 ||
              group.indexOf('userQuestionEdit') != -1
                ? false
                : true
            // this.usersdisabled = root == 'admin' || group.indexOf('userimprove') != -1 ? false:true
            this.usersSelectdisabled =
              root == 'admin' || group.indexOf('usershowpic') != -1
                ? false
                : true
            this.userpmoSelectdisabled =
              (root == 'admin' ||
                root == 'userpmo' ||
                group.indexOf('userpmo') != -1 ||
                jobnumber == res.data.obj.effect_principle) &&
              this.question_status == '已接收异常'
                ? false
                : true
            // this.ecr_principle = res.data.obj.ecr_principle
            // this.effect_principle = res.data.obj.effect_principle
            this.project_number = res.data.obj.project_number
            this.remark = res.data.mava && res.data.mava
            const value = {}
            this.addProblemData.forEach(val => {
              if (res.data.mava && res.data.mava.indexOf('media') != -1) {
                if (val.name == 'improve_plan') {
                  val.show = true
                  val.required = true
                  this.$nextTick(() => {
                    this.form.validateFields(['improve_plan'], { force: true })
                  })
                }
                if (res.data.obj.improve_plan == '是') {
                  if (
                    val.name == 'improve_plan_time' ||
                    val.name == 'improve_plan_upload_time'
                  ) {
                    val.show = true
                  }
                  if (
                    res.data.obj.improve_plan_time &&
                    res.data.obj.improve_plan_upload_time
                  ) {
                    if (
                      val.name == 'improve_plan_result' ||
                      val.name == 'improve_plan_result_time'
                    ) {
                      val.show = true
                    }
                  } else {
                    if (
                      val.name == 'improve_plan_result' ||
                      val.name == 'improve_plan_result_time'
                    ) {
                      val.show = false
                    }
                  }
                } else {
                  if (
                    val.name == 'improve_plan_time' ||
                    val.name == 'improve_plan_upload_time'
                  ) {
                    val.show = false
                  }
                }
              } else {
                if (
                  val.name == 'improve_plan_time' ||
                  val.name == 'improve_plan_upload_time' ||
                  val.name == 'improve_plan_result' ||
                  val.name == 'improve_plan_result_time'
                ) {
                  val.show = false
                }
              }

              //根据状态判断是否显示
              if (
                (val.name == 'no_or_repeat' ||
                  val.name == 'same_project_exception_number') &&
                (root == 'admin' ||
                  root == 'userpmo' ||
                  group.indexOf('userpmo') != -1)
              ) {
                val.show = true
              }
              //那个有值显示那个
              if (res.data.obj.no_or_repeat && val.name == 'no_or_repeat') {
                val.show = true
              }
              if (
                res.data.obj.same_project_exception_number &&
                val.name == 'same_project_exception_number'
              ) {
                val.show = true
              }

              if (
                res.data.obj.no_or_repeat &&
                res.data.obj.no_or_repeat == '重复异常'
              ) {
                if (val.name == 'same_project_exception_number') {
                  val.required = true
                }
              }

              for (let item in res.data.obj) {
                if (res.data.obj[item]) {
                  if (
                    val.name == item &&
                    (val.type == 'date' || val.type == 'usersdate')
                  ) {
                    value[item] = moment(res.data.obj[item], this.dateFormat)
                  } else if (val.name == item) {
                    value[item] = res.data.obj[item]
                  }
                }
              }
            })
            value.batch = value.batch.split(',')
            this.changeOccurrence_node(
              value.occurrence_node,
              this.project_number
            )
            this.synchroProject(value.synchro_project)
            this.form.setFieldsValue(value)
          } else {
            this.$message.error(res.data.message)
          }
        })
    } else {
      this.question_status = '已接收异常'
      this.form.setFieldsValue({
        priority: '低',
        category_label: '改善问题（EH）',
        eh_or_ehq: 'EH',
        drawing_time_required_time: moment(
          new Date().setDate(new Date().getDate() + 1)
        ),
        part_requirement_time: moment(
          new Date().setDate(new Date().getDate() + 3)
        ),
        questioner: this.username + '-' + jobnumber + '-' + jobName,
        batch: ['P01']
        // "questioner": '周静-03430-开发工程师'
      })
      this.addProblemData.forEach(val => {
        if (
          val.name == 'improve_plan_time' ||
          val.name == 'improve_plan_upload_time' ||
          val.name == 'improve_plan' ||
          val.name == 'improve_plan_result' ||
          val.name == 'improve_plan_result_time' ||
          val.name == 'no_or_repeat' ||
          val.name == 'same_project_exception_number'
        ) {
          val.show = false
        }
      })
      this.changeOccurrence_node()
      this.synchroProject()
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
    width: 100%;
    height: 40px;
    background: @default-color;
  }
}
</style>
