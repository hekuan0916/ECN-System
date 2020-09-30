<template>
  <div class="editQuestion">
    <a-form
      :form="form"
      @submit="handleSubmit"
      :autoFormCreate="
        form => {
          this.form = form
        }
      "
      style="padding: 10px 10px 40px 10px;"
    >
      <a-row>
        <a-col
          v-for="(item, index) in ehConfirm"
          :key="index"
          :value="item.label"
        >
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
              v-if="item.type == 'systemValue'"
              :disabled="disabled"
            />
            <span v-if="item.name == 'confirmPerson'"> </span>
            <a-select
              :placeholder="item.message"
              allowClear
              v-if="item.type == 'select'"
              :disabled="disabled"
            >
              <a-select-option
                v-for="option in item.option"
                :key="option.value"
              >
                {{ option.value }}
              </a-select-option>
            </a-select>
            <a-date-picker
              placeholder="请选择时间"
              :format="dateFormat"
              v-if="item.type == 'date'"
              :disabled="disabled"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-button
        type="primary"
        htmlType="submit"
        class="proBotton"
        :loading="btnloading"
        >确定</a-button
      >
    </a-form>
  </div>
</template>

<script>
import { SHOWFORMDATA } from '@/assets/js/url'
import { ehConfirm } from '@/assets/ehData.js'
import qs from 'qs'
export default {
  data () {
    return {
      keys: [
        'PRIORITY',
        'DEPT',
        'EXCEPTION_POINT',
        'PRO_LINE',
        'HAPPEN_NODE',
        'BAD_CATE'
      ],
      dateFormat: 'YYYY-MM-DD',
      disabled: false,
      btnloading: false,
      ehConfirm,
      id: this.$route.query.id,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
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
    getQuestion () {
      this.axios
        .get(SHOWFORMDATA, {
          params: {
            id: this.id,
            node: '异常确认'
          }
        })
        .then(res => {
          this.form.setFieldsValue(res.data.obj)
        })
    }
  },
  created () {
    this.getQuestion()
  }
}
</script>
<style lang="less" scoped>
@import url('../assets/style/color');
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
</style>
