const ehProblem = [
  {
    type: 'systemValue',
    label: '异常编号',
    required: true,
    message: '请输入异常编号',
    name: 'project_exception_number'
  },
  {
    type: 'systemValue',
    label: '异常提出人',
    required: true,
    message: '请输入异常提出人',
    name: 'questioner'
  },
  {
    type: 'systemValue',
    label: '异常提出部门',
    required: true,
    message: '请选择异常提出部门',
    name: 'abnormal_presentation_deparment'
  },
  {
    type: 'comboboxSelect',
    label: '项目编号',
    option: [],
    required: true,
    message: '请输入项目编号如：1106',
    placeholder: '如：B1317',
    name: 'project_number',
    showSearch: true
  },
  {
    type: 'input',
    label: '项目名称',
    option: [],
    required: true,
    message: '请输入项目名称',
    name: 'project_name',
    showSearch: true
  },
  {
    type: 'comboboxSelect',
    label: '工位号',
    option: [],
    required: true,
    message: '如：1106-01-01',
    name: 'position_code',
    showSearch: false
  },
  {
    type: 'input',
    label: '工位名称',
    option: [],
    required: true,
    message: '请输入工位名称',
    name: 'position_name',
    showSearch: false
  },
  {
    type: 'select',
    label: '工位SN码',
    option: [],
    required: false,
    message: '请填写工位SN码',
    name: 'sn_code'
  },
  {
    type: 'select',
    label: '批次',
    option: [],
    required: true,
    message: '请输入批次',
    name: 'batch',
    multiple: 'multiple'
  },
  {
    type: 'input',
    label: '产品线',
    required: true,
    message: '请选择产品线',
    name: 'product_line'
  },
  {
    type: 'textarea',
    label: '异常问题描述',
    required: true,
    min: 30,
    message:
      '项目号-机台号-工位号-零件名（物料编号），由于（具体原因或情况）' +
      '导致（什么结果或现象），改善建议：（a类/b类/c类/d类）',
    name: 'theme'
    // help: '例：1364-01-28工位，底部底板零件200000437371，' +
    //   '由于安装孔位打偏，导致无法安装，需重新打孔'
  },
  {
    type: 'select',
    label: '项目进度',
    required: true,
    message: '请选择项目进度',
    option: [
      { value: '21 设计' },
      { value: '30 制造' },
      { value: '40 厂外安调' },
      { value: '60 售后' }
    ],
    name: 'project_stage'
  },
  {
    type: 'select',
    label: '异常影响问题点',
    required: true,
    key: 'EXCEPTION_POINT',
    option: [],
    message: '请选择异常影响问题点',
    name: 'abnormal_influence_point'
  },
  {
    type: 'select',
    label: '不良类别',
    required: true,
    key: 'BAD_CATE',
    option: [],
    message: '请选择不良类别',
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
    message: '请选择是否需要厂内组装',
    name: 'is_assembly',
    help: '注：改善后零件可以组装成机构类的异常必须厂内组装后才发往现场'
  },
  {
    type: 'systemValue',
    label: '异常创建时间',
    name: 'createTime',
    show: false
  },
  {
    type: 'systemValue',
    label: '异常创建人',
    name: 'create',
    show: false
  }
]

const ehConfirm = [
  {
    type: 'select',
    label: '异常明细',
    option: [
      { value: '改善异常' },
      { value: '不是异常' },
      { value: '重复异常' }
    ],
    required: true,
    message: '请选择异常明细',
    name: 'no_or_repeat',
    show: true
  },
  {
    type: 'input',
    label: '重复异常编号',
    required: false,
    message: '请填写重复异常编号',
    name: 'same_project_exception_number',
    show: false
  },
  {
    type: 'systemValue',
    label: '确认人',
    required: false,
    message: '确认人',
    name: 'confirmPerson'
  },
  {
    type: 'date',
    label: '确认日期',
    required: false,
    message: '确认日期',
    name: 'confirm_time'
  }
]

