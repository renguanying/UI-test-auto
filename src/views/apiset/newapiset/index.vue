<template>
<div class="api-client">
    <div class="header">
        <div class="method-selector">
            <el-select v-model="selectMethod" placeholder="Select">
            <el-option
                v-for="item in requestMethods"
                :key="item.id"
                :label="item.name"
                :value="item.name"
            />
            </el-select>
        </div>
        <div class="url-input">
            <el-input v-model="apiUrl" placeholder="请输入请求地址" />
        </div>
        <div class="buttons">
            <el-button type="primary" @click="sendRequest">发送</el-button>
            <el-button type="danger">保存</el-button>
        </div>
    </div>
    <div class="request-content">
        <div class="tabs">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="Params" name="params"></el-tab-pane>
                <el-tab-pane label="Body" name="body"></el-tab-pane>
                <el-tab-pane label="Headers" name="headers"></el-tab-pane>
                <el-tab-pane label="Cookies" name="cookies"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="content">
            <div v-if="activeTab === 'params'">
                <div class="query-params">
                    <el-table :data="queryParams" style="width: 100%">
                        <el-table-column prop="name" label="参数名">
                            <template #default="scope">
                                <el-input v-model="scope.row.name" placeholder="参数名"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="value" label="参数值">
                            <template #default="scope">
                                <el-input v-model="scope.row.value" placeholder="参数值"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" label="类型">
                            <template #default="scope">
                                <el-select v-model="scope.row.type" placeholder="Select">
                                <el-option
                                    v-for="item in paramTypes"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.name"
                                />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="description" label="说明">
                            <template #default="scope">
                                <el-input v-model="scope.row.description" placeholder="说明"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="50">
                            <template #default="scope">
                                <div class="operation-buttons">
                                    <!-- 定义一个isDeleting变量，来控制显示，isDeleting的默认值是false -->
                                    <el-button size="small"  @click="handleDelete(scope.$index, scope.row)">
                                        <el-icon v-if="scope.row.isDeleting" color="red"><CircleCloseFilled /></el-icon>
                                        <el-icon v-else><Remove /></el-icon>
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="primary" @click="addQueryParam" style="margin-top: 5px;">添加参数</el-button>
                </div>
            </div>
        </div>
    </div>
    <div class="response-content">
      <div class="tabs">
        <el-tabs v-model="responseActiveTab">
            <el-tab-pane label="Body" name="body"></el-tab-pane>
            <el-tab-pane label="Cookie" name="cookie"></el-tab-pane>
            <el-tab-pane label="Header" name="header"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="content">
        <div v-if="responseActiveTab === 'body'">
            <div class="json-viewer">
                <el-input
                    type="textarea"
                    :rows="15"
                    v-model="responseContent"
                    readonly
                ></el-input>
            </div>
        </div>
      </div>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { requestMethods, paramTypes } from '@/api/constants'

//选择的请求方式
const selectMethod = ref('get')

const apiUrl = ref('')
const queryParams = ref([
{ name: 'current', value: '1', type: 'string', description: '' },
{ name: 'size', value: '20', type: 'string', description: '' }
])
const activeTab = ref('params')
const responseActiveTab = ref('body')

const addQueryParam = () => {
queryParams.value.push({
    name: '',
    value: '',
    type: 'string',
    description: ''
})
}

const sendRequest = () => {
// 这里可以实现发送请求的逻辑
ElMessage.success('请求已发送')
}
// 修改项目
const handleDelete = (index, row) => {
    // row.isDeleting值默认是false
  if (row.isDeleting) {
    // 执行删除操作
    queryParams.value.splice(index, 1)
  } else {
    // 进入删除确认状态，此时再次点击就会进入上面操作
    row.isDeleting = true
    // 设置定时器，2秒后恢复
    setTimeout(() => {
      if (row.isDeleting) {
        row.isDeleting = false
      }
    }, 2000)
  }
}
</script>

<style lang="less" scoped>
.api-client {
   padding: 10px;
   /deep/ .el-tabs__item{
        font-size:12px;
    }
    .tabs /deep/ .el-tabs__header{
        margin: 0 0 5px;
    }
  .header {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding:10px;
    margin-bottom: 10px;
    border-radius: 5px;
    .method-selector {
        margin-right: 10px;
        width: 100px;
    }
    .url-input {
        flex: 1;
        margin-right: 10px;
    }
    .buttons {
        display: flex;
    }
  }
  .request-content,.response-content{
    background-color: #fff;
    border-radius: 5px;
    padding:0 5px 5px;
    margin-bottom: 10px;
    .content {
        margin-top: 5px;
        .query-params {
        margin:0;
    }
    }

  }
  
  
}





</style>