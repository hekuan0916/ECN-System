const addProblemData = [
  {
    type: 'selectLabel',
    label: '异常类型',
    required: false,
    message: '请选择类别标签',
    keyLabel: 'CATE_LABLE',
    option: [],
    name: 'category_label'
  },
  // {
  //   type: 'selectLabel',
  //   label: 'EH或EHQ',
  //   required: true,
  //   option: [{ value: 'EH' }, { value: 'EHQ' }],
  //   message: 'EH或EHQ',
  //   name: 'eh_or_ehq'
  // },
  {
    type: 'select',
    label: '异常提出人',
    option: [],
    required: true,
    message: '姓名-工号-岗位',
    name: 'questioner',
    searchType: 'questioner'
  },
  {
    type: 'showSelect',
    label: '异常提出部门',
    required: true,
    key: 'DEPT',
    option: [],
    message: '中心-部门',
    name: 'abnormal_presentation_deparment'
  },
  {
    type: 'comboboxSelect',
    label: '项目编号',
    option: [],
    required: true,
    message: '项目号+项目名称',
    placeholder: '项目号+项目名称',
    name: 'project_number'
  },
  {
    type: 'select1',
    label: '工位SN码',
    option: ['无'],
    required: false,
    message: '例:1616-01-01-0001',
    name: 'sn_code'
  },
  {
    type: 'comboboxSelect',
    label: '工位号',
    option: [],
    required: true,
    message: '工位号-工位名称',
    name: 'position_code'
  },
  {
    type: 'comboboxSelect',
    option: [],
    label: '批次',
    required: true,
    message: 'P01',
    name: 'batch'
  },
  {
    type: 'select',
    label: '产品线',
    required: true,
    key: 'PRO_LINE',
    option: [],
    message: '请选择产品线',
    name: 'product_line'
  },
  {
    type: 'textarea',
    label: '异常问题描述',
    required: true,
    message:
      '项目号-机台号-工位号-零件名（物料编号），由于（具体原因或情况）导致（什么结果或现象），改善建议：（a类/b类/c类/d类）',
    name: 'theme'
  },
  {
    type: 'select',
    label: '发生节点',
    required: true,
    key: 'HAPPEN_NODE',
    option: [],
    message: '请选择发生节点',
    name: 'occurrence_node'
  },
  //   {
  //     type: 'showSelect',
  //     label: '改善负责人',
  //     option: [],
  //     required: true,
  //     message: '请输入改善负责人',
  //     name: 'improve_man',
  //     searchType: 'improve_man'
  //   },
  // {type:'comboboxSelect',label:'批次',option: [],required:true,message:'请输入批次',name:'batch'},
  //   {
  //     type: 'select',
  //     label: '优先级',
  //     required: true,
  //     key: 'PRIORITY',
  //     option: [],
  //     message: '请选择优先级',
  //     name: 'priority'
  //   },
  {
    type: 'select',
    label: '异常影响问题点',
    required: true,
    key: 'EXCEPTION_POINT',
    option: [],
    message: '请选择',
    name: 'abnormal_influence_point'
  },
  {
    type: 'select',
    label: '不良类别',
    required: true,
    key: 'BAD_CATE',
    option: [],
    message: '请选择',
    name: 'bad_category'
  },
  {
    type: 'date',
    label: '要求出图时间',
    required: true,
    message: '请选择要求出图时间',
    name: 'drawing_time_required_time'
  },
  {
    type: 'date',
    label: '零件要求领用时间',
    required: true,
    message: '请选择零件要求领用时间',
    name: 'part_requirement_time'
  },
  {
    type: 'select',
    label: '是否需要厂内组装',
    required: true,
    option: [{ value: '是' }, { value: '否' }],
    message: '请选择',
    name: 'is_assembly'
  },
  {
    type: 'date',
    label: '异常创建时间',
    required: true,
    message: '获取创建时间',
    name: 'part_requirement_time'
  },
  {
    type: 'select',
    label: '异常创建人',
    option: [],
    required: true,
    message: '姓名-工号-岗位',
    name: 'questioner',
    searchType: 'questioner'
  },
  {
    type: 'select',
    label: '是否需要确认改善方案',
    required: false,
    message: '请选择是否需要确认改善方案',
    name: 'improve_plan',
    option: [{ value: '是' }, { value: '否' }],
    show: false
  },
  {
    type: 'usersdate',
    label: '确认改善方案时间',
    required: false,
    message: '请选择确认改善方案时间',
    name: 'improve_plan_time',
    show: false
  },
  {
    type: 'usersdate',
    label: '改善方案上传时间',
    required: false,
    message: '请选择改善方案上传时间',
    name: 'improve_plan_upload_time',
    show: false
  },
  {
    type: 'usersselect',
    label: '改善方案确认的结果',
    required: false,
    message: '请选择改善方案确认的结果',
    name: 'improve_plan_result',
    option: [{ value: 'OK' }, { value: 'NG' }],
    show: false
  },
  {
    type: 'inputusers',
    label: '改善方案确认时间',
    required: false,
    message: '暂无',
    name: 'improve_plan_result_time',
    show: false
  },
  // {
  //   type: 'userpmoSelect',
  //   label: '不是/重复异常',
  //   required: false,
  //   message: '请选择不是/重复异常',
  //   name: 'no_or_repeat',
  //   option: [{ value: '不是异常' }, { value: '重复异常' }],
  //   show: false
  // },
  // {
  //   type: 'userpmoInput',
  //   label: '重复异常编号',
  //   required: false,
  //   message: '请填写重复异常编号',
  //   name: 'same_project_exception_number',
  //   show: false
  // },
  //   {
  //     type: 'selectProvince',
  //     label: '所在省份',
  //     required: false,
  //     message: '请选择省份',
  //     name: 'province',
  //     show: false
  //   },
  //   {
  //     type: 'selectCity',
  //     label: '城市',
  //     required: false,
  //     message: '请选择城市',
  //     name: 'city',
  //     show: false
  //   },
  //   {
  //     type: 'input',
  //     label: '客户名称',
  //     required: false,
  //     message: '请输入客户名称',
  //     name: 'customer_name',
  //     show: false
  //   },
  {
    type: 'numInput',
    label: '批量修改数量',
    required: false,
    message: '请输入批量修改数量',
    name: 'change_num_effect',
    show: false
  }
]

