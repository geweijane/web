import other from './other'
import menu from './menu'
import chart from './chart'
let state = {
  // 所有菜单项
  item: [menu, chart],
  // 非菜单
  other: other.router
}

export default {
  state
}
