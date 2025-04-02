<template>
<div class="api-list-container">
    <!-- 搜索栏 -->
    <div class="api-header">
    
    <el-form :inline="true" :model="searchForm" class="form-sty" ref="searchRef">
        <div class="form-label">搜索</div>
        <el-form-item label="所属部门" class="depart-select">
        <el-select v-model="searchForm.depart_id" placeholder="请选择部门" style="width:200px"  @change="handleDepartChange">
            <el-option
                v-for="depart in departOptions"
                :key="depart.id"
                :label="depart.departName"
                :value="depart.id"
            />
        </el-select>
        </el-form-item>
        <el-form-item label="所属项目">
        <el-select v-model="searchForm.project_id" placeholder="请选择项目" style="width:200px">
        <el-option
            v-for="project in projectOptions"
            :key="project.id"
            :label="project.project_name"
            :value="project.id"
        />
        </el-select>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
        <el-button  @click="handleReset">重置</el-button>
        </el-form-item>
    </el-form>
    <el-divider style="height:1px;margin:5px;" />
    <el-form :inline="true" :model="runForm" class="form-sty">
        <div class="form-label">执行</div>
        <el-form-item label="*环境地址">
            <el-select v-model="runForm.env_url" placeholder="请选择环境地址" style="width:200px"  @change="handleEnvChange">
                <el-option
                    v-for="depart in departOptions"
                    :key="depart.id"
                    :label="depart.departName"
                    :value="depart.id"
                />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="warning" icon="VideoPlay" @click="handleRun">执行</el-button>
        </el-form-item>
    </el-form>
    </div>
    
    <div class="api-body">
    <div class="header">
    <el-button type="primary" icon="Plus" @click="handleNewProject">新建接口</el-button>
    <el-button icon="Delete" @click="handleBatchDelete">批量删除</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column
        type="selection"
        width="55"
    />
    <el-table-column
        prop="id"
        label="接口ID"
        width="80"
    />
    <el-table-column
        prop="depart_name"
        label="部门名称"
        width="110"
    />
    <el-table-column
        prop="project_name"
        label="项目名称"
        width="110"
    />
    <el-table-column
        prop="api_url"
        label="接口地址"
        min-width="150"
    />
    <el-table-column
        prop="api_method"
        label="请求方式"
        min-width="80"
    />
    <el-table-column
        prop="api_headers"
        label="header"
        min-width="130"
    />
    <el-table-column
        prop="api_params"
        label="请求参数"
        min-width="130"
    />
    <el-table-column
        prop="validate_result"
        label="预期结果"
        width="100"
    />
    <el-table-column
        prop="create_time"
        label="创建时间"
        :formatter="formatDate"
        width="100"
    />
    <el-table-column
        prop="update_time"
        label="更新时间"
        :formatter="formatDate"
        width="100"
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
</div>
</div>
</template>

<script setup>
import { reactive, ref, nextTick, onMounted } from 'vue'
import dayjs from 'dayjs'
import { getAllDepartment } from '@/api/department'
import { getAllProject } from '@/api/project'
import { getApiByDepartId, addApi, updateApi, deleteApi, deleteMultiple } from '@/api/apiset'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'
import { requestMethods } from '@/api/constants' 
import { useStore } from 'vuex'
import eventBus from '@/utils/eventBus'
const store = useStore()
const tableData = ref([])//记录所有项目数据
const departOptions = ref([])//记录所有部门数据
const projectOptions = ref([])//记录项目数据，有时候是所有数据，有时候是根据部门筛选出的部分数据
const dialogProjectOptions = ref([])//记录对话框中的项目数据
const allProjectOption = ref([])//记录所有项目数据

const searchRef = ref(null)
//页码处理
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(1)
//选中的行
const selectedRows = ref([])
//控制对话框的展示
const dialogVisible = ref(false)
const dialogTitle = ref('新建接口')
//搜索框中的form数据
const searchForm = reactive({
    depart_id: '',
    project_id: ''
})
//对话框中form数据
const runForm = reactive({
    env_url:''
})
//对话框中form表单验证规则，对应prop内容
const rules = {
    depart_id: [{ required: true, message: '请选择部门', trigger: 'change' }],
    project_id: [{ required: true, message: '请选择项目', trigger: 'change' }],
    description: [{ required: true, message: '请输入环境描述', trigger: 'blur' }],
    environment_url: [{ required: true, message: '请输入环境地址', trigger: 'blur' }]
}
const formRef = ref(null)
// 格式化时间
const formatDate = (row, column) => {
  const value = row[column.property]
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}
const getAllApi = async (departId, projectId) => {
    if(departId === 0 && projectId === 0) { //获取所有的情况
        // searchRef.value.resetField()
        searchForm.depart_id = ''
        searchForm.project_id = ''
    }
    const requestParams = {current: currentPage.value, size: pageSize.value, departId, projectId}
    console.log('param:' + JSON.stringify(requestParams))
    await getApiByDepartId(requestParams).then((result) => {
        nextTick(() => {
            // console.log('result:' + JSON.stringify(result.records))
            // result.records.forEach(element => {
            //     // element.api_method
            //     requestMethods.forEach(item => {
            //         if(element.api_method === item.id){
            //             // element = {...element,api_method_str:item.method}
            //             //添加了一个新的属性，可以直接写
            //             element.api_method_str = item.name
            //         }
            //     })
            // })
            console.log('result:' + JSON.stringify(result.records))
            tableData.value = result.records
            total.value = result.total
        })
    })
}
onMounted(async () => {
    console.log('执行')
    await getAllApi(0, 0)
    if(store.state.projectAndDepartment.allDepartments.length === 0){
        //获取所有部门
        store.dispatch('projectAndDepartment/getDepartment')
    }
    departOptions.value = store.state.projectAndDepartment.allDepartments
    if(store.state.projectAndDepartment.allProjects.length === 0){
        store.dispatch('projectAndDepartment/getProject')
    }
    allProjectOption.value = store.state.projectAndDepartment.allProjects
    projectOptions.value = store.state.projectAndDepartment.allProjects
    console.log('project:' + JSON.stringify(projectOptions.value))
}) 

