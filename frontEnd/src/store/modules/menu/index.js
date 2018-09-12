import other from './other'
import home from './home'
import warning from './warning'
import repair from './repair'
import device from './device'
import user from './user'
import ota from './ota'
let state = {
  // 所有菜单项
  item: [home, device, warning, repair, user, ota],
  // 非菜单
  other: other.router
}

export default {
  state
}
