<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <el-card shadow="never">
      <div slot="header">
        <b class="h4">项目信息</b>
      </div>
      <el-form class="updateForm" labelWidth="7rem" :model="formData" :rules="rules" ref="auditForm">
        <el-col :span="11">
          <el-form-item label="地区" prop="area">
            <el-cascader :options="cityFilter" v-model="formData.area" :props="props" style="width: 100%;" @change="changeArea" ref="area"></el-cascader>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model.trim="formData.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="项目名" prop="title">
            <el-input v-model.trim="formData.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <map-location ref="map" :address="address" :point="{lng: formData.lng, lat: formData.lat}" @updatePoint="updatePoint"></map-location>
          <el-form-item prop="lng" style="margin-top: -30px; pointer-events: none;">
            <el-input type="hidden" v-model="formData.lng"></el-input></el-form-item>
        </el-col>
        <el-col :span="24" style="margin-top: 1rem;">
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
import MapLocation from 'components/map/location'
import sessionMixin from '@/until/session'
import cityMixin from '@/until/city'
import {mapGetters} from 'vuex'
import {catchError, getProject, getArea, addProject, updateProject} from '@/api/api'
export default {
  components: {
    MapLocation,
    Breadcrumb
  },
  mixins: [cityMixin, sessionMixin],
  name: 'repairUpdate',
  data () {
    return {
      id: this.$route.params.id,
      type: this.$route.meta.type,
      address: '永州市',
      formData: {
        area: [],
        title: '',
        remark: '',
        lng: null,
        lat: null
      },
      rules: {
        area: [
          {required: true, message: '地区不能为空', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '项目名称不能为空', trigger: 'blur'}
        ],
        lng: [
          {required: true, message: '项目位置不能为空', trigger: 'blur'}
        ]
      },
      path: '/project/' + this.$route.params.id + (this.$route.meta.type === 'modify' ? '/device' : ''),
      props: {
        value: 'id',
        label: 'title',
        children: 'children'
      }
    }
  },
  computed: {
    ...mapGetters(['rootParentId']),
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'},
        {title: '智能监控', to: '/project'}
      ]
      let session = this.session
      if (session) {
        for (let i = 0; i < session.length; i++) {
          if (!session[i].area) {
            temp.push({title: session[i].title, to: '/project/' + session[i].id})
          } else if (this.type === 'modify') {
            temp.push({title: session[i].title, to: '/project/' + session[i].id + '/device'})
          }
        }
      }
      temp.push({title: this.$route.meta.title})
      return temp
    }
  },
  methods: {
    updatePoint (point) {
      this.formData.lng = point.lng
      this.formData.lat = point.lat
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let action = this.type === 'add' ? addProject : updateProject
          let ajax = {...this.formData}
          ajax.area = ajax.area.join(',')
          this.type !== 'add' && (ajax.id = this.id)
          action(ajax).then(datas => {
            let {errno, msg} = datas
            if (errno === 0) {
              this.$message.success({
                message: msg,
                onClose: () => {
                  this.$router.push({path: this.path})
                }
              })
            } else {
              this.$message.error(msg)
            }
          }).catch(e => catchError(e, this))
        }
      })
    },
    getProject () {
      getProject({id: this.id}).then(datas => {
        let {errno, msg, data} = datas
        if (errno === 0) {
          let temp = data[0]
          for (let index in this.formData) {
            if (temp[index] !== undefined) {
              if (index === 'area') {
                let arr = []
                temp[index].split(',').forEach(function (n) {
                  arr.push(parseInt(n))
                })
                this.formData[index] = arr
              } else {
                this.formData[index] = temp[index]
              }
            }
          }
          setTimeout(() => {
            this.$refs.map.setMarker({lng: temp.lng, lat: temp.lat})
          }, 500)
        } else {
          this.$message.error(msg)
        }
      }).catch(e => catchError(e, this))
    },
    getArea () {
      getArea({per_page: 999}).then(datas => {
        let {errno, data} = datas
        if (errno === 0) {
          this.cityData = data
          this.cityFilter = {title: ['湖南']}
        }
      }).catch(e => catchError(e, this))
    },
    changeArea () {
      this.$nextTick(function () {
        var tag = this.$refs.area
        let text = tag.$el.querySelector('.el-input__inner').defaultValue
        text = text.replace(/\//ig, '')
        if (this.address !== text) {
          this.address = text
        }
      })
    }
  },
  mounted () {
  },
  beforeMount () {
    this.getArea()
    this.getProject()
  }
}
</script>
