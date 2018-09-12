<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <el-card shadow="never">
      <div slot="header">
        <b class="h4">{{userName ? '用户信息' : '添加用户'}}</b>
      </div>
      <el-form class="updateForm" labelWidth="7rem" :model="formData" :rules="rules" ref="auditForm">
        <el-col :span="11">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model.trim="formData.userName" :readonly="edit"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" required prop="mobile">
            <el-input v-model.trim="formData.mobile" :readonly="edit"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model.trim="formData.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" :required="userName === undefined" prop="repassword">
            <el-input type="password" v-model.trim="formData.repassword"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model.trim="formData.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="姓名" prop="trueName">
            <el-input v-model.trim="formData.trueName"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role" required>
            <el-select :disabled="role !== 1" v-model="formData.role" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域" prop="area">
            <el-cascader v-model="formData.area" :disabled="role !== 1" :options="optionArea" change-on-select :props="propsRole" @change="areaChange" style="width: 100%;"></el-cascader>
          </el-form-item>
          <el-form-item label="项目" prop="project">
            <el-select v-model="formData.project" multiple style="width: 100%;" :disabled="role !== 1">
              <el-option v-for="item in optionsProject" :key="item.id" :label="item.title" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button class="btn-form" type="primary" @click="submitForm('auditForm')" v-if="role === 1 || formData.userName == userName">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
  </el-main>
</template>
<script>
import Breadcrumb from 'components/until/breadcrumb'
import regExp from 'vuex-store/modules/until/regExp'
import sessionMixin from '@/until/session'
import {catchError, updateUser, addUser, getUser, getArea, getProject} from '@/api/api'
import {mapGetters} from 'vuex'
export default {
  components: {Breadcrumb},
  name: 'userModify',
  mixins: [sessionMixin],
  data () {
    return {
      breadcrumb: [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'},
        {title: '用户管理', to: '/user'},
        {title: this.$route.meta.title}
      ],
      areas: [],
      optionsProject: [],
      propsRole: {
        label: 'title',
        value: 'id',
        children: 'children'
      },
      userName: this.$route.params.userName,
      formData: {
        userName: '',
        mobile: '',
        password: '',
        repassword: '',
        trueName: '',
        ismanager: 0,
        role: 0,
        area: [],
        project: [],
        remark: ''
      },
      rules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 4, max: 20, message: '用户名长度在4-20个字符之间', trigger: 'blur'}
        ],
        mobile: [
          {
            validator: (rule, value, callback) => {
              if (this.userName !== undefined) {
                callback()
              } else if (value === '') {
                callback(new Error('请输入手机号码'))
              } else if (!regExp.phone.test(value)) {
                callback(new Error('手机号码格式不对!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        password: [
          {required: this.$route.params.userName === undefined, message: '请输入用户名', trigger: 'blur'},
          {min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur'}
        ],
        repassword: [
          {
            validator: (rule, value, callback) => {
              if (this.formData.password !== this.formData.repassword) {
                callback(new Error('确认密码和密码不一致'))
              } else {
                callback()
              }
            }
          }
        ],
        trueName: [
          {required: true, message: '请输入真实姓名', trigger: 'blur'},
          {min: 2, max: 20, message: '真实姓名长度在2-20个字符之间', trigger: 'blur'}
        ],
        area: [
          {required: true, message: '请输入权限', trigger: 'blur'}
        ],
        remark: [
          {max: 250, message: '备注最多输入250个字符', trigger: 'blur'}
        ]
      },
      options: [{
        label: '监控管理人',
        value: 1
      }, {
        label: '安装人员',
        value: 2
      }, {
        label: '物业运管人员',
        value: 3
      }, {
        label: '研发人员',
        value: 4
      }]
    }
  },
  computed: {
    ...mapGetters(['rootParentId']),
    ajaxData () {
      let temp = {...this.formData}
      temp.area = temp.area.join(',')
      temp.project = temp.project.join(',')
      temp.ismanager = temp.ismanager ? 1 : 0
      return temp
    },
    edit () {
      return this.userName === undefined ? this.role !== 1 : true
    },
    optionArea: {
      set (data) {
        let action = (ajaxdata, parent) => {
          this.getArea(ajaxdata).then(data => {
            for (let i = 0; i < data.length; i++) {
              let temp = data[i]
              temp.children = []
              action({per_page: 999, parentId: temp.id}, temp)
            }
            if (data.length !== 0) {
              parent.children = [...data]
            } else {
              delete parent.children
            }
          })
        }
        this.getArea({filter: data}).then(data => {
          for (let i = 0; i < data.length; i++) {
            let temp = data[i]
            temp.children = []
            action({per_page: 999, parentId: temp.id}, temp)
          }
          this.areas = data
        })
      },
      get () {
        return this.areas
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let action = this.userName ? updateUser : addUser
          action(this.ajaxData).then(datas => {
            let {errno, msg} = datas
            if (errno === 0) {
              this.$message.success({
                message: msg,
                onClose: () => {
                  this.$router.push({path: '/user'})
                }
              })
            } else {
              this.$message.error(msg)
            }
          }).catch(e => catchError(e, this))
        }
      })
    },
    getUser () {
      if (this.userName) {
        getUser({userName: this.userName}).then(datas => {
          let {errno, msg, data} = datas
          if (errno === 0) {
            for (let index in this.formData) {
              if (data[index] !== undefined) {
                if (index === 'area' || index === 'project') {
                  if (data[index] !== '') {
                    let arr = []
                    data[index].split(',').forEach(function (n) {
                      arr.push(parseInt(n))
                    })
                    this.formData[index] = [...this.formData[index], ...arr]
                  }
                } else {
                  this.formData[index] = data[index]
                }
              }
            }
            if (this.formData.area && this.formData.area.length !== 0) {
              this.areaChange(this.formData.area[0])
            }
          } else {
            this.$message.error(msg)
          }
        }).catch(e => catchError(e, this))
      }
    },
    getArea (ajaxData) {
      return new Promise(function (resolve, reject) {
        getArea(ajaxData).then(datas => {
          let {errno, data} = datas
          if (errno === 0) {
            resolve(data)
          }
        }).catch(e => catchError(e, this))
      })
    },
    areaChange (val) {
      if (val.length !== 0) {
        getProject({per_page: 999, area: val[val.length - 1]}).then(datas => {
          let {errno, data} = datas
          if (errno === 0) {
            this.optionsProject = data
          }
        })
      }
    }
  },
  beforeMount () {
    this.optionArea = '湖南省'
    this.getUser()
  }
}
</script>
