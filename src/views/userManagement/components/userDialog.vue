<template>
    <el-dialog title="新建账号" :visible.sync="createUserAccountDialogVisible" width="498px" align="center"
        :close-on-click-modal="false" @open="resetForm1('ruleForm')" :before-close="closeDialog">
        <el-form :model="accountForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账号名" prop="accountName">
                <el-input v-model="accountForm.accountName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
                <el-input v-model="accountForm.contact"></el-input>
            </el-form-item>
            <el-form-item label="账号类型" prop="roleId">
                <el-select v-model="accountForm.roleId" placeholder="请选择账号类型" style="width: 100%">
                    <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
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
import { createAccount } from "@/util/api.js";
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
            loading: false,
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
                accountName: "",
                contact: "",
                roleId: "",
            },
            rules: {
                accountName: [
                    {
                        required: true,
                        message: "请输入账号名",
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
                            /(^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$)|(^1[3|4|5|8]\d{9}$)/,
                        message: "联系方式格式不对",
                        trigger: "blur",
                    },
                ],
                roleId: [
                    {
                        required: true,
                        message: "请选择账号类型",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    let formData = JSONSwitchFormData(this.accountForm);
                    const res = await createAccount(formData);
                    if (res.data.code === 0) {
                        this.$emit("update:createUserAccountDialogVisible", false);
                        this.$parent.selectPage();
                        this.$message({
                            type: "success",
                            message: "新建成功!",
                        });
                    } else {
                        this.closeDialog();
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
            this.loading = false;
        },
        closeDialog() {
            this.$emit("update:createUserAccountDialogVisible", false);
            this.loading = false;
        },
    },
};
</script>

<style scoped>
.demo-ruleForm .dialog-footer {
    text-align: right;
}
</style>
