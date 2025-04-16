<template>
  <div class="header-body">
    <div class="header-left">
        <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
        <h1 v-if="!isCollapse">自动化平台</h1>
    </div>
    <div class="header-center">
        <el-icon class="menu-toggle" @click="toggleMenu" :style="toggleStyle">
            <!-- //动态组件 -->
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
        </el-icon>
    </div>

    <div class="header-right">
        <!-- <el-avatar src="@/assets/avatar.png" /> -->
        <span>我的</span>
    </div>
    
  </div>
</template>
<script setup>
import { ref, computed, defineEmits } from 'vue'
const isCollapse = ref(false)
const emit = defineEmits(['changeToggle'])
const fn = () => {
    emit('changeToggle', isCollapse.value)
}
const toggleMenu = () => {
    isCollapse.value = !isCollapse.value
    fn()
}
//折叠/展开按钮的样式，根据状态变化，动态变换样式
const toggleStyle = computed(() => {
  return {
    marginLeft: !isCollapse.value ? '0' : '-100px',
    transition: 'margin-left 0.3s ease'
  }
})
</script>

<style lang="less" scoped>
.header-body{
 width: 100%;
 height: 50px;
 padding: 0 5px;
 background-color: #409EFF;
 color: white;

 display: flex;
 justify-content: space-between;
 align-items: center;
.header-left{
    display: flex;
    align-items:center;
    padding: 0;
    width:160px;
    // border-right: 1px solid #02070d;
    
}

 .logo {
  height: 20px;
  margin-right: 5px;
 }

  .header-left h1 {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
 }

.header-center {
  flex: 1;
  margin: 0 0;
//   background-color: green;
  .menu-toggle{
    // position: absolute;
    // right: 20px;
    // top: 50%;
    // width:20px;
    // height:20px;
    // transform: translateY(-50%);
    vertical-align:middle;
    font-size: 20px;
    cursor: pointer;
    color: white;
  }
}


.header-right {
  width:100px;
  margin-left: 15px;
}
}

</style>