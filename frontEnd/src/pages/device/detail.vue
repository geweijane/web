<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="sub-nav">
      <router-link :to="'/project/' + id + '/device/' + deviceId + '/modify'">
        <el-button size="mini" plain round>修改设备</el-button>
      </router-link>
      <router-link :to="'/user?project=' + id" v-if="role === 1">
        <el-button size="mini" plain round>用户管理</el-button>
      </router-link>
    </div>
    <el-row>
      <el-col :span="14">
        <el-card style="margin-right: 3rem;">
          <ul>
            <li class="title">{{device.title ? device.title : device.imei}} &nbsp;
              <span :class="'pull-right ' + (device.status === '正常' ? 'success' : 'danger')">状态: {{device.status}}</span>
            </li>
            <li><label>设备ID: </label>{{device.deviceName}}</li>
            <li><label>软件版本: </label>{{device.sys_version}}</li>
            <li>
              <el-col :span="12"><label>物联卡号: </label>{{device.imei}}</el-col>
              <el-col :span="12"><label>投运日期: </label>{{device.createTime}}</el-col>
            </li>
            <li>
              <el-col :span="12"><label>报警次数: </label>{{device.warning}}</el-col>
              <el-col :span="12"><label>功率: </label>{{power}} kW</el-col>
            </li>
            <li>
              <el-col :span="12"><label>温度阈值: </label><span v-if="device.maxTemp != -1">{{device.maxTemp}}℃</span><span v-else>N/A</span></el-col>
              <el-col :span="12"><label>漏电阈值: </label><span v-if="device.maxLeak != -1">{{device.maxLeak}}mA</span><span v-else>N/A</span></el-col>
            </li>
            <li>
              <el-col :span="12"><label>网络类型: </label>{{device.ctnet}}</el-col>
              <el-col :span="12"><label>硬件版本: </label>{{device.prog_version}}</el-col>
            </li>
            <li>
              <el-col :span="12"><label>消音: </label>{{parseInt(device.switch) === 0 ? '打开' : '关闭'}}</el-col>
              <el-col :span="12"><label>性质: </label>{{device.nature ? '工贸楼' : '住宅楼'}}</el-col>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <ul>
            <li class="title">
              远程控制
            </li>
            <li>
              <el-row class="control-con">
                <el-col :span="8">
                  <a @click="rebootDevice">
                    <el-button type="primary" icon="pcon pcon-reset" circle></el-button>
                    <span>通讯模块重启</span>
                  </a>
                </el-col>
                <!-- <el-col :span="6">
                  <a @click="muteDevice(1)">
                    <el-button type="primary" icon="pcon pcon-noice" circle></el-button>
                    <span>设备响铃</span>
                  </a>
                </el-col> -->
                <el-col :span="8">
                  <a @click="muteDevice(0)">
                    <el-button type="primary" icon="pcon pcon-bell-off" circle></el-button>
                    <span>报警静音</span>
                  </a>
                </el-col>
                <el-col :span="8">
                  <a @click="resetDevice">
                    <el-button type="primary" icon="pcon pcon-refresh" circle></el-button>
                    <span>报警状态复位</span>
                  </a>
                </el-col>
              </el-row>
            </li>
          </ul>
        </el-card>
        <el-card>
          <ul>
            <li class="title">维护人员</li>
            <li style="height: 6.9rem;overflow-y: auto;">
              <template v-if="!device.users">
                <template>
                  <el-alert title="请联系运营人员关联主体责任人" showIcon type="warning" :closable="false" style="margin-top: 1rem;"></el-alert>
                </template>
              </template>
              <el-row v-else>
                <template v-for="item in device.users">
                  <el-col :span="8" :key="item.trueName"><label>姓名: </label>{{item.trueName}}</el-col>
                  <el-col :span="12" :key="item.mobile"><label>电话: </label>{{item.mobile}}</el-col>
                  <el-col :span="4" :key="item.userName"></el-col>
                </template>
              </el-row>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card>
          <ul>
            <li class="title">
              设备运行参数
              <span class="pull-right info">最后上报: {{device.lastTime ? device.lastTime : '暂无上报'}}</span>
            </li>
            <li style="padding: 1rem .5rem;">
              <div class="run-map" v-if="device.electricity0">
                <Galv title="A相电流" :value="parseFloat(device.electricity0)"></Galv>
              </div>
              <div class="run-map" v-if="device.electricity1">
                <Galv title="B相电流" :value="parseFloat(device.electricity1)"></Galv>
              </div>
              <div class="run-map" v-if="device.electricity2">
                <Galv title="C相电流" :value="parseFloat(device.electricity2)"></Galv>
              </div>
              <div class="run-map" v-if="device.leak">
                <Galv title="漏电流" :value="parseFloat(device.leak)" :warnValue="parseFloat(device.maxLeak)" unit="mA"></Galv>
              </div>
              <div class="run-map" v-if="device.temperature0">
                <gauge title="温度1" :value="parseFloat(device.temperature0)" :warnValue="parseFloat(device.maxTemp)"></gauge>
              </div>
              <div class="run-map" v-if="device.temperature1">
                <gauge title="温度2" :value="parseFloat(device.temperature1)" :warnValue="parseFloat(device.maxTemp)"></gauge>
              </div>
              <div class="run-map" v-if="device.temperature2">
                <gauge title="温度3" :value="parseFloat(device.temperature2)" :warnValue="parseFloat(device.maxTemp)"></gauge>
              </div>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card>
          <ul>
            <li class="title">
              设备历史数据
              <span class="pull-right">
                <i :class="'success pcon ' + (showChart ? 'pcon-table' : 'pcon-linechart' )" @click="showChart = !showChart"></i>
              </span>
            </li>
            <li style="padding: 1rem .5rem;">
              <log-chart v-show="showChart"></log-chart>
              <log-table v-show="!showChart"></log-table>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <ul>
            <li class="title">
              近期报警次数
              <router-link :to="'/warning?deviceName=' + deviceId" class="pull-right success">更多</router-link>
            </li>
            <li style="padding: 1rem .5rem;">
              <warn-chart></warn-chart>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <ul>
            <li class="title">
              设备调试
            </li>
            <li>
              <el-row class="control-con" style="padding: 4rem 0;">
                <el-col :span="12" v-if="role === 4">
                  <a @click="dialogFormVisible = true">
                    <el-button type="primary" icon="el-icon-upload" circle></el-button>
                    <span>上传日志</span>
                  </a>
                </el-col>
                <el-col :span="12" v-if="role === 4">
                  <a @click="dialogFormVisible1 = true">
                    <el-button type="primary" icon="el-icon-error" circle></el-button>
                    <span>删除日志包</span>
                  </a>
                </el-col>
                <el-col :span="12" v-if="role === 4">
                  <a @click="deleteLogFolder">
                    <el-button type="primary" icon="el-icon-remove" circle></el-button>
                    <span>清空日志</span>
                  </a>
                </el-col>
                <el-col :span="12">
                  <a @click="deleteDevice">
                    <el-button type="primary" icon="pcon pcon-level-down" circle></el-button>
                    <span>设备下线</span>
                  </a>
                </el-col>
              </el-row>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="选择时间" :visible.sync="dialogFormVisible" center width="30%">
      <el-form>
        <el-form-item label="日志时间">
          <el-date-picker v-model="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" size="small" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadLog">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择时间" :visible.sync="dialogFormVisible1" center width="30%">
      <el-form>
        <el-form-item label="日志时间">
          <el-date-picker v-model="date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" size="small" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="deleteLog">确 定</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>
