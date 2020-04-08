module.exports = {
  NODE_ENV: '"production"',
  VUE_APP_GENERATOR_ENDPOINT: '\"' + process.env.GENERATOR_ENDPOINT + '\"',
  VUE_APP_PROXY_ENDPOINT: '\"' + process.env.PROXY_ENDPOINT + '\"'  
}
