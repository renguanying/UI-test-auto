<template>
    <div class="page-list">
        <div class="left-content">
            <el-button icon="Plus" @click="addPageByProject" class="addPage">添加页面</el-button>
            <el-tree
                ref="treeRef"
                style="max-width: 600px"
                :data="pagesInfoShow"
                highlight-current
                accordion
                @node-click="handleNodeClick"
            >
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <!-- 限制只是叶子节点展示添加按钮 -->
                    <div v-if="node.isLeaf">
                        <el-button link @click="editPage(node,data)" icon="EditPen" class="hover-button"></el-button>
                        <el-button link @click="removePage(data)" icon="Delete" class="hover-button"></el-button>
                    </div>
                    <!-- <div v-else>
                        <el-tooltip content="添加页" placement="top" effect="light">
                            <el-button link @click="appendPages(data)" icon="CirclePlus" class="hover-button"></el-button>
                        </el-tooltip>
                    </div> -->
                </div>
            </template>
            </el-tree>
        </div>
        <div class="right-content">
            <div class="right-header">
                <div>
                    <el-input class="right-header-search" v-model="searchContent"  prefix-icon="Search" placeholder="请输入元素名称"></el-input>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                </div>
                <div class="right-header-new">
                    <el-button type="primary" icon="Plus" @click="handleNewElement">添加元素</el-button>
                    <el-button icon="Delete" @click="handleBatchDelete">批量删除</el-button>
                </div>
            </div>
            <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55"
                />
                <el-table-column
                    prop="id"
                    label="元素id"
                    width="80"
                />
                <el-table-column
                    prop="element_name"
                    label="元素名称"
                    min-width="120"
                />
                <el-table-column
                    prop="locate_type"
                    label="定位方式"
                    width="80"
                    :formatter="formatLocateType"
                />
                <el-table-column
                    prop="locate_value"
                    label="值"
                    min-width="150"
                />
                <el-table-column
                    prop="locate_content"
                    label="定位内容"
                    width="100"
                    :formatter="formatLocateContent"
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
                        <el-button size="small" type="primary" @click="handleEditElement(scope.$index, scope.row)">修改</el-button>
                        <el-button size="small" type="danger" @click="removeElement(scope.$index, scope.row)">删除</el-button>
                    </div>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 新建页面对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
            <!-- validate-on-rule-change="false"防止校验规则变化时，会自动校验 -->
            <el-form :model="dialogForm" :rules="rules" ref="dialogFormRef" label-width="100px" :validate-on-rule-change="false">
                  <el-form-item label="所属部门" prop="depart_id" >
                    <el-select v-model="dialogForm.depart_id" placeholder="请选择部门" style="width: 100%" :disabled="isDisabledDepart" @change="changeDepartId">
                        <el-option
                        v-for="depart in departOptions"
                        :key="depart.id"
                        :label="depart.departName"
                        :value="depart.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属项目" prop="project_id">
                    <el-select v-model="dialogForm.project_id" placeholder="请选择部门" style="width: 100%" :disabled="isDisabledProject">
                        <el-option
                            v-for="project in projectOptions"
                            :key="project.id"
                            :label="project.project_name"
                            :value="project.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="页面名称" prop="page_name">
                    <el-input v-model="dialogForm.page_name" placeholder="请输入页面名称" />
                </el-form-item>
                <el-form-item label="页面描述">
                    <el-input v-model="dialogForm.simple_desc" placeholder="请输入页面描述" />
                </el-form-item>
                
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 新建元素对话框 -->
        <el-dialog v-model="elementdiaVisible" :title="elementdiaTitle" width="500px">
            <el-form :model="elementForm" :rules="elementRules" ref="elementFormRef" label-width="100px">
                <el-form-item label="元素名称" prop="element_name">
                    <el-input v-model="elementForm.element_name" placeholder="请输入元素名称" />
                </el-form-item>
                <el-form-item label="定位方式" prop="locate_type" >
                    <el-select v-model="elementForm.locate_type" placeholder="请选择定位方式" style="width: 100%">
                        <el-option
                        v-for="locate in locateOptions"
                        :key="locate.id"
                        :label="locate.name"
                        :value="locate.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="定位值" prop="locate_value">
                    <el-input v-model="elementForm.locate_value" placeholder="请输入定位值" />
                </el-form-item>
                <el-form-item label="定位内容" prop="locate_content">
                    <el-select v-model="elementForm.locate_content" placeholder="请选择定位内容" style="width: 100%">
                        <el-option
                            v-for="option in typeOptions"
                            :key="option.id"
                            :label="option.name"
                            :value="option.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="描述信息" prop="simple_desc">
                    <el-input v-model="elementForm.simple_desc" placeholder="请输入描述信息" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                <el-button @click="elementdiaVisible = false">取消</el-button>
                <el-button type="primary" @click="submitElementForm">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { getPages, getElements, addPage, deletePage, updatePage, addElement, updateElement, deleteElementById, deleteElementMultiple, searchElementName } from '@/api/pages'
