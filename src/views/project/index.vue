<template>
<div class="project-list-container">
   <!-- 搜索栏 -->
  <div class="project-header">
    <el-form :inline="true" :model="searchForm" class="search-form" ref="searchRef">
      <el-form-item label="所属部门" class="depart-select">
        <el-select v-model="searchForm.depart_id" placeholder="请选择部门" class="select_sty">
        <el-option
            v-for="depart in departOptions"
            :key="depart.id"
            :label="depart.departName"
            :value="depart.id"
        />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
        <el-button  @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  
  <div class="project-body">
  <div class="header">
    <el-button type="primary" icon="Plus" @click="handleNewProject">新建项目</el-button>
    <el-button icon="Delete" @click="handleBatchDelete">批量删除</el-button>
  </div>
  <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column
        type="selection"
        width="55"
    />
    <el-table-column
        prop="id"
        label="项目ID"
        width="100"
    />
    <el-table-column
        prop="project_name"
        label="项目名称"
        min-width="150"
    />
    <el-table-column
        prop="project_desc"
        label="项目描述"
        min-width="150"
    />
    <el-table-column
        prop="depart_name"
        label="部门名称"
        width="180"
    />
    <el-table-column
        prop="create_time"
        label="创建时间"
        :formatter="formatDate"
        width="150"
    />
    <el-table-column
        prop="update_time"
        label="更新时间"
        :formatter="formatDate"
        width="150"
    />
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <div class="operation-buttons">
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
    <div class="pagination">
        <!-- pager-count:超过10页，显示折叠...；current-page是现在的页码，用于切换页码时的设置； -->
      <el-pagination
            :pager-count="10" 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="prev, pager, next, jumper, ->, sizes, total"
            :total="total"
      />
  </div>
   <!-- 新建项目对话框 -->
   <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="projectForm" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="项目名称" prop="project_name">
          <el-input v-model="projectForm.project_name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述" prop="project_desc">
          <el-input v-model="projectForm.project_desc" placeholder="请输入项目描述" />
        </el-form-item>
        <el-form-item label="部门名称" prop="depart_id">
          <el-select v-model="projectForm.depart_id" placeholder="请选择部门" style="width: 100%">
            <el-option
              v-for="depart in departOptions"
              :key="depart.id"
              :label="depart.departName"
              :value="depart.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
</div>
</div>
</template>

<script setup>
import { reactive, ref, nextTick, onMounted } from 'vue'
import dayjs from 'dayjs'
import { deleteMultiple, getAllProjectByPage, addProject, updateProject, deleteProject, getProjectByDepartByPage } from '@/api/project'
import { getAllDepartment } from '@/api/department'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
const store = useStore()
const tableData = ref([])//记录所有项目数据
const departOptions = ref([])//记录所有部门数据
const searchRef = ref(null)
//页码处理
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(1)
//选中的行
const selectedRows = ref([])
//控制对话框的展示
const dialogVisible = ref(false)
const dialogTitle = ref('新建项目')
//搜索框中的form数据
const searchForm = reactive({
    depart_id: ''
})
//对话框中form数据
const projectForm = reactive({
  id: '',
  project_name: '',
  project_desc: '',
  depart_id: ''
})
//对话框中form表单验证规则，对应prop内容
const rules = {
  project_name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  project_desc: [{ required: true, message: '请输入项目描述', trigger: 'blur' }],
  depart_id: [{ required: true, message: '请选择部门名称', trigger: 'change' }]
}
const formRef = ref(null)

// 格式化时间
const formatDate = (row, column) => {
  const value = row[column.property]
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}
const getAllProjectByPageFun = (current, size) => {
    searchRef.value.resetFields()
    const requestParams = {current, size}
    console.log('param:' + JSON.stringify(requestParams))
    getAllProjectByPage(requestParams).then((result) => {
        console.log('result:' + JSON.stringify(result))
        nextTick(() => {
            tableData.value = result.records
            total.value = result.total
        })
    })
}
onMounted(() => {
    console.log('执行')
    if(store.state.projectAndDepartment.allDepartments.length === 0){
        //获取所有部门
        store.dispatch('projectAndDepartment/getDepartment')
    }
    departOptions.value = store.state.projectAndDepartment.allDepartments
    getAllProjectByPageFun(currentPage.value, pageSize.value)
})

