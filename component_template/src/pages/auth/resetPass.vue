<template>
  <el-main>
    <div class="content-box" @keyup.13="onSubmit('formList')">
      <h1 class="title">{{title}}</h1>
      <hr class="hr"/>
      <el-form :model="formData" class="formBox" :rules="rules" ref="formList" label-width="8rem"  onsubmit="return false;">
        <el-form-item prop="account" label="用户名">
          <el-input placeholder="用户名" v-model.trim="formData.account" tabindex="1" readonly="">
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass" label="密码设置">
          <el-input placeholder="密码" type="password" v-model="formData.checkPass" auto-complete="off" tabindex="2">
          </el-input>
        </el-form-item>
        <el-form-item prop="reCheckPass" label="确认密码">
          <el-input placeholder="确认密码" type="password" v-model="formData.reCheckPass" auto-complete="off" tabindex="3">
          </el-input>
        </el-form-item>
        <el-form-item prop="code" label="激活码">
          <el-input placeholder="激活码" type="text" v-model="formData.code" auto-complete="off" tabindex="4">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="btnTxt !== '提交'" @click="onSubmit('formList')" tabindex="5">{{btnTxt}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-main>
</template>
<script>
import {resetPass} from '@/api/api'
import {regExp} from 'vuex-store/modules/until/regExp'
export default {
  name: 'resetPassword',
  data () {
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.checkPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    let regEmail = regExp.email
    let validaAccont = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (!regEmail.test(value)) {
        callback(new Error('用户名格式为邮箱!'))
      } else {
        callback()
      }
    }
    return {
      title: this.$route.meta.title,
      btnTxt: '提交',
      token: this.$route.params.token,
      formData: {
        account: this.$route.query.userName,
        checkPass: '',
        reCheckPass: '',
        code: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {validator: validaAccont, trigger: 'blur'}
        ],
        checkPass: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {pattern: '^[a-zA-Z0-9\\.\\@\\!\\#\\$\\%\\^\\&\\*\\(\\)]{6,24}$', message: '密码格式不对', trigger: 'blur'}
        ],
        reCheckPass: [
          {required: true, message: '请输入确认密码', trigger: 'blur'},
          {validator: validatePass2, trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入激活码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnText = '提交中...'
          var ajaxData = { userName: this.formData.account, password: this.formData.checkPass, code: this.formData.code, role: 'manager' }
          resetPass(ajaxData).then(datas => {
            let {errno, msg} = datas
            this.$message({
              message: msg,
              type: errno === 0 ? 'success' : 'error'
            })
            if (errno === 0) {
              setTimeout(() => this.$router.push({ path: '/auth/login' }), 3000)
            }
            this.btnText = '提交'
          }).catch(e => {
            this.$message.error({message: e.message})
            this.btnText = '提交'
          })
        }
      })
      return false
    }
  }
}
</script>
<style lang="less" scoped>

  @import url('../../less/_variables.less');
  .el-main{
    padding: 0;
  }
  .title{
    font-size: 2.5rem;
    text-align: center;
    color: #409EFF;
  }
  .hr{
    margin: 2rem 0;
    border: none;
    border-bottom: 2px solid #409EFF;
  }
  .formBox{
    width: 40rem;
    .center-block();
  }
</style>
