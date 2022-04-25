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
        <el-button type="primary" icon="el-icon-plus">添加员工</el-button>
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
        <el-table-column
            prop="id"
            label="员工编号"
            width="50">
        </el-table-column>
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
      empName: ''
    }
  },
  mounted() {
    this.initEmps();
  },
  methods: {
    initEmps() {
      this.loading = true;
      this.getRequest('/employee/basic/' +
          '?currentPage=' + this.currentPage +
          '&size=' + this.size +
          '&name='+this.empName).then(resp => {
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
    }
  }
}
</script>

<style>

.EmpInput .el-input {
  width: 300px;
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

</style>