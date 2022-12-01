<template>
  <div>
    <ContentHead headTitle="审批管理"></ContentHead>
    <div class="module-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="未审核任务" name="0"
          ><ApprovalList
            :activeName="activeName"
            v-if="activeName === '0'"
          ></ApprovalList
        ></el-tab-pane>
        <el-tab-pane label="已审核任务" name="666"
          ><ApprovalList :activeName="activeName" v-if="activeName === '666'" ></ApprovalList
        ></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead";
import ApprovalList from "@/views/approvalManagement/components/approvalList.vue";
export default {
  name: "approvalManagement",

  components: {
    ContentHead,
    ApprovalList,
  },

  data() {
    return {
      activeName: "0",
    };
  },
};
</script>

<style lang="less" scoped>
.module-wrapper {
  padding: 30px 20px 18px 20px;
}
</style>