const addProject1 = (data) => {
    addProject(data).then((result) => {
    console.log('result.data:' + result.data)
})  
}

const handleNewProject = () => {
  dialogTitle.value = '新建项目'
  Object.assign(projectForm, {
    id: '',
    project_name: '',
    project_desc: '',
    depart_id: null
  })
  dialogVisible.value = true
  nextTick(() => {
    formRef.value.resetFields()
  })
}
//点击新建/编辑对话框中的提交按钮
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const nowDateTime = new Date()
      if (projectForm.id) { //编辑项目
        const index = tableData.value.findIndex(item => item.id === projectForm.id)
        console.log('index:' + index + '   id:' + projectForm.id)
        if (index !== -1) {
            await updateProject({ ...projectForm, update_time: nowDateTime})
            ElMessage.success('修改成功')
              //获取所有项目
            await getAllProjectByPageFun(currentPage.value, pageSize.value)
        }
      } else { //新建项目
        //调用新建接口
        await addProject1({ ...projectForm, create_time: nowDateTime, update_time: nowDateTime })
        ElMessage.success('新建成功')
        //获取所有项目
        currentPage.value = 1
        await getAllProjectByPageFun(currentPage.value, pageSize.value)
      }
      dialogVisible.value = false
    }
  })
}

const handleEdit = (index, row) => {
  // 编辑项目
  console.log('编辑项目:', row)
  dialogTitle.value = '编辑项目'
  Object.assign(projectForm, {
    id: row.id,
    project_name: row.project_name,
    project_desc: row.project_desc,
    depart_id: row.depart_id
  })
  dialogVisible.value = true
}
//删除一个
const handleDelete = async (index, row) => {
    //二次提示
  ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 删除逻辑
    await deleteProject(row.id).then(result => {
        ElMessage.success('删除成功')
    })
     //获取所有项目
     await getAllProjectByPageFun(currentPage.value, pageSize.value)
  }).catch(() => {
    console.log('取消删除')
  })
}
//批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的项目')
    return
  }
  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个项目吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 批量删除逻辑
    const deleteList = ref([])
    selectedRows.value.forEach(row => {
      const index = tableData.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        // tableData.value.splice(index, 1)
        deleteList.value.push(row.id)
      }
    })
    await deleteMultiple(deleteList.value)
    ElMessage.success('批量删除成功')
    await getAllProjectByPageFun(currentPage.value, pageSize.value)
  }).catch(() => {
    // ElMessage.info('已取消批量删除')
  })
}
const handleSelectionChange = (val) => {
    // 多选逻辑
    console.log('多选:', val)
    selectedRows.value = val
}
const handleSizeChange = async (val) => {
    pageSize.value = val
    // 加载数据
    console.log(`每页 ${val} 条`)
    currentPage.value = 1
    await getAllProjectByPageFun(currentPage.value, pageSize.value)
}

const handleCurrentChange = async (val) => {
    currentPage.value = val
    // 加载数据
    console.log(`当前页: ${val}`)
    await getAllProjectByPageFun(currentPage.value, pageSize.value)
}
//点击搜索后的处理
const handleSearch = () => {
    console.log('searchForm:' + searchForm.depart_id)
    if(searchForm.depart_id === '') {
        ElMessage.warning('请选择部门')
    }else{
        const requestParams = {current:currentPage.value, size:pageSize.value, departId:searchForm.depart_id}
        console.log('param:' + JSON.stringify(requestParams))
        getProjectByDepartByPage(requestParams).then((result) => {
            console.log('result:' + JSON.stringify(result))
            nextTick(() => {
                tableData.value = result.records
                total.value = result.total
            })
        })
    }
}
//重置
const handleReset = async () => {
    if(searchForm.depart_id !== '') {
        await getAllProjectByPageFun(currentPage.value, pageSize.value)
        searchRef.value.resetFields()
    }
}

</script>

<style lang="less">
.project-list-container {
  padding: 10px;
  .project-header{
     background-color: #fff;
     border-radius: 5px;
     padding: 5px;
     margin-bottom: 10px;
    .search-form{
        width:100%;
        height:50px;
        .depart-select{
            padding: 9px;
        }
        .select_sty{
            width:200px;
        }
    }
  }
  .project-body{
    background-color: #fff;
    border-radius: 5px;
    padding: 10px;
    .header {
    margin-bottom: 10px;
    }

    .operation-buttons {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
  }

  
  
}
</style>