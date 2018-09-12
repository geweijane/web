<template>
  <el-main>
    <div class="login"  @keyup.13="submitData">
      <h4 class="h4">后台系统-用户登录</h4>
      <el-form :model="loginData" :rules="rules" ref="loginForm" onsubmit="return false;">
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
            <verify-image ref="canvasImg" v-model="loginData.verify"></verify-image>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" :disabled="btnTxt !== '登录'" @click.prevent="submitData()" tabindex="4">{{btnTxt}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-col :span="24">
            <router-link to="/auth/register" tabindex="5">立即注册</router-link>
            <router-link to="/auth/forget" class="pull-right" tabindex="6">忘记密码</router-link>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </el-main>
</template>
<script>
import {requestLogin, validVerify} from '@/api/api'
import VerifyImage from '@/components/until/verifyImg'
import {regExp} from 'vuex-store/modules/until/regExp'
export default {
  components: {
    VerifyImage
  },
  name: 'login',
  data () {
    let regphone = regExp.phone
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
      regPhone: regphone,
      regEmail: regEmail,
      loginData: {
        account: '',
        checkPass: '',
        verify: ''
      },
      rules: {
        account: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {validator: validaAccont, trigger: 'blur'}
        ],
        checkPass: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {pattern: '^[a-zA-Z0-9\\.\\@\\!\\#\\$\\%\\^\\&\\*\\(\\)]{6,24}$', message: '密码格式不对', trigger: 'blur'}
        ],
        verify: [
          {required: true, message: '验证码不能为空', trigger: 'blur'}
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
          validVerify({code: this.loginData.verify}).then(datas => {
            let {errno} = datas
            if (errno === 0) {
              this.login()
            } else {
              this.$message.error('校验码错误，请重新输入')
              this.btnText = '登录'
              this.changeVerify()
            }
          })
        } else {
          return false
        }
      })
      return false
    },
    login () {
      var loginParams = { userName: this.loginData.account, password: this.loginData.checkPass, type: 'email', role: 'manager' }
      requestLogin(loginParams).then(datas => {
        let { errno, msg, data } = datas
        if (errno === 0) {
          localStorage.setItem('user', JSON.stringify(data))
          setTimeout(() => this.$router.push({ path: '/' }), 3000)
        } else {
          this.changeVerify()
        }
        this.$message({
          message: msg,
          type: errno === 0 ? 'success' : 'error'
        })
        this.btnText = '登录'
      }).catch(e => {
        console.log('e.message', e.message)
        this.$message.error({message: e.message})
        this.btnText = '登录'
        this.changeVerify()
      })
    },
    removeLocalStorage () {
      localStorage.removeItem('user')
    },
    changeVerify () {
      this.$refs['canvasImg'].$el.click()
    }
  },
  mounted () {
    this.removeLocalStorage()
  }
}
</script>
<style lang="less" scoped>
@import url('../../less/_variables.less');
.login{
  position: absolute;
  width: 36rem;
  height: 29rem;
  top: 50%;
  margin-top: -14.5rem;
  left: calc(~"50% - 16rem");
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, .8);

  .box-shadow(0 0px 50px rgba(255,255,255,1));
  border-radius: 3px;
  @media screen and (max-width: @screen-xs){
    width: auto;
  }
  .h4{
    text-align: center;
    font-size: 2rem;
    line-height: 3rem;
    font-weight: bold;
    color: @brand-primary;
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
