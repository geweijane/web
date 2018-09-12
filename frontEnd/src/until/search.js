export default {
  data () {
    return {
      filterData: {},
      searchData: {},
      rules: {},
      page: 1,
      total: 0,
      pageSize: 20,
      parseData: { // 过滤数据拆分
        date: ['start', 'end']
      },
      listTimer: null
    }
  },
  computed: {
    path () {
      return this.$route.path
    },
    params () {
      return this.$route.query
    },
    search () {
      let temp = []
      let filter = this.filter
      for (let index in filter) {
        if (this.parseData[index] && filter[index].length !== 0) {
          this.parseData[index].forEach((n, i) => {
            temp.push(n + '=' + filter[index][i])
          })
        } else {
          temp.push(index + '=' + filter[index])
        }
      }
      return temp.length === 0 ? '' : '?' + temp.join('&')
    },
    filter: {
      set (data) {
        let temp = {...this.filterData, ...data}
        for (let index in temp) {
          if (temp[index] === '' || temp[index] === null) {
            delete temp[index]
          }
        }
        temp.page && (delete temp.page)
        this.filterData = temp
      },
      get () {
        let temp = {}
        this.page !== 1 && (temp.page = this.page)
        return {...this.filterData, ...temp}
      }
    }
  },
  methods: {
    removeFilter () {
      this.filterData = {}
    },
    pageChange (page) {
      this.page = page
      this.getList()
    },
    searchList (formName) {
      this.$refs[formName].validate(valid => {
        this.filter = this.searchData
        this.firstPage()
      })
    },
    firstPage () {
      if (parseInt(this.page) === 1) {
        this.setList()
      } else {
        this.page = 1
      }
    },
    setList () {
      if (this.listTimer) {
        clearTimeout(this.listTimer)
        this.listTimer = null
      }
      this.listTimer = setTimeout(() => this.getList(), 100)
    },
    setPath () {
      // 这里有bug，需要更改
      this.$router.push({path: this.path + this.search})
    },
    initFilter () {
      let temp = {}
      let params = this.params
      let _value = Object.values(this.parseData)
      let _key = Object.keys(this.parseData)
      for (let index in params) {
        let i = _value.findIndex(n => n.findIndex(m => m === index) !== -1)
        if (i !== -1) {
          !temp[_key[i]] && (temp[_key[i]] = [])
          temp[_key[i]].push(params[index])
        } else {
          temp[index] = params[index]
        }
      }
      this.filterData = {}
      this.filter = temp
      this.searchData = {...this.searchData, ...temp}
    }
  },
  beoforeMount () {
    this.initFilter()
  }
}
