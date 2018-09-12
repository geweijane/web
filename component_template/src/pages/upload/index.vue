<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <b>{{title}}</b>
    </div>
    <el-row>
      <el-col :span="24">
        <el-form labelWidth="10rem" :model="formData">
          <el-form-item label="选择文件" required>
            <file-upload @uploadSuccess="handleSuccess" :deleteFile="deleteFile" :multiple="false"></file-upload>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" style="margin-top: 1rem;">
        <el-alert title="上传文件实例" :closable="false">
          <div slot>
            上传文件组件是基于element-ui的上传组件做的二次开发，他将上传文件所需的参数方法封装处理，便于在实际生产中使用
          </div>
        </el-alert>
        <pre v-highlight class="html" content='<file-upload @uploadSuccess="handleSuccess" :multiple="false"></file-upload>'></pre>
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
import FileUpload from 'components/upload/normal'

export default {
  components: {FileUpload},
  name: 'upload-demo',
  data () {
    return {
      title: this.$route.meta.title,
      formData: {
        file: ''
      },
      apiAttr: [
        {arg: 'apiUrl', desc: '上传请求地址', type: 'String', options: '--', default: 'file/ueditor?action=uploadfile'},
        {arg: 'fileSize', desc: '文件大小，单位MB', type: 'Number', options: '--', default: '2'},
        {arg: 'fileType', desc: '文件类型，数据格式和默认值差不多，key：文件类型，value: 文件格式', type: 'Object', options: '--', default: '{\'JPG\': \'image/jpeg\',\'PNG\': \'image/png\'}'},
        {arg: 'multiple', desc: '是否多文件上传, 若为false,则一次只能上传一个文件', type: 'Boolean', options: '--', default: 'true'},
        {arg: 'deleteFile', desc: '删除文件回调,用于做删除文件后台处理', type: 'Function({path})', options: '--', default: '--'}
      ],
      apiEvent: [
        {arg: 'uploadSuccess', desc: '上传成功的回调,', type: 'Function ({})', options: '--', default: '--'}
      ]
    }
  },
  methods: {
    handleSuccess (url) {
      this.formData.file = url
    },
    deleteFile ({path}) {
      console.log(path)
    }
  }
}
</script>
