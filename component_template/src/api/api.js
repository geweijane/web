import axios from 'axios'
// import store from 'vuex-store'

export const apiBase = 'http://www.iot.com/api/'
axios.defaults.baseURL = apiBase
axios.defaults.withCredentials = true

// 获取用户token
function getToken () {
  let user = localStorage.getItem('user')
  if (user) {
    user = JSON.parse(user)
  }
  if (!user || !user.token) {
    user = {token: ''}
  }
  return user.token
}
// 请求错误处理
export const catchError = (e, that) => {
  let {status, data} = e.response
  switch (status) {
    case 403:
      that.$message.error({
        message: '登录超时，请重新登录',
        onClose () {
          that.$router.push({path: '/auth/layout'})
        }
      })
      break
    case 500:
      that.$message.error(data.msg)
      break
  }
}
// 登录授权部分
export const requestLogin = params => {
  return axios.put('auth/login', JSON.stringify(params), {
    headers: {'Content-Type': 'application/json'}
  }).then(res => res.data)
}
// 验证码
export const requestVerify = () => {
  return axios.get('auth/verify').then(res => res.data)
}
// 校验验证码
export const validVerify = params => {
  return axios.put('auth/verify/' + params.code, params).then(res => res.data)
}
// 忘记密码
export const forgetPass = params => {
  return axios.get('auth/getcode', {params: params}).then(res => res.data)
}
// 邮件激活码
export const getActive = params => {
  return axios.get('auth/getcode', {params: params}).then(res => res.data)
}
// 重置密码
export const resetPass = params => {
  let parameters = {headers: {'x-token': params.token}}
  return axios.put('auth/reset', params, parameters).then(res => res.data)
}
// 获取系统用户数据
export const getManager = params => {
  let parameters = {headers: {'x-token': getToken()}}
  return axios.get('manager/' + params.name, parameters).then(res => res.data)
}
// 修改系统用户数据
export const updateManager = params => {
  let parameters = {headers: {'x-token': getToken()}}
  return axios.put('manager/' + params.name, params, parameters).then(res => res.data)
}
// 注册与用户
export const regist = params => {
  return axios.post('manager', params).then(res => res.data)
}
// 删除文件
export const deleteFile = params => {
  let parameters = {headers: {'x-token': getToken()}}
  return axios.delete('', parameters).then(res => res.data)
}
