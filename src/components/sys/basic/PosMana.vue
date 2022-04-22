<template>
  <div>
    <div>
      <el-input
          size="small"
          class="addPosInput"
          placeholder="添加职位"
          prefix-icon="el-icon-plus"
          @keydown.enter.native="addPosition"
          v-model="pos.name">
      </el-input>
      <el-button size="small"
                 icon="el-icon-plus"
                 type="primary"
                 @click="addPosition">
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
    <div class="posManaMain">
      <el-table
          :data="positions"
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
            label="职位"
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
        title="编辑职位"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <span>职位名称</span>
        <el-input v-model="updatePos.name" class="updatePosInput"></el-input>
      </div>
      <div style="margin-top: 10px;">
        <span>是否启用</span>
        <el-switch
            v-model="updatePos.enabled"
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
  name: "PosMana",
  data() {
    return {
      pos: {
        name: ''
      },
      positions: [],
      dialogVisible: false,
      updatePos: {
        name: '',
        enabled: ''
      },
      multipleSelection: []
    }
  },
  //Vue生命周期-页面加载时
  mounted() {
    //页面加载时获取职位信息
    this.initPositions();
  },

  methods: {
    //职位信息
    initPositions() {
      this.getRequest('/system/basic/pos/').then(resp => {
        this.positions = resp;
      })
    },

    //新增职位
    addPosition() {
      if (this.pos.name) {
        this.postRequest('/system/basic/pos/', this.pos).then(resp => {
          if (resp) {
            this.initPositions();
            this.pos.name = ''
          }
        })
      } else {
        this.$message.warning('职位信息不能为空');
      }
    },
    //编辑职位对话框
    showEditView(data) {
      Object.assign(this.updatePos, data);
      this.updatePos.createDate = '';
      this.dialogVisible = true;
    },

    //职位更新
    doUpdate() {
      if (this.updatePos.name) {
        this.putRequest('/system/basic/pos/', this.updatePos).then(resp => {
          if (resp) {
            this.initPositions();
            this.dialogVisible = false;
          }
        })
      } else {
        this.$message.error('职位名称不能为空');
      }
    },

    //职位删除
    handleDelete(data) {
      this.$confirm('此操作将永久删除[' + data.name + ']职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/pos/' + data.id).then(resp => {
          if (resp) {
            this.initPositions();
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
      console.log(val)
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
        this.deleteRequest('/system/basic/pos/' + ids).then(resp => {
          if (resp) {
            this.initPositions();
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

<style>
.addPosInput {
  width: 200px;
  margin-right: 10px;
}

.posManaMain {
  margin-top: 10px;
}

.updatePosInput {
  width: 70%;
  margin-left: 10px;
}
</style>