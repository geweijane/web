import {baiduAk} from '@/api/api'
const actions = {
  loadMap () {
    // 导入地图包
    let ak = baiduAk
    return new Promise(function (resolve, reject) {
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=_init'
      script.addEventListener('load', function () {
        window._init = function () {
          resolve()
        }
      })
      script.addEventListener('error', reject)
      document.head.appendChild(script)
    })
  },
  loadUtils () {
    // 导入地图搜索包
    return new Promise(function (resolve, reject) {
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js'
      script.addEventListener('load', resolve)
      script.addEventListener('error', reject)
      document.head.appendChild(script)
    })
  }
}
export default {
  actions
}
