<template>
  <el-upload :action="apiBase + apiUrl" ref="upload" name="upfile" :multiple="multiple" :on-change="handleChange" :auto-upload="autoUpload" :on-error="handlerError" :on-success="handlerSuccess" :on-remove="removeFile" :headers="headers" :before-upload="beforeUpload">
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    <div class="el-upload__tip" slot="tip">只能上传{{Object.keys(fileType).join('/')}}文件，且不超过{{fileSize}} MB<br/>
      <el-alert :title="errorMsg" type="error" show-icon v-if="errorMsg">
      </el-alert>
    </div>
  </el-upload>
</template>
<script>
import {apiBase, catchError} from '@/api/api'
export default {
  name: 'fileUpload',
  data () {
    // 获取用户token
    function getToken () {
      let user = localStorage.getItem('user')
      if (user) {
        user = JSON.parse(user)
      }
      if (!user || !user.token) {
        user = {token: ''}
      }
      return user.token
    }
    return {
      apiBase: apiBase,
      errorMsg: '',
      headers: {'x-token': getToken()}
    }
  },
  props: {
    apiUrl: {
      type: String,
      default () {
        return 'file/ueditor?action=uploadfile'
      }
    },
    fileSize: {
      type: Number,
      default () {
        // 单位MB
        return 2
      }
    },
    fileType: {
      type: Object,
      default () {
        return {
          'JPG': 'image/jpeg',
          'PNG': 'image/png'
        }
      }
    },
    multiple: {
      type: Boolean,
      default () {
        return true
      }
    },
    autoUpload: {
      type: Boolean,
      default () {
        return false
      }
    },
    deleteFile: {
      type: Function
    }
  },
  methods: {
    submitUpload () {
      this.$refs.upload.submit()
    },
    clearFiled () {
      this.$refs.upload.clearFiles()
      this.errorMsg = ''
    },
    removeFile (file, fileList) {
      if (file.response) {
        this.deleteFile && (this.deleteFile({path: file.response.url}))
      }
    },
    handlerError (e) {
      catchError(e, this)
    },
    beforeUpload (file) {
      this.errorMsg = ''
      const isJPG = Object.values(this.fileType).findIndex(n => n === file.type) !== -1
      const isLt2M = file.size / 1024 / 1024 < this.fileSize
      if (!isJPG) {
        this.errorMsg = '上传文件只能是 ' + Object.keys(this.fileType) + ' 格式!'
      }
      if (!isLt2M) {
        this.errorMsg = '上传文件大小不能超过 ' + this.fileSize + 'MB!'
      }
      if (this.errorMsg) {
        window.setTimeout(() => { this.errorMsg = '' }, 3000)
      }
      return isJPG && isLt2M
    },
    handlerSuccess (response, file, fileList) {
      if (response.url) {
        file.name = response.url
        this.$emit('uploadSuccess', response.url)
      }
    },
    handleChange (file, fileList) {
      if (!this.multiple && fileList.length > 1) {
        fileList.splice(0, 1)
      }
      return fileList
    }
  },
  mounted () {
  }
}
</script>
