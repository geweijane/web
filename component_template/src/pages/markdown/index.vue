<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <b>{{title}}</b>
    </div>
    <el-row>
      <el-col :span="24" style="height: 25rem;">
        <markdown :mdValuesP="content" :fullPageStatusP="false" :editStatusP="false" :previewStatusP="false" :navStatusP="true" :icoStatusP="true" @childevent="childEventHandler"></markdown>
      </el-col>
      <el-col :span="24">
        <el-collapse v-model="activeNames" style="margin-top: 1rem;">
          <el-collapse-item title="依赖包" name="1">
            <el-alert title="markdown安装依赖" :closable="false">
              <div slot>
                markdown组件在使用前我们需要安装以下依赖包才能运行。<br/>
                marked 是一款转码工具，他能避免代码内容比HTML或者js转义<br/>
                vue-scroll 是vue的滚动条工具<br/>
                highlight.js 是代码高亮工具<br/>
              </div>
            </el-alert>
            <pre v-highlight class="cmd">
npm install marked
npm install vue-scroll
npm install highlight.js
            </pre>
          </el-collapse-item>
          <el-collapse-item title="使用" name="2">
            <el-alert title="vue html使用" :closeable="false">
              <div slot>
                组件高度给予组件的父元素一个确定的height值
              </div>
            </el-alert>
            <pre v-highlight class="html" content='<markdown :mdValuesP="content"
:fullPageStatusP="false" :editStatusP="false" :previewStatusP="false" :navStatusP="true" :icoStatusP="false"
@childevent="childEventHandler"></markdown>'>
            </pre>
            <el-alert title="vue js的使用" :closeable="false">
              <div slot>
                使用markdown需先引入组件，然后使用组件,<br/>
                绑定childevent事件可以监听到mardown实时内容更改。他将返回一个对象，包含mdValue和htmlValue属性。<br/>
                mdValue属性指向输入的数据，htmlValue属性指向的是html最终展示结果。
              </div>
            </el-alert>
            <pre v-highlight class="js">
import Markdown from 'components/markdown/markdown'
...
components: {
  Markdown
},
methods: {
// 监听事件，接收子组件传过来的数据
  childEventHandler (res) {
    // res会传回一个data,包含属性mdValue和htmlValue，具体含义请自行翻译
    this.content = res.mdValue
  }
}
...
            </pre>
          </el-collapse-item>
          <el-collapse-item title="API" name="3">
            <h5>属性</h5>
            <el-table :data="apiAttr" border style="width: 100%">
              <el-table-column prop="arg" label="参数">
              </el-table-column>
              <el-table-column prop="desc" label="说明">
              </el-table-column>
              <el-table-column prop="type" label="类型">
              </el-table-column>
              <el-table-column prop="options" label="可选值">
              </el-table-column>
              <el-table-column prop="default" label="默认值">
              </el-table-column>
            </el-table>
            <h5>事件</h5>
            <el-table :data="apiEvent" border style="width: 100%">
              <el-table-column prop="arg" label="参数">
              </el-table-column>
              <el-table-column prop="desc" label="说明">
              </el-table-column>
              <el-table-column prop="type" label="类型">
              </el-table-column>
              <el-table-column prop="options" label="可选值">
              </el-table-column>
              <el-table-column prop="default" label="默认值">
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import Markdown from 'components/markdown/markdown'

export default {
  components: {
    Markdown
  },
  name: 'markdown-demo',
  data () {
    return {
      title: this.$route.meta.title,
      content: '',
      activeNames: ['1', '2', '3'],
      apiEvent: [
        {arg: 'childevent', desc: '监听实时内容改变', type: 'Function ({mdValue, htmlValue})', options: '--', default: '--'}
      ],
      apiAttr: [
        {arg: 'mdValuesP', desc: '默认内容值', type: 'String', options: '--', default: '--'},
        {arg: 'fullPageStatusP', desc: '是否默认全屏视图', type: 'Boolean', options: '--', default: '--'},
        {arg: 'editStatusP', desc: '是否默认编辑视图', type: 'Boolean', options: '--', default: '--'},
        {arg: 'previewStatusP', desc: '是否默认预览视图', type: 'Boolean', options: '--', default: '--'},
        {arg: 'navStatusP', desc: '是否显示操作栏', type: 'Boolean', options: '--', default: '--'},
        {arg: 'icoStatusP', desc: '是否显示markdown相关信息', type: 'Boolean', options: '--', default: '--'}
      ]
    }
  },
  computed: {
  },
  methods: {
    // 监听事件，接收子组件传过来的数据
    childEventHandler (res) {
      // res会传回一个data,包含属性mdValue和htmlValue，具体含义请自行翻译
      this.content = res.mdValue
    }
  }
}
</script>
