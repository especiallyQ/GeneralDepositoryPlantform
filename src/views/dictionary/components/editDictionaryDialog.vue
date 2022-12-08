<template>
    <el-dialog title="编辑字典" :visible.sync="editDictionaryDialogVisible" width="498px" align="center"
        :close-on-click-modal="false" @open="resetForm1('ruleForm')" :before-close="closeDialog">
        <el-form :model="dictionaryForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
            v-loading="getLoading">
            <el-form-item label="字典名称" prop="dictionaryName">
                <el-input @input="(event) =>changeInput(event)" v-model="dictionaryForm.dictionaryName" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="数据类型">
                <el-select v-model="dictionaryForm.dataType" placeholder="请选择数据类型" style="width: 100%" disabled>
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
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" :disabled="disabled">确 定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { updateDictionary, getDictionaryById ,dicictionaryName} from "@/util/api.js";
export default {
    name: "editDictionaryDialog",
    props: {
        editDictionaryDialogVisible: {
            type: Boolean,
            default: false,
            required: true,
        },
        editDictionaryId: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            getLoading: false,
            disabled:true,
            allDicName: [],
            allDictionaryContent:[],
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
                dictionaryName: "", //字典名称
                dataType: "", //数据类型
                dictionaryData1: [
                    {
                        dictionaryContent: "",
                    },
                ],
                dictionaryData2: [],
            },
            rules: {
                dictionaryName: [
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
        this.open()
        this.getDictionaryName()
    },
    methods: {
        changeInput(event) {
            console.log(event);
        },
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


        open() {
            this.getLoading = true;
            getDictionaryById(this.editDictionaryId)
                .then((res) => {
                    if (res.data.code === 0) {
                        this.getLoading = false;
                        this.dictionaryForm.dictionaryName = res.data.data.dicName;
                        this.dictionaryForm.dataType = res.data.data.dicType;
                        this.dictionaryForm.dictionaryData1 = res.data.data.dicContent.splice(0, 1);
                        this.dictionaryForm.dictionaryData2 = res.data.data.dicContent;
                        console.log(this.dictionaryForm.dictionaryData1[0].dictionaryContent);
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000,
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: "系统错误",
                        type: "error",
                        duration: 2000,
                    });
                });
        },
        //拿到所有字典内容的名字
        async getDictionaryName() {
            const res = await dicictionaryName();
            if (res.data.code === 0) {
                let dicDataName = res.data.data.map((obj) => {
                    return obj.dicName
                })
                this.allDicName = dicDataName;
            }
        },
        submitForm(formName) {
            let data = this.dictionaryForm.dictionaryData2.map(key => {
                return key.dictionaryContent
            })
            this.allDictionaryContent = [this.dictionaryForm.dictionaryData1[0].dictionaryContent, ...data]
            console.log(this.allDictionaryContent);
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
                    for (let j = 0; j < this.allDicName.length; j++) {
                        if (this.dictionaryForm.dicName === this.allDicName[j]) {
                            this.$message({
                                type: "error",
                                message: "字典名称已存在",
                            });
                            return;
                        }
                    }
                    switch (this.dictionaryForm.dataType) {
                        case "整数":
                            let intData = /^[0-9]*$/;
                            for (let i = 0; i < this.allDictionaryContent.length; i++) {
                                if (!intData.test(this.allDictionaryContent[i])) {
                                    this.$message({
                                        type: "error",
                                        message: "字典内容必须为整数",
                                    });
                                    return;
                                }
                            }
                        case "浮点数":
                            
                            let floatData = /^[0-9]+([.][0-9]{1,})?$/;
                            for (let j = 0; j < this.allDictionaryContent.length; j++) {
                                if (!floatData.test(this.allDictionaryContent[j])) {
                                    this.$message({
                                        type: "error",
                                        message: "字典内容必须为浮点型",
                                    });
                                    return;
                                }
                            }
                    }
                    this.editDictionaryData();
                } else {
                    return false;
                }
            });
        },
        //编辑字典
        editDictionaryData() {
            let dicContent = this.params.map(obj => {
                return obj.dictionaryContent
            })
            // const { dictionaryName } = this.dictionaryForm;
            let data = {
                id: this.editDictionaryId,
                dicName: this.dictionaryForm.dictionaryName,
                dicContent: dicContent,
            }
            // console.log(data);
            updateDictionary(data).then((res) => {
                if (res.data.code === 0) {
                    this.closeDialog()
                    this.$parent.selectPage();
                    this.$message({
                        type: "success",
                        message: "新建成功!",
                    });
                } else {
                    this.closeDialog()
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000,
                    });
                }
            }).catch(() => {
                this.closeDialog()
                this.$message({
                    message: "系统错误",
                    type: "error",
                    duration: 2000,
                });
            })
        },
        resetForm(formName) {
            this.$emit("update:editDictionaryDialogVisible", false);
            this.$refs[formName].resetFields();
        },
        resetForm1(formName) {
            this.$refs[formName].resetFields();
        },
        closeDialog() {
            this.$emit("update:editDictionaryDialogVisible", false);

        },
    },
};
</script>

<style scoped>
.demo-ruleForm .dialog-footer {
    margin-left: 195px;
}
</style>
