<template>
  <div>
    <div class="EmpHeader">
      <div class="EmpInput">
        <el-input
            v-model="empName"
            @click="initEmps"
            prefix-icon="el-icon-search"
            clearable
            @clear="initEmps"
            placeholder="请输入员工名称"></el-input>
        <el-button
            @click="initEmps"
            type="primary"
            icon="el-icon-search">搜索
        </el-button>
        <el-button type="primary">
          <i class="fa fa-angle-double-down" aria-hidden="true"></i>高级搜索
        </el-button>
      </div>
      <div>
        <el-button type="success">
          <i class="fa fa-level-up" aria-hidden="true"></i>导入数据
        </el-button>
        <el-button type="success">
          <i class="fa fa-level-down" aria-hidden="true"></i>导出数据
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">添加员工</el-button>
      </div>
    </div>
    <div>
      <el-table
          :data="emps"
          stripe
          border
          v-loading="loading"
          element-loading-text="拼命加载中"
          style="width: 100%">
        <el-table-column
            type="selection"
            width="40">
        </el-table-column>
        <!--        <el-table-column-->
        <!--            prop="id"-->
        <!--            label="员工编号"-->
        <!--            width="50">-->
        <!--        </el-table-column>-->
        <el-table-column
            prop="name"
            label="姓名"
            fixed
            width="60">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            width="50">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            width="100">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="idCard"
            label="身份证号码"
            width="150">
        </el-table-column>
        <el-table-column
            prop="wedlock"
            label="婚姻状态"
            width="70">
        </el-table-column>
        <el-table-column
            prop="nation.name"
            label="民族"
            width="50">
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            label="籍贯"
            width="60">
        </el-table-column>
        <el-table-column
            prop="politicsStatus.name"
            label="政治面貌"
            width="100">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="160">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="手机号"
            width="110">
        </el-table-column>
        <el-table-column
            prop="address"
            label="联系地址"
            width="300">
        </el-table-column>
        <el-table-column
            prop="department.name"
            label="部门"
            width="100">
        </el-table-column>
        <el-table-column
            prop="position.name"
            label="职位"
            width="100">
        </el-table-column>
        <el-table-column
            prop="joblevel.name"
            label="职称"
            width="100">
        </el-table-column>
        <el-table-column
            prop="engageForm"
            label="聘用形式"
            width="100">
        </el-table-column>
        <el-table-column
            prop="tiptopDegree"
            label="最高学历"
            width="70">
        </el-table-column>
        <el-table-column
            prop="school"
            label="毕业学校"
            width="150">
        </el-table-column>
        <el-table-column
            prop="specialty"
            label="专业"
            width="100">
        </el-table-column>
        <el-table-column
            prop="workState"
            label="在职状态"
            width="70">
        </el-table-column>
        <el-table-column
            prop="beginDate"
            label="入职日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="conversionTime"
            label="转正日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="beginContract"
            label="合同起始日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="endContract"
            label="合同终止日期"
            width="100">
        </el-table-column>
        <el-table-column
            prop="salaryId"
            label="合同期限"
            width="80">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag>
            年
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            fixed="right"
            width="300">
          <template slot-scope="scope">
            <el-button>编辑</el-button>
            <el-button type="primary">查看高级资料</el-button>
            <el-button type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="EmpPagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10,20,30,50,100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog
        title="添加员工"
        :visible.sync="dialogVisible"
        width="80%"
        class="addEmpDiaLag">
      <el-form ref="empForm" :model="emp">

        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="emp.name"
                        placeholder="请输入员工姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="性别" prop="gender" size="mini">
              <el-radio-group v-model="emp.gender" size="mini">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                  v-model="emp.birthday"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="emp.idCard" placeholder="请输入身份证号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="政治面貌" prop="politicId">
              <el-select v-model="emp.politicId"
                         placeholder="请选择">
                <el-option
                    v-for="item in politicsStatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="民族" prop="nationId">
              <el-select v-model="emp.nationId" placeholder="请选择" style="width: 200px">
                <el-option
                    v-for="item in nation"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="籍贯" prop="nativePlace">
              <el-input v-model="emp.nativePlace" placeholder="请输入籍贯"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="emp.email" placeholder="请输入电子邮箱"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系地址" prop="address">
              <el-input v-model="emp.address" placeholder="请输入联系地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="职位" prop="posId">
              <el-select v-model="emp.posId" placeholder="请选择" style="width: 200px">
                <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职称" prop="jobLevelId">
              <el-select v-model="emp.jobLevelId" placeholder="请选择" style="width: 200px">
                <el-option
                    v-for="item in joblevel"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属部门" prop="departmentId">
              <el-input v-model="emp.departmentId" placeholder="请输入部门"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电话号码" prop="phone">
              <el-input v-model="emp.phone" placeholder="请输入电话号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="工号" prop="workID">
              <el-input v-model="emp.workID" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学历" prop="tiptopDegree">
              <el-select v-model="emp.tiptopDegree" placeholder="请选择" style="width: 200px">
                <el-option
                    v-for="item in tiptopDegree"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="毕业院校" prop="school">
              <el-input v-model="emp.school" placeholder="请输入毕业院校"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="专业名称" prop="specialty">
              <el-input v-model="emp.specialty" placeholder="请输入专业名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="入职日期" prop="beginDate">
              <el-date-picker
                  v-model="emp.beginDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转正日期" prop="conversionTime">
              <el-date-picker
                  v-model="emp.conversionTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同起始日期" prop="beginContract">
              <el-date-picker
                  v-model="emp.beginContract"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同终止日期" prop="endContract">
              <el-date-picker
                  v-model="emp.endContract"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="聘用形式" prop="engageForm">
              <el-radio-group v-model="emp.engageForm">
                <el-radio label="劳动合同" border>劳动合同</el-radio>
                <el-radio label="劳务合同" border>劳务合同</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="婚姻状况" prop="wedlock">
              <el-radio-group v-model="emp.wedlock">
                <el-radio label="已婚" border>已婚</el-radio>
                <el-radio label="未婚" border>未婚</el-radio>
                <el-radio label="离异" border>离异</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      emps: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      empName: '',
      dialogVisible: false,
      emp: {
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlace: '',
        politicId: null,
        email: '',
        phone: '',
        address: '',
        departmentId: null,
        jobLevelId: null,
        posId: '',
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '',
        workID: '',
        contractTerm: null,
        conversionTime: '',
        notWorkDate: null,
        beginContract: '',
        endContract: '',
        workAge: null,
        salaryId: null
      },
      nation: [],
      joblevel: [],
      politicsStatus: [],
      positions: [],
      tiptopDegree: ['博士', '硕士', '本科', '大专', '高中', '初中', '小学', '其他',]
    }
  },
  mounted() {
    this.initEmps();
    this.initData();
  },
  methods: {
    initEmps() {
      this.loading = true;
      this.getRequest('/employee/basic/' +
          '?currentPage=' + this.currentPage +
          '&size=' + this.size +
          '&name=' + this.empName).then(resp => {
        this.loading = false;
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
        }
      })
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.initEmps();
    },
    handleSizeChange(size) {
      this.size = size;
      this.initEmps()
    },
    showAddEmpView() {
      this.dialogVisible = true
      this.initPositions();
      this.getMaxWorkerId();
    },
    initData() {
      if (!window.sessionStorage.getItem('nation')) {
        this.getRequest('/employee/basic/nation').then(resp => {
          if (resp) {
            this.nation = resp;
            window.sessionStorage.setItem('nation', JSON.stringify(resp));
          }
        })
      } else {
        this.nation = JSON.parse(window.sessionStorage.getItem('nation'))
      }
      if (!window.sessionStorage.getItem('joblevel')) {
        this.getRequest('/employee/basic/joblevel').then(resp => {
          if (resp) {
            this.joblevel = resp;
            window.sessionStorage.setItem('joblevel', JSON.stringify(resp));
          }
        })
      } else {
        this.joblevel = JSON.parse(window.sessionStorage.getItem('joblevel'))
      }
      if (!window.sessionStorage.getItem('politicsStatus')) {
        this.getRequest('/employee/basic/politicsStatus').then(resp => {
          if (resp) {
            this.politicsStatus = resp;
            window.sessionStorage.setItem('politicsStatus', JSON.stringify(resp));
          }
        })
      } else {
        this.politicsStatus = JSON.parse(window.sessionStorage.getItem('politicsStatus'))
      }
    },
    initPositions() {
      this.getRequest('/employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    getMaxWorkerId() {
      this.getRequest('/employee/basic/maxWorkID').then(resp => {
        if (resp) {
          this.emp.workID = resp.object;
        }
      })
    }
  }
}
</script>

<style>

.EmpInput .el-input {
  width: 200px;
  margin-right: 10px;
}

.EmpHeader {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.EmpPagination {
  display: flex;
  justify-content: flex-end;
}

.addEmpDiaLag .el-input {
  width: 210px;
}

</style>