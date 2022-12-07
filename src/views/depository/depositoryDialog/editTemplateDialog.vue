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

        <el-form-item
          label="存证参数"
          prop="parameter"
          :show-message="false"
          v-for="(key, index) in form.parameterParamsForm1"
          :key="index"
        >
          <el-input
            v-model="key.parameterName"
            class="el-input-width"
            :disabled="true"
          ></el-input>
          <el-input
            v-model="key.parameterType"
            class="el-input-width"
            style="marginLeft: 8px"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="parameter"
          :show-message="false"
          v-for="(key, index) in form.parameterParamsForm2"
          :key="index + 1"
        >
          <el-input
            v-model="key.parameterName"
            class="el-input-width"
            :disabled="true"
          ></el-input>
          <el-input
            v-model="key.parameterType"
            class="el-input-width"
            style="marginLeft: 8px"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model="form.remark"
            :rows="4"
            resize="none"
            maxlength="60"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>

        <div class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button
            type="primary"
            @click="editDepositoryTemplate"
            :loading="loading"
            >确定</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
  
  <script>
import { getEditDepositoryTemplate, editDepoTemplate } from "@/util/api";

export default {
  name: "editTemplateDialog",
  props: {
    editTemplateDialogVisible: {
      type: Boolean,
      default: false,
      required: true,
    },
    editTemplateNameId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dialogFormVisible: this.editTemplateDialogVisible, //控制dialog是否显示
      getLoading: false, //获取数据loading图标
      loading: false, //编辑按钮loading图标
      form: {
        depositoryTemplateName: null, //存证模板名称
        remark: null, //备注
        parameterParamsForm1: [], //存证参数
        parameterParamsForm2: [], //存证参数
      },
    };
  },
  watch: {
    editTemplateDialogVisible() {
      this.dialogFormVisible = this.editTemplateDialogVisible;
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
      this.getLoading = true;
      
      // 获取模板数据
      getEditDepositoryTemplate(this.editTemplateNameId)
        .then((res) => {
          if (res.data.code === 0) {
            console.log(res.data.data);
            const { depositoryTemplateName, remark, params } = res.data.data;
            this.form.depositoryTemplateName = depositoryTemplateName;
            this.form.remark = remark;
            this.form.parameterParamsForm1 = params.splice(0, 1);
            this.form.parameterParamsForm2 = params;
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

    // 编辑存证模板方法
    editDepositoryTemplate() {
      const { remark } = this.form;
      let data = {
        id: this.editTemplateNameId,
        remark,
      };
      this.loading = true;
      editDepoTemplate(data)
        .then((res) => {
          if (res.data.code === 0) {
            this.close();
            this.$emit("getNewTemplateList");
            this.$message({
              type: "success",
              message: "编辑成功",
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