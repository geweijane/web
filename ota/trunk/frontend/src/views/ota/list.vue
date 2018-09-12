<template>
  <el-container direction="vertical">
    <h3>固件版本升级管理</h3>
    <el-row>
      <el-button size="small" type="primary" @click="showO(null)">新增固件版本</el-button>
      <el-button size="small" type="primary" @click="showOt(null)">新增固件系列</el-button>
      <el-button size="small" type="primary" @click="showC(null)">新增芯片</el-button>
    </el-row>
    <el-tabs type="border-card" style="margin-top: 20px;">
      <el-tab-pane label="固件版本列表">
        <el-form :inline="true" :model="ota.search">
          <el-form-item label="固件类型">
            <el-select v-model="ota.search.type" @change="searchOta" size="small">
              <el-option :value="0" label="全部固件"></el-option>
              <el-option v-for="item in otaType.data" :key="item.id" :label="`${item.chip}-${item.project}-${item.customer}`" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="searchOta">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="ota.data">
          <el-table-column type="expand" width="40px">
            <template slot-scope="props">
              <el-form label-width="100px">
                <el-form-item label="备注" v-if="props.row.remark !== ''">{{props.row.remark}}</el-form-item>
                <el-form-item :label="props.row.chip_type" v-if="props.row.content !== '' && props.row.content !== null ">{{props.row.content}}</el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="版本号" prop="version" width="100px"></el-table-column>
          <el-table-column label="固件类型">
            <template slot-scope="props">
              {{props.row.chip + '-' + props.row.project + '-' + props.row.customer}}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="create_time" width="160px"></el-table-column>
          <el-table-column label="更新时间" prop="update_time" width="160px"></el-table-column>
          <el-table-column label="状态" width="100px">
            <template slot-scope="props">
              <el-tag>{{status[props.row.status]}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="props">
              <a download :href="props.row.file"><el-button type="text">下载文件</el-button></a>
              <template v-if="parseInt(props.row.status) === 0">
                <el-button type="text" @click="showVerify(props.row, true)">提交验证</el-button>
                <el-button type="text" @click="showO(props.row)">编辑</el-button>
              </template>
              <template v-if="parseInt(props.row.status) === 1">
                <el-button type="text" @click="confrimVerify(props.row, props.$index)">确认验证</el-button>
              </template>
              <template v-if="parseInt(props.row.status) === 2 || parseInt(props.row.status) === 4">
              <el-button type="text" @click="showVerify(props.row, false)">发布推送</el-button>
              </template>
              <template v-if="parseInt(props.row.status) === 3">
                <el-button type="text" @click="stopPublish(props.row, props.$index)">停止发布</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-pager v-if="ota.page.total > pageSize" :total="ota.page.total" :page-size="pageSize" :current-page="ota.page.p" @current-change="otaPageChange"></el-pager>
      </el-tab-pane>
      <el-tab-pane label="固件类型列表">
        <el-table :data="otaType.data">
          <el-table-column label="芯片类型" prop="chip" width="80px"></el-table-column>
          <el-table-column label="客户名称" prop="customer"></el-table-column>
          <el-table-column label="项目名称" prop="project"></el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="创建时间" prop="create_time" width="160px"></el-table-column>
          <el-table-column label="更新时间" prop="update_time" width="160px"></el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot-scope="props">
              <el-button type="text" @click="showOt(props.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="芯片列表">
        <el-table :data="chips.data">
          <el-table-column label="芯片" prop="chip"></el-table-column>
          <el-table-column label="地址类型" prop="type"></el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="props">
              <el-button type="text" @click="showC(props.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="升级测试">
        <el-form ref="uForm" :model="upgrade" :rules="rules" label-width="200px">
          <el-form-item label="结果">
            <el-input type="textarea" v-model="upgrade.result" :autosize="{minRows: 6}" size="small" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="版本号( version )" prop="version">
            <el-input size="small" v-model.trim="upgrade.version"></el-input>
          </el-form-item>
          <el-form-item label="mac或imei地址( content )" prop="content" required>
            <el-input size="small" v-model.trim="upgrade.content"></el-input>
          </el-form-item>
          <el-form-item label="项目名称( project )" prop="project">
            <el-input size="small" v-model.trim="upgrade.project"></el-input>
          </el-form-item>
          <el-form-item label="客户名称( customer )" prop="customer">
            <el-input size="small" v-model.trim="upgrade.customer"></el-input>
          </el-form-item>
          <el-form-item label="芯片( chip )" prop="chip">
            <el-input size="small" v-model.trim="upgrade.chip"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="upgradeFrom('uForm')">测试</el-button>
            <el-button @click="resetForm('uForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="`${otaType.title}固件系列`" :visible.sync="otaType.visible" >
      <el-form ref="otForm" :model="otaType.form" :rules="rules" label-suffix=":" label-width="100px">
        <el-form-item label="芯片类型" prop="chip" required>
          <el-select v-model="otaType.form.chip">
            <el-option v-for="item in chips.data" :key="item.chip" :label="item.chip" :value="item.chip"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="customer">
          <el-input v-model.trim="otaType.form.customer"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="project">
          <el-input v-model.trim="otaType.form.project"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model.trim="otaType.form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="otaType.visible = false">取 消</el-button>
        <el-button type="primary" @click="addOtaType">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="`${ota.title}固件版本`" :visible.sync="ota.visible">
      <el-form ref="oForm" :model="ota.form" :rules="rules" label-suffix=":" label-width="100px">
        <template v-if="ota.editId === ''">
          <el-form-item label="版本号" prop="version">
            <el-input type="text" v-model.trim="ota.form.version"></el-input>
          </el-form-item>
          <el-form-item label="固件类型" prop="type">
            <el-select type="text" v-model="ota.form.type">
              <el-option v-for="item in otaType.data" :key="item.chip" :label="`${item.chip}-${item.project}-${item.customer}`" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="版本文件" prop="file">
          <file-upload @uploadSuccess="handleSuccess" apiUrl="upload" :autoUpload="true" :fileSize="2" :fileType="{ bin: 'application/octet-stream' }" :multiple="false"></file-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model.trim="ota.form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ota.visible = false">取 消</el-button>
        <el-button type="primary" @click="addOta">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="`${verify.title}固件版本`" :visible.sync="verify.visible">
      <el-form ref="vForm" :model="verify.form" :rules="rules" label-width="100px" label-suffix=":">
        <el-form-item :label="`${verify.form.chip_type}地址`" prop="content" required>
          <el-select v-model="verify.form.type" v-if="verify.title === '发布'">
            <el-option :label="`所有${verify.form.chip_type}地址`" value="all"></el-option>
            <el-option :label="`特定${verify.form.chip_type}地址`" value=""></el-option>
          </el-select>
          <template v-if="verify.form.type === ''">
            <el-input class="mt-10" type="textarea" v-model.trim="verify.form.content" :autosize="{minRows:4}"></el-input>
            <el-alert class="mt-10" :closable="false" title="多个请换行，区间段请添加-，具体参考下面示例,其中15位的imei" show-icon type="warning">
            </el-alert>
            <pre class="mac-tip">
mac地址
000000000001
000000000003-000000000005
imei地址
000000000000008
000000000000011-000000000000015
            </pre>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="verify.visible = false">取 消</el-button>
        <el-button type="primary" @click="verifyOta">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="(chips.editId !== '' ? '编辑' : '新增') + '芯片'" :visible.sync="chips.visible">
      <el-form :model="chips.form" :rules="rules" ref="cForm" label-width="100px" label-suffix=":">
        <el-form-item label="芯片" prop="chip">
          <el-input v-model="chips.form.chip" :disabled="chips.editId !== ''"></el-input>
        </el-form-item>
        <el-form-item label="地址类型" prop="type">
          <el-radio v-model="chips.form.type" label="mac">MAC</el-radio>
          <el-radio v-model="chips.form.type" label="imei">IMEI</el-radio>
          <el-tooltip placement="top" style="margin-left: 20px;">
            <div slot="content">地址类型决定你的芯片是wifi还是手机，请慎重选择</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chips.visible = false">取 消</el-button>
        <el-button type="primary" @click="addChips">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import FileUpload from '@c/upload/normal.vue';
import { addOtaType, editOtaType, deleteOtaType, getOtaType,
  listOtaType, addOta, editOta, deleteOta, getOta, listOta,
  addChip, upgrade, listChip, editChip } from '@/api';

export default {
  name: 'otaList',
  components: { FileUpload },
  data() {
    const validMac = ( value, callback) => {
      if (this.verify.form.type === 'all') {
        callback();
      } else if (value.trim() === '') {
        callback(new Error('MAC不能为空'));
      } else {
        let arr = value.split('\n');
        let reg = /^([a-f0-9]{2}){6}$/;
        let msg = '';
        for (let i = 0; i < arr.length; i++) {
          let temp = arr[i].split('-');
          if (temp.length === 1) {
            if (!reg.test(temp[0])) {
              msg += `MAC地址第${i + 1}行格式不对; `;
            }
          } else if (temp.length === 2) {
            if (!reg.test(temp[0]) && !reg.test(temp[1])) {
              msg += `MAC地址第${i + 1}行格式不对; `;
            } else {
              if (parseInt(temp[0], 16) >= parseInt(temp[1], 16)) {
                msg += `MAC地址第${i + 1}行大小不对第一个地址应小于第二个地址; `;
              }
            }
          }
        }
        if (msg === '') {
          callback();
        } else {
          callback(new Error(msg));
        }
      }
    }
    const validImei = (value, callback) => {
      if (this.verify.form.type === 'all') {
        callback();
      } else if (value.trim() === '') {
        callback(new Error('imei不能为空'));
      } else {
        let arr = value.split('\n');
        let reg = /^\d{15}$/;
        let msg = '';
        for (let i = 0; i < arr.length; i++) {
          let temp = arr[i].split('-');
          if (temp.length === 1) {
            if (!reg.test(temp[0])) {
              msg += `imei地址第${i + 1}行格式不对; `;
            }
          } else if (temp.length === 2) {
            if (!reg.test(temp[0]) && !reg.test(temp[1])) {
              msg += `imei地址第${i + 1}行格式不对; `;
            } else {
              if (parseInt(temp[0], 10) >= parseInt(temp[1], 10)) {
                msg += `imei地址第${i + 1}行大小不对第一个地址应小于第二个地址; `;
              }
            }
          }
        }
        if (msg === '') {
          callback();
        } else {
          callback(new Error(msg));
        }
      }
    }
    return {
      otaType: {
        visible: false,
        editId: '',
        title: '新增',
        form: {
          chip: null,
          project: '',
          customer: '',
          remark: '',
        },
        page: {
          total: 0,
          p: 1,
        },
        data: [],
      },
      ota: {
        visible: false,
        editId: '',
        title: '新增',
        form: {
          version: '',
          type: '',
          remark: '',
          file: '',
        },
        page: {
          total: 0,
          p: 1,
        },
        data: [],
        search: {
          type: 0,
        },
      },
      verify: {
        title: '',
        visible: false,
        form: {
          type: 'all',
          content: '',
          id: '',
          status: '',
          chip_type: '',
        },
      },
      chips: {
        visible: false,
        editId: '',
        form: {
          chip: '',
          type: 'mac',
        },
        data: [],
      },
      rules: {
        project: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
          { type: 'string', min: 2, max: 50, message: '项目名称长度在2-50个字符之间', trigger: 'blur' },
        ],
        customer: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' },
          { type: 'string', min: 2, max: 50, message: '客户名称长度在2-50个字符之间', trigger: 'blur' },
        ],
        file: [
          { required: true, message: '文件名称不能为空' },
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' },
        ],
        version: [
          { required: true, message: '固件版本不能为空', trigger: 'blur' },
          { regexp: '^\\d+(\\.\\d+){2}$', message: '版本号格式不对, 格式为x.y.z', trigger: 'blur' },
        ],
        chip: [
          { required: true, message: '芯片不能为空', trigger: 'blur' },
          { type: 'string', min: 4, max: 12, message: '芯片长度在4-12个字符之间', trigger: 'blur' },
        ],
        content: [
          {
            trigger: 'blur',
            validator: (rules, value, callback) => {
              if (this.verify.form.chip_type === 'mac') {
                validMac( value, callback);
              } else {
                validImei(value, callback);
              }
            }
          }
        ]
      },
      pageSize: 20,
      status: {
        0: '未验证',
        1: '验证中',
        2: '已验证',
        3: '发布中',
        4: '停止发布',
        '-1': '已删除',
      },
      upgrade: {
        version: '',
        content: '',
        project: '',
        customer: '',
        chip: '',
        result: '',
      },
    };
  },
  methods: {
    showOt (row) {
      this.otaType.visible = true;
      if (row !== null) {
        this.otaType.title = '编辑';
        this.otaType.editId = row.id;
        for (let index in this.otaType.form) {
          this.otaType.form[index] = row[index];
        }
      } else {
        this.otaType.title = '新增';
        this.otaType.editId = '';
        this.$nextTick(() => {
          this.$refs.otForm.resetFields();
        });
      }
    },
    addOtaType () {
      this.$refs.otForm.validate((valid) => {
        if (valid) {
          let id = this.otaType.editId;
          if (id !== '') {
            editOtaType({...this.otaType.form, id: id}).then(datas => {
              let {data} = datas;
              this.$message.success('修改固件类型成功');
              let index = this.otaType.data.findIndex(n => n.id === id)
              if (index !== -1) {
                let temp = this.otaType.data[index];
                temp.chip = data.chip;
                temp.customer = data.customer;
                temp.project = data.project;
                temp.remark = data.remark;
                temp.update_time = data.update_time;
              }
              this.otaType.visible = false;
            }).catch(e => {
              this.$message.error(e.message);
            });
          } else {
            addOtaType({...this.otaType.form}).then(datas => {
              this.$message.success('新增固件类型成功');
              this.otaType.data.push(datas.data);
              this.otaType.visible = false;
            }).catch(e => {
              this.$message.error(e.message);
            });
          }
        }
      })
    },
    listOtaType () {
      listOtaType().then(datas => {
        let {data} = datas;
        this.otaType.data = data;
      })
    },
    handleSuccess (url) {
      this.ota.form.file = url;
    },
    showO (row) {
      this.ota.visible = true;
      if (row === null) {
        this.ota.editId = '';
        this.ota.title = '新增';
        this.$nextTick(() => {
          this.$refs.oForm.resetFields();
        })
      } else {
        this.ota.editId = row.id;
        this.ota.title = '编辑';
        this.ota.form.file = row.file;
        this.ota.form.remark = row.remark;
      }
    },
    addOta () {
      this.$refs.oForm.validate((valid) => {
        if (valid) {
          let id = this.ota.editId;
          if (id === '') {
            addOta({...this.ota.form}).then(datas => {
              let {data, msg} = datas;
              this.ota.visible = false;
              this.ota.data.push(data);
              this.$message.success(msg);
            }).catch(e => {
              this.$message.error(e.message);
            })
          } else {
            editOta({file: this.ota.form.file, remark: this.ota.form.remark, id: this.ota.editId}).then(datas => {
              let {data, msg} = datas;
              this.ota.visible = false;
              this.$message.success(msg);
              let index = this.ota.data.findIndex(n => n.id === id);
              if (index !== -1) {
                let temp = this.ota.data[index];
                temp.file = data.file;
                temp.remark = data.remark;
                temp.update_time = data.update_time;
              }
            }).catch(e => {
              this.$message.error(e.message);
            })
          }
        }
      })
    },
    listOta () {
      let ajaxData = {p: this.ota.page.p, pageSize: this.pageSize};
      if (this.ota.search.type !== 0) {
        ajaxData.type = this.ota.search.type;
      }
      listOta(ajaxData).then(datas => {
        let {total, data} = datas;
        this.ota.page.total = total;
        this.ota.data = data;
      })
    },
    otaPageChange (page) {
      this.ota.page.p = page;
      this.listOta();
    },
    stopPublish (row, index) {
      this.$confirm('您确定要停止发布该固件版本?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        editOta({id: row.id, status: 4}).then(datas => {
          let {msg, data} = datas;
          this.$message.success(msg);
          this.ota.data[index].status = data.status;
        }).catch(e => {
          this.$message.error(e.message);
        })
      }).catch(() => { });
    },
    verifyOta () {
      this.$refs.vForm.validate(valid => {
        if (valid) {
          let form = this.verify.form;
          let ajaxData = {status: form.status, id: form.id, content: form.type === 'all' ? '' : form.content};
          editOta(ajaxData).then(datas => {
            let {data, msg} = datas;
            this.verify.visible = false;
            this.$message.success(msg);
            let index = this.ota.data.findIndex(n => data.id === n.id);
            if (index !== -1) {
              let temp = this.ota.data[index];
              temp.status = data.status;
              temp.update_time = data.update_time;
              temp.content = data.content;
            }
          }).catch(e => {
            this.$message.error(e.message);
          })
        }
      })
    },
    confrimVerify (row, index) {
      this.$confirm('您确定该固件版本已经验证成功?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        editOta({id: row.id, status: 2}).then(datas => {
          let {msg, data} = datas;
          this.$message.success(msg);
          this.ota.data[index].status = data.status;
        }).catch(e => {
          this.$message.error(e.message);
        })
      }).catch(() => {
        editOta({id: row.id, status: 0}).then(datas => {
          let {msg, data} = datas;
          this.$message.success(msg);
          this.ota.data[index].status = data.status;
        }).catch(e => {
          this.$message.error(e.message);
        })
      });
    },
    showVerify (row, isverify) {
      this.verify.visible = true;
      this.verify.form.id = row.id;
      this.verify.form.content = row.content ? row.content : '';
      this.verify.form.chip_type = row.chip_type;
      this.verify.form.type = isverify ? '' : 'all';
      this.verify.form.status = isverify ? 1 : 3;
      this.verify.title = isverify ? '验证' : '发布';
    },
    searchOta () {
      this.$nextTick(() =>{
        this.otaPageChange(1);
      })
    },
    showC (row) {
      this.chips.visible = true;
      if (row === null) {
        this.chips.editId = '';
        this.$nextTick(() => {
          this.$refs.cForm.resetFields();
        })
      } else {
        this.chips.editId = row.chip;
        this.chips.form.chip = row.chip;
        this.chips.form.type = row.type;
      }
    },
    addChips () {
      this.$refs.cForm.validate(valid => {
        if (valid) {
          let action = this.chips.editId !== '' ? editChip: addChip;
          action({chip: this.chips.form.chip, type: this.chips.form.type}).then(datas => {
            this.chips.visible = false;
            if (this.chips.editId !== '') {
              let index = this.chips.data.findIndex(n => n.chip === datas.data.chip);
              ( index !== -1 ) && (this.chips.data[index].type = datas.data.type);
            } else {
              this.chips.data.push(datas.data);
            }
            this.$message.success(datas.msg);
          }).catch(e => {
            this.$message.error(e.message);
          })
        }
      })
    },
    listChip () {
      listChip().then(datas => {
        let {data} = datas;
        this.chips.data = data;
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    upgradeFrom (formName) {
      this.$refs[formName].validate( valid => {
        if (valid) {
          upgrade({...this.upgrade}).then(datas =>{
            this.upgrade.result = JSON.stringify(datas);
          }).catch(e => {
            this.upgrade.result = e.message;
          })
        }
      })
    }
  },
  beforeMount() {
    this.listChip();
    this.listOtaType();
    this.listOta();
  },
}
</script>
<style lang="less" scoped>
  .el-container{
    margin: 0 20px;
  }
  .mac-tip{
    background: #f8f8f8;
    font-size: 12px;
    line-height: 1.5;
    padding: 10px 0px 0px 10px;
    color: #808080;
    margin: 10px 0 0;
  }
  .mt-10{
    margin-top: 10px;
  }
</style>