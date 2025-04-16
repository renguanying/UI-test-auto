<template>
<div class="api-client">
    <div class="header">
      <el-form :model="apiForm" class="form-sty" :rules="rules" ref="formRef">
        <el-row :gutter="10">
            <el-col :span="5">
                <el-form-item label="所属部门" class="depart-select"  prop="depart_id">
                    <el-select v-model="apiForm.depart_id" placeholder="请选择部门" style="width:200px"  @change="handleDepartChange">
                        <el-option
                            v-for="depart in departOptions"
                            :key="depart.id"
                            :label="depart.departName"
                            :value="depart.id"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="5">
                <el-form-item label="所属项目"  prop="project_id">
                    <el-select v-model="apiForm.project_id" placeholder="请选择项目" style="width:200px">
                        <el-option
                            v-for="project in projectOptions"
                            :key="project.id"
                            :label="project.project_name"
                            :value="project.id"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="2">
                <el-form-item>
                    <el-select v-model="apiForm.api_method" placeholder="Select">
                        <el-option
                            v-for="item in requestMethods"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="api_url">
                    <el-input v-model="apiForm.api_url" placeholder="请输入接口地址" />
                </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item prop="api_name">
                    <el-input v-model="apiForm.api_name" placeholder="请输入接口名称" />
                </el-form-item>
            </el-col>
            <el-col :span="3">
                <el-form-item>
                    <el-button type="primary" @click="testRequest">测试</el-button>
                    <el-button type="danger" @click="saveApiInfo">保存</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
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
            <div v-if="activeTab === 'params'" class="query-params">
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
            <div v-if="activeTab === 'body'" class="query-params">
                <el-input type="textarea" :rows="5" v-model="queryBody"></el-input>
            </div>
            <div v-if="activeTab === 'headers'" class="query-params">
                <el-input type="textarea" :rows="5" v-model="queryHeaders"></el-input>
            </div>
            <div v-if="activeTab === 'cookies'" class="query-params">
                <el-input type="textarea" :rows="5" v-model="queryCookie"></el-input>
            </div>
        </div>
    </div>
    <div class="response-content">
        <div class="response-result">
            <div class="tabs">
                <el-tabs v-model="responseActiveTab">
                    <el-tab-pane label="Body" name="body"></el-tab-pane>
                    <el-tab-pane label="Header" name="header"></el-tab-pane>
                    <el-tab-pane label="Cookie" name="cookie"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="content">
                <div v-if="responseActiveTab === 'body'">
                    <div class="json-viewer">
                        <el-input
                            type="textarea"
                            :rows="10"
                            v-model="responseBody"
                        ></el-input>
                    </div>
                </div>
                <div v-if="responseActiveTab === 'cookie'">
                    <div class="json-viewer">
                        <el-input
                            type="textarea"
                            :rows="10"
                            v-model="responseCookie"
                        ></el-input>
                    </div>
                </div>
                <div v-if="responseActiveTab === 'header'">
                    <div class="json-viewer">
                        <el-input
                            type="textarea"
                            :rows="10"
                            v-model="responseHeader"
                        ></el-input>
                    </div>
                </div>
            </div>
        </div>
        <div class="response-code">
            <el-text type="primary" style="width:100%">返回结果</el-text>
            <el-text v-model="responseCode" type="primary" style="width:100%"></el-text>
        </div>
      
    </div>
</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { requestMethods, paramTypes } from '@/api/constants'
import { getAllDepartment } from '@/api/department'
import { getAllProject, getProjectByDepartId } from '@/api/project'
import { addApi, getApiById, updateApi } from '@/api/apiset'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { testApiRunOne } from '@/api/apirun'

const isEdit = ref(false)//当前页面是新建页，还是编辑页，默认为false，新建页面
const store = useStore()
const departOptions = ref([])
const projectOptions = ref([])
const allProjectOption = ref([])
const responseCode = ref('')
const responseBody = ref('')//响应body
const responseHeader = ref('')//响应header
const responseCookie = ref('')//响应cookie
const queryBody = ref('')
const queryHeaders = ref('')
const queryCookie = ref('')
const formRef = ref(null)
// 校验规则
const rules = {
  depart_id: [{ required: true, message: '请选择部门', trigger: 'change' }],
  project_id: [{ required: true, message: '请选择项目', trigger: 'change' }],
  api_url: [{ required: true, message: '请输入接口地址', trigger: 'blur' }],
  api_name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }]
}
//form数据
const apiForm = reactive({
    id: '',
    depart_id: '',
    project_id: '',
    api_method: 'get',
    api_url:'',
    api_name:'',
    create_time:''
})
const route = useRoute()

