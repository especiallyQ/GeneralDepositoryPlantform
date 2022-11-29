<template>
    <div class="account-container">
        <ContentHead headTitle="用户管理" headSubTitle="账号管理"></ContentHead>
        <div class="content-container module-wrapper">
            <div class="content-header">
                <span class="left-text"> 账号类型:</span>
                <el-select v-model="selectValue" placeholder="请选择" @change="selectPage" size="small">
                    <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-input placeholder="账号名" v-model="inputKeyWords" clearable class="search" size="small">
                </el-input>
                <el-button class="searchButton" icon="el-icon-search" @click="selectPage" size="small"></el-button>
                <el-button type="primary" size="small" class="right" @click="newAccount" v-if="role == 1 || role == 2">
                    新建账号</el-button>
            </div>
            <div class="content-center">
                <template>
                    <el-table :data="accountListData" style="width: 100%" v-loading="loading">
                        <el-table-column prop="accountName" label="账号名" align="center">
                        </el-table-column>
                        <el-table-column prop="contact" label="联系方式" align="center">
                        </el-table-column>
                        <el-table-column prop="roleZh" label="账号类型" align="center">
                        </el-table-column>
                        <el-table-column label="操作" align="center" class="remarks">
                            <template slot-scope="{ row }">
                                <el-button :disabled="isDeleteAccountDisabled(row)" type="text"
                                    style="color: red; font-size: 12px" @click="delateAccount(row)">
                                    删除
                                </el-button>
                                <el-button :disabled="isReviseAccountDisabled()" type="text" style="font-size: 12px"
                                    @click="reviseAccount(row)">
                                    编辑</el-button>
                                <el-button :disabled="isResetAccountDisabled(row)" type="text" style="font-size: 12px"
                                    @click="getResetAccountPassword(row)">
                                    重置密码</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>
            <div class="content-footer">
                <el-pagination @size-change="handleSizeChange" @current-change="changePage" :current-page="pageNumber"
                    :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <userDialog :createUserAccountDialogVisible.sync="createUserAccountDialogVisible">
        </userDialog>
        <el-dialog title="编辑账号" :visible.sync="reviseUserAccountDialogVisible" width="498px" align="center"
            :close-on-click-modal="false">
            <el-form :model="accountForm" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号名称" prop="name">
                    <el-input v-model="accountForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                    <el-input v-model="accountForm.contact"></el-input>
                </el-form-item>
                <el-form-item label="账号类型" prop="type">
                    <el-select v-model="accountForm.type" placeholder="请选择活动区域" style="width: 100%" disabled>
                        <el-option label="管理员" value="1"></el-option>
                        <el-option label="普通用户" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="dialog-footer">
                    <el-button @click="reviseUserAccountDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import ContentHead from "@/components/contentHead.vue";
import userDialog from "./components/userDialog.vue";
import {
    accountList,
    updateAccount,
    deleteAccountInfo,
    resetAccountPassword,
} from "@/util/api.js";
import { JSONSwitchFormData } from "@/util/util.js";

