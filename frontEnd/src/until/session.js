export default {
  data () {
    let session = sessionStorage.getItem('sliderData')
    return {
      session: session ? JSON.parse(session) : [],
      isEdit: JSON.parse(sessionStorage.getItem('user')).ismanager,
      role: parseInt(JSON.parse(sessionStorage.getItem('user')).role)
    }
  },
  methods: {
    changeSession (val) {
      if (val === null || val === undefined || val === '') {
        this.session = []
        this.setSession()
      } else {
        let session = this.session
        let arr = [...session]
        let index = arr.reverse().findIndex(n => n.id === parseInt(val))
        if (index !== -1) {
          this.session = session.splice(0, session.length - index)
          this.setSession()
        } else {
          this.session = JSON.parse(sessionStorage.getItem('sliderData'))
        }
      }
    },
    setSession () {
      sessionStorage.setItem('sliderData', JSON.stringify(this.session))
    },
    addSession (item, path) {
      let index = this.session.findIndex(n => {
        if (item.area) {
          return n.area === item.area && n.id === item.id
        } else if (item.deviceName) {
          return n.deviceName === item.deviceName
        } else {
          return n.id === item.id
        }
      })
      if (index === -1) {
        this.session.push(item)
        this.setSession()
      }
      path && (this.$router.push({path: path}))
    }
  }
}
