<template>
  <a-form
    layout="horizontal"
    @submit="handleSubmit"
    :autoFormCreate="(form)=>{this.form = form}"
    style="padding: 25px 10px;"
  >
    <a-row>
      <a-col
        v-for="(item,index) in ehEcrModalData"
        :key="index"
        :class="item.type == 'textarea' ? 'aTextarea' : 'aCol'"
      >
        <a-form-item
          :label="item.label"
          :fieldDecoratorId="item.name"
          :fieldDecoratorOptions="{rules: [{ required: item.required, message: item.message }]}"
        >
          <a-input v-if="item.type =='input'" :disabled="disabled"/>
          <a-textarea
            autosize
            v-if="item.type =='textarea'"
            :disabled="item.name == 'advise_description'?businessDisabled:disabled"
          />
          <a-select v-if="item.type == 'selectDraw'" :disabled="drawDisabled">
            <a-select-option v-for="option in item.option" :key="option.value">{{option.value}}</a-select-option>
          </a-select>
          <a-select
            v-if="item.type == 'select'"
            :placeholder="item.message"
            :disabled="item.name === 'synchro_project'
              ? disabled : businessDisabled"
          >
            <a-select-option v-for="option in item.option" :key="option.value">
              {{option.value}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <div class="btn" v-if="!businessDisabled || !drawDisabled">
      <a-button type="primary" htmlType="submit" :loading="btnloading">确定</a-button>
    </div>
  </a-form>
</template>

<script>
import { ehEcrModalData } from "@/assets/data.js";
import { showOutsideECRData, UPDATEECRDATA } from "@/assets/js/url";
import moment from "moment";
import qs from "qs";
export default {
  data() {
    return {
      ehEcrModalData,
      btnloading: false,
      disabled: true,
      businessDisabled: true,
      drawDisabled: true,
      question_id: ""
    };
  },
  methods: {
    //确定提交
    handleSubmit(e) {
      let _this = this;
      e.preventDefault();
      _this.form.validateFields((err, fieldsValue) => {
        if (!err) {
          this.btnloading = true;
          const formData = new FormData();
          const values = {
            ...fieldsValue,
            label: "ecr",
            outside_jobnum: _this.jobnumber,
            question_id: _this.question_id,
            outside_username: _this.username
            // "outside_jobnum" :'03430',
            // 'question_id' : '282'
          };

          for (var key in values) {
            formData.append(key, values[key]);
          }
          formData.append("root", window.sessionStorage.getItem("ROOT"));
          formData.append("group", window.sessionStorage.getItem("GROUP"));
          _this.axios.post(UPDATEECRDATA, formData).then(res => {
            if (res.data.success == true) {
              _this.$message.success(res.data.message);
              _this.$router.push("ecnList");
            } else {
              _this.$message.error(res.data.message);
            }
          });
        }
      });
    },
    // 是否同步项目号
    synchroProject(value) {
      this.ehEcrModalData.find(val => {
        if (val.name == "synchro_number") {
          if (value == "是") {
            val.show = true;
            val.required = true;
          } else if (value == "否") {
            val.show = false;
            val.required = false;
            this.$message.error(
              "如不清楚是否同步请对接项目经理或者项目总工，后续发现同步问题将追责绩效处罚。"
            );
          } else {
            val.show = false;
            val.required = false;
          }
        }
      });
    },
    //获取表单数据
    getFormData(id) {
      let root = window.sessionStorage.getItem("ROOT");
      let group = window.sessionStorage.getItem("GROUP");
      this.axios
        .get(showOutsideECRData, {
          params: {
            id: id
            // id: 282
          }
        })
        .then(res => {
          if (res.data.success == true) {
            res.data.obj.synchro_project =
              res.data.obj.synchro_project &&
              res.data.obj.synchro_project.split(",");
            this.form.setFieldsValue(res.data.obj);
            let businessId = res.data.obj.business_engineer_jobnum;
            this.businessDisabled =
              (businessId && businessId == this.jobnumber) || root == "admin"
                ? false
                : true;
            this.drawDisabled =
              root == "admin" ||
              root == "userpmo" ||
              group.indexOf("userpmo") != -1
                ? false
                : true;
            this.synchroProject(res.data.obj.synchro_project);
          }
        });
    }
  },
  mounted() {
    this.jobnumber = window.sessionStorage.getItem("LYRIC_JOBNUMBER");
    this.username = window.sessionStorage.getItem("LYRIC_NAME");
    this.question_id = this.$route.query.id;
    this.getFormData(this.question_id);
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/style/color");
.ant-alert-info {
  border: none;
  background-color: white;
}
.ant-alert.ant-alert-no-icon {
  padding: 8px 0;
}
.btn {
  text-align: center;
}
</style>

