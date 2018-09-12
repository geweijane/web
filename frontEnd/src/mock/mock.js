import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Mock from 'mockjs'
export default {
  callback (data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, data])
      }, 1000)
    })
  },
  bootstrap () {
    let mock = new MockAdapter(axios)
    // 用户图片验证码接口
    mock.onGet('/auth/verify').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, { code: Mock.Random.integer(1000, 9999) }])
        }, 1000)
      })
    })
    // 用户登录接口
    mock.onPut(/auth\/(?:\w+$)/).reply(config => {
      let errno = 0
      let msg = 'success'
      let data = {
        current: 1,
        timeout: 1526469295,
        token: 'Hfe5BxF7cuC07nMDkFsZ6FmiRf65l3HNLS7ajiewocc=',
        userName: 'aaaa'
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, { errno, msg, data }])
        }, 1000)
      })
    })
    // 首页获取城市
    mock.onGet(/city/).reply(config => {
      let errno = 0
      let msg = 'success'
      let data = ['永州市', '长沙市']
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {errno, data, msg}])
        }, 1000)
      })
    })
    // 首页 系统概括
    mock.onGet(/analysis\/system/).reply(config => {
      let errno = 0
      let msg = 'success'
      let data = {
        role: Mock.Random.integer(10, 20),
        device: Mock.Random.integer(20, 50),
        warning: Mock.Random.integer(10, 20),
        safeguard: Mock.Random.integer(10, 20)
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {errno, data, msg}])
        }, 1000)
      })
    })
    // 首页 设备
    mock.onGet(/analysis\/device/).reply(config => {
      let errno = 0
      let msg = 'success'
      let data = [
        {name: '正常', value: Mock.Random.integer(50, 200)},
        {name: '报警', value: Mock.Random.integer(10, 50)},
        {name: '离线', value: Mock.Random.integer(10, 50)}
      ]
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {errno, data, msg}])
        }, 1000)
      })
    })
    // 首页 报警
    mock.onGet(/analysis\/warning/).reply(config => {
      let errno = 0
      let msg = 'success'
      let data = [
        {name: '温度', value: Mock.Random.integer(50, 200)},
        {name: '漏电', value: Mock.Random.integer(10, 50)}
      ]
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {errno, data, msg}])
        }, 1000)
      })
    })
    // 报警消息，列表
    mock.onGet(/warning/).reply(config => {
      let errno = 0
      let msg = 'success'
      let data = []
      let pageSize = config.params.per_page
      for (let i = 0; i < pageSize; i++) {
        data.push({
          deviceName: Mock.Random.cname(),
          productName: Mock.Random.cname()
        })
      }
      return this.callback({errno, msg, data})
    })
    // 维护记录，列表
    mock.onGet(/repair/).reply(config => {
      let errno = 0
      let msg = 'success'
      let data = []
      let pageSize = config.params.per_page
      for (let i = 0; i < pageSize; i++) {
        data.push({
          deviceName: Mock.Random.cname(),
          productName: Mock.Random.cname()
        })
      }
      return this.callback({errno, msg, data})
    })
  }
}
