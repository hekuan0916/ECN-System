<template>
  <div class="editAnalysis">
    <a-form
      :form="form"
      @submit="handleSubmit"
      :autoFormCreate="
        form => {
          this.form = form
        }
      "
      style="padding: 10px 10px 40px 10px"
    >
      <a-row>
        <a-col v-for="(item, index) in ehAnalyze" :key="index">
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
              :placeholder="item.message"
              v-if="item.type == 'textarea'"
              disabled
            />
            <!-- <span v-if="item.name == 'category_label'"> </span> -->
            <a-select
              :placeholder="item.message"
              allowClear
              v-if="item.type == 'select'"
              :disabled="disabled"
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
              v-if="item.type == 'personSelect'"
              :disabled="disabled"
            >
              <a-select-option v-for="option in item.option" :key="option">{{
                option
              }}</a-select-option>
            </a-select>
            <a-select
              :placeholder="item.message"
              allowClear
              v-if="item.type == 'selectNumber'"
              :disabled="disabled"
            >
              <a-select-option v-for="option in item.option" :key="option">{{
                option
              }}</a-select-option>
            </a-select>
            <a-select
              :placeholder="item.message"
              allowClear
              v-if="item.type == 'systemValue'"
              :disabled="disabled"
            >
              <a-select-option v-for="option in item.option" :key="option">{{
                option
              }}</a-select-option>
            </a-select>
            <a-date-picker
              placeholder="请选择时间"
              :format="dateFormat"
              v-if="item.type == 'date'"
              :disabled="disabled"
            />
            <span v-if="item.name == 'analyzeTime'"> </span>
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
import { ehAnalyze } from '@/assets/ehData.js'
export default {
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      disabled: false,
      ehAnalyze,
      btnloading: false,
      id: this.$route.query.question_id,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    handleSubmit () {},
    getAnalysis () {
      this.axios
        .get(SHOWFORMDATA, {
          params: {
            id: this.id,
            node: '分析及对策'
          }
        })
        .then(res => {
          this.form.setFieldsValue(res.data.obj)
          console.log('获取', res)
        })
    }
  },
  created () {
    this.getAnalysis()
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
