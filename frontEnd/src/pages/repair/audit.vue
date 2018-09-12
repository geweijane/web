<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <el-card shadow="never">
      <div slot="header">
        <b class="h4">审核维护记录</b>
      </div>
      <el-form class="updateForm" labelWidth="7rem" :model="formData" :rules="rules" ref="auditForm">
        <el-col :span="11">
          <el-form-item label="设备" prop="deviceName">
            <el-input v-model.trim="formData.deviceName" readonly></el-input>
          </el-form-item>
          <el-form-item label="故障类型" prop="type">
            <el-input v-model.trim="formData.type" readonly></el-input>
          </el-form-item>
          <el-form-item label="审核结果" prop="status">
            <el-select style="width: 100%;" v-model="formData.status">
              <el-option v-for="(item, index) in stateData" :key="index" :label="item" :value="parseInt(index)" :disabled="edit"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核备注" prop="remark2">
            <el-input type="textarea" :autosize="{minRows: 4}" v-model.trim="formData.remark2" :readonly="edit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="项目" prop="project">
            <el-input v-model.trim="formData.project" readonly></el-input>
          </el-form-item>
          <el-form-item label="维护人" prop="userName">
            <el-input v-model.trim="formData.userName" readonly></el-input>
          </el-form-item>
          <el-form-item label="处理时间" prop="updateTime">
            <el-input v-model.trim="formData.updateTime" readonly></el-input>
          </el-form-item>
          <el-form-item label="处理备注" prop="remark1">
            <el-input type="textarea" :autosize="{minRows: 4}" v-model.trim="formData.remark1" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button v-if="!edit" class="btn-form" type="primary" @click="submitForm('auditForm')">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
  </el-main>
</template>
<script>
import Breadcrumb from 'components/until/breadcrumb'
import sessionMixin from '@/until/session'
import moment from 'moment'
import {mapState} from 'vuex'
import {catchError, auditFixed, getFixed} from '@/api/api'
export default {
  components: {Breadcrumb},
  name: 'repairDetail',
  mixins: [sessionMixin],
  data () {
    return {
      edit: false,
      id: this.$route.params.id,
      formData: {
        deviceName: '',
        project: '',
        type: '',
        status: null,
        updateTime: '',
        userName: '',
        remark2: '',
        remark1: ''
      },
      rules: {
        remark2: [
          {required: true, message: '请输入审核备注', trigger: 'blur'},
          {max: 250, message: '审核备注最多输入250个字符', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择审核状态', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    ...mapState({stateData: state => {
      let temp = {...state.until.dataBase.fixedStatus}
      delete temp[0]
      return temp
    }}),
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'}
      ]
      let session = this.session
      if (session) {
        for (let i = 0; i < session.length; i++) {
          if (session[i].area) {
            temp.push({title: session[i].title, to: '/fixed?project=' + session[i].id})
          } else {
            temp.push({title: session[i].title, to: '/fixed?area=' + session[i].id})
          }
        }
      }
      if (temp.length === 1) {
        temp.push({title: '故障解除记录', to: '/fixed'})
      }
      temp.push({title: this.$route.meta.title})
      return temp
    },
    ajaxData () {
      let temp = {id: this.id, remark2: this.formData.remark2, remark1: this.formData.remark1, status: this.formData.status}
      return temp
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          auditFixed(this.ajaxData).then(datas => {
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
    getFixed () {
      getFixed({id: this.id}).then(datas => {
        let {errno, msg, data} = datas
        if (errno === 0) {
          for (let index in this.formData) {
            if (data[index] !== undefined) {
              this.formData[index] = data[index]
              if (index === 'status' && data[index] === 0) {
                this.formData[index] = null
              }
            }
          }
          this.formData.updateTime = moment(data.updateTime).isAfter(moment(data.createTime)) ? data.updateTime : data.createTime
          this.edit = data.status === 0 ? this.role !== 1 : true
        } else {
          this.$message.error(msg)
        }
      }).catch(e => catchError(e, this))
    }
  },
  mounted () {
    this.getFixed()
  }
}
</script>
