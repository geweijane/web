import axios from 'axios';

export const apiBase = 'http://192.168.2.95:3010/api/';

axios.defaults.baseURL = apiBase;
// axios.interceptors.request.use(
//   config =>
//     // if (store.state.auth) {
//     //   config.headers['x-token'] = store.state.auth.token;
//     // }
//     // if (config.method.toLocaleLowerCase() === 'get') {
//     //   if (config.params === undefined) {
//     //     config.params = {};
//     //   }
//     //   config.params.timer = new Date().getTime();
//     // }
//     config
//   ,
//   err => Promise.reject(err),
// );

axios.interceptors.response.use(
  (response) => {
    if (parseInt(response.data.code, 10) === 0) {
      return response;
    }
    switch (response.data.code) {
      case '401':
      case '403':
        break;
      default:
        break;
    }
    const error = new Error(response.data.msg);
    return Promise.reject(error);
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
        case 403:
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  },
);
// 新增固件类型
export const addOtaType = params => axios.post('otatype', params).then(res => res.data);
// 编辑固件类型
export const editOtaType = params => axios.put(`otatype/${params.id}`, params).then(res => res.data);
// 删除固件类型
export const deleteOtaType = params => axios.delete(`otatype/${params.id}`).then(res => res.data);
// 获取单个固件类型
export const getOtaType = params => axios.get(`otatype/${params.id}`).then(res => res.data);
// 获取固件类型列表
export const listOtaType = params => axios.get('otatype', { params }).then(res => res.data);
// 新增固件
export const addOta = params => axios.post('ota', params).then(res => res.data);
// 编辑固件
export const editOta = params => axios.put(`ota/${params.id}`, params).then(res => res.data);
// 删除固件
export const deleteOta = params => axios.delete(`ota/${params.id}`).then(res => res.data);
// 获取单个固件
export const getOta = params => axios.get(`ota/${params.id}`).then(res => res.data);
// 获取固件列表
export const listOta = params => axios.get('ota', { params }).then(res => res.data);
// 新增芯片
export const addChip = params => axios.post('chip', params).then(res => res.data);
// 验证升级
export const upgrade = params => axios.get('upgrade', { params }).then(res => res.data);
// 芯片列表
export const listChip = () => axios.get('chip').then(res => res.data);
// 芯片编辑
export const editChip = params => axios.put(`chip/${params.chip}`, params).then(res => res.data);
