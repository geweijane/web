<template>
  <el-main>
    <div class="content-box">
      <h1 class="title">忘记密码</h1>
      <hr class="hr"/>
      <el-alert title="请填写您在集贤云注册时使用的电子邮箱地址或手机号码，我们将发送重置密码的激活码至此邮箱或手机。每天可申请两次密码重置。" type="info" :closable="false" show-icon></el-alert>
      <br>
      <el-form :model="formData" class="formBox" :rules="rules" ref="formList" label-width="8rem"  onsubmit="return false;">
        <el-form-item prop="account" label="用户名">
          <el-input placeholder="请输入电子邮箱或手机号" v-model.trim="formData.account" tabindex="1">
          </el-input>
        </el-form-item>
        <el-form-item prop="verify" label="验证码">
          <el-col :span="15">
            <el-input placeholder="请输入验证码" v-model.trim="formData.verify" tabindex="2">
            </el-input>
          </el-col>
          <el-col :span="9">
            <verify-image ref="canvasImg" v-model="formData.verify"></verify-image>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="btnTxt !== '提交'" @click="onSubmit('formList')" tabindex="3">{{btnTxt}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-main>
</template>
<script>
import {forgetPass, validVerify} from '@/api/api'
import VerifyImage from '@/components/until/verifyImg'
import {regExp} from 'vuex-store/modules/until/regExp'
export default {
  name: 'forgetPass',
  components: {
    VerifyImage
  },
  data () {
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
      btnTxt: '提交',
      formData: {
        account: '',
        verify: ''
      },
      rules: {
        account: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {validator: validaAccont, trigger: 'blur'}
        ],
        verify: [
          {required: true, message: '验证码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnText = '提交中...'
          validVerify({code: this.formData.verify}).then(datas => {
            let {errno} = datas
            if (errno === 0) {
              this.sendActive()
              this.$message.success('激活码以邮件的形式发送到用户名相对应的邮箱')
            } else {
              this.$message.error('校验码错误，请重新输入')
              this.btnText = '提交'
              this.changeVerify()
            }
          })
        }
      })
      return false
    },
    sendActive () {
      var ajaxData = { userName: this.formData.account, role: 'manager' }
      forgetPass(ajaxData).then(datas => {
        let {errno, msg} = datas
        this.$message({
          message: msg,
          type: errno === 0 ? 'success' : 'error'
        })
        if (errno === 0) {
          this.$router.push({path: '/auth/resetPassword?userName=' + this.formData.account})
        } else {
          this.changeVerify()
        }
        this.btnText = '提交'
      }).catch(e => {
        this.$message.error({message: e.message})
        this.btnText = '提交'
        this.changeVerify()
      })
    },
    changeVerify () {
      this.$refs['canvasImg'].$el.click()
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
