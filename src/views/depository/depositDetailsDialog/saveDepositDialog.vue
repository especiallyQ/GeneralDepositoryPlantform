<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      @close="closeSaveDepositDialog(0)"
      @open="getSaveDepositoryMsg"
      center
      width="498px"
    >
      <el-form
        :model="form"
        ref="ruleForm"
        label-width="100px"
        class="selectForm"
        :rules="rules"
        v-loading="getParameterLoading"
      >
        <el-form-item label="存证模板名称" v-if="dialogFlag !== 2">
          <el-input
            :placeholder="templateMsg.depositoryTemplateName"
            :disabled="dialogFlag !== 2"
          ></el-input>
        </el-form-item>

        <el-form-item
          v-for="item in oldParameter"
          :key="item.parameterName"
          :label="item.parameterName"
          :prop="item.parameterName"
        >
          <el-input
            v-model="form[item.parameterName]"
            v-if="
              item.parameterType !== 'file' &&
              (item.parameterType !== 'dictionary' || dialogFlag === 2)
            "
            :disabled="dialogFlag === 2"
            @input="(event) => changeInput(event, item)"
          ></el-input>
          <el-select
            v-if="item.parameterType === 'dictionary' && dialogFlag !== 2"
            v-model="form[item.parameterName]"
            @change="
              (event) => {
                changeInput(event, item);
              }
            "
            style="width: 346px"
          >
            <el-option
              v-for="items in item.parameterOption"
              :key="items.index"
              :value="items"
              :label="items"
            ></el-option>
          </el-select>
          <el-upload
            v-if="item.parameterType === 'file'"
            class="upload-demo"
            ref="upload"
            :action="`${url.ORG_LIST}/getFileHash`"
            :limit="1"
            :auto-upload="true"
            :on-success="
              (response) => {
                handleSuccess(response, item.parameterName);
              }
            "
            :on-exceed="handleExceed"
            :on-remove="
              () => {
                handleRemove(item.parameterName);
              }
            "
            :on-change="handleChange"
            :on-error="handleError"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
          </el-upload>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="closeSaveDepositDialog(0)">取消</el-button>
          <el-button
            @click="submitDialog('ruleForm')"
            :disabled="dialogFlag === 1 && btnDisabled"
            type="primary"
            :loading="loading"
            >{{ dialogFlag === 2 ? "校验" : "确定" }}</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
  
  <script>
