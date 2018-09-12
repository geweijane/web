var http = require('http')
var querystring = require('querystring')
var archiver = require('archiver')
var fs = require('fs')
var nodemailer = require('nodemailer')
var spawn = require('child_process').spawn

var urls = []
var count = 0
var max = 0
var token = ''

login()
function login () {
  var postData = querystring.stringify({
    'password': '123456'
  })
  var options = {
    hostname: 'www.huajian.com',
    port: 80,
    path: '/api/auth/admin',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }
  sendReq(options, postData, function (data) {
    token = data.data.token
    getUrls()
  })
}
function getUrls () {
  var options = {
    hostname: 'www.huajian.com',
    port: 80,
    path: '/api/device?per_page=9999',
    method: 'GET',
    headers: {
      'x-token': token
    }
  }
  sendReq(options, function (data) {
    for (var index = 0; index < data.data.length; index++) {
      urls.push('http://www.huajian.com/project/0/device/' + data.data[index].deviceName)
    }
    max = urls.length
    if (max !== 0 && !!token) {
      capture(urls[0])
    }
  })
}
function generatePath (url) {
  // var len = 32
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  // var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  // var maxPos = chars.length
  var pwd = './capture/' + dateFormat('Ymd') + '/'
  // for (var i = 0; i < len; i++) {
  //   pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  // }
  // if (!fs.existsSync(pwd)) {
  //   fs.mkdirSync(pwd)
  // }
  // pwd += dateFormat('Ymd') + '/'
  // if (!fs.existsSync(pwd)) {
  //   fs.mkdirSync(pwd)
  // }
  var ele = url.split('/')
  pwd += ele[ele.length - 1] + '.jpg'
  return pwd
}
function capture (url) {
  var picPath = generatePath(url)
  var process = spawn('phantomjs', ['capture.js', url, picPath, token], {
    cwd: './'
  })
  process.stdout.setEncoding('utf8')
  process.stdout.on('data', function (data) {
  })
  process.stderr.on('data', function (data) {
    console.log('stderr' + data)
  })
  process.on('close', function (code) {
    if (code === 1) {
      // console.log(code, url);
    }
  })
  process.on('exit', function (code) {
    count++
    if (count !== urls.length) {
      capture(urls[count])
    } else {
      zip()
      mail()
    }
  })
}
function sendReq (options, postData, callback) {
  if (typeof (postData) === 'function') {
    callback = postData
    postData = null
  }
  var req = http.request(options, function (res) {
    var result = ''
    res.setEncoding('utf8')
    res.on('data', function (chunk) {
      result += chunk
    })
    res.on('end', () => {
      var data = JSON.parse(result)
      if (typeof (data) === 'object') {
        callback(data)
      }
    })
  })
  req.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`)
  })
  if (postData) {
    req.write(postData)
  }
  req.end(function () {
    // console.log('连接关闭');
  })
}
function dateFormat (format, timestamp) {
  var jsdate, f
  // Keep this here (works, but for code commented-out below for file size reasons)
  // var tal= [];
  var txtWords = [
    'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  // trailing backslash -> (dropped)
  // a backslash followed by any character (including backslash) -> the character
  // empty string -> empty string
  var formatChr = /\\?(.?)/gi
  var formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s
  }
  var _pad = function (n, c) {
    n = String(n)
    while (n.length < c) {
      n = '0' + n
    }
    return n
  }
  f = {
    // Day
    d: function () {
      // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2)
    },
    D: function () {
      // Shorthand day name; Mon...Sun
      return f.l()
        .slice(0, 3)
    },
    j: function () {
      // Day of month; 1..31
      return jsdate.getDate()
    },
    l: function () {
      // Full day name; Monday...Sunday
      return txtWords[f.w()] + 'day'
    },
    N: function () {
      // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7
    },
    S: function () {
      // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j()
      var i = j % 10
      if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
        i = 0
      }
      return ['st', 'nd', 'rd'][i - 1] || 'th'
    },
    w: function () {
      // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay()
    },
    z: function () {
      // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j())
      var b = new Date(f.Y(), 0, 1)
      return Math.round((a - b) / 864e5)
    },

    // Week
    W: function () {
      // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3)
      var b = new Date(a.getFullYear(), 0, 4)
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2)
    },

    // Month
    F: function () {
      // Full month name; January...December
      return txtWords[6 + f.n()]
    },
    m: function () {
      // Month w/leading 0; 01...12
      return _pad(f.n(), 2)
    },
    M: function () {
      // Shorthand month name; Jan...Dec
      return f.F()
        .slice(0, 3)
    },
    n: function () {
      // Month; 1...12
      return jsdate.getMonth() + 1
    },
    t: function () {
      // Days in month; 28...31
      return (new Date(f.Y(), f.n(), 0))
        .getDate()
    },

    // Year
    L: function () {
      // Is leap year?; 0 or 1
      var j = f.Y()
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0
    },
    o: function () {
      // ISO-8601 year
      var n = f.n()
      var W = f.W()
      var Y = f.Y()
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0)
    },
    Y: function () {
      // Full year; e.g. 1980...2010
      return jsdate.getFullYear()
    },
    y: function () {
      // Last two digits of year; 00...99
      return f.Y()
        .toString()
        .slice(-2)
    },

    // Time
    a: function () {
      // am or pm
      return jsdate.getHours() > 11 ? 'pm' : 'am'
    },
    A: function () {
      // AM or PM
      return f.a()
        .toUpperCase()
    },
    B: function () {
      // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2
      // Hours
      var i = jsdate.getUTCMinutes() * 60
      // Minutes
      // Seconds
      var s = jsdate.getUTCSeconds()
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3)
    },
    g: function () {
      // 12-Hours; 1..12
      return f.G() % 12 || 12
    },
    G: function () {
      // 24-Hours; 0..23
      return jsdate.getHours()
    },
    h: function () {
      // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2)
    },
    H: function () {
      // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2)
    },
    i: function () {
      // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2)
    },
    s: function () {
      // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2)
    },
    u: function () {
      // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6)
    },

    // Timezone
    e: function () {
      var msg = 'Not supported (see source code of date() for timezone on how to add support)'
      throw new Error(msg)
    },
    I: function () {
      var a = new Date(f.Y(), 0)
      // Jan 1
      var c = Date.UTC(f.Y(), 0)
      // Jan 1 UTC
      var b = new Date(f.Y(), 6)
      // Jul 1
      // Jul 1 UTC
      var d = Date.UTC(f.Y(), 6)
      return ((a - c) !== (b - d)) ? 1 : 0
    },
    O: function () {
      var tzo = jsdate.getTimezoneOffset()
      var a = Math.abs(tzo)
      return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4)
    },
    P: function () {
      // Difference to GMT w/colon; e.g. +02:00
      var O = f.O()
      return (O.substr(0, 3) + ':' + O.substr(3, 2))
    },
    T: function () {
      return 'UTC'
    },
    Z: function () {
      // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60
    },

    // Full Date/Time
    c: function () {
      // ISO-8601 date.
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb)
    },
    r: function () {
      // RFC 2822
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb)
    },
    U: function () {
      // Seconds since UNIX epoch
      return jsdate / 1000 | 0
    }
  }

  var _date = function (format, timestamp) {
    jsdate = (timestamp === undefined ? new Date() // Not provided
      : (timestamp instanceof Date) ? new Date(timestamp) // JS Date()
        : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    )
    return format.replace(formatChr, formatChrCb)
  }

  return _date(format, timestamp)
}
function zip () {
  var path = './capture/' + dateFormat('Ymd') + '.zip'
  var output = fs.createWriteStream(path)
  var archive = archiver('zip', {
    zlib: {
      level: 9
    }
  })
  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes')
  })
  output.on('end', function () {
    console.log('Data has been drained')
  })
  archive.on('error', function (err) {
    throw err
  })
  archive.pipe(output)
  archive.directory('./capture/' + dateFormat('Ymd') + '/', false)
  archive.finalize()
}
function mail () {
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    host: 'smtp.yunyou.top',
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'pengweifu@uascent-iot.com', // generated ethereal user
      pass: 'ua180508' // generated ethereal password
    }
  })

  // setup email data with unicode symbols
  var mailOptions = {
    from: '"彭维富" <pengweifu@uascent-iot.com>', // sender address
    to: 'pengweifu@uascent-iot.com', // list of receivers
    subject: '永州电气项目设备定时截图', // Subject line
    text: '永州电气项目设备定时截图', // plain text body
    // html: '<b>Hello world?</b>' // html body
    attachments: [{
      filename: dateFormat('Ymd') + '.zip',
      path: './capture/' + dateFormat('Ymd') + '.zip'
    }
    ]
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: %s', info.messageId)
  })
}
