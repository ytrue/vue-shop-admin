<template>
  <div>
    <h3>权限列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表区域 -->
    <!-- row-key="id" 是2019年3月提供的新特性，
    if there's nested data, rowKey is required.
    如果这是一个嵌套的数据，rowkey 是必须添加的属性 -->

    <el-table row-key="id" :data="roleList" border>
      <!-- 添加展开列 -->
      <el-table-column type="expand"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'Roles',
    data () {
      return {
        roleList: []
      }
    },
    created () {
      this.getRoleList()
    },
    methods: {
      async getRoleList () {
        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
        this.roleList = res.data
      }
    }
  }
</script>

<style scoped>

</style>
