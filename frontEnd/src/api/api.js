import axios from 'axios'

export const baiduAk = 'Wd9YGt7OBXFI9T8XZf3IP8oZGRENyhFF'
export const apiBase = process.env.NODE_ENV !== 'development' ? '/' : 'http://www.huajian.com/'

// 获取用户token
function getToken () {
  let user = sessionStorage.getItem('user')
  if (user) {
    user = JSON.parse(user)
  }
  if (!user || !user.token) {
    user = {
      token: ''
    }
  }
  return user.token
}

axios.defaults.baseURL = apiBase

axios.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['x-token'] = token
    }
    if (config.method.toLocaleLowerCase() === 'get') {
      if (config.params === undefined) {
        config.params = {}
      }
      config.params.timer = new Date().getTime()
    }
    return config
  },
  err => Promise.reject(err)
)

axios.interceptors.response.use(
  (response) => {
    if (parseInt(response.data.errno, 10) === 0) {
      return response
    }
    switch (response.data.errno) {
      case '401':
      case '403':
        sessionStorage.removeItem('user')
        window.location.href = '/'
        break
      default:
        break
    }
    const error = new Error(response.data.msg)
    return Promise.reject(error)
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
        case 403:
          sessionStorage.removeItem('user')
          window.location.href = '/'
          break
        default:
          break
      }
    }
    return Promise.reject(error)
  }
)

// 请求错误处理
export const catchError = (e, that) => {
  if (e) {
    if (e.response) {
      let {
        status,
        data
      } = e.response
      switch (status) {
        case 403:
          that.$message.error({
            message: '登录超时，请重新登录',
            onClose () {
              that.$router.push({
                path: '/auth/login'
              })
            }
          })
          break
        default:
          let msg = data.msg ? data.msg : e.toString()
          that.$message.error(msg)
          break
      }
    } else {
      that.$message.error(e.toString())
    }
  }
}
// 登录授权部分
export const requestLogin = params => axios.put('api/auth/' + params.name, params).then(res => res.data)

// 验证码
export const requestVerify = () => axios.get('api/auth/verify').then(res => res.data)

// 发送短信验证码
export const requestSms = params => axios.put('api/auth/getcode', params).then(res => res.data)

// 重置密码
export const resetPassword = params => axios.put('api/auth/reset', params).then(res => res.data)

// 更改用户信息
export const putUser = params => axios.put('api/user/' + params.userName, params).then(res => res.data)

// 获取项目单位
export const getRoles = params => axios.get('v2/role', {params}).then(res => res.data)

// 首页部分 -- 系统概况
export const analysisHome = () => axios.get('v2/analysis').then(res => res.data)

// 报警消息
export const getWarnings = params => axios.get('v2/warning', {params}).then(res => res.data)

// 报警消息 单个
export const getWarning = params => axios.get('v2/warning/' + params.id, {params}).then(res => res.data)

// 维护记录 --列表
export const getFixeds = params => axios.get('v2/fixed', {params}).then(res => res.data)

// 维护记录 --详情
export const getFixed = params => axios.get('v2/fixed/' + params.id, {params}).then(res => res.data)

// 维护记录 --审核
export const auditFixed = params => axios.put('v2/fixed/' + params.id, params).then(res => res.data)

// 维护记录 -- 添加维护记录
export const addFixed = params => axios.post('v2/fixed', params).then(res => res.data)

// 运维人员 编辑用户
export const updateUser = params => axios.put('api/user/' + params.userName, params).then(res => res.data)

// 运维人员 添加用户
export const addUser = params => axios.post('api/user', params, params).then(res => res.data)

// 运维人员 获取用户
export const getUser = params => axios.get('api/user/' + params.userName, {params}).then(res => res.data)

// 运维人员 获取用户列表
export const getUsers = params => axios.get('api/user', {params}).then(res => res.data)

// 设备部分 设备列表
export const getDevices = params => axios.get('api/device', {params}).then(res => res.data)

// 智能监控 -- 获取区域
export const getArea = params => axios.get('v2/area', {params}).then(res => res.data)

// 智能监控 -- 获取项目
export const getProject = params => axios.get('v2/project', {params}).then(res => res.data)

// 智能监控 -- 添加项目
export const addProject = params => axios.post('v2/project', params).then(res => res.data)

// 智能监控 -- 修改项目
export const updateProject = params => axios.put('v2/project/' + params.id, params).then(res => res.data)

// 设备详情 日志
export const getDevice = params => axios.get('api/device/' + params.deviceName, {params}).then(res => res.data)

// 设备详情 重启设备
export const controlDevice = params => axios.put('api/device/control/' + params.deviceName, params).then(res => res.data)

// 设备详情 删除设备，设备下线
export const deleteDevice = params => axios.delete('api/device/' + params.deviceName).then(res => res.data)

// 设备修改
export const putDevice = params => axios.put('api/device/' + params.deviceName, params).then(res => res.data)

// 设备详情 请求设备日志部分图表部分
export const deviceLogData = params => axios.get('api/deviceLog/' + params.deviceName, {params}).then(res => res.data)

// 设备详情，报警图表
export const getDeviceWarning = params => axios.get('api/device/analysis/' + params.deviceName, {params}).then(res => res.data)

// 设备想起 日志表格
export const getDeviceLog = params => axios.get('api/device/log/' + params.deviceName, {params}).then(res => res.data)

export const getOta = params => axios.get('api/ota/' + params.id, {params}).then(res => res.data)

export const getOtas = params => axios.get('api/ota', {params}).then(res => res.data)

export const editOta = (params, id) => {
  let parameters = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  if (id) {
    return axios.post('api/ota/' + id, params, parameters).then(res => res.data)
  } else {
    return axios.post('api/ota', params, parameters).then(res => res.data)
  }
}