const ehEcrModalData = [
  {
    type: 'textarea',
    label: '异常原因',
    required: true,
    message: '请输入异常原因',
    name: 'abnormal_cause'
  },
  {
    type: 'input',
    label: '异常等级',
    required: true,
    name: 'abnormity_grade'
  },
  // {
  //     type:'input',
  //     label:'涉及变更内容',
  //     required:true,
  //     name:'ecr_involve_changes_content'
  // },
  {
    type: 'input',
    label: '是否全是退库清单',
    required: true,
    name: 'whether_back'
  },
  {
    type: 'input',
    label: '异常明细分类',
    required: true,
    name: 'exception_category'
  },
  {
    type: 'input',
    label: '异常责任部门',
    required: true,
    name: 'abnormal_responsibility_department'
  },
  {
    type: 'input',
    label: '异常责任人',
    required: true,
    name: 'abnormity_principle'
  },
  {
    type: 'input',
    label: '实际出图时间',
    required: false,
    name: 'ecr_project_actual_drawings_time'
  },
  {
    type: 'selectDraw',
    label: '图纸更新',
    required: true,
    name: 'ecr_update_drawings',
    option: [
      { value: '更新图纸，并要求下发清单/图纸' },
      { value: '仅更新图纸，无需下发清单/图纸' },
      { value: '无需更新图纸，只需修补零件' },
      { value: '需下发修改零件图纸，物料无需跟踪' },
      { value: '不是异常/重复异常' }
    ]
  },
  // {type:'input',label:'协同部门',required:true,message:'请输入协同部门',name:'collaborative_department'},
  // {type:'input',label:'协同人',required:true,name:'collaborator'},
  { type: 'input', label: '实际出图人', name: 'actual_ecr_principle' },
  {
    type: 'input',
    label: '是否需要厂内组装',
    required: true,
    name: 'is_assembly'
  },

  {
    type: 'input',
    label: '是否涉及电气外购件',
    required: true,
    name: 'send_message_to_electrical'
  },
  {
    type: 'input',
    label: '电气工艺代表',
    required: false,
    message: '请选择电气工艺代表',
    name: 'electrical_person'
  },
  // {
  //     type:'input',
  //     label:'是否通知装配工艺代表',
  //     required:true,
  //     message:'请选择是否通知装配工艺代表',
  //     name:'send_message_to_assembling'
  // },
  // {type:'input',label: '装配工艺代表',required:false,message:'请选择装配工艺代表',name:'assembling_person'},
  // {
  //     type:'input',
  //     label:'是否通知程序设计代表',
  //     required:true,
  //     message:'请选择是否通知程序设计代表',
  //     name:'send_message_to_program'
  // },
  // {type:'input',label: '程序设计代表',required:false,message:'请选择程序设计代表',name:'program_person'},

  {
    type: 'textarea',
    label: '改善对策',
    required: true,
    message: '请输入改善对策',
    name: 'improve_countermeasure'
  },
  {
    type: 'select',
    label: '是否同步项目',
    required: true,
    message: '请选择是否同步项目',
    name: 'synchro_project',
    option: [{ value: '是' }, { value: '否' }]
  },
  {
    type: 'input',
    label: '同步项目号',
    required: false,
    message: '请输入同步项目号',
    name: 'synchro_number',
    show: false
  },
  {
    type: 'input',
    label: '客户相关性',
    required: true,
    name: 'customer_relevance'
  },
  {
    type: 'input',
    label: '商务工程师',
    required: false,
    name: 'business_engineer'
  },
  {
    type: 'select',
    label: '客户意见',
    required: true,
    option: [{ value: '同意变更' }, { value: '不同意变更' }],
    message: '请选择客户意见',
    name: 'customer_advise'
  },
  {
    type: 'textarea',
    label: '客户意见描述',
    required: true,
    message: '请输入客户意见描述',
    name: 'advise_description'
  }
]

