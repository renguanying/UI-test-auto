<template>
    <div class="page-list">
        <div class="left-content">
            <el-tree
                style="max-width: 600px"
                :data="pagesInfoShow"
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
                        <el-tooltip content="添加页" placement="top">
                            <el-button link @click="append(data)" icon="CirclePlus"></el-button>
                        </el-tooltip>
                    </div>
                </div>
            </template>
            </el-tree>
        </div>
        <div class="right-content">
            <div class="header">
                <el-button type="primary" icon="Plus" @click="handleNewElement">新建元素</el-button>
                <el-button icon="Delete" @click="handleBatchDelete">批量删除</el-button>
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
                    min-width="100"
                />
                <el-table-column
                    prop="locate_value"
                    label="值"
                    width="160"
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
        </div>
    </div>
</template>

<script setup>
import { getPages, getElements } from '@/api/pages'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
const pagesInfo = ref(null)
const showButton = ref(true)
const pagesInfoShow = ref([])
const tableData = ref([])
// 格式化时间
const formatDate = (row, column) => {
  const value = row[column.property]
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}
onMounted(async () => {
    await getPages().then((result) => {
        console.log('result:' + JSON.stringify(result))
        pagesInfo.value = result
        pagesInfo.value.forEach((item) => {
            const pagesNameArr = ref([])
            JSON.parse(item.page_info).forEach(element => {
                pagesNameArr.value.push({label: element.page_name, id: element.id})
            })
        //    const showItem = {label:item.project_name, id:item.project_id, children:pagesNameArr}
           pagesInfoShow.value.push({label:item.project_name, id:item.project_id, children:pagesNameArr})
        })
        console.log('pagesInfoShow:' + JSON.stringify(pagesInfoShow.value))
    })
})
const handleNodeClick = async (data, node) => {
  console.log(data)
   // 判断是否是叶子节点
   if (!node.children) {
    await getElements({pageId: data.id}).then((result) => {
        console.log('result:' + JSON.stringify(result))
        tableData.value = result
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