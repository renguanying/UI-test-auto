<template>
  <div class="common-layout">
    <el-container class="container-layout">
        <el-header>
            <UIHeader @changeToggle="changeToggle"/>
        </el-header>
        <el-container class="container-body">
            <el-aside :style="sidebarStyle">
                <SideMenu :isCollapse = "isCollapse" @menuClick="menuClick"/>
            </el-aside>
            <el-main class="main-body">
                <!-- <HomePage :style="{marginLeft: isCollapse ? '64px' : '160px' }"/> -->
                <MainTabs class="main-tabs" ref="tabRef"/>
                <div class="router-body">
                    <RouterView/>
                </div>
            </el-main>
        </el-container>
    </el-container>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import UIHeader from '@/components/ui-header.vue'
import SideMenu from '@/components/side-menu.vue'
import MainTabs from '@/components/main-tabs.vue'
const isCollapse = ref(false)//是否折叠menu
const tabRef = ref(null)//tab的ref
const store = useStore()
//切换收起折叠按钮
const changeToggle = (val) => {
    isCollapse.value = val
} 
//左侧菜单栏收起折叠样式设置
const sidebarStyle = computed(() => {
  return {
    width: isCollapse.value ? '64px' : '160px',
    transition: 'width 0.3s ease'
  }
})
//左侧菜单栏的点击事件
const menuClick = (val) => {
  console.log('点击事件：' + JSON.stringify(val))
  tabRef.value.addTab(val)//利用ref调用子组件里的方法
}
onMounted(() => {
  //项目初始加载后，就获取所有部门和所有项目
  store.dispatch('projectAndDepartment/getDepartment')
  store.dispatch('projectAndDepartment/getProject')
})
</script>
<style scoped lang="less">
.container-layout{
    width: 100%;
    height:100vh;//关键
    display:flex;
    flex-direction: column;
  .el-header{
    padding: 0;
    height:50px;
   }
  .el-main{
    width:100%;
    height:100%;
  }
  .el-aside{
    overflow: hidden;
  }
  .container-body{
    display: flex;
    flex:1;
    overflow: hidden;
    .main-body{
        flex:1;
        overflow: auto;
        padding:0;
        .main-tabs{
            background-color: white;
        }
        .router-body{
            padding:5px;
        }
    }
  }
}

</style>