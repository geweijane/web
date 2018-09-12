<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 1rem;">
    <template v-for="item in data">
      <el-breadcrumb-item :key="item.title" v-if="item.to" :to="item.to">
        <i v-if="item.iconClass" :class="'text-large ' + item.iconClass"></i>{{item.title}}
      </el-breadcrumb-item>
      <el-breadcrumb-item :key="item.title" v-else>{{item.title}}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>
<script>
export default {
  name: 'breadcrumb',
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
