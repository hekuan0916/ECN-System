import Vue from 'vue'
import Router from 'vue-router'
import ecnList from '@/components/ecnList'
import ecnDetail from '@/components/ecnDetail'
import ecnCheckList from '@/components/ecnCheckList'
// import checkPic from '@/components/checkPic'
import createEffect from '@/components/createEffect'
import createProblem from '@/components/createProblem'
import ehwProblem from '@/components/ehwProblem'
import upload from '@/components/upload'
import ecrModal from '@/components/ecrModal'
import ehwDetail from '@/components/ehwDetail'
import ehwApproval from '@/components/ehwApproval'
import ehcProblem from '@/components/ehcProblem'
import ehcDetail from '@/components/ehcDetail'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/Welcome'
    },
    {
      path: '/Welcome',
      name: '欢迎',
      component: {
        template: '<div style="text-align: center">欢迎</div>'
      }
    },
    {
      path: '/ecnList',
      name: '列表',
      meta: {
        requiresAuth: true
      },
      component: ecnList
    },
    {
      path: '/ecnDetail',
      name: '详情',
      meta: {
        requiresAuth: true
      },
      component: ecnDetail
    },
    {
      path: '/ecnCheckList',
      name: '清单',
      meta: {
        requiresAuth: true
      },
      component: ecnCheckList
    },
    {
      path: '/createProblem',
      name: '问题创建（EH）',
      meta: {
        requiresAuth: true
      },
      component: createProblem
    },
    {
      path: '/ehwProblem',
      name: '问题创建（EHW）',
      meta: {
        requiresAuth: true
      },
      component: ehwProblem
    },
    {
      path: '/createEffect',
      name: '效果验证',
      meta: {
        requiresAuth: true
      },
      component: createEffect 
    },
    {
      path: '/upload',
      name: '上传',
      meta: {
        requiresAuth: true
      },
      component: upload
    },
    {
      path: '/ecrModal',
      name: '编辑',
      meta: {
        requiresAuth: true
      },
      component: ecrModal
    },
    {
      path: '/ehwDetail',
      name: 'ehw详情',
      meta: {
        requiresAuth: true
      },
      component: ehwDetail 
    },
    {
      path: '/ehwApproval',
      name: 'ehw审批',
      meta: {
        requiresAuth: true
      },
      component: ehwApproval 
    },
    {
      path: '/ehcProblem',
      name: 'ehc问题',
      meta: {
        requiresAuth: true
      },
      component: ehcProblem
    },
    {
      path: '/ehcDetail',
      name: 'ehc详情',
      meta: {
        requiresAuth: true
      },
      component: ehcDetail
    }
    // {
    //   path: '/checkPic',
    //   name: '查看',
    //   meta: {
    //     requiresAuth: true
    //   },
    //   component: checkPic
    // },
  ]
})

// 注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (window.sessionStorage.getItem('isLogin') === 'true') {
      next()
    } else {
      alert('请在钉钉上访问')
      next({
        path: '/'
      })
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  dd.biz.navigation.setTitle({
    title: to.name, //控制标题文本，空字符串表示显示默认文本
  });
})

export default router