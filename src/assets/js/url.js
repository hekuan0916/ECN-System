export const URL = 'http://10.123.8.94:8282' //测试参数地址

// export const URL = 'http://183.234.204.230:8090/ecnMoblie/' //打包参数地址

export const DD_CONFIG = 'http://183.234.204.230:8085/WorkStat/dingtalk/config'

export const DD_GET_USER_INFO =
  'http://183.234.204.230:8085/WorkStat/dingtalk/user/info'

const url = '/api'

// const url = 'http://183.234.204.230:8090'  //打包地址

export const LOGIN = `${url}/ECN/configController/loginOutside`

export const GETFORMDATA = url + '/ECN/FormShowController/outsideFormData'

export const DETAILDATA = url + '/ECN/FormShowController/outsideFormDetailData'

export const SELECTBYKEY = `${url}/ECN/configController/selectByKey`

export const SHOWDATABYPROJECTNUM = `${url}/ECN/FormBuildController/showDataByProjectNumber`

// 根据项目号获取项目批次
export const getBatchFromSAP = `${url}/ECN/FormBuildController/getBatchFromSAP`

export const SEARCHNAME = `${url}/ECN/FormBuildController/searchName`

export const QUESTIONBUILD = `${url}/ECN/FormBuildController/questionBuild`

export const UPDATEQUESTIONDATA = `${url}/ECN/FormBuildController/updateQuestionData`

export const EFFECTBUILD = `${url}/ECN/FormBuildController/effectVerificationBuild`

export const UPDATEEFFECTDATA = `${url}/ECN/FormBuildController/updateEffectData`

export const SEARCHNAMEBYJOB = `${url}/ECN/configController/searchNameByJobnum`

export const CHOICEURL = `${url}/ECN/FormShowController/choiceCreateOrUpdate`

export const DOWNLOAD = `${url}/ECN/FormShowController/downloadOutsideForm`

export const SHOWQUESTIONDATA = `${url}/ECN/FormShowController/showOutsideQuestionData`

export const DELETEDATA = `${url}/ECN/FormBuildController/deleteQuestionData`

export const SERACHPRONUM = `${url}/ECN/AppController/searchProjcetNumber`

export const CHECKLIST = `${url}/ECN/AppController/connectSAPGetMaterielData`

export const getAcceptAddress = `${url}/ECN/AppController/getAcceptAddressFromSAP`

export const saveMaterialAcceptData = `${url}/ECN/FormBuildController/saveMaterialAcceptData`

export const uploadImg = `${url}/ECN/AppController/saveMediaInfo`

export const showMedioInfo = `${url}/ECN/AppController/showMediaInfo`

export const delMedioInfo = `${url}/ECN/AppController/deleteMediaInfo`

export const UPDATESTATUS = `${url}/ECN/FormBuildController/updateQuestionStatus`

export const showVideo = `${url}/ECN/AppController/showVideo`

export const selectjitaiNumber = `${url}/ECN/FormBuildController/selectJitaiNumber`

export const showOutsideECRData = `${url}/ECN/FormShowController/showOutsideECRData`

export const UPDATEECRDATA = `${url}/ECN/FormBuildController/updateEcrData`

export const EHWBuild = `${url}/ECN/EHWController/questionBuild`

export const SHOWEHWDATA = `${url}/ECN/EHWController/showEHWQuestionToDingDing`

export const SHOWEHWEDITDATA = `${url}/ECN/EHWController/showEHWQuestionData`

export const findDQEPerson = `${url}/ECN/FormBuildController/findDQEPerson`

export const getDataFromSAP = `${url}/ECN/EHWController/getDataFromSAP`

export const getSNCodeFromSAP = `${url}/ECN/AppController/getSNCodeFromSAP`

export const showEHWDetailInfo = `${url}/ECN/EHWController/showEHWDetailInfo`

export const getImproveMan = `${url}/ECN/FormBuildController/getImproveMan`

export const CHANGEECRPRINCIPLE = `${url}/ECN/configController/changeEcrPrinciple`

export const RESETPWD = `${url}/ECN/AppController/resetPassword`

export const approvalEHW = `${url}/ECN/EHWController/approvalEHWQuestionBuild`

export const backManagerApproval = `${url}/ECN/EHWController/backToFirst`

export const IEApproval = `${url}/ECN/EHWController/ieApproval`

export const SHOWEHCDATA = `${url}/ECN/EHCController/showEHCQuestionToDingDing`

export const CREATEEHC = `${url}/ECN/EHCController/saveQuestion`

export const SAVEEHCREASON = `${url}/ECN/EHCController/saveReasonAnalysis`

export const EHCEFFECT = `${url}/ECN/EHCController/saveEffect`

export const CHANGEEHC = `${url}/ECN/EHCController/changeImproveMan`

export const DELETEEHC = `${url}/ECN/EHCController/deleteData`

export const SHOWEHCINFO = `${url}/ECN/EHCController/showEHCDetailInfo`

export const GETLAST = `${url}/ECN/EHCController/getLastCreate`

export const GETEHCDATA = `${url}/ECN/EHCController/showEHCModifyData`
// 异常确认
export const editQuestion = `${url}/ECN/FormBuildV2Controller/editQuestionConfirm`
// 分析及对策
export const editAnalysis = `${url}/ECN/FormBuildV2Controller/editReasonAnalysis`
// 出图确认
export const editDraw = `${url}/ECN/FormBuildV2Controller/editDrawConfirm`

// 获取省份
export const showProvince = `${url}/ECN/AppController/showProvinceByName`

// 获取城市
export const showCity = `${url}/ECN/AppController/showCity`
