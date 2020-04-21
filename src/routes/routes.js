import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
import NotFound from '../components/GeneralViews/NotFoundPage.vue'
import LoginPage from 'src/components/GeneralViews/LoginPage'
import Overview from 'src/components/Dashboard/Views/Overview.vue'
import SmartContractList from 'src/components/Dashboard/Views/SmartContractList.vue'
import SmartContractDetails from 'src/components/Dashboard/Views/SmartContractDetails.vue'

import store from '../store'

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/loginPage')
}

const routes = [

  {
    path: '/',
    component: DashboardLayout,    
    redirect: '/overview',        
    children: [
      {
        path: 'overview',
        name: 'Overview',        
        component: Overview        
      },  
      {
        path: 'smartContractList',
        name: 'SmartContractList',
        beforeEnter: ifAuthenticated,
        component: SmartContractList
      },
      {
        path: 'smartContractDetails/:id',
        name: 'Details of a specific smart contract',
        beforeEnter: ifAuthenticated,
        component: SmartContractDetails
      }      
    ]
  },  
  {
    path: '*',
    name: 'Page reached in case of invalid url',
    component: NotFound
  },
  {
    path: '/loginPage',
    name: 'LoginPage',
    component: LoginPage,    
    beforeEnter: ifNotAuthenticated    
  }  
]

export default routes
