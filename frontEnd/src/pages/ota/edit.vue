<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <el-card shadow="never">
      <div slot="header">
        <b class="h4">{{$route.meta.title}}</b>
      </div>
      <el-form class="updateForm" labelWidth="7rem" ref="auditForm" v-if="id">
        <el-col :span="11">
          <el-form-item label="固件类型">
            <el-select  v-model="formData.type" placeholder="请选择" disabled>
              <el-option label="网络模块" :value="0"/>
              <el-option label="MCU" :value="1"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="版本号">
            <el-input v-model.trim="formData.version" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="固件">
            <el-input v-model.trim="formData.path" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="重传固件">
            <el-input type="file" @blur="fileChange" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="更新内容">
            <el-input type="textarea" :autosize="{minRows: 4}" v-model.trim="formData.content" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button class="btn-form" type="primary" @click="submitForm('auditForm')">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <el-form class="updateForm" labelWidth="7rem" ref="auditForm" v-else>
        <el-col :span="11">
          <el-form-item label="固件类型">
            <el-select  v-model="formData.type" placeholder="请选择">
              <el-option label="网络模块" :value="0"/>
              <el-option label="MCU" :value="1"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="上传固件">
            <el-input type="file" @blur="fileChange" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button class="btn-form" type="primary" @click="submitForm('auditForm')">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
  </el-main>
</template>
<script>
import Breadcrumb from 'components/until/breadcrumb'
import {catchError, getOta, editOta} from '@/api/api'
export default {
  components: {Breadcrumb},
  data () {
    return {
      id: this.$route.params.id,
      formData: {
        id: '',
        version: '',
        path: '',
        file: null,
        content: '',
        type: 0
      }
    }
  },
  computed: {
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'}
      ]
      if (temp.length === 1) {
        temp.push({title: '固件管理', to: '/ota'})
      }
      temp.push({title: this.$route.meta.title})
      return temp
    }
  },
  methods: {
    submitForm (formName) {
      if (this.formData.file) {
        let param = new FormData()
        param.append('type', this.formData.type)
        if (typeof this.formData.file === 'object') {
          param.append('file', this.formData.file, this.formData.file.name)
        }
        editOta(param, this.id).then(datas => {
          let {errno, msg} = datas
          if (errno === 0) {
            this.$message.success({
              message: msg,
              onClose: () => {
                this.$router.push({path: '/ota'})
              }
            })
          } else {
            this.$message.error(msg)
          }
        }).catch(e => catchError(e, this))
      } else {
        alert('请选择固件')
      }
    },
    fileChange (e) {
      this.formData.file = e.target.files[0]
    },
    getOta () {
      if (this.id) {
        getOta({id: this.id}).then(datas => {
          let {errno, msg, data} = datas
          if (errno === 0) {
            this.formData = data
          } else {
            this.$message.error(msg)
          }
        }).catch(e => catchError(e, this))
      }
    }
  },
  mounted () {
    this.getOta()
  }
}
</script>
