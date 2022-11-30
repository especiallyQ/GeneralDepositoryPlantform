<template>
  <div>
    <el-dialog
      title="审批"
      :visible.sync="dialogFormVisible"
      center
      :close-on-click-modal="false"
      @close="close"
      width="598px"
    >
      <el-form label-width="100px" class="selectForm" v-loading="getLoading">
        <el-form-item label="审批类型">
          <el-input
            :disabled="true"
            :value="form.depositoryTemplateName"
          ></el-input>
        </el-form-item>
        <div class="box" v-for="item in editData" :key="item.paramName">
          <div class="left-list">
            <el-form-item :label="item.paramName">
              <el-input
                :disabled="true"
                :placeholder="item.oldParam"
              ></el-input>
            </el-form-item>
          </div>
          <div class="el-icon-right icon-right"></div>
          <div :class="item.edited ? 'newData-red' : ''">
            <el-input :disabled="true" :placeholder="item.newParam"></el-input>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button @click="close(0)">取消</el-button>
          <el-button
            type="danger"
            @click="submitApprovalRejectResult"
            :loading="rejectLoading"
            :disabled="agreeLoading"
            >拒绝</el-button
          >
          <el-button
            type="primary"
            @click="submitApprovalSuccessResult"
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
import {
  submitApprovalSuccess,
  submitApprovalReject,
  getApprovalComparisonData,
} from "@/util/api";

export default {
  name: "ComparisonDialog",
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
      editData: null, //审核新旧数据
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
    close(val) {
      this.$emit("closeApprovalDialog", val);
    },

    open() {
      this.getLoading = true;
      // 获取模板数据
      getApprovalComparisonData(this.approvalId)
        .then((res) => {
          if (res.data.code === 0) {
            this.getLoading = false;
            this.$set(
              this.form,
              "depositoryTemplateName",
              res.data.data.approvalType
            );
            this.editData = res.data.data.params;
            console.log(this.editData);
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

    //  提交审批通过结果
    submitApprovalSuccessResult() {
      this.agreeLoading = true;
      submitApprovalSuccess(this.approvalId)
        .then((res) => {
          if (res.data.code === 0) {
            this.close(1);
            this.$message({
              message: "审批已通过",
              type: "success",
              duration: 2000,
            });
          } else {
            this.close(0);
            this.$message({
              message: res.data.message || this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.close(0);
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },
    //  提交审批拒绝结果
    submitApprovalRejectResult() {
      this.rejectLoading = true;
      submitApprovalReject(this.approvalId)
        .then((res) => {
          if (res.data.code === 0) {
            this.close(1);
            this.$message({
              message: "审批已拒绝",
              type: "warning",
              duration: 2000,
            });
          } else {
            this.close(0);
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.close(0);
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
  
<style lang="less" scoped>
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

.selectForm {
  /deep/.el-form-item__label {
    font-size: 12px;
    font-family: "Courier New", Courier, monospace;
  }
}

.newData-red {
  /deep/.el-input__inner::placeholder {
    color: red;
  }
}

.box {
  display: flex;

  .icon-right {
    width: 50px;
    height: 35px;
    line-height: 35px;
    text-align: center;
  }
}
</style>