//request的参数设置
const queryParams = ref([
// { name: 'current', value: '1', type: 'string', description: '' },
// { name: 'size', value: '20', type: 'string', description: '' }
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
onMounted(async () => {
    if (route.params.id) {
        isEdit.value = true
        // 加载编辑数据
        await getApiById({id:route.params.id}).then((result) => {
            console.log('当前id对应的结果:' + JSON.stringify(result))
            Object.assign(apiForm, {
                id: result.id,
                depart_id: result.depart_id,
                project_id: result.project_id,
                api_method: result.api_method,
                api_url: result.api_url,
                api_name: result.api_name,
                create_time: result.create_time
            })
            queryParams.value = result.api_params.trim() === '' ? '' : JSON.parse(result.api_params)
            queryBody.value = result.api_body
            queryHeaders.value = result.api_headers
            queryCookie.value = result.api_cookie
        }) 
     }
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
})
const handleDepartChange = async (value) => {
    console.log('选择的部门ID:', value)
    // console.log('选择的部门名称:', departOptions.value.find(item => item.id === value)?.departName);
    await getProjectByDepartId({departId: value}).then((result) => {
        console.log('result:' + JSON.stringify(result))
        projectOptions.value = result.data
    })
}
//测试一个接口
const testRequest = async () => {    
    if(apiForm.api_url === ''){
        ElMessage.warning('输入接口地址后再点测试')
    } else {
        const requestData = {api_url:apiForm.api_url, api_method:apiForm.api_method, api_params:JSON.stringify(queryParams.value), api_body:queryBody.value, api_headers:queryHeaders.value, api_cookie:queryCookie.value}
        console.log('requestData:' + JSON.stringify(requestData))
        await testApiRunOne(requestData).then((result) => {
            if(result.header){
                responseHeader.value = JSON.stringify(result.header)
            }
            if(result.cookie){
                responseCookie.value = JSON.stringify(result.cookie)
            }
            if(result.data){
                responseBody.value = result.data
            }
            console.log('result:' + JSON.stringify(result))
            // responseBody.value = JSON.stringify(result)
        })
    }
}
const saveApiInfo = () => {
  formRef.value.validate(async (valid) => {
    console.log('valid:' + valid)
    if (valid) {
        const nowDateTime = new Date()
        if (isEdit.value) { //编辑
            const requestData = {...apiForm, api_params:JSON.stringify(queryParams.value), api_body:queryBody.value, api_headers:queryHeaders.value, api_cookie:queryCookie.value, update_time: nowDateTime}
            console.log('data:' + JSON.stringify(requestData))
            await updateApi(requestData).then((result) => {
                console.log('修改数据:' + JSON.stringify(result))
                ElMessage.success('修改成功')
            })
        } else { //新建
            const requestData = {...apiForm, api_params:JSON.stringify(queryParams.value), api_body:queryBody.value, api_headers:queryHeaders.value, api_cookie:queryCookie.value, create_time:nowDateTime, update_time: nowDateTime, api_result:''}
            console.log('data:' + JSON.stringify(requestData))
            await addApi(requestData).then((result) => {
                console.log('result:' + JSON.stringify(result))
                ElMessage.success('添加成功')
            })
        }
    }
  })
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
    width:100%;
   padding: 10px;
   :deep(.el-tabs__item){
        font-size:12px;
    }
    .tabs :deep(.el-tabs__header){
        margin: 0 0 5px;
    }
  .header {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding:15px 15px 0 15px;
    margin-bottom: 10px;
    border-radius: 5px;
    .form-sty{
        width:100%;
        align-items: center;
    }
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
  .response-content{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items:center;
        height:280px;
        .response-result{
            flex:1;
            border-right:1px solid #edeaea;
            padding: 5px;
        }
        .response-code{
            width:500px;
            height:100%;
            padding: 10px;
            display: flex;
            flex-direction:column;
            justify-content: flex-start;
            align-items:start;
            align-content: flex-start;
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