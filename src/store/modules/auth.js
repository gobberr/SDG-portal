/* eslint-disable promise/param-names */
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/auth'

const state = {   
  status: '', 
  hasLoadedOnce: false,
  token: localStorage.getItem('token') || '', //FIXME:
  owner: localStorage.getItem('owner') || '',
  cid: localStorage.getItem('cid') || '' 
}

const getters = {
  isAuthenticated: state => !!state.owner, //FIXME:
  authStatus: state => state.status,
}

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, response) => {    

    //console.log('AUTH_REQUEST: ' + JSON.stringify(response))        
    return new Promise((resolve, reject) => {       
      commit(AUTH_REQUEST)  
      //console.log(response.userInfo)
      localStorage.setItem('status', 'success')
      localStorage.setItem('token', response.userInfo.id_token)
      localStorage.setItem('owner', response.userInfo.profile.user_name)
      localStorage.setItem('cid', 1) //FIXME: add cid to AC user response
      commit(AUTH_SUCCESS, response)      
      resolve()
    })
  },
  [AUTH_LOGOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      /*localStorage.removeItem('token')
      localStorage.removeItem('cid')
      localStorage.removeItem('owner')*/
      localStorage.clear();
      resolve()
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, resp) => {
    console.log('AUTH_SUCCESS')
    //console.log(resp)  
    //state.token = resp.token
    state.hasLoadedOnce = true      
    state.owner = resp.user      
    state.status = 'success'    
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    console.log('AUTH_LOGOUT')
    state.status = 'not logged'
    state.token = null
    state.owner = null
    state.cid = null
    state.hasLoadedOnce = false    
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
