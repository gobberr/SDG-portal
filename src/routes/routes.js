import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
import NotFound from '../components/GeneralViews/NotFoundPage.vue'
import LoginPage from 'src/components/GeneralViews/LoginPage'
import Overview from 'src/components/Dashboard/Views/Overview.vue'
import CreateTemplate from 'src/components/Dashboard/Views/CreateTemplate.vue'
import CreateTemplateTechnical from 'src/components/Dashboard/Views/CreateTemplateTechnical.vue'
import CreateTemplateFull from 'src/components/Dashboard/Views/CreateTemplateFull.vue'
import CreateTemplateHTML from 'src/components/Dashboard/Views/CreateTemplateHTML.vue'
import TemplateList from 'src/components/Dashboard/Views/TemplateList.vue'
import TemplateDetails from 'src/components/Dashboard/Views/TemplateDetails.vue'
import CompileTemplate from 'src/components/Dashboard/Views/CompileTemplate.vue'
import ModifyTemplate from 'src/components/Dashboard/Views/ModifyTemplate.vue'
import ModifyTechnicalTemplate from 'src/components/Dashboard/Views/ModifyTechnicalTemplate.vue'
import ModifyTemplateHTML from 'src/components/Dashboard/Views/ModifyTemplateHTML.vue'
import ContractList from 'src/components/Dashboard/Views/ContractList.vue'
import CompileContract from 'src/components/Dashboard/Views/CompileContract.vue'
import ContractDetails from 'src/components/Dashboard/Views/ContractDetails.vue'
import SmartContractList from 'src/components/Dashboard/Views/SmartContractList.vue'
import SmartContractDetails from 'src/components/Dashboard/Views/SmartContractDetails.vue'
import SmartContractTesoreria from 'src/components/Dashboard/Views/SmartContractTesoreria.vue'
import BlockchainList from 'src/components/Dashboard/Views/BlockchainList.vue'

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
        path: 'TemplateList',
        name: 'Template List',
        beforeEnter: ifAuthenticated,
        component: TemplateList
      },      
      {
        path: 'ContractList',
        name: 'Contract List',
        beforeEnter: ifAuthenticated,
        component: ContractList
      },
      {
        path: 'BlockchainList',
        name: 'Blockchain List',
        beforeEnter: ifAuthenticated,
        component: BlockchainList
      },
      {
        path: 'TemplateDetails/:id',
        name: 'Details of a specific template',
        beforeEnter: ifAuthenticated,
        component: TemplateDetails
      },
      {
        path: 'ContractDetails/:id',
        name: 'Details of a specific contract',
        beforeEnter: ifAuthenticated,
        component: ContractDetails
      },
      {
        path: 'template/modify/:id/',
        name: 'Page to modify a template',
        beforeEnter: ifAuthenticated,
        component: ModifyTemplate
      },      
      {
        path: 'template/modifyTechnical/:id/',
        name: 'Page to modify a technical template',
        beforeEnter: ifAuthenticated,
        component: ModifyTechnicalTemplate
      },      
      {
        path: 'template/modifyTemplateHTML/:id/',
        name: 'Page to modify a HTML template',
        beforeEnter: ifAuthenticated,
        component: ModifyTemplateHTML
      },      
      {
        path: 'createTemplate',
        name: 'CreateTemplate',
        beforeEnter: ifAuthenticated,
        component: CreateTemplate
      },
      {
        path: 'technical',
        name: 'Create a technical template step by step',
        beforeEnter: ifAuthenticated,
        component: CreateTemplateTechnical
      },
      {
        path: 'html',
        name: 'Create an html template step by step',
        beforeEnter: ifAuthenticated,
        component: CreateTemplateHTML
      },
      {
        path: 'full',
        name: 'Create a full template step by step',
        beforeEnter: ifAuthenticated,
        component: CreateTemplateFull
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
      },
      {
        path: 'tesoreria',
        name: 'Details of a smart contract tesoreria',
        beforeEnter: ifAuthenticated,
        component: SmartContractTesoreria
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
  },
  {
    path: '/template/compile/:id/',
    name: 'Page to compile a template',
    beforeEnter: ifAuthenticated,
    component: CompileTemplate
  },
  {
    path: '/contract/compile/:id/',
    name: 'Page to modify a contract',
    beforeEnter: ifAuthenticated,
    component: CompileContract
  },
]

export default routes
