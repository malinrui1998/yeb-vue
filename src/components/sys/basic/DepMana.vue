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
              <td>{{ pName }}</td>
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
      pName: ''
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
    initDeps() {
      this.getRequest('/system/basic/department/').then(resp => {
        if (resp) {
          this.deps = resp;
        }
      })
    },
    showAddDep(date) {
      this.pName = date.name;
      this.dep.parentId = date.id;
      this.dialogVisible = true;
    },
    initDep() {
      this.dep = {
        name: '',
        parentId: -1
      }
      this.pName = ''
    },
    addDep2Deps(deps, dep) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == dep.parentId) {
          d.children = d.children.concat(dep);
          return;
        } else {
          this.addDep2Deps(d.children, dep)
        }
      }
    },
    doAddDep() {
      this.postRequest('/system/basic/department/', this.dep).then(resp => {
        if (resp) {
          this.addDep2Deps(this.deps, resp.obj)
          this.dialogVisible = false
          this.initDep();
        }
      })

    },
    deleteDep(date) {
      console.log(date)
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