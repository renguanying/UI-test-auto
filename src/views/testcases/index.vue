<template>
    <div class="page-list">
        <div class="left-content">
            <el-tree
                style="max-width: 600px"
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
                        <el-button link @click="remove(node, data)" icon="Delete"></el-button>
                    </div>
                    <div v-else>
                        <el-tooltip content="添加用例" placement="top">
                            <el-button link @click="append(data)" icon="CirclePlus"></el-button>
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
                        <el-icon><document /></el-icon>
                        <span>{{ scope.row.name }}</span>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="editStep(scope.row)">查看结果</el-button>
                        <el-button type="success" size="small" @click="editStep(scope.row)">...</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
                
        </div>
        <div class="step-details" v-if="isDetailsOpen">
            <div class="step-details-header">
                <h3>步骤名称</h3>
                <el-button type="danger" circle @click="closeDetails">×</el-button>
            </div>
            <!-- <div class="step-details-content">
                <el-form label-width="120px">
                <el-form-item label="步骤名称">
                    <el-input v-model="selectedStep.name"></el-input>
                </el-form-item>
                <el-form-item label="*输入URL">
                    <el-input v-model="selectedStep.url"></el-input>
                </el-form-item>
                <el-form-item label="追加页面">
                    <el-checkbox v-model="selectedStep.appendPage">追加页面（勾选后则在新的页面打开URL，不勾选覆盖当前URL）</el-checkbox>
                </el-form-item>
                <el-form-item label="手动配置设置">
                    <el-switch v-model="selectedStep.manualConfig"></el-switch>
                </el-form-item>
                <el-form-item label="元素同步方式">
                    <el-select v-model="selectedStep.syncMethod">
                    <el-option label="与元素管理相互实时同步" value="real-time"></el-option>
                    <el-option label="手动同步" value="manual"></el-option>
                    </el-select>
                </el-form-item>
                </el-form>
            </div>
            <div class="step-details-actions">
                <el-button>设置</el-button>
                <el-button>断言</el-button>
                <el-button>关联提取</el-button>
            </div>
            <div class="step-details-footer">
                <el-button @click="closeDetails">保存</el-button>
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { getAllTestCases, getSteps } from '@/api/testcase'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
const testCasesInfo = ref(null)
const showButton = ref(true)
const casesInfoShow = ref([])
const tableData = ref([])

const steps = ref([
  { id: 1, name: '打开百度...', url: 'https://www.baidu.com', appendPage: true, manualConfig: false, syncMethod: 'real-time' },
  { id: 2, name: '点击输入框', url: '', appendPage: false, manualConfig: false, syncMethod: 'real-time' },
  { id: 3, name: '在输入框...', url: '', appendPage: false, manualConfig: false, syncMethod: 'real-time' },
  { id: 4, name: '点击确定...', url: '', appendPage: false, manualConfig: false, syncMethod: 'real-time' }
])

const selectedStep = ref(null)
const isDetailsOpen = ref(false)


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
        padding:10px;
        border-radius:5px;
        flex:1;
        height:100%;
        .header{
            display: flex;
            justify-content: space-between;
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
}
</style>