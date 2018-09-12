<template>
  <el-aside width="22rem" class="slideBar">
    <el-menu :default-active="activeClass" :router="true">
      <el-menu-item-group v-for="(item, index) in menu" :key="item.path + index">
        <div slot="title" class="text-primary level-1">
          <i :class="item.meta.iconClass"></i>
          <span>{{item.meta.title}}</span>
        </div>
        <template v-if="item.children">
          <el-menu-item style="height: 40px;line-height: 40px" v-for="subItem in item.children" :key="'/' + subItem.path" :index="'/' + subItem.path">{{subItem.meta.title}}</el-menu-item>
        </template>
      </el-menu-item-group>
    </el-menu>
  </el-aside>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'silderBar',
  data () {
    return {
      activeClass: ''
    }
  },
  watch: {
    '$route' (to) {
      this.activePath = to.path
    }
  },
  computed: {
    ...mapGetters({menu: 'menuItem'}),
    activePath: {
      set (toPath) {
        let className = toPath.slice(1)
        this.activeClass = '/' + (className.length === 0 ? '' : className.indexOf('/') === -1 ? className : className.substring(0, className.indexOf('/')))
      },
      get () {
        return ''
      }
    }
  },
  methods: {
  },
  beforeMount () {
    this.activePath = this.$route.path
  }
}
</script>
<style lang="less" scoped>
.slideBar{
  padding: 1rem;
  .level-1{
    font-size: 1.6rem;
    font-weight: bold;
  }
}
</style>
