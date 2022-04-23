<template>
  <div>
    <div style="width: 300px">
      <el-input
          prefix-icon="el-icon-search"
          placeholder="输入部门名称进行搜索"
          v-model="filterText">
      </el-input>
      <el-tree
          class="filter-tree"
          :data="deps"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="tree"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
            <span class="depBtn">
              <el-button
                  type="primary"
                  size="mini"
                  @click="() => showAddDep(data)">
                添加
              </el-button>
              <el-button
                  type="danger"
                  size="mini"
                  @click="() => deleteDep(data)">
                删除
              </el-button>
            </span>
      </span>
      </el-tree>
      <el-dialog
          title="添加部门"
          :visible.sync="dialogVisible"
          width="30%">
        <div>
          <table>
            <tr>
              <td>上级部门</td>
              <td>{{ pname }}</td>
            </tr>
            <tr>
              <td>部门名称</td>
              <td>
                <el-input v-model="dep.name" placeholder="请输入部门名称"></el-input>
              </td>
            </tr>
          </table>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddDep">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      filterText: '',
      deps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogVisible: false,
      dep: {
        name: '',
        parentId: -1
      },
      pname: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.initDeps();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //加载部门信息
    initDeps() {
      this.getRequest('/system/basic/department/').then(resp => {
        if (resp) {
          this.deps = resp;
        }
      })
    },
    //添加部门对话框
    showAddDep(data) {
      this.dep.parentId = data.id;
      this.pname = data.name;
      this.dialogVisible = true;
    },
    initDep() {
      this.dep = {
        name: '',
        parentId: -1
      }
      this.pname = ''
    },
    //手动添加
    addDep2Deps(deps, dep) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == dep.parentId) {
          d.children = d.children.concat(dep);
          if (d.children.length > 0) {
            d.isParent = true
          }
          return;
        } else {
          this.addDep2Deps(d.children, dep);
        }
      }
    },
    //添加部门
    doAddDep() {
      this.postRequest('/system/basic/department/', this.dep).then(resp => {
        if (resp) {
          this.addDep2Deps(this.deps, resp.obj)
          this.dialogVisible = false
          this.initDep();
          // this.dep.parentId = -1
          // this.dep.name = ''
          // this.pname = ''
        }
      })
    },
    removeDepFromDeps(p, deps, id) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == id) {
          deps.splice(i, 1);
          if (deps.length == 0) {
            p.isParent = false;
          }
          return;
        } else {
          this.removeDepFromDeps(d, d.children, id);
        }
      }
    }
    ,
    deleteDep(data) {
      if (data.isParent) {
        this.$message.error('该部门下有子部门无法删除')
      } else {
        this.$confirm('此操作将永久删除该[' + data.name + ']部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/system/basic/department/' + data.id).then(resp => {
            if (resp) {
              this.removeDepFromDeps(null, this.deps, data.id);
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
}
</script>

<style>

.depBtn .el-button {
  padding: 2px;

}

.custom-tree-node {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>