<template>
  <div class="editDraw">
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
        <a-col v-for="(item, index) in ehFigureConfirm" :key="index">
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
            <span v-if="item.name == 'improve_confirm'"> </span>
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
import { ehFigureConfirm } from '@/assets/ehData.js'
export default {
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      disabled: false,
      ehFigureConfirm,
      id: this.$route.query.question_id,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    handleSubmit () {},
    getDraw () {
      this.axios
        .get(SHOWFORMDATA, {
          params: {
            id: this.id,
            node: '出图确认'
          }
        })
        .then(res => {
          this.form.setFieldsValue(res.data.obj)
          console.log('获取', res)
        })
    }
  },
  created () {
    this.getDraw()
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
