<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    :unique-opened="true"
    :collapse-transition="true"
    @select="menuSelectHandle"
    router
  >
    <!-- 工作台 -->
    <el-menu-item index="/">
        <el-icon><House /></el-icon>
        <span>首页</span>
    </el-menu-item>
    <!-- 项目管理 -->
    <el-sub-menu index="1">
      <template #title>
        <el-icon><Menu /></el-icon>
        <span>项目管理</span>
      </template>
      <el-menu-item index="/project">
        <el-icon><Document /></el-icon>
        <span>项目配置</span>
      </el-menu-item>
      <el-menu-item index="/environment">
        <el-icon><Grid /></el-icon>
        <span>环境配置</span>
      </el-menu-item>
    </el-sub-menu>

    <!-- 测试管理 -->
    <el-sub-menu index="2">
      <template #title>
        <el-icon><Operation /></el-icon>
        <span>UI管理</span>
      </template>
      <el-menu-item index="/pagesmanager">
        <el-icon><Memo /></el-icon>
        <span>页面管理</span>
      </el-menu-item>
      <!-- <el-menu-item index="/elements">
        <el-icon><Collection /></el-icon>
        <span>元素管理</span>
      </el-menu-item> -->
      <el-menu-item index="/testcases">
        <el-icon><Files /></el-icon>
        <span>测试用例</span>
      </el-menu-item>
      <el-menu-item index="/testcases-run">
        <el-icon><Tickets /></el-icon>
        <span>测试报告</span>
      </el-menu-item>
    </el-sub-menu>
    <!-- 接口管理 -->
    <el-sub-menu index="3">
      <template #title>
        <el-icon><Connection /></el-icon>
        <span>接口管理</span>
      </template>
      <el-menu-item index="/apiset">
        <el-icon><DataBoard /></el-icon>
        <span>接口集合</span>
      </el-menu-item>
      <el-menu-item index="/apiresult">
        <el-icon><Reading /></el-icon>
        <span>执行结果</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, defineExpose } from 'vue'
import { useRouter, useRoute } from 'vue-router'//用来监听路由变化


const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['menuClick'])

const activeMenu = ref('/')

const route = useRoute()
const router = useRouter()
router.push('/')

// 菜单项与标签页的映射关系
const menuTabsMap = {
  '/': { title: '首页', name: '/' },
  '/project': { title: '项目配置', name: '/project' },
  '/environment': { title: '环境配置', name: '/environment'},
  '/pagesmanager': { title: '页面管理', name: '/pagesmanager'},
  '/testcases': { title: '测试用例', name: '/testcases'},
  '/apiset': { title: '接口集合', name: '/apiset'},
  '/apiresult': { title: '执行结果', name: '/apiresult'}
}
//菜单栏点击事件
const menuSelectHandle = (index) => {
  console.log('index:' + index)
  const tabContent = menuTabsMap[index]
  emit('menuClick', tabContent)
}

watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
}, { immediate: true })
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  /* width: 160px; */
  min-height: 400px;
  height: 100%;
}

/* 确保在折叠模式下只显示图标，隐藏文字 */
:deep(.el-menu--collapse) .el-submenu__title span,
:deep(.el-menu--collapse) .el-menu-item span {
  display: none !important;
}

.el-menu-vertical-demo {
  height: 100%;
  border-right: none;
  overflow-x: hidden;
}

.el-menu-item i,
.el-submenu__title i {
  color: #606266;
  margin-right: 8px;
}

.el-menu-item span,
.el-submenu__title span {
  font-size: 14px;
}

.el-menu-item,
.el-submenu__title {
  height: 48px;
  line-height: 48px;
}

.el-menu--collapse .el-submenu__title {
  height: 48px;
}

.el-menu-item.is-active {
  background-color: #e6f7ff;
  color: #1890ff;
}

.el-menu-item:hover,
.el-submenu__title:hover {
  background-color: #f5f7fa;
}
</style>