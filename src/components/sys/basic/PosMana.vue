<template>
  <div>
    <div>
      <el-input
          size="small"
          class="addPosInput"
          placeholder="添加职位"
          suffix-icon="el-icon-plus"
          v-model="pos.name">
      </el-input>
      <el-button
          size="small"
          icon="el-icon-plus"
          type="primary"
          class="addPosButton">添加
      </el-button>
    </div>
    <div class="posManaMain">
      <el-table
          :data="positions"
          stripe
          border
          style="width: 70%">
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
      </el-table-column>
      </el-table>
    </div>
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
      positions:[

      ]
    }
  },
  mounted() {
    this.initPositions();
  },
  methods:{
    initPositions(){
      this.getRequest('/system/basic/pos/').then(resp=>{
        this.positions=resp;
      })
    }
  }
}
</script>

<style>
.addPosInput {
  width: 200px;
  margin-right: 8px;
}

.posManaMain {
margin-top: 10px
;
}
</style>