export default {
    name: "userManagement",
    components: { ContentHead, userDialog },
    data() {
        return {
            pageNumber: 1, //分页器的第几页
            pageSize: 10, //每一页展示的条数
            roleId: "", //用户权限id
            role: localStorage.getItem("rootId"),
            userId: localStorage.getItem("userId"),
            total: 0, //总共的条数
            createUserAccountDialogVisible: false, //控制新建dialog是否显示
            reviseUserAccountDialogVisible: false, //控制修改dialog是否显示
            dialogVisible: false, //控制删除dialog是否显示
            //存放表单数据
            accountForm: {
                name: "",
                contact: "",
                type: "",
                id: "",
            },
            // accountId: '',
            accountListData: [], //账号管理页面初始化数据
            selectValue: "", //账号管理选择框结果
            inputKeyWords: "", //存放搜索数据
            //存放选择框数据
            roleOptions: [
                {
                    value: "",
                    label: "全部",
                },
                {
                    value: 1,
                    label: "超级管理员",
                },
                {
                    value: 2,
                    label: "管理员",
                },
                {
                    value: 3,
                    label: "普通用户",
                },
            ],
            loading: true,
            rules: {
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
            },
        };
    },
    mounted() {
        this.getAccountList();
    },
    computed: {},
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.update();
                } else {
                    return false;
                }
            });
        },
        selectPage() {
            this.pageNumber = 1;
            this.getAccountList();
        },

        //账号管理初始化
        async getAccountList() {
            const res = await accountList({
                pageNumber: this.pageNumber,
                pageSize: `${this.pageSize}?roleId=${this.selectValue}&accountName=${this.inputKeyWords}`,
            });
            if (res.data.code === 0) {
                if (
                    Object.prototype.toString.call(res.data.data) == "[object Object]"
                ) {
                    this.accountListData = [res.data.data];
                } else {
                    this.accountListData = res.data.data;
                }
                this.total = res.data.total;
                this.loading = false;
            } else {
                this.$message({
                    message: this.$chooseLang(res.data.code),
                    type: "error",
                    duration: 2000,
                });
            }
        },
        //点击新建账号显示dialog
        newAccount() {
            this.createUserAccountDialogVisible = true;
        },
        //点击编辑时渲染数据
        reviseAccount(row) {
            this.reviseUserAccountDialogVisible = true;
            this.accountForm.name = row.accountName;
            this.accountForm.contact = row.contact;
            this.accountForm.type = row.roleZh;
            this.accountForm.id = row.accountId;
        },
        //编辑账号
        async update() {
            this.reviseUserAccountDialogVisible = false;
            let formData = JSONSwitchFormData(this.accountForm);
            const res = await updateAccount(formData);
            if (res.data.code === 0) {
                this.$message({
                    type: "success",
                    message: "编辑成功!",
                });
                this.getAccountList();
            } else {
                this.$message({
                    message: this.$chooseLang(res.data.code),
                    type: "error",
                    duration: 2000,
                });
            }
        },
        //删除账号
        delateAccount(row) {
            this.dialogVisible = true;
            this.$confirm(`确定删除账号${row.accountName}?`, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(() => {
                    this.$confirm(`确定删除${row.accountName}?`, {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                    })
                        .then(async () => {
                            const res = await deleteAccountInfo(row.accountId);
                            if (res.data.code === 0) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!",
                                });
                                this.pageNumber =
                                    this.accountListData.length > 1
                                        ? this.pageNumber
                                        : this.pageNumber - 1;
                                this.getAccountList();
                            } else {
                                this.$message({
                                    message:
                                        "系统中存在由当前账号创建的未冻结的存证模板，请先冻结存证模板，再进行删除账号操作",
                                    type: "error",
                                });
                            }
                        })
                        .catch(() => { });
                })
                .catch(() => { });
        },
        //重置账号密码
        getResetAccountPassword(row) {
            this.dialogVisible = true;
            this.$confirm(`是否重置账号${row.accountName}的密码?`, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(() => {
                    this.$confirm(`确定重置账号${row.accountName}的密码?`, {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                    })
                        .then(async () => {
                            const res = await resetAccountPassword(row.accountId);
                            if (res.data.code === 0) {
                                this.$message({
                                    type: "success",
                                    message: "重置成功!",
                                });
                            }
                        })
                        .catch(() => { });
                })
                .catch(() => { });
        },
        //底部页码跳转
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getAccountList();
        },
        changePage(paper = 1) {
            this.pageNumber = paper;
            this.getAccountList();
        },
        //删除操作权限设置
        isDeleteAccountDisabled(row) {
            return !(
                (this.role == 1 || this.role == 2) &&
                row.accountId != this.userId
            );
        },
        //编辑权限设置
        isReviseAccountDisabled() {
            return !(this.role == 1 || this.role == 2);
        },
        //重置密码操作权限设置
        isResetAccountDisabled(row) {
            return !(this.role == 1 || this.role == 2);
        },
    },
};
</script>

<style scoped>
.content-container {
    background-color: white;
    /* margin: 10px; */
}

.content-container .content-header .search {
    width: 180px;
    margin-left: 10px;
}

.dialog-footer {
    margin-left: 195px;
}

.content-container .content-header {
    display: flex;
    position: relative;
    height: 100px;
    align-items: center;
    margin-left: 20px;
}

.content-container .content-header .left-text {
    font-size: 12px;
    margin-right: 10px;
}

.content-container .content-header .searchButton {
    color: #ffffff;
    border: 0px;
    height: 32px;
    background-color: #4093ff;
    border-top-left-radius: 0%;
    border-bottom-left-radius: 0%;
    margin-left: -5px;
    z-index: 100;
    margin-top: 0px;
}

.content-container .content-header .right {
    position: absolute;
    right: 20px;
}

.content-container .content-center {
    margin: 0 25px 0 25px;
}

.content-container .content-footer {
    height: 76px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
}

.el-button.is-disabled {
    background-color: transparent !important;
    border-color: transparent !important;
}
</style>
