<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <b>{{title}}</b>
    </div>
    <el-row>
      <el-col :span="24">
        <chart-type></chart-type>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import ChartType from 'components/chart/type1'

export default {
  components: {ChartType},
  name: 'chart-demo1',
  data () {
    return {
      title: this.$route.meta.title
    }
  }
}
</script>
