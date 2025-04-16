<template>
    <div class="result-list">
        <div class="left-content">
            <el-tree
                style="max-width: 600px"
                :data="runResult"
                :props="defaultProps"
                highlight-current
                accordion
                @node-click="handleNodeClick"
            >
            <template #default="{ node }">
                <div class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <!-- <el-button link @click="remove(node, data)" icon="Delete" class="hover-button"></el-button> -->
                </div>
            </template>
            </el-tree>
        </div>
        <div class="right-content">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column
                    prop="id"
                    label="接口id"
                    width="50"
                />
                <el-table-column
                    prop="depart_name"
                    label="部门名称"
                    width="70"
                />
                <el-table-column
                    prop="project_name"
                    label="项目名称"
                    width="70"
                />
                <el-table-column
                    prop="api_name"
                    label="接口名"
                    width="80"
                />
                <el-table-column
                    prop="api_url"
                    label="接口地址"
                    width="80"
                />
                <el-table-column
                    prop="api_method"
                    label="请求方式"
                    width="50"
                />
                <el-table-column
                    prop="api_params"
                    label="params参数"
                    width="130"
                />
                <el-table-column
                    prop="api_body"
                    label="body参数"
                    width="80"
                />  
                <el-table-column prop="api_result" label="请求结果" min-width="180">
                    <template #default="scope">
                    <div class="text-container">
                        <div v-if="!scope.row.expanded && scope.row.api_result.length > 300" class="text-overflow">
                            {{ scope.row.api_result.substring(0, 300) + '...' }}
                            <el-link type="primary" @click="toggleExpand(scope.row)">展开</el-link>
                        </div>
                        <div v-else>
                            {{ scope.row.api_result }}
                            <el-link v-if="scope.row.api_result.length > 300" type="primary" @click="toggleExpand(scope.row)">收起</el-link>
                        </div>
                    </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { selectAllResults } from '@/api/apiresult'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
const runResultData = ref([])
const tableData = ref([])
const runResult = ref([])
// 格式化时间
const formatDate = (row, column) => {
  const value = row[column.property]
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}
onMounted(async () => {
    await selectAllResults().then((result) => {
        console.log('result:' + JSON.stringify(result))
        runResultData.value = result

        runResultData.value.forEach(item => {
            runResult.value.push({label:`${item.run_environment}：${item.run_time}`, id:item.id, result:item.run_result})
        })
        console.log('runDataresult:' + JSON.stringify(result))
    })
})
const handleNodeClick = async (data, node) => {
    // console.log('nodeClick:' + JSON.stringify(data))
    const result = JSON.parse(data.result)
    tableData.value = result
}
// 切换展开和折叠
const toggleExpand = (row) => {
  row.expanded = !row.expanded
}
</script>

<style lang="less" scoped>
.result-list{
    width:100%;
    height:100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .left-content{
        // width:400px;
        flex: 0 0 330px;//宽度固定为400px
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