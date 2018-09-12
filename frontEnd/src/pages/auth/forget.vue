<template>
  <el-main>
    <div class="login">
      <fieldset><legend>电气火灾监控系统</legend></fieldset>
      <el-form class="login-box" :model="formData" :rules="rules" ref="formList" onsubmit="return false;">
        <h4 class="h4">找回密码</h4>
        <el-form-item prop="account">
          <el-input placeholder="请输入手机号" v-model.trim="formData.account" tabindex="1">
            <template slot="prepend"><i class="pcon pcon-people"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="verify">
          <el-col :span="15">
            <el-input placeholder="请输入验证码" v-model.trim="formData.verify" tabindex="2">
              <template slot="prepend"><i class="pcon pcon-key"></i></template>
            </el-input>
          </el-col>
          <el-col :span="9">
            <verify-code ref="verifyCode"></verify-code>
          </el-col>
        </el-form-item>
        <el-form-item prop="sms">
          <el-col :span="15">
            <el-input placeholder="请输入验证码" v-model.trim="formData.sms" tabindex="3">
              <template slot="prepend"><i class="pcon pcon-key"></i></template>
            </el-input>
          </el-col>
          <el-col :span="9">
            <el-button plain type="primary" style="width: 90%;" class="pull-right" :disabled="sText !== '短信验证码'" @click="sendSms('formList')">{{sText}}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input placeholder="密码" type="password" v-model="formData.checkPass" auto-complete="off" tabindex="4">
            <template slot="prepend"><i class="pcon pcon-lock"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass1">
          <el-input placeholder="确认密码" type="password" v-model="formData.checkPass" auto-complete="off" tabindex="5">
            <template slot="prepend"><i class="pcon pcon-lock"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="btnTxt !== '找回密码'" @click="onSubmit('formList')" tabindex="7" style="width: 100%;">{{btnTxt}}</el-button>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <router-link to="/auth/login" class="pull-right" tabindex="6">返回登录</router-link>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-main>
</template>
<script>
import {requestSms, resetPassword} from '@/api/api'
import VerifyCode from 'components/until/verify'
import regExp from 'vuex-store/modules/until/regExp'
export default {
  name: 'forgetPass',
  components: {
    VerifyCode
  },
  data () {
    let regPhone = regExp.phone
    let validaAccont = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else if (!regPhone.test(value)) {
        callback(new Error('用户名格式为手机号码!'))
      } else {
        callback()
      }
    }
    return {
      btnTxt: '找回密码',
      sText: '短信验证码',
      formData: {
        account: '',
        verify: '',
        sms: '',
        checkPass: '',
        checkPass1: ''
      },
      rules: {
        account: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {validator: validaAccont, trigger: 'blur'}
        ],
        verify: [
          {required: true, message: '验证码不能为空', trigger: 'blur'}
        ],
        sms: [
          {required: true, message: '手机验证码不能为空', trigger: 'blur'}
        ],
        checkPass: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {pattern: '^[a-zA-Z0-9\\.\\@\\!\\#\\$\\%\\^\\&\\*\\(\\)]{6,24}$', message: '密码格式不对', trigger: 'blur'}
        ],
        checkPass1: [
          {
            validator: (rule, value, callback) => {
              if (this.formData.checkPass !== this.formData.checkPass1) {
                callback(new Error('确认密码和密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnText = '提交中...'
          resetPassword({name: this.formData.account, sms: this.formData.sms, password: this.formData.checkPass}).then(datas => {
            let {errno, msg} = datas
            this.$message({
              message: msg,
              type: errno === 0 ? 'success' : 'error',
              onClose: () => {
                errno === 0 && (this.$router.push({ path: '/auth/login' }))
              }
            })
            this.btnText = '找回密码'
          }).catch(e => {
            this.btnText = '找回密码'
          })
        }
      })
      return false
    },
    sendSms (formName) {
      this.$refs[formName].validateField('account', (msg) => {
        if (!msg) {
          this.$refs[formName].validateField('verify', (error) => {
            if (!error) {
              this.sText = '验证码获取中'
              requestSms({name: this.formData.account, verify: this.formData.verify}).then(datas => {
                let {errno, msg} = datas
                if (errno === 0) {
                  this.$message.success(msg)
                  let count = 60
                  let timer = window.setInterval(() => {
                    if (count === 0) {
                      window.clearInterval(timer)
                      this.sText = '短信验证码'
                    } else {
                      this.sText = count + 's后在获取'
                      count--
                    }
                  }, 1000)
                } else {
                  this.$message.error(msg)
                  this.sText = '短信验证码'
                  this.changeVerify()
                }
              })
            }
          })
        }
      })
    },
    changeVerify () {
      this.$refs.verifyCode.createCode()
    }
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
  @import url('../../less/_variables.less');
  .login{
    position: absolute;
    width: 36rem;
    height: 43rem;
    top: 42%;
    margin-top: -21.5rem;
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
