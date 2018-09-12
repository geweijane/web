<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <b>{{title}}</b>
    </div>
    <el-row>
      <el-col :span="24">
        <el-alert title="highlight之vue组件" :closable="false">
          <div slot>
            highlight 的vue组件是通过注册vue指令来完成的。所以我们在使用时针对 <span class="text-primary">pre</span> 标签添加 <span class="text-primary">v-highlight</span> 的指令<br/>
            另，需要针对pre添加class来针对你要高亮代码的语言类别。<br/>
            需要高亮的语言放到pre标签内的html，若有vue要执行解释的代码可以放在pre的content属性内，注意因为vue的缘故content中使用转义符'\'无用，请将" 的转码符,具体详见示例<br/>
            highlight 需要在 <span class="text-primary">main.js</span> 内引入组件。
          </div>
        </el-alert>
        <pre v-highlight class="js">
import 'components/highlight'
        </pre>
        <pre v-highlight class="html" content="
// 使用方法一
<pre v-highlight class=&#34;js&#34;>
import 'components/highlight'
</pre>

// 使用方法二
<pre v-highlight class=&#34;html&#34; content=&#34;
  <pre v-highlight class=&#34;js&#34;>
    import 'components/highlight'
  </pre>&#34;>
</pre>">
        </pre>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: 'highlight-demo',
  data () {
    return {
      title: this.$route.meta.title
    }
  }
}
</script>
