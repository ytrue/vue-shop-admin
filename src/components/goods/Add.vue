<template>
  <div>
    <h3>添加商品</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>

      <!-- 步骤条组件 -->
      <!-- align-center(居中效果) -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域:el-tab-pane必须是el-tabs的子节点
      :tab-position="'left'"(设置tab栏为左右结构tab栏) -->
      <!-- 表单：label-position="top"(设置label在文本框上方) -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex"
                 :tab-position="'left'"
                 :before-leave="beforeTabLeave"
                 @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader expandTrigger='hover' v-model="addForm.goods_cat" :options="cateList" :props="cateProps"
                           @change="handleChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in manyTableData">
              <!-- 使用数组渲染复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="val" v-for="(val,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 循环生成静态属性 -->
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 商品图片上传
             action:指定图片上传api接口
             :on-preview ： 当点击图片时会触发该事件进行预览操作,处理图片预览
             :on-remove : 当用户点击图片右上角的X号时触发执行
             :on-success：当用户点击上传图片并成功上传时触发
             list-type ：设置预览图片的方式
             :headers ：设置上传图片的请求头 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 预览图片对话框 -->
          <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" class="previewImg"/>
          </el-dialog>

          <!-- 富文本编辑器组件 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        //保存步骤条激活项索引
        activeIndex: '0',
        //添加商品的表单数据对象
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          goods_cat: [],
          //上传图片数组
          pics: [],
          //商品的详情介绍
          goods_introduce:''
        },
        //验证规则
        addFormRules: {
          goods_name: [
            {
              required: true,
              message: '请输入商品名称',
              trigger: 'blur'
            }
          ],
          goods_price: [
            {
              required: true,
              message: '请输入商品价格',
              trigger: 'blur'
            }
          ],
          goods_weight: [
            {
              required: true,
              message: '请输入商品重量',
              trigger: 'blur'
            }
          ],
          goods_number: [
            {
              required: true,
              message: '请输入商品数量',
              trigger: 'blur'
            }
          ],
          goods_cat: [
            {
              required: true,
              message: '请选择商品分类',
              trigger: 'blur'
            }
          ]
        },
        //用来保存分类数据
        cateList: [],
        //配置级联菜单中数据如何展示
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        //动态参数列表
        manyTableData: [],
        //静态属性列表
        onlyTableData: [],
        //上传图片的url地址
        uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
        //图片上传组件的headers请求头对象
        headerObj: { Authorization: window.sessionStorage.getItem('token') },
        //保存预览图片的url地址
        previewPath: '',
        //控制预览图片对话框的显示和隐藏
        previewVisible: false,
      }
    },
    created () {
      this.getCateList()
    },
    methods: {
      async getCateList () {
        const { data: res } = await this.$http.get('categories')

        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类数据失败')
        }
        this.cateList = res.data
      },
      handleChange () {
        //如果用户选择的不是三级分类,该次选择无效，因为必须选择三级分类
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
          return
        }
      },
      //再到methods编写事件函数beforeTabLeave
      beforeTabLeave (activeName, oldActiveName) {
        //在tab栏切换之前触发，两个形参为切换前，后的tab栏name
        if (oldActiveName === '0') {
          //在第一个标签页的时候
          if (this.addForm.goods_cat.length !== 3) {
            this.$message.error('请选择商品的分类')
            return false
          } else if (this.addForm.goods_name.trim() === '') {
            this.$message.error('请输入商品名称')
            return false
          } else if (this.addForm.goods_price.trim() === '0') {
            this.$message.error('请输入商品价格')
            return false
          } else if (this.addForm.goods_weight.trim() === '0') {
            this.$message.error('请输入商品重量')
            return false
          } else if (this.addForm.goods_number.trim() === '0') {
            this.$message.error('请输入商品数量')
            return false
          }
        }
      },
      async tabClicked () {
        //当用户点击切换tab栏时触发
        if (this.activeIndex === '1') {
          //发送请求获取动态参数
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`,
            {
              params: { sel: 'many' }
            })

          if (res.meta.status !== 200) {
            return this.$message.error('获取动态参数列表失败')
          }
          //将attr_vals字符串转换为数组
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyTableData = res.data
        } else if (this.activeIndex === '2') {
          //发送请求获取静态属性
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`,
            { params: { sel: 'only' } }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('获取静态属性列表失败')
          }

          this.onlyTableData = res.data
        }
      },
      handlePreview (file) {
        //当用户点击图片进行预览时执行，处理图片预览
        //形参file就是用户预览的那个文件
        this.previewPath = file.response.data.url
        //显示预览图片对话框
        this.previewVisible = true
      },
      handleRemove (file) {
        //当用户点击X号删除时执行
        //形参file就是用户点击删除的文件
        //获取用户点击删除的那个图片的临时路径
        const filePath = file.response.data.tmp_path
        //使用findIndex来查找符合条件的索引
        const index = this.addForm.pics.findIndex(item => item.pic === filePath)
        //移除索引对应的图片
        this.addForm.pics.splice(index, 1)
      },
      handleSuccess (response) {
        //当上传成功时触发执行
        //形参response就是上传成功之后服务器返回的结果
        //将服务器返回的临时路径保存到addForm表单的pics数组中
        this.addForm.pics.push({ pic: response.data.tmp_path })
      }
    },
    //添加 计算属性获取三级分类
    computed: {
      cateId () {
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2]
        }
        return null
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  .previewImg {
    width: 100%;
  }

  .btnAdd {
    margin-top: 15px;
  }
</style>