import { ref, onMounted, reactive, nextTick } from 'vue'
import dayjs from 'dayjs'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { locateOptions, typeOptions } from '@/api/constants'
import { getProjectByDepartId } from '@/api/project'
const store = useStore()
const departOptions = ref([])
const projectOptions = ref([])
const allProjectOptions = ref([])
const pagesInfo = ref(null)
const pagesInfoShow = ref([])
const tableData = ref([])
const treeRef = ref(null)
const isDisabledDepart = ref(true)//设置选择框为不可用
const isDisabledProject = ref(true)
const dialogVisible = ref(false)
const elementdiaVisible = ref(false)
const dialogTitle = ref('')
const elementdiaTitle = ref('')
const dialogFormRef = ref(null)
const elementFormRef = ref(null)
const pageId = ref('')//记录点击页面后的页面Id
const searchContent = ref('')
//选中的行
const selectedRows = ref([])
//新建编辑页面对话框内容
const dialogForm = ref({
    id:'',
    depart_id: '',
    project_id:'',
    page_name:'',
    simple_desc:''
})
//添加修改元素对话框内容
const elementForm = ref({
    id:'',
    element_name:'',
    locate_type: 1,
    locate_value:'',
    locate_content: 1,
    simple_desc:''
})

//对话框中form表单验证规则，对应prop内容
let rules = {}
const elementRules = {
    element_name: [{ required: true, message: '请输入元素名称', trigger: 'blur' }],
    locate_type: [{ required: true, message: '请选择定位方式', trigger: 'change' }],
    locate_value: [{ required: true, message: '请选择定位值', trigger: 'blur' }],
    locate_content: [{ required: true, message: '请选择定位内容', trigger: 'change' }]
}
// 格式化定位方式
const formatLocateType = (row, column) => {
  const value = row[column.property]
  const elementItem = locateOptions.find((item) => 
    item.id === value
  )
  return elementItem.name || value
}
//格式化定位内容
const formatLocateContent = (row, column) => {
  const value = row[column.property]
  const elementItem = typeOptions.find((item) => 
    item.id === value
  )
  return elementItem.name || value
}
// 格式化时间
const formatDate = (row, column) => {
  const value = row[column.property]
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}
const getPagesFun = async() => {
    await getPages().then((result) => {
        // console.log('pagesresult:' + JSON.stringify(result))
        pagesInfo.value = result
        pagesInfoShow.value = []
        pagesInfo.value.forEach((item) => {
            const pagesNameArr = ref([])
            JSON.parse(item.page_info).forEach(element => {
                pagesNameArr.value.push({label: element.page_name, id: element.id, simple_desc:element.simple_desc})
            })
           pagesInfoShow.value.push({label:item.project_name, id:item.project_id, children:pagesNameArr, depart_id:item.depart_id})
        })
    })
}
const getElementFun = async () => {
    await getElements({pageId:pageId.value}).then((result) => {
        // console.log('result:' + JSON.stringify(result))
        tableData.value = result
    })
}
onMounted(() => {
    getPagesFun()
    departOptions.value = store.state.projectAndDepartment.allDepartments
    projectOptions.value = store.state.projectAndDepartment.allProjects
    allProjectOptions.value = projectOptions.value
})
//切换项目id后
const changeDepartId = async (value) => {
    // console.log('选择的部门名称:', departOptions.value.find(item => item.id === value)?.departName);
    await getProjectByDepartId({departId: value}).then((result) => {
        projectOptions.value = result.data
    })
}
const handleNodeClick = (data, node) => {
    pageId.value = data.id
   // 判断是否是叶子节点
   if (!node.children) {
    getElementFun()
  }
}
//添加页面，针对于没有项目的情况
const addPageByProject = () => {
    nextTick(() => {
        projectOptions.value = allProjectOptions.value
        if (dialogFormRef.value) {
            dialogFormRef.value.resetFields()
        }
        isDisabledDepart.value = false
        isDisabledProject.value = false
        rules = {
            page_name: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
            project_id: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
            depart_id: [{ required: true, message: '请选择部门名称', trigger: 'change' }]
        }
        dialogTitle.value = '新建页面'
        dialogForm.value = {
            id: '',
            depart_id: '',
            project_id: '',
            page_name:'',
            simple_desc:''
        }
        dialogVisible.value = true 
    })
}
//添加页面
//添加元素
const handleNewElement = () => {
    elementdiaTitle.value = '添加元素'
    elementForm.value = {
        id:'',
        element_name:'',
        locate_type:1,
        locate_value:'',
        locate_content:1,
        simple_desc:''
    }
    elementdiaVisible.value = true
}
//修改元素
const handleEditElement = (index, row) => {
    elementdiaTitle.value = '修改元素'
    elementForm.value = {
        id:row.id,
        element_name:row.element_name,
        locate_type:row.locate_type,
        locate_value:row.locate_value,
        locate_content:row.locate_content,
        simple_desc:row.simple_desc
    }
    elementdiaVisible.value = true
}
//修改页
const editPage = (node, data) => {
    nextTick(() => {
        projectOptions.value = allProjectOptions.value
        if (dialogFormRef.value) {
            dialogFormRef.value.resetFields()
        }
        isDisabledDepart.value = true
        isDisabledProject.value = true
        rules = {
            page_name: [{ required: true, message: '请输入页面名称', trigger: 'blur' }]
        }
        // 获取父节点
        const parentNode = node.parent
        if (!parentNode) {
            console.log('当前节点是根节点，没有父节点')
        } else {
            console.log('父节点数据:', parentNode.data)
        }
        dialogTitle.value = '编辑页面'
        console.log('data:' + JSON.stringify(data))
        dialogForm.value = {
            id: data.id,
            depart_id: parentNode.data.depart_id,
            project_id: parentNode.data.id,
            page_name: data.label,
            simple_desc: data.simple_desc
        }
        dialogVisible.value = true
    })
}
//删除页
const removePage = (data) => {
     //二次提示
  ElMessageBox.confirm('确定要删除该页吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    console.log('pageId:' + data.id)
    // 删除逻辑
    await deletePage(data.id).then(result => {
        ElMessage.success('删除成功')
    })
     //获取所有
    await getPagesFun()
  }).catch(() => {
    console.log('取消删除')
  })
}
const removeElement = (index, row) => {
    ElMessageBox.confirm('确定要删除该元素吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 删除逻辑
    await deleteElementById(row.id).then(result => {
        ElMessage.success('删除成功')
    })
     //获取所有
     getElementFun()
  }).catch(() => {
    console.log('取消删除')
  })
}
//dialog里的submit按钮的点击事件
const submitForm = async() => {
    dialogFormRef.value.validate(async (valid) => {
    if (valid) {
      const nowDateTime = new Date()
      if (dialogForm.value.id) { //编辑
        // console.log('编辑')
        await updatePage({ ...dialogForm.value, update_time: nowDateTime})
        ElMessage.success('修改成功')
      } else { //新建
        const pageContent = {...dialogForm.value, create_time:nowDateTime, update_time:nowDateTime}
        // console.log('pageCOntent:' + JSON.stringify(pageContent))
        await addPage(pageContent).then((result) => {
            ElMessage.success('添加成功')
        })
      }
      getPagesFun()
      dialogVisible.value = false
    }
  })
}
const submitElementForm = async() => {
    elementFormRef.value.validate(async (valid) => {
    if (valid) {
      const nowDateTime = new Date()
      if (elementForm.value.id) { //编辑
        console.log('编辑')
        await updateElement({ ...elementForm.value, page_id:pageId.value, update_time: nowDateTime})
        ElMessage.success('修改成功')
      } else { //新建
        const elementContent = {...elementForm.value, page_id:pageId.value, create_time:nowDateTime, update_time:nowDateTime}
        await addElement(elementContent).then((result) => {
            ElMessage.success('添加成功')
        })
      }
      getElementFun()
      elementdiaVisible.value = false
    }
  })
}
//批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的元素')
    return
  }
  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个元素吗？`, '提示', {
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
    await deleteElementMultiple(deleteList.value)
    ElMessage.success('批量删除成功')
    getElementFun()
  }).catch(() => {
    // ElMessage.info('已取消批量删除')
  })
}
const handleSelectionChange = (val) => {
    selectedRows.value = val
}
//搜索元素
const handleSearch = async () => {
    if(searchContent.value.trim() !== ''){
        console.log('content:' + searchContent.value)
        await searchElementName({element_name: searchContent.value, page_id: pageId.value}).then((result) => {
        // console.log('result:' + JSON.stringify(result))
        tableData.value = result
         })
    }else{
        getElementFun()
    }
}
</script>

<style lang="less" scoped>
.page-list{
    width:100%;
    height:100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .left-content{
        // width:400px;
        flex: 0 0 300px;//宽度固定为400px
        height:100%;
        padding:10px;
        background-color: #fff;
        border-radius:5px;
        margin-right:5px;
        .addPage{
            margin-bottom: 10px;
        }
    }
    .right-content{
        background-color: #fff;
        padding:10px;
        border-radius:5px;
        flex:1;
        height:100%;
        .right-header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            // gap:10px;
            .right-header-search{
                width:200px;
                margin:10px;
            }
            .right-header-new{
                width:210px;
            }
        }
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    
    .hover-button {
        visibility: hidden; /* 默认隐藏按钮 */
        transition: visibility 0.3s; /* 添加过渡效果 */
     }
     .custom-tree-node:hover .hover-button {
        visibility: visible; /* 鼠标悬停时显示按钮 */
     }
}
</style> 