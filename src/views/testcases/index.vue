<template>
    <div class="page-list">
        <div class="left-content">
            <el-tree
                style="max-width: 600px"
                highlight-current
                :data="casesInfoShow"
                :props="defaultProps"
                accordion
                @node-click="handleNodeClick"
            >
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <!-- 限制只是叶子节点展示添加按钮 -->
                    <div v-if="node.isLeaf">
                        <el-button link @click="remove(node, data)" icon="Delete" class="hover-button"></el-button>
                    </div>
                    <div v-else>
                        <el-tooltip content="添加用例" placement="top" effect="light">
                            <el-button link @click="append(data)" icon="CirclePlus" class="hover-button"></el-button>
                        </el-tooltip>
                    </div>
                </div>
            </template>
            </el-tree>
        </div>
        <div class="right-content">
            <div class="header">
                <div class="left-buttons">
                    <h3>用例步骤</h3>
                </div>
                <div class="right-buttons">
                    <el-button icon="Delete" @click="handleBatchDelete">批量删除</el-button>
                    <el-button @click="handleConfigInfo">调试配置</el-button>
                    <el-button icon="VideoPlay" type="success" @click="handleTestCaseDebug">用例调试</el-button>
                </div>
            </div>
            <div class="steps-table" :class="{ 'full-screen': !isDetailsOpen }">
                <el-table :data="steps" style="width: 100%">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column label="步骤名称" min-width="200">
                        <template #default="scope">
                            <div class="step-item">
                            <!-- <el-icon><document /></el-icon> -->
                            <span>{{ scope.row.name }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template #default="scope">
                            <el-button type="primary" size="small" @click="editStep(scope.row)" v-if="runResult">查看结果</el-button>
                            <el-button icon="Delete" size="small" @click="editStep(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="operation-container">
                <div class="button-group">
                    <el-dropdown @command="handleBrowser">
                        <el-button type="primary" plain>浏览器操作<el-icon class="el-icon--right"><arrow-down /></el-icon></el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="open">打开网页</el-dropdown-item>
                                <el-dropdown-item command="close">关闭页面</el-dropdown-item>
                                <el-dropdown-item command="forward">前进</el-dropdown-item>
                                <el-dropdown-item command="back">后退</el-dropdown-item>
                                <el-dropdown-item command="refresh">刷新</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-dropdown>
                        <el-button type="primary" plain>鼠标操作<el-icon class="el-icon--right"><arrow-down /></el-icon></el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>点击</el-dropdown-item>
                                <el-dropdown-item>鼠标滚动</el-dropdown-item>
                                <el-dropdown-item>鼠标移动</el-dropdown-item>
                                <el-dropdown-item>鼠标拖拽</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-dropdown>
                        <el-button type="primary" plain>键盘操作</el-button>
                    </el-dropdown>
                    <el-dropdown>
                        <el-button type="primary" plain>等待事件</el-button>
                    </el-dropdown>
                    <el-dropdown>
                        <el-button type="primary" plain>循环<el-icon class="el-icon--right"><arrow-down /></el-icon></el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                            <el-dropdown-item>while循环</el-dropdown-item>
                            <el-dropdown-item>for循环</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-dropdown>
                        <el-button type="primary" plain>if判断</el-button>
                    </el-dropdown>
                    <el-dropdown>
                        <el-button type="primary" plain>断言</el-button>
                    </el-dropdown>
                    <el-dropdown>
                        <el-button type="primary" plain>更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon></el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                            <el-dropdown-item>1</el-dropdown-item>
                            <el-dropdown-item>2</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
             </div>
        </div>
        <div class="drawer-content">
            <el-drawer v-model="drawerVisible" direction="rtl">
                <template #header>
                    <span style=" font-size: 14px;color: black;">{{drawerTitle}}</span>
                    <!-- <el-divider style="height:1px;"></el-divider> -->
                </template>
                <template #default>
                    
                     <!-- 步骤名称 -->
                    <el-form class="stepForm">
                        <el-form-item label="步骤名称">
                            <el-input placeholder="请输入步骤名称" v-model="formData.stepName"></el-input>
                        </el-form-item>
                        <!-- 输入URL -->
                        <el-form-item label="*输入URL">
                            <el-input placeholder="请输入URL" v-model="formData.url"></el-input>
                        </el-form-item>
                        <!-- 追加页面 -->
                        <el-form-item>
                            <el-checkbox v-model="formData.appendPage">
                                追加页面（默认在当前页面打开，勾选则在新的页面打开URL）
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item label="断言">
                            <el-dropdown trigger="click">
                                <el-button>添加断言<el-icon class="el-icon--right"><arrow-down /></el-icon></el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>断言元素存在</el-dropdown-item>
                                        <el-dropdown-item>断言元素不存在</el-dropdown-item>
                                        <!-- <el-dropdown-item>断言文本存在</el-dropdown-item>
                                        <el-dropdown-item>断言文本不存在</el-dropdown-item>
                                        <el-dropdown-item>断言元素属性</el-dropdown-item>
                                        <el-dropdown-item>断言页面属性</el-dropdown-item> -->
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </el-form-item>
                        <el-card class="assertion-card" shadow="never">
                            <template #header>
                                <div class="card-header">
                                    <span>断言元素存在</span>
                                    <div>
                                        <el-button icon="Delete" @click="removeAssertion" class="btn-transparent"/>
                                        <el-button icon="ArrowDown" class="btn-transparent"/>
                                    </div>
                                </div>
                            </template>
                            <el-form style="font-size:12px;">
                                <!-- 断言类型 -->
                                <el-form-item label="*断言类型">
                                    <el-select v-model="assertForm.assertionType" placeholder="请选择断言类型">
                                        <el-option label="断言元素存在" value="exists"></el-option>
                                        <el-option label="断言元素不存在" value="notExists"></el-option>
                                    </el-select>
                                </el-form-item>

                                <!-- 目标元素 -->
                                <el-form-item label="*目标元素">
                                    <div class="target-element-actions">
                                        <el-button @click="selectElement">选择元素</el-button>
                                        <el-button @click="defineElement">自定义元素</el-button>
                                    </div>
                                </el-form-item>

                            <!-- 元素目录和选择 -->
                            <div class="element-selection">
                                
                            </div>
                            </el-form>
                        </el-card>
                    </el-form>
                </template>
                <template #footer>
                    <div style="flex: auto">
                        <el-button @click="cancelClick">取消</el-button>
                        <el-button type="primary" @click="confirmClick">保存</el-button>
                    </div>
                </template>
            </el-drawer>
        </div>
    </div>
</template>

<script setup>
import { getAllTestCases, getSteps } from '@/api/testcase'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
const testCasesInfo = ref(null)
const casesInfoShow = ref([])
const drawerVisible = ref(false)//初始设置抽屉不显示
const runResult = ref(false)//如果当前用例运行后，则设置为true，没运行则设置为false
const assertForm = ref({
    assertionType: 'exists',
    elementName: '',
    selectedElement: 'baiduSearchButton'
})

const steps = ref([
  { id: 1, name: '打开百度', url: 'https://www.baidu.com'},
  { id: 2, name: '点击输入框', url: '', appendPage: false},
  { id: 3, name: '在输入框', url: '', appendPage: false},
  { id: 4, name: '点击确定', url: '', appendPage: false}
])
const formData = ref({
      stepName: '',
      url: '',
      appendPage: false
    })
const selectedStep = ref(null)
const isDetailsOpen = ref(false)
const drawerTitle = ref('')

// 格式化时间
const formatDate = (row, column) => {
  const value = row[column.property]
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}
onMounted(async () => {
    await getAllTestCases().then((result) => {
        console.log('result:' + JSON.stringify(result))
        testCasesInfo.value = result
        testCasesInfo.value.forEach((item) => {
            const testCaseArr = ref([])
            JSON.parse(item.testcase_info).forEach(element => {
                testCaseArr.value.push({label: element.case_name, id: element.id})
            })
           casesInfoShow.value.push({label:item.project_name, id:item.project_id, children:testCaseArr})
        })
        console.log('pagesInfoShow:' + JSON.stringify(casesInfoShow.value))
    })
})
const handleNodeClick = async (data, node) => {
  console.log(data)
   // 判断是否是叶子节点
   if (!node.children) {
    await getSteps({testCaseId: data.id}).then((result) => {
        console.log('result:' + JSON.stringify(result))
        // tableData.value = result
    })
  }
}
const showAssert = () => {

}
const handleBrowser = (command) => {
    drawerVisible.value = true
    
    let title = ''
    switch(command){
        case 'open':
            title = '打开网页'  
            break
        case 'close':
            title = '关闭网页' 
            break
        case 'forward':
            title = '向前' 
            break
        case 'back':
            title = '向后' 
            break
        case 'refresh':
            title = '刷新页面' 
            break
    }
    drawerTitle.value = title
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
    }
    .right-content{
        background-color: #fff;
        padding:0 10px 10px;
        border-radius:5px;
        flex:1;
        height:100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
        gap:5px;
        .header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height:32px;
            width:100%;
            padding:20px;
            border-bottom: 1px solid #e5e3e3;
        }
        .steps-table{
            flex: 1;
            width:100%;
        }
       
        .operation-container{
            width:100%;
            padding: 0;
            // height:80px;
            .button-group {
                display: flex;
                gap: 10px;
                overflow-x: auto;
                width: 100%;
                padding: 10px;
                box-sizing: border-box;
                border-radius: 5px;
                border:1px solid #e5e3e3;
             }
            .el-button {
            padding: 8px 15px;
            font-size: 14px;
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
     .drawer-content{
        :deep(.el-drawer__header){
            height:35px;
            padding: 20px;
            margin-bottom: 0px;
            border-bottom:1px solid rgb(221, 219, 219);
        }

        :deep(.el-drawer__body){
            padding:0;
           
            .stepForm{
                // label-width:100px;
                padding:10px 20px;

            }
        }
        :deep(.el-drawer__footer){
            border-top:1px solid rgb(221, 219, 219);
        }
        :deep(.el-card__header){
            padding:0;
        }
        .assertion-card {
            margin-bottom: 10px;    
            :deep(.el-form-item__label){
                font-size:12px;
            }
        }
        // .btn-transparent{
            // border:none !important;
            // background-color: transparent;
            // margin-right:5px;
        // }
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // margin-bottom: 15px;
            padding:5px 10px;
        }


     }
}
</style>