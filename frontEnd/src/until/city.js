
export default {
  data () {
    return {
      districtOption: [],
      cityData: []
    }
  },
  computed: {
    allCity () {
      let temp = {}
      for (let i = 0; i < this.cityData.length; i++) {
        let t = this.cityData[i]
        temp[t.id] = t
      }
      for (let i in temp) {
        let t = temp[i]
        if (temp[t.parentId]) {
          if (!temp[t.parentId].children) {
            temp[t.parentId].children = []
          }
          temp[t.parentId].children.push(t)
        }
      }
      temp = JSON.parse(JSON.stringify(temp))
      return temp
    },
    cityFilter: {
      set (data) {
        data = {...{title: [], level: ''}, ...data}
        let {title, level} = data
        let _city = JSON.parse(JSON.stringify(this.allCity))
        let temp = []
        if (title === '') {
          temp = Object.values(_city)
        } else {
          for (let i in _city) {
            if (title.findIndex(n => _city[i].title.indexOf(n) !== -1) !== -1) {
              temp.push(JSON.parse(JSON.stringify(_city[i])))
            }
          }
        }
        if (level === '') {
          this.districtOption = temp
        } else {
          this.districtOption = this.removeChildren(level, temp)
        }
      },
      get () {
        return this.districtOption
      }
    }
  },
  methods: {
    removeChildren (level, data) {
      let remove = (l, temp) => {
        for (let i = 0; i < temp.length; i++) {
          if (l === level) {
            delete temp[i].children
          } else {
            l++
            remove(l, temp[i].children)
          }
        }
        return temp
      }
      return remove(1, data)
    }
  }
}
