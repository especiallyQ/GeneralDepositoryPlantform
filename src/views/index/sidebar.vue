<template>
  <div class="sidebar-wrapper">
    <div class="sidebar-content">
      <div class="image-flex justify-center center" v-if="menuShow">
        <span class="sidebar-header">通用存证平台</span>
        <span class="sidebar-contract-icon">
          <i
            class="el-icon-caret-left font-color-aeb1b5"
            @click="hideMune(true)"
            style="font-size: 18px"
          >
          </i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
};
</script>

<style lang="less" scoped>
.sidebar-wrapper {
  position: relative;
  height: 100%;
  box-sizing: border-box;
  user-select: none;

  .sidebar-content {
    position: relative;
    height: 100%;
    background-color: #0c1220;
    box-sizing: border-box;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
}
</style>