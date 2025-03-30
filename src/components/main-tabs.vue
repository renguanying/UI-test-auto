<template>
  <el-tabs
    v-model="activeTabName"
    type="card"
    class="demo-tabs"
    closable
    @tab-remove="removeTab"
    @tab-click="clickTab"
  >
    <el-tab-pane
      v-for="item in tabsData"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref, defineExpose, watch} from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
const activeTabName = ref('/')//用来记录当前激活状态的tab的name值，初始值是首页的name'/'
const tabsData = ref([{ title: '首页', name: '/' }])//用来存放所有tab的内容

const addTab = (val) => {
  console.log('tab里的值：' + JSON.stringify(val))
  //如果不存在，则添加
  if(!tabsData.value.find(item => item.name === val.name)){
    tabsData.value.push(val)
  }
  console.log('tabsData的值：' + JSON.stringify(tabsData.value))
  //修改点击后的name值
  activeTabName.value = val.name
}
//点击菜单里任意一个时
const clickTab = (val) => {
  activeTabName.value = val.props.name//设置当前活跃的tab的name值
  router.push(val.props.name)
}
const removeTab = (targetName) => {
  console.log('targetName:' + targetName + 'activeTabName:' + activeTabName.value)
  //找出下一个活跃的tab
  const tabs = tabsData.value
  if (activeTabName.value === targetName) {
    tabsData.value.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeTabName.value = nextTab.name
          router.push(activeTabName.value)
        } else { //如果最后一个都不剩时，跳转首页
          activeTabName.value = '/'
          router.push('/')
        }
      }
    })
  }
  
  //过滤掉删除掉的tab
  tabsData.value = tabsData.value.filter((tab) => tab.name !== targetName)
}
defineExpose({addTab})
</script>

<style lang="less" scoped>
// 利用深度穿透，不然不起作用
.demo-tabs /deep/ .el-tabs__header{
  margin: 0 0 5px;
}
</style>