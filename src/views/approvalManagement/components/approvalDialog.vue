<template>
  <div>
    <el-dialog
      title="编辑存证模板"
      :visible.sync="dialogFormVisible"
      center
      :close-on-click-modal="false"
      @close="close"
      width="498px"
    >
      <el-form
        :model="form"
        label-width="100px"
        class="selectForm"
        v-loading="getLoading"
      >
        <el-form-item label="存证模板名称">
          <el-input
            v-model="form.depositoryTemplateName"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button
            type="danger"
            @click="submitApproval(2)"
            :loading="rejectLoading"
            :disabled="agreeLoading"
            >拒绝</el-button
          >
          <el-button
            type="primary"
            @click="submitApproval(1)"
            :loading="agreeLoading"
            :disabled="rejectLoading"
            >通过</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
  
  <script>
import { submitApprovalResult, getApprovalComparisonData } from "@/util/api";

export default {
  name: "editTemplateDialog",
  props: {
    approvalDialogVisible: {
      type: Boolean,
      default: false,
      required: true,
    },
    approvalId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dialogFormVisible: this.approvalDialogVisible, //控制dialog是否显示
      getLoading: false, //获取数据loading图标
      agreeLoading: false, //审批通过按钮loading图标
      rejectLoading: false, //审批拒绝按钮loading图标
      form: {
        depositoryTemplateName: null, //存证模板名称
      },
    };
  },
  watch: {
    approvalDialogVisible() {
      this.dialogFormVisible = this.approvalDialogVisible;
    },
  },

  mounted() {
    this.open();
  },

  methods: {
    // 关闭新建存证模板时触发
    close() {
      this.$emit("updateTemplateDialog", false);
    },

    open() {
      // this.getLoading = true;
      // 获取模板数据
      getApprovalComparisonData(this.approvalId)
        .then((res) => {
          if (res.data.code === 0) {
            this.getLoading = false;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },

    //  提交审批结果
    submitApproval(val) {
      switch (val) {
        case 1:
          this.agreeLoading = true;
          break;
        case 2:
          this.rejectLoading = true;
          break;
      }
      const data = {
        id: this.approvalId,
        status: val,
      };
      submitApprovalResult(data)
        .then((res) => {
          if (res.data.code === 0) {
            this.close();
            this.$message({
              message: "审批成功",
              type: "success",
              duration: 2000,
            });
          } else {
            this.close();
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.close();
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },
  },
};
</script>
  
  <style scoped>
.dialog-footer {
  text-align: right;
}
.el-select-width {
  width: 346px;
}

.el-input-width {
  width: 163px;
  margin-right: 5px;
}

.selectForm >>> .el-form-item__label {
  font-size: 12px;
  font-family: "Courier New", Courier, monospace;
}
</style>