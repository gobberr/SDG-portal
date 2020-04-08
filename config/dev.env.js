var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_GENERATOR_ENDPOINT: '\"' + process.env.GENERATOR_ENDPOINT + '\"',
  VUE_APP_PROXY_ENDPOINT: '\"' + process.env.PROXY_ENDPOINT + '\"'   
})
