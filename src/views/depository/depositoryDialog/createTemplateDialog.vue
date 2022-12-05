<template>
  <div>
    <el-dialog id="createTemplateDialog" title="新建存证模板" :visible.sync="dialogFormVisible" center
      :close-on-click-modal="false" @close="close" width="498px">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="selectForm">
        <el-form-item label="存证模板名称" prop="depositoryTemplateName">
          <el-input v-model.trim="form.depositoryTemplateName" placeholder="请输入存证模板名称" maxlength="20"
            :show-word-limit="true"></el-input>
        </el-form-item>
      </el-form>

      <el-form :model="parameterParamsForm" label-width="100px" class="selectForm">
        <el-form-item label="存证参数" prop="parameter" :show-message="false"
          v-for="(key, index) in parameterParamsForm.parameterParams1" :key="index">
          <el-input v-model.trim="key.parameterName" placeholder="参数名" class="el-input-width" maxlength="20"
            style="marginRight: 8px"></el-input>
          <el-select v-model="key.parameterType" placeholder="参数类型" class="el-input-width" @change="changeFileDisabled">
            <el-option v-for="(item, index) in parameterOption" :key="index" :label="item.label" :value="item.value"
              :disabled="item.disabled"></el-option>
          </el-select>
          <el-button type="primary" circle icon="el-icon-plus" @click="addParameter" size="mini"
            style="marginLeft: 8px"></el-button>
        </el-form-item>

        <el-form-item prop="parameter" :show-message="false"
          v-for="(key, index) in parameterParamsForm.parameterParams2" :key="index + 1"
          :validate-on-rule-change="false">
          <el-input v-model.trim="key.parameterName" placeholder="参数名" class="el-input-width" style="marginRight: 8px">
          </el-input>

          <el-select filterable v-model="key.parameterType" placeholder="参数类型" class="el-input-width"
            @change="changeFileDisabled">
            <el-option v-for="(item, index) in parameterOption" :key="index" :type="item.value"
              @mouseover.native="mouseover" @mouseleave.native="mouseleave" :label="item.label" :value="item.value"
              :disabled="item.disabled">
              <!-- <el-popover placement="right"  width="200" trigger="hover" v-show="item.value=='x'"
                ><div class="sign-out-wrapper">
                  <el-input placeholder="账号名" v-model="inputKeyWords" clearable style="width:75%;margin-right: 5px;" size="small">
                </el-input>
                <el-button class="searchButton" icon="el-icon-search" @click="selectPage" size="small"></el-button>
                <div class="change-password" @click="changePassword">修改密码</div>
          <div class="change-password" @click="lookVersion">查看版本</div>
          <div class="sign-out" @click="signOut">退出登录</div>
                  
                </div>
                <el-button slot="reference" type="text" style="width:100%">{{ item.label }}</el-button>
              </el-popover> -->
            </el-option>
          </el-select>






          <!-- <el-cascader v-model="key.parameterType" placeholder="参数类型" @change="changeFileDisabled"
            :options="parameterOption" :show-all-levels="false" class="el-input-width"
            :props="{ expandTrigger: 'hover' }" @focus="test" filterable>
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader> -->

          <el-button type="danger" circle icon="el-icon-minus" @click="removeParameter(index)" size="mini"
            style="marginLeft: 8px"></el-button>
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark" :rows="4" resize="none" maxlength="60"
            :show-word-limit="true"></el-input>
        </el-form-item>
      </el-form>

      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveDepoTemplate } from "@/util/api";

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
      containerNode:null,
      timer: null,
      dialogFormVisible: this.createTemplateDialogVisible, //控制dialog是否显示
      loading: false, //loading图标
      fileDisabled: false, //文件类型是否可选
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
      //模板参数下拉框
      parameterOption: [
        {
          label: "自定义字典",
          value: "x",
          disabled: false,
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
  methods: {
    // 关闭新建存证模板时触发
    mouseover(e) {
      if (!this.containerNode && e.target.getAttribute('type') === 'x') {
        clearTimeout(this.timer)
        const inputNode = document.createElement('input')
        this.containerNode = document.createElement('div')
        this.containerNode.appendChild(inputNode)

        inputNode.style.position = 'absolute'
        inputNode.style.top = '0'
        inputNode.style.left = '0'
        inputNode.style.width = '200px'
        inputNode.style.height = '50px'
        
        const node = e.target.parentNode.parentNode.parentNode.parentNode

        node.appendChild(this.containerNode)
        this.containerNode.style.position = 'absolute'
        this.containerNode.style.width = '200px'
        this.containerNode.style.minHeight = '100px'
        this.containerNode.style.bottom = '40%'
        this.containerNode.style.left = '100%'
        this.containerNode.style.zIndex = 9999
        this.containerNode.style.backgroundColor = '#ffffff'

        this.containerNode.addEventListener('mouseover', () => {
          do {
            clearTimeout(this.timer)
            this.timer = null
          } while (this.timer)
        })
        this.containerNode.addEventListener('mouseleave', () => {
          this.timer = setTimeout(() => {
            this.containerNode.remove()
            this.containerNode = null
          }, 500)
        })

        inputNode.addEventListener('mouseover', () => {
          do {
            clearTimeout(this.timer)
            this.timer = null
          } while (this.timer)
        })
        inputNode.addEventListener('mouseleave', () => {
          this.timer = setTimeout(() => {
            this.containerNode.remove()
            this.containerNode = null
          }, 500)
        })

        inputNode.addEventListener('focus', () => {
          do {
            clearTimeout(this.timer)
            this.timer = null
          } while (this.timer)
        })

        inputNode.addEventListener('blur', () => {
        })
      }
    },
    mouseleave(e) {
      if (e.target.getAttribute('type') === 'x') {
        this.timer = setTimeout(() => {
          this.containerNode.remove()
          this.containerNode = null
        }, 500)
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
      const { depositoryTemplateName, remark } = this.form;
      let data = {
        depositoryTemplateName,
        remark,
        params: this.params,
      };
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
        if (this.params[i].parameterType === "file") {
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

.selectForm>>>.el-form-item__label {
  font-size: 12px;
  font-family: "Courier New", Courier, monospace;
}
</style>