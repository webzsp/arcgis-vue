/**
 * @author zsp
 * @description  封装axios网络请求框架,
 */
import axios from 'axios'    
import router from '@/router'
import config from '../../config/config'



const instance = axios.create({    
  timeout: 10000, 
  baseURL:   config.publicPath//根据自己配置的反向代理去设置不同环境的baeUrl
})
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
let httpCode = {       
  400: '请求参数错误',
  401: '权限不足, 请重新登录',
  403: '服务器拒绝本次访问',
  404: '请求资源未找到',
  500: '内部服务器错误',
  501: '服务器不支持该请求中使用的方法',
  502: '网关错误',
  504: '网关超时'
}

instance.interceptors.request.use(config => {
  return config
}, error=> {
  return Promise.reject(error)
})

/** 添加响应拦截器  **/
instance.interceptors.response.use(response => {
  if (response.data.status === 'ok') {     // 响应结果里的status: ok是我与后台的约定，大家可以根据实际情况去做对应的判断
    return Promise.resolve(response.data)
  } else {
    return Promise.reject(response.data.message)
  }
}, error => {
  if (error.response) {     
    let tips = error.response.status in httpCode ? httpCode[error.response.status] : error.response.data.message
    if (error.response.status === 401) {  
      router.push({
        path: `/login`
      })
    }
    return Promise.reject(error)
  } else {
    return Promise.reject(new Error('请求超时, 请刷新重试'))
  }
})
const request=function(config){
    return new Promise(resolve,reject){
        instance.request(...config).then(function(res){
            resolve(res)
        }).catch(function(res){
            reject(res)
        })
    }
}
export default request