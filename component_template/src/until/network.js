export const networkObj = {
  // 网络类型为wifi
  wifi: {
    network: 'wifi',
    type: 'wifi',
    name: 'WiFi'
  },
  gprs: {
    network: 'gprs',
    type: 'wifi',
    name: 'WiFi-移动网络'
  },
  // 网络类型为蓝牙
  bluetooth: {
    network: 'bluetooth',
    type: 'bluetooth',
    name: '蓝牙'
  },
  // 网络类型为网关
  wifigate: {
    network: 'wifigate',
    type: 'gateway',
    name: '网关-wifi'
  },
  mobileNet: {
    network: 'gprsgate',
    type: 'gateway',
    name: '网关-移动网络'
  }
}
// 开发者类型
export const developerType = {
  all: {
    name: '所有开发者',
    value: 'all'
  },
  person: {
    name: '个人开发者',
    value: 'person'
  },
  company: {
    name: '企业/机构开发者',
    value: 'company'
  }
}
