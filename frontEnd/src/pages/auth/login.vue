<template>
  <el-main>
    <div class="login"  @keyup.13="submitData">
      <fieldset><legend>电气火灾监控系统</legend></fieldset>
      <el-form class="login-box" :model="loginData" :rules="rules" ref="loginForm">
        <h4>用户登录</h4>
        <el-form-item prop="account">
          <el-input placeholder="用户名" v-model.trim="loginData.account" tabindex="1">
            <template slot="prepend"><i class="pcon pcon-people"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input placeholder="密码" type="password" v-model="loginData.checkPass" auto-complete="off" tabindex="2">
            <template slot="prepend"><i class="pcon pcon-lock"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="verify">
          <el-col :span="15">
            <el-input placeholder="验证码" v-model.trim="loginData.verify" tabindex="3">
              <template slot="prepend"><i class="pcon pcon-key"></i></template>
            </el-input>
          </el-col>
          <el-col :span="9">
            <verify-code ref="verifyCode" @change="changeCode"></verify-code>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" :disabled="btnTxt !== '登录'" @click.prevent="submitData()" tabindex="4">{{btnTxt}}</el-button>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <router-link to="/auth/forget" class="pull-right" tabindex="6">忘记密码</router-link>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-main>
</template>
<script>
import {requestLogin} from '@/api/api'
import VerifyCode from 'components/until/verify'
export default {
  components: {
    VerifyCode
  },
  name: 'login',
  data () {
    return {
      loginData: {
        account: '',
        checkPass: '',
        verify: ''
      },
      verify: '',
      rules: {
        account: [
          {required: true, type: 'string', message: '请输入用户名', trigger: 'blur'},
          {pattern: '^[a-zA-Z0-9_]{3,16}$', message: '用户名格式错误', trigger: 'blur'}
        ],
        checkPass: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {pattern: '^[a-zA-Z0-9\\.\\@\\!\\#\\$\\%\\^\\&\\*\\(\\)]{6,24}$', message: '密码格式不对', trigger: 'blur'}
        ],
        verify: [
          {
            validator: (rules, value, callback) => {
              if (value.trim() === '') {
                callback(new Error('验证码不能为空'))
              } else if (value !== this.verify) {
                callback(new Error('验证码不正确'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      btnTxt: '登录'
    }
  },
  methods: {
    submitData () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.btnText = '登录中...'
          this.login()
        } else {
          return false
        }
      })
      return false
    },
    login () {
      var loginParams = { name: this.loginData.account, password: this.loginData.checkPass, verify: this.loginData.verify }
      requestLogin(loginParams).then(datas => {
        let { errno, msg, data } = datas
        if (errno === 0) {
          this.storeUser(data)
        } else {
          this.changeVerify()
        }
        this.$message({
          message: msg,
          type: errno === 0 ? 'success' : 'error',
          onClose: () => {
            errno === 0 && (this.$router.push({ path: '/home' }))
          }
        })
        this.btnText = '登录'
      }).catch(e => {
        this.$message.error({message: e.message})
        this.btnText = '登录'
        this.changeVerify()
      })
    },
    changeCode (code) {
      this.verify = code
    },
    changeVerify () {
      this.$refs.verifyCode.createCode()
    },
    storeUser (data) {
      sessionStorage.setItem('user', JSON.stringify(data))
    }
  },
  mounted () {
    sessionStorage.removeItem('user')
  }
}
</script>
<style lang="less" scoped>
@import url('../../less/_variables.less');
.login{
  position: absolute;
  width: 36rem;
  height: 32.5rem;
  top: 42%;
  margin-top: -16.25rem;
  left: calc(~"70% - 18rem");
  .login-box{

    padding: 1rem 2rem;
    background: rgba(255, 255, 255, .8);
    .box-shadow(0 0px 50px rgba(255,255,255,1));
    border-radius: 3px;
    h4{
      text-align: center;
      color: @brand-primary;
    }
    .pcon{
      font-size: 2rem;
    }
  }
  @media screen and (max-width: @screen-xs){
    width: 92%;
    left: 4%;
    box-sizing: border-box;
    height: auto;
  }
  @media screen and (max-width: @screen-sm){
  }
  fieldset{
    text-align: center;
    font-size: 2rem;
    line-height: 3rem;
    font-weight: bold;
    color: @brand-primary;
    border: 0;
    border-top: 2px solid @brand-primary;
  }
  a {
    &, &:hover, &:active{
      color: @brand-primary;
      text-decoration: none;
    }
  }
}
.el-main {
  height: 100%;
}
</style>
