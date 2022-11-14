<template>
    <div>
      <el-dialog
        title="录入存证信息"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        @close="closeSaveDepositDialog"
        center
        width="498px"
      >
        <el-form
          :model="form"
          ref="ruleForm"
          label-width="100px"
          class="selectForm"
          :rules="rules"
        >
          <el-form-item label='合约模板名称' v-if="flag !== 2">
            <el-input :placeholder="templateName" :disabled="true"></el-input>
          </el-form-item>
  
          <el-form-item
            v-for="item in parameter"
            :key="item.parameterName"
            :label="item.parameterName"
            :prop="item.parameterName"
          >
            <el-input
              v-model="form[item.parameterName]"
              v-if="item.parameterType !== 'file' || flag === 1"
              :disabled="
                (flag === 1 && item.parameterType === 'file') || flag === 2
              "
            ></el-input>
            <el-upload
              v-else
              class="upload-demo"
              ref="upload"
              action=""
              :auto-upload="false"
              :limit="1"
              :file-list="fileList"
              :on-remove="
                () => {
                  handleRemove(item.parameterName);
                }
              "
              :on-change="
                (file, fileList) => {
                  handleChange(file, fileList, item.parameterName);
                }
              "
            >
              <el-button slot="trigger" size="small" type="primary"
                >选取文件</el-button
              >
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="closeAllDialog(false)">取消</el-button>
          <el-button
            @click="submitAllDialog('ruleForm')"
            type="primary"
            :loading="loading"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import {
    getDepoTemplateById,
    saveDepositoryContent,
    modifyDepositoryContent,
    validateDepositoryContent,
  } from "@/util/api";
  export default {
    props: {
      // 控制Dialog是否显示
      visible: {
        type: Boolean,
        default: false,
        required: true,
      },
      // 区分Dialog用途
      // 存证模板
      templateName: {
        type: String,
      },
      // 编辑时所选的列表数据
      editData: {
        type: Object,
      },
      // 存证模板Id
      id: {
        type: Object,
      },
    },
    data() {
      return {
        dialogFormVisible: this.visible, //控制dialog是否显示
        parameter: [],
        rules: {}, //验证规则
        form: {
          //表单数据
        },
        loading: false,
        fileList: [],
        flag:0
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
    },
  
    methods: {
      // 移除文件
      handleRemove(parameterName) {
        this.form[parameterName] = null;
      },
  
      // 改变文件状态
      handleChange(file, fileList, parameterName) {
        if (fileList.length >= 2) {
          return;
        }
        for (let key of this.parameter) {
          if (key.parameterType === "file") {
            this.$refs.ruleForm.clearValidate(key.parameterName);
          }
        }
        this.$set(this.form, parameterName, file);
      },
  
      // 开启Dialog时
      openAllDialog() {
        this.editFormData();
      },
  
      // 关闭Dialog时
      closeSaveDepositDialog(flag) {
        this.$emit("updateAllDialog", false, flag);
      },
  
      // 获取当前列表项数据
      editFormData() {
        for (let key of this.parameter) {
          if (this.flag === 2 && key.parameterType === "file") {
            this.$set(this.form, key.parameterName, null);
          } else {
            this.$set(
              this.form,
              key.parameterName,
              this.editData[key.parameterName]
            );
          }
        }
      },

  
      // 录入存证信息
      setDepositoryContent() {
        const { appChainId, contractNameId, templateId } = this.id;
        let params = {
          chainId: appChainId,
          contractId: contractNameId,
          depositoryTemplateId: templateId,
        };
        let formData = new FormData();
        for (let key of this.parameter) {
          if (key.parameterType === "file") {
            formData.append("file", key.parameterValue.raw);
            key.parameterValue = "";
          }
        }
        params.params = this.parameter;
        let arrParams = [];
        arrParams.push(JSON.stringify(params));
        let blobParams = new Blob(arrParams, { type: "application/json" });
        formData.append("params", blobParams);
        saveDepositoryContent(formData)
          .then((res) => {
            if (res.data.code === 0) {
              this.closeAllDialog(true);
              this.$message({
                type: "success",
                message: '新建成功',
                duration: 2000,
              });
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
              message: '系统错误',
              type: "error",
              duration: 2000,
            });
          });
      },
  
      // 提交Dialog
      submitAllDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
                this.setDepositoryContent();
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
                  message: `请输入${
                    key.parameterName
                  }`,
                  trigger: "blur",
                },
              ];
              break;
            case "int":
              this.rules[key.parameterName] = [
                {
                  required: true,
                  message: `请输入${
                    key.parameterName
                  }`,
                  trigger: "blur",
                },
                {
                  pattern: /^[0-9]*$/,
                  message: `${key.parameterName}'必须是整数'`,
                  trigger: "blur",
                },
              ];
              break;
            case "float":
              this.rules[key.parameterName] = [
                {
                  required: true,
                  message: `请输入${
                    key.parameterName
                  }`,
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
                  message: `${key.parameterName}文件存证不能为空`,
                  trigger: ["blur", "change", "submit"],
                },
              ];
              break;
          }
        }
      },
    },

    mounted() {
      this.openAllDialog();
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