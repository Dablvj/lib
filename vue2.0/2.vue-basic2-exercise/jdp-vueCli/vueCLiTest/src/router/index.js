import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Hi from '@/components/Hi'
import Hi1 from '@/components/Hi1'
import Hi2 from '@/components/Hi2'
import Params from '@/components/Params'
import Error from '@/components/Error'
import Count from '@/components/Count'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    // {
    //   path: '/hi',
    //   component: Hi,
    //   children: [
    //     {
    //       path: '/',name:'/hello/hi',component:Hi
    //     },
    //     {
    //       path: 'hi1',name:'/hello/hi/hi1',component:Hi1
    //     },
    //     {
    //       path: 'hi2',component:Hi2
    //     }
    //   ]
    // },
    // {
    //   path: '/',
    //   name: 'Hello',
    //   components: {
    //     default:Hello,
    //     left:Hi1,
    //     right:Hi2
    //   }
    // },
    {
      path: '/hi',
      name: 'Hi',
      component:Hi,
      alias: '/evrygo'
    },
    {
      path: '/test/:id(\\d+)/:title',
      name: 'test',
      component: Params,
      alias: '/evrygo2/:id(\\d+)/:title',
      beforeEnter:(to,from,next) =>{
        console.log('我进入模板')
        console.log(to)
        console.log(from)
        next({path:'/hi'})
      }
    },
    {
      path:'/redirect/:id(\\d+)/:title',
      redirect:'/test/:id(\\d+)/:title',
    },
    {
      path: "*",
      component:Error
    },
    {
      path:"/count",
      component:Count
    }
  ]
})