const effectValidateData = [
  {
    type: 'select',
    label: '改善效果',
    required: true,
    key: 'IMPROVE_RESULT',
    option: [],
    message: '请选择改善结果',
    name: 'improvement_results'
  },
  {
    type: 'numInput',
    label: '已改善机台数量',
    required: true,
    message: '请输入已改善机台数量',
    name: 'improve_machine_number'
  },
  {
    type: 'showSelect',
    option: [],
    label: '确认人',
    required: true,
    message: '请输入确认人',
    name: 'temporary_confirmer',
    searchType: 'temporary_confirmer'
  },
  {
    type: 'date',
    label: '确认日期',
    required: true,
    name: 'improvement_results_completion_time',
    message: '请选择确认日期'
  },
  // {type:'textarea',label:'NG原因',required:false,name:'ng_reason',message:'请填写NG原因'},
  // {
  //     type:'select',
  //     label:'一个月内是否还有同类不良发生',
  //     required:true,
  //     option:[{value:'是'},{value:'否'}],
  //     message:'请选择一个月内是否还有同类不良发生',
  //     name:'same_bad_category',
  // },
  // {type:'range',label:'日期',message:'请选择日期',required:true,name:'bad_category_time'},
  // {type:'textarea',label:'描述',message:'请输入描述',required:true,name:'bad_describe'},
  // {
  //     type:'select',
  //     label:'客服是否仍在投诉',
  //     required:true,
  //     option:[{value:'是'},{value:'否'}],
  //     message:'请选择客服是否仍在投诉',
  //     name:'guest_complaint'
  // },
  // {type:'textarea',label:'描述',message:'请输入描述',required:true,name:'complaint_describe'},
  {
    type: 'textarea',
    label: '装配及调试情况',
    message: '请输入装配及调试情况',
    required: true,
    name: 'improvement_situation'
  },
  {
    type: 'input',
    label: '关闭人',
    message: '请选择关闭人',
    name: 'actual_close_man'
  },
  {
    type: 'input',
    label: '关闭时间',
    required: false,
    name: 'creator_time',
    message: '请选择关闭时间'
  }
]

