var page = require('webpage').create() // 创建一个网页对象;
var system = require('system')
var address, fileName, token
page.viewportSize = { width: 1920, height: 2000 } // 设置窗口的大小为1024*800；
page.onConsoleMessage = function (msg, lineNum, sourceId) {
  console.log('msg', msg, lineNum, sourceId)
}
page.onUrlChanged = function (targetUrl) {
  console.log('New URL: ' + targetUrl)
}
if (system.args.length === 1) {
  console.log('Try to pass some args when invoking this script!')
  phantom.exit(1)
} else {
  address = system.args[1]
  fileName = system.args[2]
  token = system.args[3]
  var auth = {
    ismanager: 1,
    menu: 'Dashboard,People,Role,User,Product,ErrorDevice,Device,Analysis,Map,AnalysisDevie,AnalysisUser,System,Msg,Auth,Ota,outlineDevice',
    role: 3,
    timeout: 1933550615,
    token: token,
    userName: 'admin'
  }
  auth = JSON.stringify(auth)
  // 打开一个网页；
  page.open(address, function (status) {
    waitFor(function () {
      if (page.url === address) {
        return page.evaluate(function () {
          var loaded = window.sessionStorage.getItem('loaded')
          var canvas = document.getElementsByTagName('canvas')
          canvas = canvas ? canvas.length : 0
          return loaded && canvas
        })
      } else {
        var script1 = "function() {window.sessionStorage.setItem('user', '" + auth + "');window.sessionStorage.removeItem('loaded')}"
        page.evaluateJavaScript(script1)
        page.evaluate(function () {
          var auth = JSON.parse(window.sessionStorage.getItem('user'))
          if (!auth) {
            auth = {
              token: false
            }
          } else {
            window.history.back()
          }
          return auth.token
        })
      }
      return false
    }, function () {
      page.render(fileName, {
        format: 'jpeg',
        quality: '75'
      })
      page.close()
      phantom.exit()
    })
  })
}

function waitFor (testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis || 20000
  var start = new Date().getTime()
  var condition = false
  var interval = setInterval(function () {
    if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
      condition = (typeof (testFx) === 'string' ? eval(testFx) : testFx())
    } else {
      if (!condition) {
        console.log("'waitFor()' timeout")
        phantom.exit(1)
      } else {
        console.log("'waitFor()' finished in " + (new Date().getTime() - start) + 'ms.')
        typeof (onReady) === 'string' ? eval(onReady) : onReady()
        clearInterval(interval)
      }
    }
  }, 1000)
};
