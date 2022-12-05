<template>
    <el-dialog title="新建字典" :visible.sync="createDictionaryDialogVisible" width="498px" align="center"
        :close-on-click-modal="false" @open="resetForm1('ruleForm')" :before-close="closeDialog">
        <el-form :model="dictionaryForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="字典名称" prop="dicName">
                <el-input v-model="dictionaryForm.dicName" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="数据类型" prop="dicType">
                <el-select v-model="dictionaryForm.dicType" placeholder="请选择数据类型" style="width: 100%">
                    <el-option v-for="item in dataTypes" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="字典内容" prop="dictionaryData1" v-for="(key, index) in dictionaryForm.dictionaryData1"
                :key="index">
                <el-input v-model.trim="key.dictionaryContent" placeholder="请输入字典内容" style="width: 320px"></el-input>
                <el-button type="primary" circle icon="el-icon-plus" @click="addParameter" size="mini"
                    style="margin-left: 8px"></el-button>
            </el-form-item>
            <el-form-item v-for="(key, index) in dictionaryForm.dictionaryData2" :key="index + 1">
                <el-input v-model.trim="key.dictionaryContent" placeholder="请输入字典内容" class="el-input-width"
                    style="width: 320px"></el-input>
                <el-button type="danger" circle icon="el-icon-minus" @click="removeParameter(index)" size="mini"
                    style="margin-left: 8px"></el-button>
            </el-form-item>

            <el-form-item class="dialog-footer">
                <el-button @click="resetForm('ruleForm')">取 消 </el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">确 定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { JSONSwitchFormData } from "@/util/util.js";
import { addDictionary } from "@/util/api.js";
export default {
    name: "dictionaryDialog",
    props: {
        createDictionaryDialogVisible: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            //存放选择框数据
            dataTypes: [
                {
                    value: "字符串",
                    label: "字符串",
                },
                {
                    value: "整数",
                    label: "整数",
                },
                {
                    value: "浮点数",
                    label: "浮点数",
                },
            ],
            dictionaryForm: {
                dicName: "", //字典名称
                dicType: "", //数据类型
                dictionaryData1: [
                    {
                        dictionaryContent: "",
                    },
                ],
                dictionaryData2: [],
            },
            rules: {
                dicName: [
                    {
                        required: true,
                        message: "请输入字典名称",
                        trigger: "blur",
                    },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在1-20字符之内",
                        trigger: "blur",
                    },
                ],
                dicType: [
                    {
                        required: true,
                        message: "请选择字典类型",
                        trigger: "change",
                    },
                ],
                dictionaryData1: [
                    {
                        required: true,
                        message: "请输入字典内容",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    computed: {
        params() {
            return [
                ...this.dictionaryForm.dictionaryData1,
                ...this.dictionaryForm.dictionaryData2,
            ];
        },
    },
    mounted() {
    },
    methods: {
        // 点击+添加参数项
        addParameter() {
            this.dictionaryForm.dictionaryData2.push({
                dictionaryContent: "", //参数名称
            });
        },
        // 点击-移除参数项
        removeParameter(index) {
            this.dictionaryForm.dictionaryData2.splice(index, 1);
        },

        // 判断参数内容是否有重复
        checkParamName(arr, key) {
            const parameterContents = arr.map((item) => item[key]);
            const newParameterContents = Array.from(new Set(parameterContents));
            return parameterContents.length === newParameterContents.length
                ? true
                : false;
        },
        submitForm(formName) {

            // 请求成功，清空数据
            // this.dictionaryForm.dictionaryData1[0].dictionaryContent = '',
            // this.dictionaryForm.dictionaryData2=[]
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    for (let i = 0; i < this.params.length; i++) {
                        if (!this.params[i].dictionaryContent) {
                            this.$message({
                                type: "error",
                                message: "存在空值的字典内容",
                            });
                            return;
                        } else if (!this.checkParamName(this.params, "dictionaryContent")) {
                            this.$message({
                                type: "error",
                                message: "存字典内容不能重复",
                            });
                            return;
                        }
                    }
                    this.addDictionaryTemplate();
                } else {
                    return false;
                }
            });
        },
        //新建字典
        addDictionaryTemplate() {
            const { dicName, dicType } = this.dictionaryForm;
            let dicContent = this.params.map(obj => {
                return obj.dictionaryContent
            })
            let data = {
                dicName,
                dicType,
                dicContent: dicContent,
            }
            this.loading = true;
            addDictionary(data).then((res) => {
                if (res.data.code === 0) {
                    this.loading = false;
                    this.closeDialog()
                    this.$parent.selectPage();
                    this.$message({
                        type: "success",
                        message: "新建成功!",
                    });
                } else {
                    this.loading = false;
                    this.closeDialog()
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000,
                    });
                }
            }).catch(() => {
                this.loading = false;
                this.closeDialog()
                this.$message({
                    message: "系统错误",
                    type: "error",
                    duration: 2000,
                });
            })
        },
        resetForm(formName) {
            this.$emit("update:createDictionaryDialogVisible", false);
            this.$refs[formName].resetFields();
        },
        resetForm1(formName) {
            this.$refs[formName].resetFields();
            this.clearDictionaryForm();
            this.loading = false;

        },
        closeDialog() {
            this.$emit("update:createDictionaryDialogVisible", false);

        },
        clearDictionaryForm() {
            this.dictionaryForm.dictionaryData1[0].dictionaryContent = '',
                this.dictionaryForm.dictionaryData2 = []
        },
    },
};
</script>

<style scoped>
.demo-ruleForm .dialog-footer {
    text-align: right;
}
</style>
