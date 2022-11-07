<template>
    <div class="account-container">
        <ContentHead headTitle="用户管理" headSubTitle="账号管理"></ContentHead>
        <div class="content-container">
            <div class="content-header">
                <span class="left-text">账号类型</span>
                <el-select v-model="selectValue" placeholder="请选择" @change="getAccountList">
                    <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-input placeholder="请输入内容" v-model="inputKeyWords" clearable class="search" @change="test">
                </el-input>
                <el-button class="searchButton" icon="el-icon-search" @click="getAccountList"></el-button>
                <p class="p"></p>
                <el-button type="primary" class="right" @click="newAccount">新建账号</el-button>
            </div>
            <div class="content-center">
                <template>
                    <el-table :data="accountListData" style="width: 100%">
                        <el-table-column prop="accountName" label="账号名">
                        </el-table-column>
                        <el-table-column prop="contact" label="联系方式">
                        </el-table-column>
                        <el-table-column prop="roleZh" label="账号类型"> </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="{ row }">
                                <el-button type="text" style="color: red; font-size: 12px" @click="delateAccount(row)">
                                    删除
                                </el-button>
                                <el-button type="text" style="font-size: 12px" @click="reviseAccount(row)">
                                    编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>
            <div class="content-footer">
                <el-pagination @size-change="handleSizeChange" @current-change="searchName" :current-page="pageNumber"
                    :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <userDialog :createUserAccountDialogVisible.sync="createUserAccountDialogVisible">
        </userDialog>
        <el-dialog title="编辑账号" :visible.sync="reviseUserAccountDialogVisible" width="498px" align="center"
            :close-on-click-modal="false">
            <el-form :model="accountForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
                <el-form-item>
                    <el-button @click="reviseUserAccountDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="reviseUserAccountDialogVisible = false">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span>是否确定删除该账号</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleClose">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ContentHead from "@/components/contentHead.vue";
import userDialog from "./components/userDialog.vue";
import { accountList } from "@/util/api.js";

export default {
    name: "userManagement",
    components: { ContentHead, userDialog },
    data() {
        return {
            pageNumber: 1, //分页器的第几页
            pageSize: 10, //每一页展示的条数
            roleId: "",//用户权限id
            total: 0, //总共的条数
            createUserAccountDialogVisible: false,//控制新建dialog是否显示
            reviseUserAccountDialogVisible: false,//控制修改dialog是否显示
            dialogVisible: false,//控制删除dialog是否显示
            //存放表单数据
            accountForm: {
                name: "",
                contact: "",
                type: "",
            },
            accountListData: [],//账号管理页面初始化数据
            selectValue: "",//账号管理选择框结果
            inputKeyWords: "",//存放搜索数据
            //存放选择框数据
            roleOptions: [
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
        };
    },
    mounted() {
        this.getAccountList();

    },
    methods: {
        test() {
            console.log(this.inputKeyWords);
        },
        //账号管理初始化
        async getAccountList() {
            const res = await accountList({
                pageNumber: this.pageNumber,
                pageSize: `${this.pageSize}?accountName=${this.inputKeyWords}`,
            });
            if (res.data.code === 0) {
                this.accountListData = res.data.data;
                this.total = res.data.total;
                console.log(res);
            } else {
                this.$message({
                    message: this.$chooseLang(res.data.code),
                    type: "error",
                    duration: 2000,
                });
            }
        },

        newAccount() {
            this.createUserAccountDialogVisible = true;
        },
        reviseAccount(row) {
            this.reviseUserAccountDialogVisible = true;
            console.log(row);
            this.accountForm.name = row.accountName;
            this.accountForm.contact = row.contact;
            this.accountForm.type = row.roleZh;
        },
        delateAccount(row) {
            this.dialogVisible = true;
            console.log(9999);
            
        },
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then((_) => {
                    this.dialogVisible = false;
                    delateAccount();
                })
                .catch((_) => {
                    this.dialogVisible = false;
                });
        },
        //底部页码跳转
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getAccountList();
        },
        searchName(paper = 1) {
            this.pageNumber = paper;
            this.getAccountList();
        },
    },
};
</script>

<style scoped>
.content-container {
    width: 1298px;
    height: 800px;
    background-color: white;
    margin: 10px;
}

.content-container .content-header .search {
    width: 180px;
    margin-left: 10px;
}

.content-container .content-header {
    display: flex;
    height: 100px;
    align-items: center;
    margin-left: 20px;
}

.content-container .content-header .left-text {
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    margin-right: 10px;
}

.content-container .content-header .searchButton {
    color: #ffffff;
    background-color: #4093ff;
    border-top-left-radius: 0%;
    border-bottom-left-radius: 0%;
}

.content-container .content-header .p {
    flex: auto;
}

.content-container .content-header .right {
    margin-right: 20px;
}

.content-container .content-center {
    margin-left: 80px;
}

.content-container .content-footer {
    height: 76px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
}
</style>
