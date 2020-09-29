<template>
  <a-spin tip="加载中..." :spinning="spinning" class="spinning">
    <div id="MeetingRoom">
      <div class="title">
        <h4
          @click="open = !open"
          style="height: 31px;margin-top: 0px;border: 1px solid #e6e6e6;"
        >
          筛选
        </h4>
        <a-select
          v-model="templateChoose"
          @change="changeTemplate"
          style="width: 50%;border: none;"
          ghost
        >
          <a-select-option v-for="item in templates" :key="item.id">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>
      <section class="meeting-room-wrapper" v-if="showEhList">
        <div class="tips" v-show="ecnList.length === 0">无筛选结果</div>
        <div
          class="clearfix meeting-room-item"
          v-for="(item, index) in ecnList"
          :key="index"
        >
          <div>
            <p class="info"><b>项目信息：</b>{{ item.position_code }}</p>
            <p class="info">
              <b>异常编号：</b>{{ item.project_exception_number }}
            </p>
            <p class="info"><b>异常处理状态：</b>{{ item.question_status }}</p>
            <p class="infos"><b>异常问题描述：</b>{{ item.theme }}</p>
            <p class="info">
              <b>计划出图时间：</b>{{ item.drawing_time_required_time }}
            </p>
            <p class="info"><b>计划齐套时间：</b>{{ item.plan_set_time }}</p>
            <p class="info"><b>MC备注：</b>{{ item.pmc_remarks }}</p>
            <p style="text-align:right;margin-bottom: 0.3em;">
              <a-button
                type="primary"
                size="small"
                v-show="item.project_exception_number.indexOf('EHQ') == -1"
                @click="editProblem(item)"
                >编辑</a-button
              >
              <!-- <a-button type="primary" size="small" @click="editProblem(item)" 
                v-show="(jobnumber == item.creator || jobnumber == item.business_engineer_jobnum || item.effect_principle == jobnumber
                || isCanEdit)  && item.project_exception_number.indexOf('EHQ') == -1">编辑</a-button> -->
              <a-button
                size="small"
                v-show="item.project_exception_number.indexOf('EHW')"
                v-if="
                  (item.ehclose.indexOf(jobnumber) != -1 || isClose) &&
                    (item.question_status == '工程已出图' ||
                      item.question_status == '物料齐套' ||
                      item.question_status == '物料接收')
                "
                @click="toClose(item)"
                >关闭</a-button
              >
              <a-button type="primary" size="small" @click="goToECNDetail(item)"
                >查看</a-button
              >
              <a-button
                type="primary"
                size="small"
                @click="goToECNList(item)"
                v-show="item.project_exception_number.indexOf('EHW')"
                >清单</a-button
              >
              <a-button
                type="danger"
                ghost
                size="small"
                @click="del(item)"
                v-show="item.question_status == '已接收异常' && isCanDel"
                >删除</a-button
              >
              <a-button
                type="primary"
                size="small"
                @click="upload(item)"
                v-show="item.creator == jobnumber"
                >上传/查看</a-button
              >
              <a-button
                size="small"
                @click="changePeople(item.id)"
                v-show="
                  item.question_status == '已接收异常' &&
                    (item.ecr_principle == jobnumber ||
                      root == 'admin' ||
                      root == 'userChangeEcr' ||
                      group.indexOf('userChangeEcr') != -1)
                "
              >
                转交
              </a-button>
            </p>
          </div>
        </div>
        <a-pagination
          size="small"
          v-if="ecnList.length > 0"
          :pageSize="5"
          class="pagination"
          v-model="queryParams.page"
          :total="pageTotal"
          @change="changePage"
        />
      </section>

      <section class="meeting-room-wrapper" v-if="showEhwList">
        <div class="tips" v-show="ecnList.length === 0">无筛选结果</div>
        <div
          class="clearfix meeting-room-item"
          v-for="(item, index) in ecnList"
          :key="index"
        >
          <div>
            <p class="info"><b>项目号：</b>{{ item.project_number }}</p>
            <p class="info">
              <b>异常项目编号：</b>{{ item.project_exception_number }}
            </p>
            <p class="info"><b>物料描述：</b>{{ item.material_description }}</p>
            <p class="infos"><b>异常描述：</b>{{ item.theme }}</p>
            <p class="info"><b>工位代号：</b>{{ item.position_code }}</p>
            <p class="info"><b>状态：</b>{{ item.question_status }}</p>
            <p style="text-align:right;margin-bottom: 0.3em;">
              <a-button
                type="primary"
                size="small"
                @click="editProblem(item)"
                v-if="item.question_status != '关闭'"
              >
                编辑
              </a-button>
              <!-- <a-button type="primary" size="small" @click="editProblem(item)" 
                  v-show="(jobnumber == item.creator || isCanEdit)">编辑
                </a-button> -->
              <a-button
                type="primary"
                size="small"
                @click="checkEhwDetail(item)"
                >查看
              </a-button>
            </p>
          </div>
        </div>
        <a-pagination
          size="small"
          v-if="ecnList.length > 0"
          :pageSize="5"
          class="pagination"
          v-model="queryParams.page"
          :total="pageTotal"
          @change="changePage"
        />
      </section>

      <section class="meeting-room-wrapper" v-if="showEhcList">
        <div class="tips" v-show="ecnList.length === 0">无筛选结果</div>
        <div
          class="clearfix meeting-room-item"
          v-for="(item, index) in ecnList"
          :key="index"
        >
          <div>
            <p class="info"><b>项目号：</b>{{ item.projectNumber }}</p>
            <p class="info">
              <b>异常项目编号：</b>{{ item.projectExceptionNumber }}
            </p>
            <p class="infos"><b>异常描述：</b>{{ item.theme }}</p>
            <p class="info"><b>工位代码：</b>{{ item.positionCode }}</p>
            <p class="info"><b>状态：</b>{{ item.questionStatus }}</p>
            <p style="text-align:right;margin-bottom: 0.3em;">
              <a-button
                @click="editEHCProblem(item)"
                type="primary"
                size="small"
                v-if="item.questionStatus != '关闭'"
                >编辑</a-button
              >
              <a-button
                @click="checkEhcDetail(item)"
                type="primary"
                size="small"
                >查看</a-button
              >
              <a-button
                @click="del(item)"
                :disabled="root == 'admin' ? false : true"
                type="danger"
                ghost
                size="small"
                v-if="
                  item.questionStatus != '关闭' &&
                    item.questionStatus == '已接收问题'
                "
                >删除</a-button
              >
              <a-button
                @click="changePeople(item.id)"
                :disabled="
                  root == 'admin' || item.ecrJobnum == jobnumber ? false : true
                "
                size="small"
                v-if="
                  item.questionStatus != '关闭' &&
                    item.questionStatus == '已接收问题'
                "
                >转交</a-button
              >
            </p>
          </div>
        </div>
        <a-pagination
          size="small"
          v-if="ecnList.length > 0"
          :pageSize="5"
          class="pagination"
          v-model="queryParams.page"
          :total="pageTotal"
          @change="changePage"
        />
      </section>

      <!-- 搜索 -->
      <a-drawer title="搜索" @close="onClose" :visible="open">
        <a-form layout="vertical">
          <a-row style="margin-bottom:20px;">
            <a-col>
              <a-radio-group v-model="queryParams.label">
                <a-radio value="all">全部</a-radio>
                <a-radio value="mine">我发起的</a-radio>
                <a-radio value="myduty" v-if="showEhwList || showEhList"
                  >我的待办</a-radio
                >
              </a-radio-group>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="项目编号：">
                <a-input
                  placeholder="项目标号搜索"
                  v-model="queryParams.project_number"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="异常编号：">
                <a-input
                  placeholder="异常编号搜索"
                  v-model="queryParams.project_exception_number"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="异常问题描述">
                <a-textarea
                  placeholder="异常问题描述搜索"
                  v-model="queryParams.theme"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="工位代号">
                <a-textarea
                  placeholder="工位代号"
                  v-model="queryParams.position_code"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="开始时间：">
                <a-date-picker
                  :allowClear="false"
                  @change="startTimeChange"
                  :value="moment(queryParams.creator_time_start, dateFormat)"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="结束时间：">
                <a-date-picker
                  :allowClear="false"
                  @change="endTimeChange"
                  :value="moment(queryParams.creator_time_end, dateFormat)"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="状态：">
                <a-select
                  placeholder="请选择"
                  allowClear
                  v-model="queryParams.question_status"
                >
                  <a-select-option v-for="item in option" :key="item.value">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div
          :style="{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right'
          }"
        >
          <!-- <a-button :style="{marginRight: '8px'}" @click="onClose">取消</a-button> -->
          <a-button @click="searchData" type="primary">搜索</a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="init">重置</a-button>
        </div>
      </a-drawer>

      <ehcClose
        v-if="ehcFlag"
        :closeExpand="closeExpand"
        :effectId="effectId"
        @getExpand="setCloseExpand"
        @getList="getecnList"
      >
      </ehcClose>
      <ehcReason
        v-if="ehcAnalysisFlag"
        :reasonExpand="reasonExpand"
        :effectId="effectId"
        @getExpand="setReasonExpand"
        @getList="getecnList"
      >
      </ehcReason>
      <!-- 删除弹窗 -->
      <a-modal
        title="删除"
        :visible="delVisible"
        @ok="sureDel"
        @cancel="cancelDel"
        okText="确定"
        cancelText="取消"
      >
        <a-form>
          <a-form-item label="删除原因">
            <a-textarea placeholder="请填写删除原因" v-model="delContent" />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 转交弹窗 -->
      <a-modal
        title="转交"
        :visible="changeEcrVisible"
        okText="确定"
        cancelText="取消"
        :confirmLoading="confirmLoading"
        @ok="sureChangeEcr"
        @cancel="changeEcrVisible = false"
      >
        <a-form
          :autoFormCreate="
            form => {
              this.form = form
            }
          "
          layout="inline"
        >
          <a-form-item
            label="转交人"
            fieldDecoratorId="username"
            :fieldDecoratorOptions="{
              rules: [{ required: true, message: '请填写转交人' }]
            }"
          >
            <a-select
              showSearch
              placeholder="请选择转交人"
              style="width: 200px"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              :labelInValue="true"
              @search="handleSearchEcr"
              :notFoundContent="null"
            >
              <a-select-option v-for="item in NameList" :key="item.user">
                {{ item.name }}-{{ item.user }}-{{ item.jobname }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 重置密码弹窗 -->
      <a-modal
        title="重置密码"
        :visible="resetPsdVisible"
        okText="确定"
        cancelText="取消"
        :footer="null"
        @ok="sureDel"
        @cancel="resetPsdVisible = false"
      >
        <a-form>
          <a-form-item label="重置密码">
            <a-input-search
              placeholder="请输入工号"
              enterButton="确定"
              style="width:90%"
              @search="onSearch"
            />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 底部栏 -->
      <div class="bottomtitle">
        <div class="flexbtn ecnList">列表</div>
        <div class="flexbtn" @click="problemCreate">创建</div>
        <div class="flexbtn" v-if="isCanDel" @click="resetPsdVisible = true">
          重置密码
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
import {
  SELECTBYKEY,
  GETFORMDATA,
  SHOWEHWDATA,
  DELETEDATA,
  SEARCHNAME,
  CHANGEECRPRINCIPLE,
  RESETPWD,
  SHOWEHCDATA,
  DELETEEHC,
  CHANGEEHC
} from '@/assets/js/url'
import ehcClose from '@/components/ehcClose'
import ehcReason from '@/components/ehcReason'
import moment from 'moment'
import qs from 'qs'
export default {
  components: { ehcClose, ehcReason },
  data () {
    return {
      moment,
      key: 'STATE',
      ehw_key: 'EHW_STATE',
      ehc_key: 'EHC_STATE',
      dateFormat: 'YYYY-MM-DD',
      open: false,
      spinning: false,
      queryParams: {
        project_number: '',
        project_exception_number: '',
        theme: '',
        position_code: '',
        creator_time_start: '',
        creator_time_end: '',
        label: 'all',
        question_status: undefined,
        page: 1
      },
      nextTwoDate: '',
      ecnList: [],
      pageTotal: 0,
      isClose: false, // sign 原本是false
      jobnumber: '',
      option: [],
      delVisible: false,
      delId: '',
      delContent: '',
      isUpload: false,
      isCanEdit: false,
      isCanDel: false,
      showEhList: true,
      showEhwList: false,
      showEhcList: false,
      changeModeTitle: '切换EHW模板',
      changeEcrVisible: false,
      NameList: [],
      resetPsdVisible: false,
      root: '',
      group: '',
      templateChoose: 'eh',
      templates: [
        {
          id: 'eh',
          value: 'EH模板'
        },
        {
          id: 'ehw',
          value: 'EHW模板'
        },
        {
          id: 'ehc',
          value: 'EHC模板'
        }
      ],
      ehcFlag: false,
      effectId: '',
      closeExpand: false,
      reasonExpand: false,
      ehcAnalysisFlag: false,
      confirmLoading: false
    }
  },
  created () {
    const _this = this
    if (sessionStorage.getItem('templateChoose')) {
      switch (sessionStorage.getItem('templateChoose')) {
        case 'eh':
          _this.showEhList = true
          _this.showEhwList = false
          _this.showEhcList = false
          _this.templateChoose = 'eh'
          break
        case 'ehw':
          _this.showEhList = false
          _this.showEhwList = true
          _this.showEhcList = false
          _this.templateChoose = 'ehw'
          break
        case 'ehc':
          _this.showEhList = false
          _this.showEhwList = false
          _this.showEhcList = true
          _this.templateChoose = 'ehc'
          break
        default:
          _this.showEhList = true
          _this.showEhwList = false
          _this.showEhcList = false
          _this.templateChoose = 'eh'
          break
      }
    } else {
      _this.showEhList = true
      _this.showEhwList = false
      _this.showEhcList = false
      _this.templateChoose = 'eh'
    } // TODO
    //获取当前时间
    let date = new Date()
    let nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)
    let lastDay = moment(nextDate).format('YYYY-MM-DD')

    //获取当前时间前一个月的时间
    let preMonth = date.setMonth(date.getMonth() - 1)
    let firstDay = moment(preMonth).format('YYYY-MM-DD')

    this.nextTwoDate = moment(nextDate)
      .add(1, 'day')
      .format('YYYY-MM-DD')
    this.queryParams.creator_time_start = firstDay
    this.queryParams.creator_time_end = lastDay

    //获取工号
    const jobnumber = window.sessionStorage.getItem('LYRIC_JOBNUMBER')
    const center = window.sessionStorage.getItem('CENTERNAME')
    const root = window.sessionStorage.getItem('ROOT')
    const group = window.sessionStorage.getItem('GROUP') || ''
    this.jobnumber = jobnumber
    this.root = root
    this.group = group

    this.isClose =
      root == 'userpmo' || group.indexOf('userpmo') != -1 ? true : false
    this.isCanEdit = group.indexOf('usershowpic') != -1 ? true : false
    this.isCanDel = root == 'admin' ? true : false

    this.axios
      .get(SELECTBYKEY, {
        params: {
          key: this.key
        }
      })
      .then(res => {
        this.option = []
        this.option = res.data
      })

    let condition = JSON.parse(window.sessionStorage.getItem('condition'))

    if (condition) this.queryParams = { ...condition }

    this.getecnList(this.queryParams)
    if (this.showEhList) {
      this.getStatus(this.key)
    } else if (this.showEhwList) {
      this.getStatus(this.ehw_key)
    } else if (this.showEhcList) {
      this.getStatus(this.ehc_key)
    }
  },
  methods: {
    // 重置
    init () {
      //获取当前时间
      let date = new Date()
      let nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)
      let lastDay = moment(nextDate).format('YYYY-MM-DD')

      //获取当前时间前一个月的时间
      let preMonth = date.setMonth(date.getMonth() - 1)
      let firstDay = moment(preMonth).format('YYYY-MM-DD')

      this.queryParams = {
        project_number: '',
        project_exception_number: '',
        theme: '',
        position_code: '',
        creator_time_start: firstDay,
        creator_time_end: lastDay,
        label: 'all',
        question_status: undefined,
        page: 1
      }
      this.getecnList(this.queryParams)
    },
    // 获取状态值
    getStatus (key) {
      this.axios
        .get(SELECTBYKEY, {
          params: {
            key: key
          }
        })
        .then(res => {
          this.option = []
          this.option = res.data
        })
    },
    // 切换模板
    changeTemplate () {
      switch (this.templateChoose) {
        case 'eh':
          this.showEhList = true
          this.showEhwList = false
          this.showEhcList = false
          this.queryParams.page = 1
          this.getecnList(this.queryParams)
          this.getStatus(this.key)
          sessionStorage.setItem('templateChoose', 'eh')
          break
        case 'ehw':
          this.showEhList = false
          this.showEhwList = true
          this.showEhcList = false
          this.queryParams.page = 1
          this.getecnList(this.queryParams)
          this.getStatus(this.ehw_key)
          sessionStorage.setItem('templateChoose', 'ehw')
          break
        case 'ehc':
          this.showEhList = false
          this.showEhwList = false
          this.showEhcList = true
          this.queryParams.page = 1
          this.getecnList(this.queryParams)
          this.getStatus(this.ehc_key)
          sessionStorage.setItem('templateChoose', 'ehc')
          break
      }
    },
    // 上传或查看图片及视频
    upload (record) {
      this.$router.push({
        path: '/upload',
        query: {
          id: record.id
        }
      })
    },
    // 查看清单
    goToECNList (item) {
      this.$router.push({
        path: '/ecnCheckList',
        query: {
          id: item.id,
          EHCode: item.project_exception_number,
          projectNum: item.project_number,
          status: item.question_status
        }
      })
    },
    // 查看详情
    goToECNDetail (item) {
      this.$router.push({
        path: '/ecnDetail',
        query: { id: item.id }
      })
    },
    checkEhwDetail (item) {
      this.$router.push({ path: '/ehwDetail', query: { id: item.id } })
    },
    checkEhcDetail (item) {
      this.$router.push({ path: '/ehcDetail', query: { id: item.id } })
    },
    // 关闭
    toClose (item) {
      this.$router.push({ path: '/createEffect', query: { id: item.id } })
    },
    // 创建问题
    problemCreate () {
      let _this = this
      dd.device.notification.actionSheet({
        title: '请选择要创建的类别', //标题
        cancelButton: '取消', //取消按钮文本
        otherButtons: [
          '改善问题（EH）',
          '外购件异常（EHW）',
          '程序异常处理（EHC）'
        ],
        onSuccess: function (result) {
          if (result.buttonIndex == 0) {
            _this.$router.push({ path: '/createProblem' })
          } else if (result.buttonIndex == 1) {
            _this.$router.push({ path: '/ehwProblem' })
          } else if (result.buttonIndex == 2) {
            _this.$router.push({ path: '/ehcProblem' })
          }
        },
        onFail: function (err) {
          console.log(err)
        }
      })
    },
    // 搜索
    searchData () {
      this.queryParams.page = 1
      this.getecnList(this.queryParams)
    },
    // 获取列表数据
    getecnList (queryParams) {
      queryParams = {
        ...queryParams,
        // 'jobnum': '03430',
        jobnum: this.jobnumber,
        pc_or_mobile: 'mobile'
      }
      if (this.queryParams.label == 'myduty') {
        queryParams.group = this.group
      }
      let url = ''
      if (this.showEhList) {
        url = GETFORMDATA
      } else if (this.showEhwList) {
        url = SHOWEHWDATA
      } else if (this.showEhcList) {
        url = SHOWEHCDATA
      }
      this.spinning = true
      // if (!this.showEhcList) {
      this.axios
        .post(url, queryParams)
        .then(res => {
          if (res.data.success == true) {
            this.ecnList = res.data.mava
            this.pageTotal = res.data.obj
            this.open = false
            this.spinning = false
            window.sessionStorage.setItem(
              'condition',
              JSON.stringify(queryParams)
            )
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
      // }
      // else {
      //   let ehcParams = {
      //     'pcOrMobile': 'mobile',
      //     'page': this.queryParams.page,
      //     'creatorTimeStart': this.queryParams.creator_time_start,
      //     'creatorTimeEnd': this.queryParams.creator_time_end,
      //     'projectNumber': this.queryParams.project_number,
      //     'projectExceptionNumber': this.queryParams.project_exception_number,
      //     'label': this.queryParams.label,
      //     'theme': this.queryParams.theme,
      //     'questionStatus': this.queryParams.question_status,
      //     'jobnum': this.jobnumber
      //   }
      //   this.axios.post(url, ehcParams).then((res) => {
      //     if(res.data.success == true){
      //       this.ecnList = res.data.obj.data
      //       this.pageTotal = res.data.obj.total
      //       this.open =  false
      //       this.spinning = false
      //       window.sessionStorage.setItem('condition', JSON.stringify(queryParams))
      //     } else {
      //       this.$message.error(res.data.message)
      //     }
      //   }).catch((err) => {
      //     console.log(err)
      //   })
      // }
    },
    // 关闭搜索弹窗
    onClose () {
      this.open = false
    },
    // 时间改变事件
    startTimeChange (date, dateString) {
      if (dateString) {
        this.queryParams.creator_time_start = dateString
      }
    },
    // 时间改变事件
    endTimeChange (date, dateString) {
      if (dateString) {
        this.queryParams.creator_time_end = dateString
        this.nextTwoDate = date.add(1, 'day').format('YYYY-MM-DD')
      }
    },
    // 改变页码
    changePage (page, pageSize) {
      this.queryParams.page = page
      this.getecnList(this.queryParams)
    },
    // 编辑问题
    editProblem (item) {
      let _this = this
      let isCounts = false
      if (item.project_exception_number.indexOf('PL') == -1) {
        isCounts = false
      } else {
        isCounts = true
      }
      let tempButtons = ['项目经理审核']
      if (
        this.jobnumber == item.creator ||
        this.group.indexOf('userEHWQuestionEdit') != -1
      ) {
        tempButtons.push('问题创建模块')
      }
      if (this.group.indexOf('userIE') != -1) {
        tempButtons.push('IE工程师审核')
      }
      if (this.root == 'admin') {
        tempButtons = ['项目经理审核', 'IE工程师审核', '问题创建模块']
      }
      let index = item.project_exception_number.indexOf('EHW')
      if (index != -1) {
        dd.device.notification.actionSheet({
          title: '要编辑的模块？', //标题
          cancelButton: '取消', //取消按钮文本
          otherButtons: tempButtons,
          onSuccess (result) {
            if (result.buttonIndex == 0) {
              _this.$router.push({
                path: 'ehwApproval',
                query: {
                  id: item.id,
                  proNum: item.project_number,
                  status: item.question_status,
                  flag: 1
                }
              })
            } else if (result.buttonIndex == 1) {
              if (
                JSON.stringify(tempButtons) ==
                JSON.stringify(['项目经理审核', '问题创建模块'])
              ) {
                _this.$router.push({
                  path: 'ehwProblem',
                  query: {
                    id: item.id,
                    creator: item.creator,
                    project_exception_number: item.project_exception_number
                  }
                })
              } else if (
                JSON.stringify(tempButtons) ==
                JSON.stringify(['项目经理审核', '问题创建模块', 'IE工程师审核'])
              ) {
                _this.$router.push({
                  path: 'ehwProblem',
                  query: {
                    id: item.id,
                    creator: item.creator,
                    project_exception_number: item.project_exception_number
                  }
                })
              } else {
                _this.$router.push({
                  path: 'ehwApproval',
                  query: {
                    id: item.id,
                    flag: 2
                  }
                })
              }
            } else if (result.buttonIndex == 2) {
              if (
                JSON.stringify(tempButtons) ==
                JSON.stringify(['项目经理审核', 'IE工程师审核', '问题创建模块'])
              ) {
                _this.$router.push({
                  path: 'ehwProblem',
                  query: {
                    id: item.id,
                    creator: item.creator,
                    project_exception_number: item.project_exception_number
                  }
                })
              } else {
                _this.$router.push({
                  path: 'ehwApproval',
                  query: {
                    id: item.id,
                    flag: 2
                  }
                })
              }
            }
          },
          onFail (err) {
            console.log(err)
          }
        })
      } else {
        dd.device.notification.actionSheet({
          title: '要编辑的模块？', //标题
          cancelButton: '取消', //取消按钮文本
          otherButtons: [
            '创建异常',
            '异常确认',
            '分析及对策',
            '出图确认',
            '效果验证'
          ],
          onSuccess (result) {
            if (result.buttonIndex == 0) {
              _this.$router.push({
                path: '/createProblem',
                query: {
                  id: item.id,
                  creator: item.creator,
                  project_exception_number: item.project_exception_number,
                  isCounts: isCounts
                }
              })
              //
            } else if (result.buttonIndex == 1) {
              _this.$router.push({
                path: '/editQuestion',
                query: { id: item.id }
              })
            } else if (result.buttonIndex == 2) {
              _this.$router.push({
                path: '/editAnalysis',
                query: { question_id: item.id }
              })
            } else if (result.buttonIndex == 3) {
              _this.$router.push({
                path: '/editDraw',
                query: { question_id: item.id }
              })
            } else if (result.buttonIndex == 4) {
              _this.$router.push({
                path: '/createEffect',
                query: { question_id: item.id }
              })
            }
          },
          onFail: function (err) {}
        })
      }
    },
    editEHCProblem (record) {
      let _this = this
      const bottomValue = []
      if (record.creator === this.jobnumber || this.root == 'admin') {
        bottomValue.push('问题创建模块')
      }
      if (record.ecrJobnum === this.jobnumber || this.root == 'admin') {
        bottomValue.push('原因分析模块')
      }
      if (
        (record.inspectedArray &&
          record.inspectedArray.split(',').indexOf(this.jobnumber) != -1) ||
        this.root == 'admin' ||
        this.group.indexOf('userEHCEffect') != -1
      ) {
        bottomValue.push('效果验证模块')
      }
      dd.device.notification.actionSheet({
        title: '要编辑的模块？', //标题
        cancelButton: '取消', //取消按钮文本
        otherButtons: bottomValue,
        onSuccess (result) {
          const buttonName = bottomValue[result.buttonIndex]
          if (buttonName == '问题创建模块') {
            _this.$router.push({
              path: '/ehcProblem',
              query: { id: record.id, creator: record.creator }
            })
          } else if (buttonName == '原因分析模块') {
            _this.$message.info('请先选择问题类型再选择问题原因')
            _this.ehcAnalysis(record.id)
          } else if (buttonName == '效果验证模块') {
            _this.closeEhc(record.id)
          }
        },
        onFail (err) {
          console.log(err)
        }
      })
    },
    closeEhc (id) {
      this.ehcFlag = true
      this.effectId = id
      this.closeExpand = true
    },
    ehcAnalysis (id) {
      this.ehcAnalysisFlag = true
      this.effectId = id
      this.reasonExpand = true
    },
    setCloseExpand (val) {
      this.closeExpand = val
    },
    setReasonExpand (val) {
      this.reasonExpand = val
    },
    // 删除
    del (item) {
      this.delVisible = true
      this.delId = item.id
    },
    // 确定删除
    sureDel () {
      if (this.delContent) {
        let _this = this
        let value = {}
        if (!this.showEhcList) {
          this.axios
            .get(DELETEDATA, {
              params: {
                id: this.delId,
                label: 'outside',
                // outside_number : '03347',
                outside_number: this.jobnumber,
                reason: this.delContent
              }
            })
            .then(res => {
              if (res.data.success == true) {
                this.$message.success(res.data.message)
                this.getecnList(this.queryParams)
                // this.getecnList(this.num,this.theme,this.project_exception_number,this.creator_time_start,this.nextTwoDate,this.page,this.checkType,this.status)
                this.delContent = ''
                this.delVisible = false
              } else {
                this.$message.error(res.data.message)
              }
            })
        } else {
          this.axios
            .post(
              DELETEEHC,
              qs.stringify({
                id: this.delId,
                deletedReason: this.delContent,
                jobnum: this.jobnumber,
                username: window.sessionStorage.getItem('LYRIC_NAME'),
                jobname: window.sessionStorage.getItem('JobName'),
                label: 'out',
                root: this.root,
                group: this.group
              })
            )
            .then(res => {
              if (res.data.success == true) {
                this.$message.success(res.data.message)
                this.getecnList(this.queryParams)
                this.delContent = ''
                this.delVisible = false
              } else {
                this.$message.error(res.data.message)
              }
            })
        }
      } else {
        this.$message.warning('删除原因不能为空')
      }
    },
    // 取消删除
    cancelDel () {
      this.delContent = ''
      this.delVisible = false
    },
    // 转交的时候搜索人
    handleSearchEcr (value) {
      this.axios
        .get(SEARCHNAME, {
          params: {
            username: value
          }
        })
        .then(res => {
          if (res.data.success == true) {
            this.NameList = res.data.obj
          }
        })
    },
    //转交弹窗
    changePeople (id) {
      this.changeEcrVisible = true
      this.changeId = id
    },
    //确定转交事件
    sureChangeEcr () {
      this.form.validateFields((err, fieldsValue) => {
        if (!err) {
          this.confirmLoading = true
          const params = {
            username: fieldsValue.username.label.replace(/^\s+|\s+$/g, ''),
            improveMan: fieldsValue.username.label.replace(/^\s+|\s+$/g, ''),
            jobnum: fieldsValue.username.key,
            ids: this.changeId,
            id: this.changeId,
            label: 'outside',
            outsideName:
              sessionStorage.getItem('LYRIC_NAME') + '-' + this.jobnumber,
            root: this.root,
            group: this.group
          }
          let url = ''
          url = this.showEhcList ? CHANGEEHC : CHANGEECRPRINCIPLE
          this.axios.post(url, qs.stringify(params)).then(res => {
            if (res.data.success == true) {
              this.confirmLoading = false
              this.getecnList(this.queryParams)
              this.$message.success(res.data.message)
              this.changeEcrVisible = false
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
      // if (!this.showEhcList) {
      //   this.form.validateFields((err, fieldsValue) => {
      //     if(!err){
      //       const params = {
      //         'username': (fieldsValue.username.label).replace(/^\s+|\s+$/g,""),
      //         'jobnum' : fieldsValue.username.key,
      //         'ids' : this.changeId,
      //         'label': 'outside',
      //         'outSideName': sessionStorage.getItem('LYRIC_NAME') + '-' + this.jobnumber,
      //         'root': this.root
      //       }
      //       this.axios.post(CHANGEECRPRINCIPLE,qs.stringify(params)).then(res=>{
      //         if(res.data.success == true){
      //           this.getecnList(this.queryParams)
      //           this.$message.success(res.data.message)
      //           this.changeEcrVisible = false
      //         }else{
      //           this.$message.error(res.data.message)
      //         }
      //       })
      //     }
      //   })
      // } else if (this.showEhcList) {
      //   this.form.validateFields((err, fieldsValue) => {
      //     if(!err){
      //       console.log(fieldsValue.username)
      //       this.axios.post(CHANGEEHC, qs.stringify({
      //         id: this.changeId,
      //         improveMan: fieldsValue.username.label.replace(/^\s+|\s+$/g,""),
      //         jobnum: window.sessionStorage.getItem('LYRIC_JOBNUMBER'),
      //         username: window.sessionStorage.getItem('LYRIC_NAME'),
      //         jobname: window.sessionStorage.getItem('JobName'),
      //         label: 'out',
      //         root: this.root,
      //         group: this.group
      //       }))
      //       .then(res => {
      //         if (res.data.success == true) {
      //           this.$message.success(res.data.message)
      //           this.getecnList(this.queryParams)
      //           this.passName = ''
      //           this.changeEcrVisible = false
      //         } else {
      //           this.$message.error(res.data.message)
      //         }
      //       })
      //     }
      //   })
      // }
    },
    // 重置密码
    onSearch (value) {
      if (value) {
        this.axios
          .post(
            RESETPWD,
            qs.stringify({
              jobnum: value,
              root: 'admin'
            })
          )
          .then(res => {
            if (res.data.success == true) {
              this.$message.success(res.data.message)
              this.resetPsdVisible = false
            } else {
              this.$message.error(res.data.message)
            }
          })
      } else {
        this.$message.warning('工号不能为空哟！')
      }
    }
  },
  watch: {
    closeExpand (val) {
      if (val == false) {
        this.getecnList(this.queryParams)
      }
    },
    reasonExpand (val) {
      if (val == false) {
        this.getecnList(this.queryParams)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../assets/style/color');
p {
  margin-bottom: 0;
}
#MeetingRoom {
  .title {
    position: fixed;
    display: flex;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 33px;
    line-height: 33px;
    text-align: center;
    border-top: 1px solid @border-color;
    border-bottom: 1px solid @border-color;
    background-color: #fff;
    h4 {
      flex: 1;
    }
  }
  .bottomtitle {
    position: fixed;
    display: flex;
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
      flex: 1;
      border-right: 1px solid @border-color;
    }
    // .flexbtn{
    //   width: 50%;
    //   float: left;
    //   border-right: 1px solid @border-color;
    // }
    .ecnList {
      color: @default-color;
    }
  }
  .meeting-room-wrapper {
    padding: 40px 0;
    height: 100%;
    // text-align: center;
    .tips {
      text-align: center;
      margin: 20px 0;
    }
    .meeting-room-item {
      display: flex;
      align-content: center;
      margin-top: 10px;
      padding: 10px 0 0 0;
      background-color: #fff;
      border-top: 1px solid @border-color;
      border-bottom: 1px solid @border-color;
      & > div:first-child {
        position: relative;
        .status {
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          padding: 5px 10px;
          font-size: 12px;
          color: #fff;
          &.free {
            background-color: blue;
          }
          &.busy {
            background-color: red;
          }
          &.close {
            background-color: gray;
          }
        }
      }
      & > div:last-child {
        flex: 1;
        margin-left: 10px;
        max-width: 92%;
        & > .info {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: break-word;
        }
      }
      .name {
        font-size: 16px;
        font-weight: 700;
        color: #000;
      }
      .time {
        color: #f00;
      }
      // .info>b ,.infos>b {
      //   color: #000000d4;
      // }
    }
  }
  .customFilterConditionForm {
    padding: 15px;
    height: calc(100% - 50px);
  }
  footer {
    display: flex;
    height: 50px;
    line-height: 50px;
    color: #fff;
    text-align: center;
    background-color: @default-color-lighter;
    cursor: pointer;
    div {
      flex: 1;
      &:last-child {
        background-color: @default-color;
      }
    }
  }
  .pagination {
    margin: 20px 5px 20px 0;
    text-align: right;
  }
}
</style>
