<template>
  <el-main>
    <el-card class="box-card main-card">
      <div slot="header" class="clearfix">
        <b class="title">{{title}}</b>
      </div>
      <div style="padding: 1rem 0;" @keyup.13="submitForm('addForm')">
        <el-form labelWidth="10rem" style="width: 40rem;" ref="addForm" :model="formData" :rules="rules">
          <el-form-item prop="oldPass" label="旧密码">
            <el-input placeholder="请输入旧密码" type="password" v-model="formData.oldPass" auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password" required>
            <el-input type="password" v-model.trim="formData.password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="rePassword" required>
            <el-input type="password" v-model.trim="formData.rePassword" placeholder="请输入确认密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="submitForm('addForm')">{{btnTxt}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </el-main>
</template>
<script>
import {putUser, catchError} from '@/api/api'
export default {
  name: 'managerAdd',
  data () {
    return {
      title: this.$route.meta.title,
      btnTxt: '确定',
      formData: {
        name: JSON.parse(sessionStorage.getItem('user')).userName,
        oldPass: '',
        password: '',
        rePassword: ''
      },
      rules: {
        oldPass: [
          {required: true, message: '旧密码不能为空', trigger: 'blur'},
          {type: 'string', max: 20, min: 6, message: '旧密码的长度为6-20个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '新密码不能为空', trigger: 'blur'},
          {type: 'string', max: 20, min: 6, message: '新密码的长度为6-20个字符', trigger: 'blur'}
        ],
        rePassword: [
          {trigger: 'blur',
            validator: (rules, value, callback) => {
              if (value === '') {
                callback(new Error('确认密码不能为空'))
              } else if (value !== this.formData.password) {
                callback(new Error('确认密码和新密码不一致'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ajaxData () {
      let temp = {userName: this.formData.name, oldPassword: this.formData.oldPass, password: this.formData.password}
      return temp
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          putUser(this.ajaxData).then(datas => {
            let {errno, msg} = datas
            if (errno === 0) {
              this.$message.success({
                message: msg,
                onClose: () => {
                  this.$router.push({path: '/auth/login'})
                }
              })
            } else {
              this.$message.error(msg)
            }
          }).catch(e => catchError(e, this))
        }
      })
    }
  },
  mounted () {

  }
}
</script>
