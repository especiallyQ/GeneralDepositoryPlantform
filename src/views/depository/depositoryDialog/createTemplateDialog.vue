<template>
  <div>
    <el-dialog
      title="新建存证模板"
      :visible.sync="dialogFormVisible"
      center
      :close-on-click-modal="false"
      @close="close"
      width="498px"
    >
      <div v-loading="dialogLoading">
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="selectForm"
        >
          <el-form-item label="存证模板名称" prop="depositoryTemplateName">
            <el-input
              v-model.trim="form.depositoryTemplateName"
              placeholder="请输入存证模板名称"
              maxlength="20"
              :show-word-limit="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属数据源" prop="dataOriginId">
            <el-select
              v-model="form.dataOriginId"
              placeholder="请选择数据源"
              style="width: 346px"
            >
              <el-option
                v-for="item in dataOriginOptions"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-form
          :model="parameterParamsForm"
          label-width="100px"
          class="selectForm"
        >
          <el-form-item
            label="存证参数"
            prop="parameter"
            :show-message="false"
            v-for="(key, index) in parameterParamsForm.parameterParams1"
            :key="index"
          >
            <el-input
              v-model.trim="key.parameterName"
              placeholder="参数名"
              class="el-input-width"
              maxlength="20"
              style="marginright: 8px"
            ></el-input>
            <el-cascader
              v-model="key.parameterType"
              placeholder="参数类型"
              @change="changeFileDisabled"
              :options="parameterOption"
              :props="parameterProps"
              :show-all-levels="false"
              class="el-input-width"
              filterable
            >
            </el-cascader>
            <el-button
              type="primary"
              circle
              icon="el-icon-plus"
              @click="addParameter"
              size="mini"
              style="marginleft: 8px"
            ></el-button>
          </el-form-item>

          <el-form-item
            prop="parameter"
            :show-message="false"
            v-for="(key, index) in parameterParamsForm.parameterParams2"
            :key="index + 1"
            :validate-on-rule-change="false"
          >
            <el-input
              v-model.trim="key.parameterName"
              placeholder="参数名"
              class="el-input-width"
              style="marginright: 8px"
            >
            </el-input>
            <el-cascader
              v-model="key.parameterType"
              placeholder="参数类型"
              @change="changeFileDisabled"
              :options="parameterOption"
              :props="parameterProps"
              :show-all-levels="false"
              class="el-input-width"
              filterable
            >
            </el-cascader>

            <el-button
              type="danger"
              circle
              icon="el-icon-minus"
              @click="removeParameter(index)"
              size="mini"
              style="marginleft: 8px"
            ></el-button>
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
        </el-form>

        <div class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            :loading="loading"
            >确定</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepoTemplateDataOrigin,
  saveDepoTemplate,
  dicictionaryName,
} from "@/util/api";
export default {
  name: "createTemplateDialog",
  props: {
    createTemplateDialogVisible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      containerNode: null,
      timer: null,
      dialogFormVisible: this.createTemplateDialogVisible, //控制dialog是否显示
      loading: false, //loading图标
      dialogLoading: true, //新建存证Dialog加载
      fileDisabled: false, //文件类型是否可选
      dataOriginOptions: [], //数据源列表
      form: {
        depositoryTemplateName: null, //存证模板名称
        remark: null, //备注
      },
      //存证参数
      parameterParamsForm: {
        parameterParams1: [
          {
            parameterName: "", //参数名称
            parameterType: "", //参数类型
          },
        ],
        parameterParams2: [],
      },
      parameterProps: {
        label: "label",
        value: "value",
        disabled: "disabled",
        children: "children",
        expandTrigger: "hover",
      },

      //模板参数下拉框
      parameterOption: [
        {
          label: "自定义字典",
          value: "dictionary",
          disabled: false,
          children: [],
        },
        {
          label: "字符串",
          value: "string",
          disabled: false,
        },
        {
          label: "整数",
          value: "int",
          disabled: false,
        },
        {
          label: "浮点数",
          value: "float",
          disabled: false,
        },
        {
          label: "文件",
          value: "file",
          disabled: false,
        },
      ],

      // 新建模板存证表单验证规则
      rules: {
        depositoryTemplateName: [
          {
            required: true,
            message: "请输入存证模板名称",
            trigger: "blur",
          },
        ],
        dataOriginId: [
          {
            required: true,
            message: "请选择数据源",
            trigger: "blur",
          },
        ],
      },
      parameterRules: {
        parameter: [{ required: true }],
      },
    };
  },
  watch: {
    createTemplateDialogVisible() {
      this.dialogFormVisible = this.createTemplateDialogVisible;
    },
    "parameterParamsForm.parameterParams2": {
      handler() {
        this.changeFileDisabled();
      },
      deep: true,
    },
  },

  computed: {
    params() {
      return [
        ...this.parameterParamsForm.parameterParams1,
        ...this.parameterParamsForm.parameterParams2,
      ];
    },
  },
  mounted() {
    this.getDictionaryName();
    this.getDepoTemplateDataOriginList();
  },
  methods: {
    async getDictionaryName() {
      const res = await dicictionaryName();
      if (res.data.code === 0) {
        let dicData = res.data.data.map((obj) => {
          return {
            label: obj.dicName,
            value: obj.id,
          };
        });
        this.parameterOption[0].children = dicData;
      } else {
        this.$message({
          type: "error",
          message: "",
        });
      }
    },
    close() {
      this.$emit("updateTemplateDialog", false);
    },

    // 点击+添加参数项
    addParameter() {
      this.parameterParamsForm.parameterParams2.push({
        parameterName: "", //参数名称
        parameterType: "", //参数类型
      });
    },
    // 点击-移除参数项
    removeParameter(index) {
      this.parameterParamsForm.parameterParams2.splice(index, 1);
    },

    // 判断参数名是否有重复
    checkParamName(arr, key) {
      const parameterNames = arr.map((item) => item[key]);
      const newParameterNames = Array.from(new Set(parameterNames));
      return parameterNames.length === newParameterNames.length ? true : false;
    },

    // 获取数据源列表
    getDepoTemplateDataOriginList() {
      getDepoTemplateDataOrigin()
        .then((res) => {
          if (res.data.code === 0) {
            this.dialogLoading = false;
            this.dataOriginOptions = res.data.data;
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

    //提交新建存证模板表单
    submitForm(formName) {
      // 新建存证模板校验规则
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.params.length; i++) {
            if (!this.params[i].parameterName) {
              this.$message({
                type: "error",
                message: "存在空值的参数名",
              });
              return;
            } else if (!this.params[i].parameterType) {
              this.$message({
                type: "error",
                message: `${this.params[i].parameterName}${"参数未设置类型"}`,
              });
              return;
            } else if (!this.checkParamName(this.params, "parameterName")) {
              this.$message({
                type: "error",
                message: "存证模板参数名不能重复",
              });
              return;
            }
          }
          this.addDepositoryTemplate();
        } else {
          return false;
        }
      });
    },

    // 存证模板新建方法
    addDepositoryTemplate() {
      for (let i = 0; i < this.params.length; i++) {
        if (this.params[i].parameterType[0] == "dictionary") {
          this.params[i].parameterType = this.params[i].parameterType[1];
        } else {
          this.params[i].parameterType = this.params[i].parameterType[0];
        }
      }
      const { depositoryTemplateName, dataOriginId, remark } = this.form;
      let data = {
        depositoryTemplateName,
        dataOriginId,
        remark,
        params: this.params,
      };
      console.log(data);
      this.loading = true;
      saveDepoTemplate(data)
        .then((res) => {
          if (res.data.code === 0) {
            this.close();
            this.$message({
              type: "success",
              message: "新建成功",
              duration: 2000,
            });
            this.$emit("getNewTemplateList");
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

    // 判断文件类型是否被选中
    changeFileDisabled() {
      for (let i = 0; i < this.params.length; i++) {
        if (this.params[i].parameterType[0] === "file") {
          this.parameterOption[this.parameterOption.length - 1].disabled = true;
          break;
        } else {
          this.parameterOption[
            this.parameterOption.length - 1
          ].disabled = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.sign-out-wrapper {
  line-height: 32px;
  text-align: center;
}

.dialog-footer {
  text-align: right;
}

.el-select-width {
  width: 346px;
}

.el-input-width {
  width: 145px;
  margin-right: 5px;
}

.selectForm >>> .el-form-item__label {
  font-size: 12px;
  font-family: "Courier New", Courier, monospace;
}
</style>