import {getWarnings} from '@/api/api'
export default {
  data () {
    return {
      status: 0,
      total: 0,
      disable: localStorage.getItem('notifyDisabled') ? JSON.parse(localStorage.getItem('notifyDisabled')) : [],
      notifyData: [],
      notifyPlay: false,
      timer: null
    }
  },
  computed: {
  },
  methods: {
    getWarnings () {
      getWarnings({status: this.status, per_page: 3}).then(datas => {
        let {errno, data} = datas
        if (errno === 0 && data.length !== 0) {
          this.setNotify(data)
        }
      })
    },
    setNotify (data) {
      this.notifyPlay = false
      for (let i = 0; i < data.length; i++) {
        let temp = data[i]
        if (this.disable.findIndex(n => n === temp.id) === -1) {
          if (this.notifyData.findIndex(n => n.id === temp.id) === -1 && this.notifyData.length < 3) {
            setTimeout(() => {
              this.notifyPlay = true
              let notify = this.$notify({
                title: '提示',
                message: temp.title,
                duration: 0,
                customClass: 'warningNotify',
                offset: 100,
                type: 'error',
                onClose: () => {
                  this.setDisabled(temp)
                },
                onClick: () => {
                  this.$router.push({path: '/warning'})
                  notify.close()
                }
              })
              this.notifyData.push(temp)
            }, 300 * (i + 1))
          }
        }
      }
    },
    setDisabled (data) {
      if (this.timer) {
        this.disable.push(data.id)
        let index = this.notifyData.findIndex(n => n.id === data.id)
        this.notifyData.splice(index, 1)
        localStorage.setItem('notifyDisabled', JSON.stringify(this.disable))
      }
    },
    initNotify () {
      this.getWarnings()
      this.timer = setInterval(() => {
        this.getWarnings()
      }, 30 * 1000)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
    this.$notify.closeAll()
  }
}
