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
      style="padding: 10px 10px 40px 10px;"
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
              <a-select-option v-for="option in item.option" :key="option">{{
                option
              }}</a-select-option>
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
    </a-form>
  </div>
</template>

<script>
// import { editQuestion } from '@/assets/js/url'
import { ehAnalyze } from '@/assets/ehData.js'
export default {
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      disabled: false,
      ehAnalyze,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    handleSubmit () {}
  }
}
</script>
<style lang="less" scoped>
@import url('../assets/style/color');
</style>
