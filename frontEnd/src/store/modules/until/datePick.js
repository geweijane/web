import moment from 'moment'
// 日期控件 状态值控制
export const pickerOptions1 = {
  disabledDate (time) {
    return moment(time).isAfter(moment())
  },
  shortcuts: [{
    text: '最近一周',
    onClick (picker) {
      const start = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
      const end = moment().format('YYYY-MM-DD HH:mm:ss')
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick (picker) {
      const start = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss')
      const end = moment().format('YYYY-MM-DD HH:mm:ss')
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick (picker) {
      const start = moment().subtract(3, 'months').format('YYYY-MM-DD HH:mm:ss')
      const end = moment().format('YYYY-MM-DD HH:mm:ss')
      picker.$emit('pick', [start, end])
    }
  }]
}
