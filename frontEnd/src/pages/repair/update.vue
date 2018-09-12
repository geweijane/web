<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <el-card shadow="never">
      <div slot="header">
        <b class="h4">添加维护记录</b>
      </div>
      <el-form class="updateForm" labelWidth="7rem" :model="formData" :rules="rules" ref="auditForm">
        <el-col :span="11">
          <el-form-item label="设备" prop="deviceName">
            <el-input v-model.trim="formData.deviceName" readonly></el-input>
          </el-form-item>
          <el-form-item label="故障类型" prop="type">
            <el-input v-model.trim="formData.type" readonly></el-input>
          </el-form-item>
          <el-form-item label="处理备注" prop="remark1">
            <el-input type="textarea" :autosize="{minRows: 4}" v-model.trim="formData.remark1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="项目" prop="project">
            <el-input v-model.trim="formData.project" readonly></el-input>
          </el-form-item>
          <el-form-item label="维护人" prop="userName">
            <el-input v-model.trim="formData.userName" readonly></el-input>
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
import sessionMixin from '@/until/session'
import {catchError, addFixed, getWarning} from '@/api/api'
export default {
  components: {Breadcrumb},
  name: 'repairUpdate',
  mixins: [sessionMixin],
  data () {
    return {
      id: this.$route.params.id,
      formData: {
        deviceName: '',
        project: '',
        userId: '',
        type: '',
        deviceId: '',
        userName: '',
        remark1: ''
      },
      rules: {
        remark1: [
          {required: true, message: '请输入审核备注', trigger: 'blur'},
          {max: 250, message: '审核备注最多输入250个字符', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'}
      ]
      let session = this.session
      if (session) {
        for (let i = 0; i < session.length; i++) {
          if (session[i].area) {
            temp.push({title: session[i].title, to: '/warning?project=' + session[i].id})
          } else {
            temp.push({title: session[i].title, to: '/warning?area=' + session[i].id})
          }
        }
      }
      if (temp.length === 1) {
        temp.push({title: '消息报警', to: '/warning'})
      }
      temp.push({title: '添加故障解除记录'})
      return temp
    },
    ajaxData () {
      let temp = {deviceId: this.formData.deviceId, userId: this.formData.userId, remark1: this.formData.remark1, type: this.formData.type}
      return temp
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addFixed(this.ajaxData).then(datas => {
            let {errno, msg} = datas
            if (errno === 0) {
              this.$message.success({
                message: msg,
                onClose: () => {
                  this.$router.push({path: '/fixed'})
                }
              })
            } else {
              this.$message.error(msg)
            }
          }).catch(e => catchError(e, this))
        }
      })
    },
    getWarning () {
      getWarning({id: this.id}).then(datas => {
        let {errno, msg, data} = datas
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
  mounted () {
    this.getWarning()
  }
}
</script>