<script>
import Galv from 'components/chart/galv'
import Gauge from 'components/chart/gauge'
import Breadcrumb from 'components/until/breadcrumb'
import LogChart from './chart/run'
import WarnChart from './chart/warning'
import LogTable from './logTable'
import sessionMixin from '@/until/session'
import {catchError, getDevice, controlDevice, deleteDevice} from '@/api/api'
export default {
  components: {
    LogTable,
    WarnChart,
    LogChart,
    Gauge,
    Galv,
    Breadcrumb
  },
  mixins: [sessionMixin],
  name: 'deviceDetail',
  data () {
    return {
      dialogFormVisible: false,
      dialogFormVisible1: false,
      id: this.$route.params.id,
      deviceId: this.$route.params.deviceId,
      device: {},
      power: 0,
      showChart: true,
      date: '',
      userName: ''
    }
  },
  computed: {
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'},
        {title: '智能监控', to: '/project'}
      ]
      let session = this.session
      if (session) {
        for (let i = 0; i < session.length; i++) {
          if (session[i].area) {
            temp.push({title: session[i].title, to: '/project/' + session[i].id + '/device'})
          } else if (session[i].deviceName) {
            temp.push({title: session[i].title ? session[i].title : session[i].imei})
          } else {
            temp.push({title: session[i].title, to: '/project/' + session[i].id})
          }
        }
      }
      return temp
    }
  },
  methods: {
    getDevice () {
      getDevice({deviceName: this.deviceId}).then(datas => {
        let {errno, msg, data} = datas
        if (errno === 0) {
          this.device = data
          this.power = 220 * (parseFloat(data.electricity0) + parseFloat(data.electricity1) + parseFloat(data.electricity2)) / 1000
        } else {
          this.$message.error(msg)
        }
      })
    },
    rebootDevice () {
      this.$confirm('您确定要重启通讯模块' + this.deviceId + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.controlDevice({ deviceName: this.deviceId, action: 'reboot' })
      }).catch(() => { })
    },
    resetDevice () {
      this.$confirm('您确定要复位报警状态' + this.deviceId + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.controlDevice({ deviceName: this.deviceId, line: 0, action: 'reset' })
      }).catch(() => { })
    },
    controlDevice (ajax) {
      // 复位或重启ajax请求
      return new Promise((resolve, reject) => {
        controlDevice(ajax).then(datas => {
          let {errno, msg} = datas
          this.$message({
            type: errno === 0 ? 'success' : 'error',
            message: msg
          })
          resolve(errno)
        }).catch(e => catchError(e, this))
      })
    },
    muteDevice (state) {
      // 消音或者响铃设备
      this.$confirm('您确定要' + (state ? '响铃' : '消音') + '设备' + this.deviceId + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.controlDevice({ deviceName: this.deviceId, value: state, action: 'mute' }).then(errno => {
          if (errno === 0) {
            this.device.switch = state
          }
        })
      }).catch(() => { })
    },
    uploadLog () {
      let params = { deviceName: this.deviceId, action: 'upload' }
      if (this.date) {
        params.stime = this.date[0]
        params.etime = this.date[1]
      }
      this.controlDevice(params).then(data => { this.dialogFormVisible = false })
    },
    deleteLog () {
      let params = { deviceName: this.deviceId, action: 'delete' }
      if (this.date) {
        params.stime = this.date[0]
        params.etime = this.date[1]
      }
      this.controlDevice(params).then(data => { this.dialogFormVisible1 = false })
    },
    deleteLogFolder () {
      this.$confirm('您确定要清空设备' + this.deviceId + '日志吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.controlDevice({ deviceName: this.deviceId, action: 'deletes' })
      }).catch(() => { })
    },
    deleteDevice () {
      this.$confirm('您确定要下线设备' + this.deviceId + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDevice({deviceName: this.deviceId}).then(datas => {
          let {errno, msg} = datas
          if (errno === 0) {
            this.$router.push({path: '/project/' + this.id + '/device'})
          } else {
            this.$message.error(msg)
          }
        }).catch((e) => {
          let msg = typeof (e.response.data.msg) !== 'undefined' ? e.response.data.msg : e.toString()
          this.$message.error(msg)
        })
      }).catch(() => {})
    }
  },
  beforeMount () {
    this.getDevice()
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
  .pcon{
    cursor: pointer;
  }
  .el-card {
    background: #f8fff7;
    border-top: 4px solid #003f96;
    margin: 0 1rem 1rem 0;
    box-shadow: none;
    ul {
      list-style: none;
      margin: -1.6rem;
      padding: 0;
      line-height: 2.7rem;
      font-size: 1.4rem;
      li {
        border-bottom: 1px solid #ebf0e9;
        padding: 0 1rem;
        overflow: hidden;
        &:last-child {
          border-bottom: none;
        }
        &.title{
          font-size: 1.6rem;
          .pull-right{
            font-size: 1.4rem;
          }
        }
        .success{
          color: #068e06;
        }
        .info{
          color: #999;
        }
        .danger{
          color: #f60100;
        }
        .warning{
          color: #976408;
        }
        label{
          width: 5rem;
          display: inline-block;
          text-align: right;
          padding-right: 1rem;
        }
        .run-map{
          width: 100%/7;
          float: left;
        }
      }
    }
    .control-con{
      padding: .5rem 1rem;
      text-align: center;
      a{
        .el-button{
          font-size: 2.6rem;
        }
        span{
          display: block;
        }
      }
    }
  }
  .el-icon-delete{
    color: #f60100;
    cursor: pointer;
  }
</style>
