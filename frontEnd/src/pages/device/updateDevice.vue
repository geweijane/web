<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <el-card shadow="never">
      <div slot="header">
        <b class="h4">设备配置</b>
      </div>
      <el-form class="updateForm" labelWidth="8rem" :model="formData" :rules="rules" ref="updateForm">
        <el-col :span="11">
          <el-form-item label="项目名称" prop="project">
            <el-select  v-model="formData.project" style="width: 100%;">
              <el-option v-for="item in options" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="温度阈限值" prop="maxTemp">
            <el-input v-model.trim="formData.maxTemp"></el-input>
          </el-form-item>
          <el-form-item label="漏电阈限值" prop="maxLeak">
            <el-input v-model.trim="formData.maxLeak"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="设备地址" prop="title">
            <el-input v-model.trim="formData.title"></el-input>
          </el-form-item>
          <el-form-item label="监测点性质" prop="nature">
            <el-select v-model="formData.nature" style="width: 100%;">
              <el-option v-for="(item, index) in natureOpts" :key="item" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button class="btn-form" type="primary" @click="submitForm('updateForm')">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
  </el-main>
</template>
<script>
import Breadcrumb from 'components/until/breadcrumb'
import sessionMixin from '@/until/session'
import {putDevice, catchError, getDevice, getProject} from '@/api/api'
export default {
  components: {Breadcrumb},
  mixins: [sessionMixin],
  name: 'updateDevice',
  data () {
    return {
      options: [],
      natureOpts: {
        0: '住宅楼',
        1: '工贸'
      },
      formData: {
        project: null,
        maxTemp: '',
        title: '',
        maxLeak: '',
        nature: null
      },
      rules: {
        project: [
          {required: true, message: '请选择项目名称', trigger: 'blur'}
        ],
        temperature: [
          {required: true, message: '请输入温度阈限值', trigger: 'blur'},
          {type: 'number', min: 0, max: 9000, message: '温度阈限值在0-9000之间', trigger: 'blur'}
        ],
        title: [
          {required: true, type: 'string', message: '请输入设备地址', trigger: 'blur'},
          {min: 2, max: 20, message: '设备地址长度在2-20个字符之间', trigger: 'blur'}
        ],
        leak: [
          {required: true, message: '请输入漏电流阈限值', trigger: 'blur'},
          {type: 'number', min: 0, max: 9000, message: '漏电流阈限值在0-9000之间', trigger: 'blur'}
        ],
        nature: [
          {required: true, message: '请选择监测点性质', trigger: 'blur'}
        ]
      },
      deviceId: this.$route.params.deviceId,
      path: '/project/' + this.$route.params.id + '/device/' + this.$route.params.deviceId,
      id: this.$route.params.id
    }
  },
  computed: {
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'},
        {title: '智能监控', to: '/project'}
      ]
      let session = this.session
      if (session) {
        for (let i = 0; i < session.length; i++) {
          if (session[i].area) {
            temp.push({title: session[i].title, to: '/project/' + session[i].id + '/device'})
          } else if (session[i].deviceName) {
            temp.push({title: session[i].title ? session[i].title : session[i].imei, to: '/project/' + this.id + '/device/' + session[i].deviceName})
          } else {
            temp.push({title: session[i].title, to: '/project/' + session[i].id})
          }
        }
      }
      temp.push({title: '设备配置'})
      return temp
    },
    ajaxData () {
      let temp = {state: JSON.stringify({desired: {leak: this.formData.maxLeak, temperature: this.formData.maxTemp}}), ...this.formData}
      delete temp.maxLeak
      delete temp.maxTemp
      temp.deviceName = this.deviceId
      return temp
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          putDevice(this.ajaxData).then(datas => {
            let {errno, msg} = datas
            if (errno === 0) {
              this.$message.success({
                message: msg,
                onClose: () => {
                  this.$router.back()
                }
              })
            } else {
              this.$message.error(msg)
            }
          }).catch(e => catchError(e, this))
        }
      })
    },
    getDetail () {
      if (this.deviceId) {
        getDevice({deviceName: this.deviceId}).then(datas => {
          let {errno, data, msg} = datas
          if (errno === 0) {
            for (let index in this.formData) {
              if (data[index] !== undefined) {
                this.formData[index] = data[index]
              }
            }
          } else {
            this.$message.error(msg)
          }
        }).catch(e => catchError(e, this))
      }
    },
    getProject () {
      let id = this.session[0].id
      getProject({per_page: 9999, area: id}).then(datas => {
        let {errno, data} = datas
        if (errno === 0) {
          this.options = data
        }
      }).catch(e => catchError(e, this))
    }
  },
  beforeMount () {
    this.getProject()
    this.getDetail()
  }
}
</script>
