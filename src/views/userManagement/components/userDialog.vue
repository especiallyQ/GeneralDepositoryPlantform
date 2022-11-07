<template>
    <el-dialog title="新建账号" :visible.sync="createUserAccountDialogVisible" width="498px" align="center"
        :close-on-click-modal="false" @close="resetForm('ruleForm')">
        <el-form :model="accountForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="accountForm.name"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
                <el-input v-model="accountForm.contact"></el-input>
            </el-form-item>
            <el-form-item label="活动区域" prop="type">
                <el-select v-model="accountForm.type" placeholder="请选择活动区域" style="width: 100%">
                    <el-option label="管理员" value="1"></el-option>
                    <el-option label="普通用户" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm('ruleForm')">取 消 </el-button>
                <el-button type="primary" @click="submitForm(true, 'ruleForm')">确 定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>

export default {
    name: "userDialog",
    props: {
        createUserAccountDialogVisible: {
            type: Boolean,
            default: false,
            required: true,
        },
        // title: {
        //     type: String,
        //     default: "新建账号",
        //     required: true,
        // },
    },
    data() {
        return {
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
                        required: true,
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
        submitForm(flag, formName) {
            if (flag) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit("update:createUserAccountDialogVisible", false);
                        this.accountForm = {
                            accountName: "",
                            contact: "",
                            type: "",
                        };
                    } else {
                    }
                });
            }
        },
        resetForm(formName) {
            this.$emit("update:createUserAccountDialogVisible", false);
            this.$refs[formName].resetFields();
        }
    },
};
    // computed: {
    //     ...mapState({
    //         test: state => state.userDialog.test,
    //     }),
    // },
// ...mapActions({
        //     getTest:"userDialog/getTest"
        // }),
        // ...mapMutations({
        //     setTest: 'userDialog/setTest',
        //     setForm:'userDialog/setForm'
        // }),
        // this.setTest(3211)
            // this.setForm({
            //     name: this.accountForm,name,
            //     contact: this.accountForm.contact,
            //     type:this.accountForm.type,
            // })
            // console.log(this.test2);
            // this.$store.dispatch("userDialog/getTest", 321).then((val) => {
                //     console.log(val);
                // })
                // this.getTest(321).then((val) => {
                //     console.log(val,"这是mapActions");
                // })
</script>

<style>

</style>
