<template>
  <el-aside width="22rem" class="slideBar">
    <el-menu :default-active="activeClass">
      <el-menu-item-group v-for="(item, index) in menu" :key="item.path + index">
        <div slot="title" class="text-primary level-1">
          <i :class="item.meta.iconClass"></i>
          <span>{{item.meta.title}}</span>
        </div>
        <template v-if="item.children">
          <el-menu-item style="height: 40px;padding: 0;" v-for="subItem in item.children" :key="'/' + subItem.path" :index="'/' + subItem.path">
            <a v-if="subItem.meta.redirect" :href="subItem.meta.outLink" target="_blank" activeClass="activeMenu" class="menu-link">{{subItem.meta.title}}</a>
            <router-link v-else :to="'/' + subItem.path" activeClass="activeMenu" class="menu-link">{{subItem.meta.title}}</router-link>
          </el-menu-item>
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
  },
  computed: {
    ...mapGetters({menu: 'menuItem'})
  },
  methods: {
  },
  beforeMount () {
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
.menu-link{
  padding-left: 20px;
  height: 40px;
  line-height: 40px;
  display: block;
  &.activeMenu{
    color: #409EFF;
    background: #ecf5ff;
  }
  &:hover{
    color: #409EFF;
  }
}
</style>