const ehAnalyze = [
  {
    type: 'textarea',
    label: '异常原因',
    required: true,
    message: '异常原因',
    name: 'abnormal_cause'
  },
  {
    type: 'textarea',
    label: '改善对策',
    required: true,
    message: '请输入改善对策',
    name: 'improve_countermeasure'
  },
  {
    type: 'select',
    label: '异常等级',
    required: true,
    option: [{ value: '一般异常' }, { value: '重大异常' }],
    message: '请选择异常等级',
    name: 'abnormity_grade'
  },
  {
    type: 'select',
    label: '异常明细分类',
    required: true,
    key: 'EXCEPTION_CATE',
    option: [],
    message: '请选择异常明细分类',
    name: 'exception_category',
    tag: 'exception_category',
    showName: 'abnormity_principle'
  },
  {
    type: 'select',
    label: '异常责任部门',
    required: true,
    message: '请选择异常责任部门',
    key: 'EXCE_RESP_DEP',
    option: [],
    tag: 'department',
    name: 'abnormal_responsibility_department',
    showName: 'abnormity_principle'
  },
  {
    type: 'personSelect',
    option: [],
    label: '异常责任人',
    required: true,
    message: '请选择异常责任人',
    name: 'abnormity_principle'
  },
  {
    type: 'select',
    label: '低级错误',
    required: true,
    message: '请选择低级错误',
    option: [{ value: '是' }, { value: '否' }],
    name: 'stupid'
  },
  {
    type: 'personSelect',
    option: [],
    label: '改善负责人',
    required: true,
    message: '请选择改善负责人',
    name: 'improve_man'
  },
  {
    type: 'select',
    label: '涉及电气外购件',
    required: true,
    option: [{ value: '是' }, { value: '否' }],
    message: '涉及电气外购件',
    name: 'send_message_to_electrical',
    tag: 'electrical',
    showName: 'electrical_person'
  },
  {
    type: 'personSelect',
    option: [],
    label: '电气工艺代表',
    required: false,
    message: '请选择电气工艺代表',
    name: 'electrical_person'
  },
  {
    type: 'select',
    label: '是否同步项目',
    required: true,
    message: '请选择是否同步项目',
    name: 'synchro_project',
    option: [{ value: '是' }, { value: '否' }],
    help: '批量机改善填写，选择“是”，填写项目号后，自动生成新的蓝色异常编号'
  },
  {
    type: 'selectNumber',
    search: true,
    multiple: true,
    option: [],
    label: '同步项目号',
    required: false,
    message: '请输入同步项目号',
    name: 'synchro_number'
  },
  {
    type: 'systemValue',
    label: '分析人',
    required: false,
    message: '分析人',
    name: 'analyze'
  },
  {
    type: 'date',
    label: '分析日期',
    required: false,
    message: '分析日期',
    name: 'analyzeTime'
  }
]

const ehFigureConfirm = [
  {
    type: 'select',
    label: '改善确认',
    required: true,
    message: '请选择改善确认',
    option: [{ value: 'NG' }, { value: 'OK' }],
    name: 'improve_confirm'
  },
  {
    type: 'systemValue',
    label: '确认人',
    message: '确认人',
    required: false,
    name: 'actual_ecr_principle'
  },
  {
    type: 'date',
    label: '确认时间',
    required: false,
    message: '确认时间',
    name: 'ecr_project_actual_drawings_time'
  }
]

const ehEffect = [
  {
    type: 'select',
    label: '改善效果',
    required: true,
    key: 'IMPROVE_RESULT',
    option: [],
    message: '请选择改善效果',
    name: 'improvement_results'
  },
  {
    type: 'inputNum',
    label: '已改善机台数量',
    message: '请输入已改善机台数量',
    required: true,
    name: 'improve_machine_number'
  },
  {
    type: 'personSelect',
    option: [],
    label: '确认人',
    required: true,
    message: '请输入确认人',
    name: 'temporary_confirmer'
  },
  {
    type: 'date',
    label: '确认时间',
    required: true,
    name: 'improvement_results_completion_time',
    message: '请选择确认时间'
  },
  {
    type: 'textarea',
    label: '装配及调试情况',
    message: '请详细填写调试与装配情况！',
    required: true,
    name: 'improvement_situation'
  },
  {
    type: 'systemValue',
    label: '关闭人',
    message: '请选择关闭人',
    name: 'actual_close_man'
  },
  {
    type: 'date',
    label: '关闭时间',
    name: 'creator_time',
    message: '请选择关闭时间'
  }
]

export { ehProblem, ehConfirm, ehAnalyze, ehFigureConfirm, ehEffect }