// const addEnv1 = (data) => {
//     addEnv(data).then((result) => {
//     console.log('result.data:' + result.data)
// })  
// }

const handleNewProject = () => {
    router.push({ name: 'apiNew' })
    // 触发事件
    eventBus.emit('addTab', { title: '新建接口', name: '/apiset/api' })
    // dialogTitle.value = '新建项目'
    // dialogProjectOptions.value = allProjectOption.value
    // Object.assign(envForm, {
    //     id: '',
    //     depart_id: '',
    //     project_id: '',
    //     description: '',
    //     environment_url: ''
    // })
    // dialogVisible.value = true
    // nextTick(() => {
    //     formRef.value.resetFields()
    // })
}
//点击新建/编辑对话框中的提交按钮
const submitForm = () => {
    // formRef.value.validate(async (valid) => {
    // if (valid) {
    //     if (envForm.id) { //编辑项目
    //     const index = tableData.value.findIndex(item => item.id === envForm.id)
    //     console.log('index:' + index + '   id:' + envForm.id)
    //     if (index !== -1) {
    //         await updateEnv({ ...envForm})
    //         ElMessage.success('修改成功')
    //             //获取所有项目
    //         await getAllEnv(0, 0)
    //     }
    //     } else { //新建项目
    //         //调用新建接口
    //         await addEnv1({ ...envForm})
    //         ElMessage.success('新建成功')
    //         //获取所有项目
    //         currentPage.value = 1
    //         await getAllEnv(0, 0)
    //     }
    //     dialogVisible.value = false
    // }
    // })
}

const handleEdit = (index, row) => {
    router.push({ name: 'apiEdit', params: { id: row.id } })
    eventBus.emit('addTab', { title: '编辑接口', name: `/apiset/api/${row.id}` })
    // 编辑项目
    // console.log('编辑项目:', row)
    // dialogTitle.value = '编辑项目'
    // Object.assign(envForm, {
    //     id: row.id,
    //     depart_id: row.depart_id,
    //     project_id: row.project_id,
    //     description: row.description,
    //     environment_url: row.environment_url
    // })
    // dialogVisible.value = true
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
        await deleteApi(row.id).then(result => {
            ElMessage.success('删除成功')
        })
        //获取所有项目
        await getAllApi(0, 0)
    }).catch(() => {
            console.log('取消删除')
    })
}
//批量删除
const handleBatchDelete = () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请选择要删除的内容')
        return
    }
    ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个接口吗？`, '提示', {
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
        await getAllApi(0, 0)
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
    await getAllApi(0, 0)
}

const handleCurrentChange = async (val) => {
    currentPage.value = val
    // 加载数据
    console.log(`当前页: ${val}`)
    await getAllApi(0, 0)
}
//点击搜索后的处理
const handleSearch = async () => {
    // console.log('searchForm:' + searchForm.depart_id + '  :' + searchForm.project_id)
    // if(searchForm.depart_id === '' && searchForm.project_id === '') {
    //     ElMessage.warning('请选择部门或者项目')
    // }else{
    //     const departId = searchForm.depart_id === '' ? 0 : searchForm.depart_id
    //     const projectId = searchForm.project_id === '' ? 0 : searchForm.project_id
    //     await getAllApi(departId, projectId)
    // }
}
//重置
const handleReset = async () => {
    // if(searchForm.depart_id !== '' || searchForm.project_id !== '') {
    //     await getAllApi(0, 0)
    //     projectOptions.value = allProjectOption.value
    // }
}
const handleDepartChange = async (value) => {
    // console.log('选择的部门ID:', value)
    // // console.log('选择的部门名称:', departOptions.value.find(item => item.id === value)?.departName);
    // await getProjectByDepartId({departId: value}).then((result) => {
    //     console.log('result:' + JSON.stringify(result))
    //     projectOptions.value = result.data
    // })
}
</script>

<style lang="less">
.api-list-container {
    padding: 10px;
    .api-header{
        background-color: #fff;
        border-radius: 5px;
        padding: 5px;
        margin-bottom: 10px;
        .form-sty{
            width:100%;
            height:40px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
        }
        .form-label{
                font-size: 15px;
                font-weight: 500;
                margin-right: 20px;
                border-right: 1px solid #b0b1b2;
                padding:0 10px;
         }
        .el-form-item{
            margin: 0 !important;
            padding: 9px;
        }
       
    }
    .api-body{
    background-color: #fff;
    border-radius: 5px;
    padding: 10px;
    .header {
    margin-bottom: 10px;
    }

    .operation-buttons {
        display: flex;
        gap: 10px;
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