const ehwProblem = [
  {
    type: 'comboboxSelect',
    label: '项目编号',
    option: [],
    required: true,
    message: '请输入项目编号如：1106',
    placeholder: '如：B1317',
    name: 'project_number'
  },
  {
    type: 'systemValue',
    label: '项目异常编号',
    required: false,
    message: '项目异常编号',
    name: 'project_exception_number'
  },
  {
    type: 'comboboxSelect',
    label: '工位代号',
    option: [],
    required: true,
    message: '如：1106-01-01',
    name: 'position_code'
  },
  {
    type: 'input',
    label: '批次',
    required: true,
    message: '请输入批次',
    name: 'batch'
  },
  {
    type: 'systemValue',
    label: '提出日期',
    required: false,
    message: '暂无',
    name: 'creator_time'
  },
  {
    type: 'date',
    label: '需求日期',
    required: true,
    message: '请选择需求日期',
    name: 'demand_time'
  },
  {
    type: 'showSelect',
    label: '异常提出人',
    option: [],
    required: true,
    message: '请输入异常提出人',
    name: 'questioner',
    searchType: 'questioner'
  },
  {
    type: 'select',
    label: '异常提出部门',
    required: true,
    key: 'DEPT',
    option: [],
    message: '请选择异常提出部门',
    name: 'abnormal_presentation_department'
  },
  {
    type: 'select',
    label: '项目状况',
    required: true,
    option: [{ value: '紧急' }, { value: '不紧急' }],
    message: '请选择项目状况',
    name: 'project_status'
  },
  {
    type: 'input',
    label: '物料编号',
    required: true,
    message: '请填写物料编号',
    name: 'material_code'
  },
  {
    type: 'textarea',
    label: '物料描述',
    required: true,
    message: '请填写物料描述',
    name: 'material_description'
  },
  // {type:'input',label:'外购件名称',required:true,message:'请填写外购件名称',name:'purchased_part_name'},
  // {type:'input',label:'外购件品牌型号',required:true,message:'请填写外购件品牌型号',name:'purchased_part_brand_type'},
  // {type:'input',label:'外购件型号',required:true,message:'请填写外购件型号',name:'purchased_part_type'},
  // {type:'input',label:'外购件品牌',required:true,message:'请填写外购件品牌',name:'purchased_part_brand'},
  {
    type: 'numInput',
    label: '数量',
    required: true,
    message: '请填写数量',
    name: 'purchased_part_number'
  },
  {
    type: 'select',
    label: '初次判定',
    required: true,
    key: 'JUDGE',
    option: [],
    message: '请选择初次判定',
    name: 'judgement'
  },
  {
    type: 'input',
    label: '已使用时间',
    required: true,
    message: '例：12个月',
    name: 'used_date'
  },
  {
    type: 'select',
    label: '处理意见',
    required: true,
    key: 'SUG',
    option: [],
    message: '请选择处理意见',
    name: 'suggestion'
  },
  {
    type: 'select',
    label: '发生节点',
    required: true,
    key: 'HAPPEN_NODE',
    option: [],
    message: '请选择发生节点',
    name: 'occurrence_node'
  },
  {
    type: 'date',
    label: '计划退库日期',
    required: true,
    message: '请选择计划退库日期',
    name: 'withdrawa_time'
  },
  // {type:'comboboxSelect',label:'机台号',option: [],required:true,message:'请输入机台号',name:'jitai_number'},
  {
    type: 'select',
    label: '物料处理类型',
    required: true,
    message: '请选择物料处理类型',
    option: [{ value: '维修' }, { value: '购买' }],
    name: 'material_handle_type'
  },
  {
    type: 'select',
    label: '是否有库存',
    required: false,
    message: '请选择是否有库存',
    option: [{ value: '有' }, { value: '无' }],
    name: 'stock'
  },
  {
    type: 'select',
    label: '是否开处罚单',
    required: true,
    option: [{ value: '是' }, { value: '否' }],
    message: '请选择是否开处罚单',
    name: 'whether_punish'
  },
  {
    type: 'showSelect',
    label: '处罚责任人',
    required: true,
    message: '请输入处罚责任人',
    name: 'punish_principal',
    option: [],
    searchType: 'punish_principal'
  },
  {
    type: 'select',
    label: ' 本厂/外协责任',
    option: [
      { value: '本厂' },
      { value: '外协' },
      { value: '本厂和外协' },
      { value: '无' }
    ],
    required: true,
    message: '请选择本厂/外协责任',
    name: 'whos_duty'
  },
  {
    type: 'select',
    label: '是否有实物',
    option: [{ value: '有' }, { value: '无' }],
    required: true,
    message: '请选择是否有实物',
    name: 'real_mater'
  },
  {
    type: 'input',
    label: '物料员',
    option: [],
    required: false,
    message: '请输入物料员',
    name: 'material_clerk'
  },
  {
    type: 'showSelect',
    label: '异常分析人',
    option: [],
    required: true,
    message: '请输入异常分析人',
    name: 'anomaly_analyst',
    searchType: 'anomaly_analyst'
  },
  {
    type: 'textarea',
    label: '临时对策',
    required: true,
    message: '请输入临时对策',
    name: 'temporay_countermeasures'
  },
  {
    type: 'textarea',
    label: '长期对策',
    required: true,
    message: '请输入长期对策',
    name: 'long_countermeasures'
  },
  {
    type: 'textarea',
    label: '异常描述',
    required: true,
    message: '请输入异常描述',
    name: 'theme'
  },
  {
    type: 'selectEvent',
    label: '外观分析',
    option: [{ value: '完整' }, { value: '损坏' }],
    message: '请选择外观分析',
    required: true,
    name: 'appearance_analysis',
    tagName: 'appearance_analysis_description'
  },
  {
    type: 'textarea',
    label: '描述',
    required: false,
    message: '请输入描述',
    name: 'appearance_analysis_description'
  },
  {
    type: 'selectEvent',
    label: '线路排查',
    option: [{ value: '正常' }, { value: '异常' }],
    message: '请选择线路排查',
    required: true,
    name: 'line_survey',
    tagName: 'line_survey_description'
  },
  {
    type: 'textarea',
    label: '描述',
    required: false,
    message: '请输入描述',
    name: 'line_survey_description'
  },

  {
    type: 'selectEvent',
    label: '机械装配',
    option: [{ value: '正常' }, { value: '异常' }],
    message: '请选择机械装配',
    required: true,
    name: 'mechanical_assembly',
    tagName: 'mechanical_assembly_description'
  },
  {
    type: 'textarea',
    label: '描述',
    required: false,
    message: '请输入描述',
    name: 'mechanical_assembly_description'
  },

  {
    type: 'selectEvent',
    label: '程序逻辑',
    option: [{ value: '正常' }, { value: '异常' }],
    message: '请选择程序逻辑',
    required: true,
    name: 'procedural_logic',
    tagName: 'procedural_logic_description'
  },
  {
    type: 'textarea',
    label: '描述',
    required: false,
    message: '请输入描述',
    name: 'procedural_logic_description'
  },

  {
    type: 'selectEvent',
    label: '工程设计',
    option: [{ value: '正常' }, { value: '异常' }],
    message: '请选择工程设计',
    required: true,
    name: 'engineering_design',
    tagName: 'engineering_design_description'
  },
  {
    type: 'textarea',
    label: '描述',
    required: false,
    message: '请输入描述',
    name: 'engineering_design_description'
  },
  {
    type: 'textarea',
    label: '备注',
    required: false,
    message: '请输入备注',
    name: 'annotation'
  }
]
const managerApproval = [
  {
    type: 'select',
    option: [{ value: '维修' }, { value: '购买' }, { value: '报废' }],
    label: '项目负责人意见',
    required: true,
    message: '请选择意见',
    name: 'approval_opinions_one'
  },
  {
    type: 'systemValue',
    label: '审核人',
    required: false,
    message: '审核人',
    name: 'approver_one'
  },
  {
    type: 'systemValue',
    label: '审核时间',
    required: false,
    message: '审核人时间',
    name: 'approval_time_one'
  },
  {
    type: 'textarea',
    label: '备注',
    required: false,
    message: '请输入备注',
    name: 'ng_reason_one'
  }
]
const engineerApproval = [
  {
    type: 'select',
    option: [
      { value: '人为损坏' },
      { value: '来料异常' },
      { value: '功能不良' },
      { value: '正常老化' }
    ],
    label: '制造技术部初判',
    required: false,
    message: '请选择初判结果',
    name: 'ie_judge'
  },
  {
    type: 'systemValue',
    label: '审核人',
    required: false,
    message: '审核人',
    name: 'ie_approver'
  },
  {
    type: 'systemValue',
    label: '审核时间',
    required: false,
    message: '审核人时间',
    name: 'ie_approval_time'
  },
  {
    type: 'textarea',
    label: '备注',
    required: false,
    message: '请输入备注',
    name: 'ie_remark'
  }
]
const ehcProblem = [
  {
    type: 'select',
    label: '异常提出部门',
    required: true,
    key: 'DEPT',
    option: [],
    message: '请选择异常提出部门',
    name: 'abnormalPresentationDepartment'
  },
  {
    type: 'showSelect',
    label: '异常提出者',
    option: [],
    required: true,
    message: '请输入异常提出者',
    name: 'questioner',
    searchType: 'questioner'
  },
  {
    type: 'comboboxSelect',
    label: '项目编号',
    option: [],
    required: true,
    message: '请输入项目编号如：1106',
    placeholder: '如：B1317',
    name: 'projectNumber'
  },
  {
    type: 'input',
    label: '批次/区域',
    required: true,
    message: '请输入批次',
    name: 'batch'
  },
  {
    type: 'select',
    label: '发生节点',
    required: true,
    key: 'HAPPEN_NODE_EHC',
    option: [],
    message: '请选择发生节点',
    name: 'occurrenceNode'
  },
  {
    type: 'showSelect',
    label: '关注人',
    required: false,
    option: [],
    message: '请选择关注人',
    name: 'concern',
    searchType: 'concern'
  },
  {
    type: 'comboboxSelect',
    label: '工位代号',
    option: [],
    required: true,
    message: '如：1106-01-01',
    name: 'positionCode'
  },
  {
    type: 'showSelect',
    label: '改善负责人',
    option: [],
    required: true,
    message: '请输入改善负责人',
    name: 'improveMan',
    searchType: 'improveMan'
  },
  {
    type: 'textarea',
    label: '异常描述',
    required: true,
    message: '请输入异常描述',
    name: 'theme'
  }
]
const ehcDetail1 = [
  {
    type: 'comboboxSelect',
    label: '工位代号',
    option: [],
    required: true,
    message: '如：1106-01-01',
    name: 'positionCode'
  },
  {
    type: 'showSelect',
    label: '改善负责人',
    option: [],
    required: true,
    message: '请输入改善负责人',
    name: 'improveMan',
    searchType: 'improveMan'
  },
  {
    type: 'textarea',
    label: '异常描述',
    required: true,
    message: '请输入异常描述',
    name: 'theme'
  }
  // {
  //     type: 'select',
  //     label: '问题类型',
  //     option: [{value:'有'},{value:'无'}],
  //     required: true,
  //     message: '请选择问题类型',
  //     name: 'question_type'
  // },
  // {
  //     type: 'select',
  //     label: '问题原因',
  //     option: [{value:'有'},{value:'无'}],
  //     required: true,
  //     message: '请选择问题原因',
  //     name: 'question_reason'
  // },
  // {
  //     type: 'textarea',
  //     label: '改善对策',
  //     required: true,
  //     message: '请输入改善对策',
  //     name: 'strategy'
  // }
]
const ehcClose = [
  {
    type: 'select',
    label: '改善结果',
    required: true,
    key: 'IMPROVE_RESULT',
    option: [{ value: 'OK' }, { value: 'NG' }],
    message: '请选择改善结果',
    name: 'improveResult'
  },
  // {
  //     type: 'showSelect',
  //     label: '关闭人',
  //     required: true,
  //     message: '请选择关闭人',
  //     name: 'actualCloseMan'
  // },
  // {
  //     type: 'input',
  //     label: '关闭时间',
  //     required: true,
  //     name: 'creatorTime',
  //     message: '请选择关闭时间'
  // },
  {
    type: 'select',
    label: '无法解决需协助',
    required: true,
    option: [{ value: '是' }, { value: '否' }],
    name: 'needCoordinate',
    message: '请选择是否需要协助'
  }
]
const ehcReason = [
  {
    type: 'select',
    label: '问题类型',
    required: true,
    key: 'QUESTION_TYPE',
    option: [],
    message: '请选择问题类型',
    name: 'questionType'
  },
  {
    type: 'showSelect',
    label: '问题原因',
    required: true,
    key: '',
    option: [],
    message: '请选择问题原因',
    name: 'questionReason'
  },
  {
    type: 'showSelect',
    label: '验收人员',
    required: true,
    key: '',
    option: [],
    message: '请选择验收人员',
    name: 'inspected',
    searchType: 'inspected'
  },
  {
    type: 'textarea',
    label: '改善对策',
    required: true,
    message: '请输入改善对策',
    name: 'strategy'
  }
]
const ehEditQuestion = [
  {
    type: 'select',
    label: '异常类型',
    required: true,
    key: 'QUESTION_TYPE',
    option: [1, 2, 3],
    message: '请选择',
    name: 'questionType'
  },
  {
    type: 'input',
    label: '确认人',
    required: true,
    key: '',
    option: [],
    message: '请输入确认人',
    name: 'questionReason'
  },
  {
    type: 'date',
    label: '确认日期',
    required: true,
    name: 'improvement_results_completion_time',
    message: '请选择确认日期'
  }
]
export {
  addProblemData,
  ehEcrModalData,
  effectValidateData,
  ehwProblem,
  managerApproval,
  engineerApproval,
  ehcProblem,
  ehcClose,
  ehcDetail1,
  ehcReason,
  ehEditQuestion
}
