<template>
    <el-dialog title="新建账号" :visible.sync="createUserAccountDialogVisible" width="498px" align="center"
        :close-on-click-modal="false" @open="resetForm1('ruleForm')" :before-close="closeDialog">
        <el-form :model="accountForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账号名" prop="name">
                <el-input v-model="accountForm.name" ></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
                <el-input v-model="accountForm.contact" ></el-input>
            </el-form-item>
            <el-form-item label="账号类型" prop="type">
                <el-select v-model="accountForm.type" placeholder="请选择账号类型" style="width: 100%">
                    <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm('ruleForm')">取 消 </el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { JSONSwitchFormData } from "@/util/util.js";
export default {
    name: "userDialog",
    props: {
        createUserAccountDialogVisible: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    data() {
        return {
            //存放选择框数据
            roleOptions: [
                {
                    value: 2,
                    label: "管理员",
                },
                {
                    value: 3,
                    label: "普通用户",
                },
            ],
            accountForm: {
                name: "",
                contact: "",
                type: "",
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入组织名称",
                        trigger: "blur",
                    },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在1-20字符之内",
                        trigger: "blur",
                    },
                ],
                contact: [
                    {

                        message: "请输入联系方式",
                        trigger: "blur",
                    },
                    {
                        pattern:
                            /^1(3|4|5|7|8)[0-9]{9}|([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                        message: "联系方式格式不对",
                        trigger: "blur",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "请选择账号类型",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        // test() {
        //     this.$emit("update:createUserAccountDialogVisible", false);
        //     console.log(this.accountForm);
        // },
        submitForm(formName) {
            console.log(this.accountForm);
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.$emit("update:createUserAccountDialogVisible", false);
                    let formData = JSONSwitchFormData(this.accountForm);
                    const res = await addChainOrg(formData);
                    if (res.data.code === 0) {
                        this.$parent.getAccountList()
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000,
                        });
                    }
                } else {
                }
            });
        },
        resetForm(formName) {
            this.$emit("update:createUserAccountDialogVisible", false);
            this.$refs[formName].resetFields();
        },
        resetForm1(formName) {
            this.$refs[formName].resetFields();
        },
        closeDialog() {
            this.$emit("update:createUserAccountDialogVisible", false);
        }
    },
};

</script>

<style>

</style>
