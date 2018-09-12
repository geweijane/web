<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <b>{{title}}</b>
    </div>
    <el-row>
      <el-col :span="24">
        <u-editor :value="content" ref="ueditor" :config="editorConfig"></u-editor>
      </el-col>
      <el-col :span="24" style="margin-top: 1rem;">
        <el-alert :closable="false" title="vue使用ueditor">
          <div slot>
            ueditor 是百度的富文本编辑器，其配置详见<a target="_blank" href="http://fex.baidu.com/ueditor/#start-config" class="text-primary">ueditor 配置详情</a><br/>
            这里我们主要将ueditor封装成组件，将组件使用我们应该注意哪些方面<br/>
            使用ueditor 需要在<span class="text-primary">main.js</span> 中引入ueditor的相关文件
          </div>
        </el-alert>
        <pre v-highlight class="js">
// 配置百度编辑器
import 'static/ueditor/ueditor.config.js'
import 'static/ueditor/ueditor.all.min.js'
import 'static/ueditor/lang/zh-cn/zh-cn.js'
import 'static/ueditor/ueditor.parse.min.js'
        </pre>
        <el-alert :closable="false" title="">
          <div slot>
            下面是封装的组件在具体页面中的使用
          </div>
        </el-alert>
        <pre v-highlight class="html" content='<u-editor :value="content" ref="ueditor" :config="editorConfig"></u-editor>'>
        </pre>
        <pre v-highlight class="js">
import UEditor from 'components/ueditor/index'
...
components: {UEditor},
data () {
  return {
    content: '测试文字内容',
    editorConfig: {
      serverUrl: apiBase + '/file/ueditor',
      elementPathEnabled: false,
      initialFrameHeight: 400
    }
  }
},
methods: {
  getContent () {
    this.content = this.$refs.ueditor.getUEContent()
  }
}
...
        </pre>
        <h4>API</h4>
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
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import UEditor from 'components/ueditor/index'
import {apiBase} from '@/api/api'
export default {
  components: {UEditor},
  name: 'ueditor-demo',
  data () {
    return {
      title: this.$route.meta.title,
      content: '测试文字内容',
      editorConfig: {
        serverUrl: apiBase + '/file/ueditor',
        elementPathEnabled: false,
        initialFrameHeight: 400
      },
      apiAttr: [
        {arg: 'content', desc: '内容', type: 'String', options: '--', default: '--'},
        {arg: 'editorConfig', desc: '选填，基本配置文件中有，但是 serverUrl 最好要配置，详情参见ueditor配置文档', type: 'Object', options: '--', default: '--'},
        {arg: 'ref', desc: '必填，用于获取内容', type: 'String', options: '--', default: '--'}
      ],
      apiEvent: [
        {arg: 'getUEContent', desc: '获取内容，使用方法为this.$refs[ref].getUEContent()', type: 'String', options: '--', default: '--'}
      ]
    }
  },
  computed: {

  },
  methods: {
    getContent () {
      this.content = this.$refs.ueditor.getUEContent()
    }
  },
  mounted () {
  }
}
</script>