import {
  saveDepositoryContent,
  getInitAddDepository,
  getCheckDataMessage,
  validateDepositoryContent,
  editDepoMsgList,
} from "@/util/api";
import url from "@/util/url";
export default {
  props: {
    // 控制Dialog是否显示
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    // 当前存证模板详细信息
    templateMsg: {
      type: Object,
    },
    // Dialog用途 0表示录入 1表示存证信息 2表示数据校验
    dialogFlag: {
      type: Number,
      required: true,
    },
    // 数据校验行Id
    depositoryId: {
      type: Number,
    },
  },
  data() {
    return {
      dialogFormVisible: this.visible, //控制dialog是否显示
      loading: false, //确定按钮loading
      getParameterLoading: false, // 获取表单数据loading
      parameter: [], //将要提交的参数
      oldParameter: [], //原始获取的参数，用于对比
      rules: {}, //验证规则
      form: {
        //表单数据
      },
      url, //服务器地址
      fileHash: "", //旧上传文件Hash
      btnDisabled: true, //确定按钮是否禁用
      btnDisabledArr: [], //确定按钮是否禁用 为空表示新旧表单数据一样
      btnDisabledFileArr: [], //确定按钮是否禁用 为空表示新旧文件数据一样
    };
  },

  watch: {
    visible() {
      this.dialogFormVisible = this.visible;
    },
    form: {
      handler() {
        for (let key of this.parameter) {
          key.parameterValue = this.form[key.parameterName];
        }
      },
      deep: true,
    },
    btnDisabledArr: {
      handler() {
        if (
          this.btnDisabledArr.length === 0 &&
          this.btnDisabledFileArr.length === 0
        ) {
          this.btnDisabled = true;
        } else {
          this.btnDisabled = false;
        }
      },
      deep: true,
    },

    btnDisabledFileArr: {
      handler() {
        if (
          this.btnDisabledArr.length === 0 &&
          this.btnDisabledFileArr.length === 0
        ) {
          this.btnDisabled = true;
        } else {
          this.btnDisabled = false;
        }
      },
      deep: true,
    },
  },

  methods: {
    
    // 改变表单内容
    changeInput(event, item) {
      for (let key of this.oldParameter) {
        console.log('@@@@@@@@@@@key@@@'+key.parameterValue);
        console.log('@@@@@@@@@@@event@@'+event);
        if (key.parameterName === item.parameterName) {
          if (
            key.parameterValue !== event &&
            !this.btnDisabledArr.includes(key.parameterName)
          ) {
            this.btnDisabledArr.push(key.parameterName);
          }
          if (
            key.parameterValue === event &&
            this.btnDisabledArr.includes(key.parameterName)
          ) {
            this.btnDisabledArr.splice(
              this.btnDisabledArr.indexOf(key.parameterName),
              1
            );
          }
        }
      }
    },

    // 移除文件
    handleRemove(parameterName) {
      this.form[parameterName] = null;
      this.btnDisabledFileArr.pop();
    },

    // 改变文件状态
    handleChange(file, fileList) {
      if (fileList.length >= 2) {
        return;
      }
      for (let key of this.parameter) {
        if (key.parameterType === "file") {
          this.$refs.ruleForm.clearValidate(key.parameterName);
        }
      }
    },

    // 上传文件获取Hash
    handleSuccess(response, parameterName) {
      this.$set(this.form, parameterName, response.data);
      if (this.fileHash === response.data) {
        this.btnDisabledFileArr.pop();
      } else {
        this.btnDisabledFileArr.push(1);
      }
    },

    handleExceed() {
      this.$message({
        message: "当前限制选择 1 个文件",
        type: "warning",
        duration: 2000,
      });
    },

    // 上传文件错误处理
    handleError() {
      this.$message({
        message: "文件上传失败或文件过大，请稍后重试",
        type: "error",
        duration: 2000,
      });
    },

    // 关闭Dialog时
    closeSaveDepositDialog(flag) {
      this.$emit("closeSaveDetailsDialog", flag);
    },

    // 获取Dialog初始化数据
    getDialogParameterData() {
      if (!this.dialogFlag) {
        this.getSaveDepositoryMsg();
        return;
      }
      this.getDepositoryMsg();
    },

    // 获取录入存证按钮信息
    getSaveDepositoryMsg() {
      this.getParameterLoading = true;
      getInitAddDepository(this.templateMsg.id)
        .then((res) => {
          if (res.data.code === 0) {
            this.parameter = res.data.data;
            this.parameter = JSON.parse(JSON.stringify(res.data.data));
            this.oldParameter = JSON.parse(JSON.stringify(res.data.data));
            this.createRules();
            this.getParameterLoading = false;
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

    //获取存证信息列表数据
    getDepositoryMsg() {
      this.getParameterLoading = true;
      getCheckDataMessage(this.depositoryId)
        .then((res) => {
          if (res.data.code === 0) {
            this.parameter = JSON.parse(JSON.stringify(res.data.data));
            this.oldParameter = JSON.parse(JSON.stringify(res.data.data));
            for (let key of this.parameter) {
              if (key.parameterType === "file") {
                this.fileHash = key.parameterValue;
                this.$set(this.form, key.parameterName, null);
              } else {
                this.$set(this.form, key.parameterName, key.parameterValue);
              }
            }
            this.createRules();
            this.getParameterLoading = false;
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

    // 录入存证信息
    setDepositoryContent() {
      const { id } = this.templateMsg;
      let formData = new FormData();
      for (let key of this.parameter) {
        if (key.parameterType === "file") {
          formData.append("fileHash", key.parameterValue);
          key.parameterValue = "";
        }
      }
      formData.append("depositoryParams", JSON.stringify(this.parameter));
      formData.append("templateId", id);
      saveDepositoryContent(formData)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: "新建成功",
              duration: 2000,
            });
            this.closeSaveDepositDialog(1);
          } else {
            this.$message({
              message: res.data.message || this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
            this.closeSaveDepositDialog(0);
          }
        })
        .catch(() => {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
          this.closeSaveDepositDialog(0);
        });
    },

    // 编辑存证信息
    editDepositoryContent() {
      let formData = new FormData();
      formData.append("depositoryId", this.depositoryId);
      formData.append("templateId", this.templateMsg.id);
      for (let key of this.parameter) {
        if (key.parameterType === "file") {
          formData.append("fileHash", key.parameterValue);
          key.parameterValue = "";
        }
      }
      formData.append("depositoryParams", JSON.stringify(this.parameter));
      editDepoMsgList(formData)
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data === 0) {
              this.$message({
                type: "warning",
                message: "当前存证信息已被提交，正在等待管理员审批",
                duration: 2000,
              });
            } else {
              this.$message({
                type: "success",
                message: "编辑成功",
                duration: 2000,
              });
            }
            this.closeSaveDepositDialog(1);
          } else {
            this.$message({
              message: res.data.message || this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
            this.closeSaveDepositDialog(0);
          }
        })
        .catch(() => {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
          this.closeSaveDepositDialog(1);
        });
    },

    //数据校验
    submitCheckContent() {
      let formData = new FormData();
      formData.append("depositoryId", this.depositoryId);
      for (let key of this.parameter) {
        if (key.parameterType === "file") {
          formData.append("fileHash", key.parameterValue);
          key.parameterValue = "";
        }
      }
      formData.append("depositoryParams", JSON.stringify(this.parameter));
      validateDepositoryContent(formData)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: "存证校验成功",
              duration: 2000,
            });
            this.closeSaveDepositDialog(0);
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "warning",
              duration: 2000,
            });
            this.closeSaveDepositDialog(0);
          }
        })
        .catch(() => {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
          this.closeSaveDepositDialog(0);
        });
    },

    // 提交Dialog
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          switch (this.dialogFlag) {
            case 0: //录入
              this.setDepositoryContent();
              break;
            case 1: //编辑
              this.editDepositoryContent();
              break;
            case 2: //校验
              this.submitCheckContent();
              break;
          }
        } else {
          return false;
        }
      });
    },

    // 创建验证规则
    createRules() {
      for (let key of this.parameter) {
        switch (key.parameterType) {
          case "string":
            this.rules[key.parameterName] = [
              {
                required: true,
                message: `请输入${key.parameterName}`,
                trigger: "blur",
              },
            ];
            break;
          case "int":
            this.rules[key.parameterName] = [
              {
                required: true,
                message: `请输入${key.parameterName}`,
                trigger: "blur",
              },
              {
                pattern: /^[0-9]*$/,
                message: `${key.parameterName}必须是整数`,
                trigger: "blur",
              },
            ];
            break;
          case "float":
            this.rules[key.parameterName] = [
              {
                required: true,
                message: `请输入${key.parameterName}`,
                trigger: "blur",
              },
              {
                pattern: /^[0-9]+([.][0-9]{1,})?$/,
                message: `${key.parameterName}必须是浮点数`,
                trigger: "blur",
              },
            ];
            break;
          case "file":
            this.rules[key.parameterName] = [
              {
                required: true,
                message: `${key.parameterName}不能为空`,
                trigger: ["blur", "change", "submit"],
              },
            ];
            break;
          case "dictionary":
            this.rules[key.parameterName] = [
              {
                required: true,
                message: `${key.parameterName}不能为空`,
                trigger: ["blur", "change", "submit"],
              },
            ];
            break;
        }
      }
    },
  },

  mounted() {
    this.getDialogParameterData();
  },

  computed: {
    title() {
      let title;
      switch (this.dialogFlag) {
        case 0:
          title = "录入存证信息";
          break;
        case 1:
          title = "编辑存证信息";
          break;
        case 2:
          title = "数据校验";
          break;
      }
      return title;
    },
  },
};
</script>
  
  <style scoped>
.dialog-footer {
  text-align: right;
}
.selectForm >>> .el-form-item__label {
  font-size: 12px;
  font-family: "Courier New", Courier, monospace;
}
</style>