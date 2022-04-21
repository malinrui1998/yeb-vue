<template>
  <div>
    <div>
      <el-input
          size="small"
          class="addJobInput"
          placeholder="添加职称"
          suffix-icon="el-icon-plus"
          style="width: 300px;margin-right: 10px"
          v-model="jl.name">
      </el-input>
      <el-select
          size="small"
          v-model="jl.titleLevel"
          clearable
          placeholder="请选择">
        <el-option
            v-for="item in titleLevels"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          @click="addJoblevel"
      >
        添加
      </el-button>
      <el-button
          size="small"
          type="danger"
          :disabled="this.multipleSelection.length==0"
          @click="deleteMany"
      >批量删除
      </el-button>
    </div>

    <div class="jobManaMain">
      <el-table
          :data="jls"
          stripe
          border
          style="width: 100%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            sortable
            width="75">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职称"
            width="120">
        </el-table-column>
        <el-table-column
            prop="titleLevel"
            label="职称等级"
            width="120">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间"
            width="200">
        </el-table-column>
        <el-table-column
            prop="enabled"
            label="是否启用"
            width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
            <el-tag v-else type="danger">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="showEditView(scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
        title="编辑职称"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <span>职称名称</span>
        <el-input v-model="updateJl.name" class="updatePosInput"></el-input>
      </div>
      <div>
        <span>职称等级</span>
        <el-select value="" v-model="updateJl.titleLevel" class="updatePosInput">
          <el-option
              v-for="item in titleLevels"
              :key="item"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
      </div>
      <div style="margin-top: 10px;">
        <span>是否启用</span>
        <el-switch
            v-model="updateJl.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            style="margin-left: 10px"
        ></el-switch>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
     <el-button type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "JoblevelMana",
  data() {
    return {
      jl: {
        name: '',
        titleLevel: '',
        enabled: ''
      },
      dialogVisible: false,
      titleLevels: [
        '正高级',
        '副高级',
        '中级',
        '初级',
        '员级'
      ],
      jls: [],
      updateJl: {
        name: '',
        titleLevel: '',
        enabled: '',
      },
      multipleSelection: []
    }
  },
  mounted() {
    this.initJls();
  },
  methods: {
    //获取职称信息
    initJls() {
      this.getRequest('/system/basic/joblevel/').then(resp => {
        this.jls = resp;
        this.jl.name = '';
        this.jl.titleLevel = ''
      })
    },
    //添加职位信息
    addJoblevel() {
      if (this.jl.name && this.jl.titleLevel) {
        this.postRequest('/system/basic/joblevel/', this.jl).then(resp => {
          if (resp) {
            this.initJls();
          }
        })
      } else {
        this.$message.warning("职称信息未完善")
      }

    },
    //编辑职称Dialog
    showEditView(data) {
      this.dialogVisible = true;
      Object.assign(this.updateJl, data);
      this.updateJl.createDate = '';

    },
    //更新职称信息
    doUpdate() {
      if (this.updateJl.name && this.updateJl.titleLevel) {
        this.putRequest('/system/basic/joblevel/', this.updateJl).then(resp => {
          if (resp) {
            this.dialogVisible = false;
            this.initJls();
          }
        })
      } else {
        this.$message.warning("职称信息未完善")
      }
    },
    //删除职称
    handleDelete(data) {
      this.$confirm('此操作将永久删除[' + data.name + ']职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/joblevel/' + data.id).then(resp => {
          if (resp) {
            this.initJls();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //批量选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    deleteMany() {
      this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']条职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        });
        this.deleteRequest('/system/basic/joblevel/' + ids).then(resp => {
          if (resp) {
            this.initJls();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>

.jobManaMain {
  margin-top: 10px;
}
.updatePosInput {
  width: 70%;
  margin-left: 10px;
  margin-top: 10px;
}
</style>