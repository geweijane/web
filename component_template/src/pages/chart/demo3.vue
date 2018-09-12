<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <b>{{title}}</b>
    </div>
    <el-row>
      <el-col :span="24">
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: 'chart-demo1',
  data () {
    return {
      title: this.$route.meta.title
    }
  }
}
</script>
