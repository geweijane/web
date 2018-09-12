<template>
  <el-main>
    <div class="login" @keyup.13="onSubmit('registForm')">
      <h1 class="h4">用户注册</h1>
      <el-form :model="registData" class="registBox" :rules="rules" ref="registForm" label-width="8rem"  onsubmit="return false;">
        <el-form-item prop="account" label="用户名">
          <el-input placeholder="用户名" v-model.trim="registData.account" tabindex="1">
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass" label="密码设置">
          <el-input placeholder="密码" type="password" v-model="registData.checkPass" auto-complete="off" tabindex="2">
          </el-input>
        </el-form-item>
        <el-form-item prop="reCheckPass" label="确认密码">
          <el-input placeholder="确认密码" type="password" v-model="registData.reCheckPass" auto-complete="off" tabindex="3">
          </el-input>
        </el-form-item>
        <el-form-item prop="verify" label="验证码">
          <el-col :span="15">
            <el-input placeholder="验证码" v-model.trim="registData.verify" tabindex="4">
            </el-input>
          </el-col>
          <el-col :span="9">
            <verify-image ref="canvasImg" v-model="registData.verify"></verify-image>
          </el-col>
        </el-form-item>
        <el-form-item prop="activeCode" label="激活码">
          <el-col :span="15">
            <el-input placeholder="激活码" v-model.trim="registData.activeCode" tabindex="5">
            </el-input>
          </el-col>
          <el-col :span="9">
            <el-button class="pull-right" type="primary" style="width: 90%;" :disabled="registData.account === '' || activeText !== '获取激活码'" @click="getActive('registForm')">{{activeText}}</el-button>
          </el-col>
        </el-form-item>
        <el-row>
          <el-button type="primary" style="width: 100%" :disabled="btnTxt !== '立即注册'" @click="onSubmit('registForm')" tabindex="5">{{btnTxt}}</el-button>
          <p class="text-muted" style="margin-top: 1rem;">点击立即注册表示同意遵守<a href="" class="text-primary" target="_blank" tabindex="6">《服务协议》</a></p>
        </el-row>
      </el-form>
    </div>
  </el-main>
</template>
<script>
import {regist, getActive, validVerify} from '@/api/api'
import VerifyImage from '@/components/until/verifyImg'
import {regExp} from 'vuex-store/modules/until/regExp'
export default {
  components: {
    VerifyImage
  },
  name: 'regist',
  data () {
    let regphone = regExp.phone
    let regEmail = regExp.email
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.registData.checkPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    let validaAccont = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (!(regphone.test(value) || regEmail.test(value))) {
        callback(new Error('用户名格式为邮箱或手机号码!'))
      } else {
        callback()
      }
    }
    return {
      btnTxt: '立即注册',
      activeText: '获取激活码',
      regPhone: regphone,
      regEmail: regEmail,
      timeout: 60,
      registData: {
        account: '',
        checkPass: '',
        reCheckPass: '',
        verify: '',
        activeCode: ''
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
        reCheckPass: [
          {required: true, message: '请输入确认密码', trigger: 'blur'},
          {validator: validatePass2, trigger: 'blur'}
        ],
        verify: [
          {required: true, message: '验证码不能为空', trigger: 'blur'}
        ],
        activeCode: [
          {required: true, message: '激活码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getActive (formName) {
      this.$refs[formName].validateField('account', (valid) => {
        if (valid === '') {
          getActive({userName: this.registData.account, role: 'developer'}).then(datas => {
            let {errno, msg} = datas
            if (errno === 0) {
              // php时间戳转js时间戳
              // let time = Math.ceil((data.timeout * 1000 - new Date().getTime()) / 1000)
              let time = this.timeout
              let timer = setInterval(() => {
                if (time === 0) {
                  this.activeText = '获取激活码'
                  clearInterval(timer)
                } else {
                  this.activeText = time + 's...'
                  time--
                }
              }, 1000)
              this.$message.success('激活码以邮件或者短信验证码的形式发送到用户名相对应的邮箱或者手机')
            } else {
              this.$message.error(msg)
            }
          })
        }
      })
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnText = '注册中...'
          validVerify({code: this.registData.verify}).then(datas => {
            let {errno} = datas
            if (errno === 0) {
              this.register()
            } else {
              this.$message.error('校验码错误，请重新输入')
              this.btnText = '立即注册'
              this.changeVerify()
            }
          })
        } else {
          return false
        }
      })
      return false
    },
    register () {
      var loginParams = { userName: this.registData.account, password: this.registData.checkPass, code: this.registData.activeCode, role: 'developer', type: this.regPhone.test(this.registData.account) ? 'mobile' : 'email' }
      regist(loginParams).then(datas => {
        let {errno, msg, data} = datas
        this.$message({
          message: msg,
          type: errno === 0 ? 'success' : 'error'
        })
        if (errno === 0) {
          localStorage.setItem('user', JSON.stringify(data))
          setTimeout(() => this.$router.push({ path: '/' }), 3000)
        } else {
          this.changeVerify()
        }
        this.btnText = '立即注册'
      }).catch(e => {
        this.$message.error({message: e.message})
        this.btnText = '立即注册'
        this.changeVerify()
      })
    },
    removeLocalStorage () {
      localStorage.removeItem('register')
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
  height: 36rem;
  top: 50%;
  margin-top: -18rem;
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
}
.el-main {
  height: 100%;
}
</style>
