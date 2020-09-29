<template>
  <div id="effectValidate">
    <!-- <header>效果验证</header> -->
    <a-form
      layout="horizontal"
      @submit="handleOk"
      :autoFormCreate="
        form => {
          this.form = form
        }
      "
      style="padding: 10px 10px 25px 10px"
    >
      <a-row>
        <a-col v-for="(item, index) in effectValidateData" :key="index">
          <a-form-item
            :label="item.label"
            v-show="item.show != false"
            :fieldDecoratorId="item.name"
            :fieldDecoratorOptions="{
              rules: [{ required: item.required, message: item.message }]
            }"
          >
            <a-textarea
              autosize
              style="height: auto"
              v-if="item.type == 'textarea'"
            />
            <a-input
              :placeholder="item.placeholder"
              v-if="item.type == 'input'"
              disabled
            />
            <a-select
              placeholder="请选择"
              v-if="item.type == 'select'"
              @change="
                item.name == 'improvement_results' ? counts($event) : null
              "
            >
              <a-select-option
                v-for="option in item.option"
                :key="option.value"
                >{{ option.value }}</a-select-option
              >
            </a-select>
            <a-select
              :placeholder="item.message"
              v-if="item.type == 'showSelect'"
              showSearch
              style="width: 200px"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              @search="searchName($event, item.searchType)"
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
            <a-input-number
              placeholder="请输入"
              v-if="item.type == 'numInput'"
              :min="1"
            />
            <a-range-picker v-if="item.type == 'range'" />
            <a-date-picker placeholder="请选择" v-if="item.type == 'date'" />
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
    <problem ref="problem" v-show="problemShow"></problem>
  </div>
</template>
<script>
import { effectValidateData } from '@/assets/data'
import {
  CHOICEURL,
  EFFECTBUILD,
  SELECTBYKEY,
  UPDATEEFFECTDATA,
  SEARCHNAME
} from '@/assets/js/url'
import problem from '@/components/createProblem'
import qs from 'qs'
export default {
  data () {
    return {
      effectValidateData,
      question_id: '',
      jobnumber: '',
      name: '',
      choice: '',
      btnloading: false,
      problemShow: false
    }
  },
  components: { problem },
  created () {
    //获取行id
    this.question_id = this.$route.query.id
    this.axios
      .post(
        CHOICEURL,
        qs.stringify({
          id: this.question_id
        })
      )
      .then(res => {
        if (res.data.success == true) {
          this.choice = 'create'
        } else {
          this.choice = 'update'
        }
      })
  },
  mounted () {
    this.jobnumber = window.sessionStorage.getItem('LYRIC_JOBNUMBER')
    this.name = window.sessionStorage.getItem('LYRIC_NAME')
    this.axios
      .get(SELECTBYKEY, {
        params: {
          key: 'IMPROVE_RESULT'
        }
      })
      .then(res => {
        this.effectValidateData.forEach(val => {
          if (val.key == 'IMPROVE_RESULT') {
            val.option = []
            val.option = val.option.concat(res.data)
          }
        })
      })
    this.counts()
  },
  methods: {
    //确认人搜索
    searchName (value, type) {
      this.axios
        .get(SEARCHNAME, {
          params: {
            username: value
          }
        })
        .then(res => {
          if (res.data.success) {
            if (res.data.obj.length > 0) {
              this.effectValidateData.forEach(val => {
                if (val.searchType == type) {
                  val.option = res.data.obj
                }
              })
            }
          }
        })
    },
    counts (value) {
      this.effectValidateData.find(item => {
        if (item.name == 'change_num_effect') {
          item.show = value == 'OK，需批量修改' ? true : false
          item.required = value == 'OK，需批量修改' ? true : false
        }
      })
    },
    handleOk (e) {
      let _this = this
      e.preventDefault()
      _this.form.validateFields((err, fieldsValue) => {
        if (!err) {
          const formData = new FormData()
          const values = {
            ...fieldsValue,
            improvement_results_completion_time: fieldsValue[
              'improvement_results_completion_time'
            ].format('YYYY-MM-DD')
            // 'bad_category_time' : fieldsValue['bad_category_time'][0].format('YYYY-MM-DD') + '=' + fieldsValue['bad_category_time'][1].format('YYYY-MM-DD'),
          }
          _this.btnloading = true
          for (var key in values) {
            if (values[key] != undefined) {
              formData.append(key, values[key])
            }
          }
          formData.append('question_id', _this.question_id)
          formData.append('label', 'outside')
          formData.append('outside_number', _this.jobnumber)
          formData.append('outside_name', _this.name)
          formData.append('root', window.sessionStorage.getItem('ROOT'))
          formData.append('group', window.sessionStorage.getItem('GROUP'))
          formData.append('jobname', window.sessionStorage.getItem('JobName'))
          if (_this.choice == 'create') {
            _this.url = EFFECTBUILD
          } else {
            _this.url = UPDATEEFFECTDATA
          }

          let result = fieldsValue['improvement_results']

          _this.axios.post(_this.url, formData).then(res => {
            if (res.data.success == true) {
              _this.$message.success(res.data.message)
              _this.btnloading = false
              _this.$router.push('/ecnList')
              //如果改善效果包含NG的重新创建
              if (result.indexOf('NG') != -1) {
                this.$$refs.problem.copy('effect', e)
              }
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#effectValidate {
  header {
    position: relative;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    color: #000;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
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
}
.ant-btn {
  border-radius: 0;
}
</style>
