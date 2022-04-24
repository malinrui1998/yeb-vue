<template>
  <div>
    <div class="addPermissInput">
      <el-input
          placeholder="请输入角色英文名"
          v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input
          placeholder="请输入角色中文名"
          v-model="role.nameZh"
          style="width: 150px"
      ></el-input>
      <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="doAddRole"
      >添加
      </el-button>
    </div>
    <div class="permissManaMain">
      <el-collapse v-model="activeName" accordion @change="change">
        <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button style="float: right; padding: 3px 0 ;color:red ;" type="text"
                         icon="el-icon-delete" @click="doDeleteRole(r)"></el-button>
            </div>
            <div>
              <el-tree show-checkbox
                       :data="allMenus"
                       :props="defaultProps"
                       :default-checked-keys="selectedMenus"
                       node-key="id"
                       ref="tree"
                       :key="index"></el-tree>
            </div>
            <div class="updateMenusButton">
              <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
              <el-button size="mini" type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissMana",
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      roles: [],
      allMenus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectedMenus: [],
      activeName: -1
    }
  },
  mounted() {
    this.initRoles();

  },
  methods: {
    initRoles() {
      this.getRequest('/system/basic/permiss/').then(resp => {
        if (resp) {
          this.roles = resp;
        }
      })
    },
    change(rid) {
      if (rid) {
        this.initAllMenus();
        this.initSelectedMenus(rid)
      }
    },
    initAllMenus() {
      this.getRequest('/system/basic/permiss/menus').then(resp => {
        if (resp) {
          this.allMenus = resp;
        }
      })
    },
    initSelectedMenus(rid) {
      this.getRequest('/system/basic/permiss/mid/' + rid).then(resp => {
        if (resp) {
          this.selectedMenus = resp;
        }
      })
    },
    doUpdate(rid, index) {
      let tree = this.$refs.tree[index];
      let selectedKeys = tree.getCheckedKeys(true);
      let url = '/system/basic/permiss/?rid=' + rid;
      selectedKeys.forEach(key => {
        url += '&mids=' + key;
      });
      this.putRequest(url).then(resp => {
        if (resp) {
          this.initRoles();
          this.activeName = -1;
        }
      })
    },
    cancelUpdate() {
      this.activeName = -1;
    },
    doAddRole() {
      if (this.role.name && this.role.nameZh) {
        this.postRequest('/system/basic/permiss/role', this.role).then(resp => {
          if (resp) {
            this.initRoles();
            this.role.name = '';
            this.role.nameZh = '';
          }
        })
      } else {
        this.$message.error("请输入完整信息")
      }
    },
    doDeleteRole(role) {
      this.$confirm('此操作将永久删除[' + role.nameZh + ']角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/permiss/role/' + role.id).then(resp => {
          if (resp) {
            this.initRoles();
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
.addPermissInput {
  display: flex;
  justify-content: flex-start;
}

.addPermissInput .el-input {
  width: 220px;
  margin-right: 10px;
}

.permissManaMain {
  margin-top: 10px;
  width: 70%;
}

.updateMenusButton {
  display: flex;
  justify-content: flex-end;
}




</style>