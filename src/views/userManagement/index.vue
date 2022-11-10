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
                <el-input placeholder="账号名" v-model="inputKeyWords" clearable class="search" >
                </el-input>
                <el-button class="searchButton" icon="el-icon-search" @click="getAccountList"></el-button>
                <p class="p"></p>
                <el-button type="primary" class="right" @click="newAccount" v-if="role == 1 || role == 2">新建账号</el-button>
            </div>
            <div class="content-center">
                <template>
                    <el-table :data="accountListData" style="width: 100%">
                        <el-table-column prop="accountName" label="账号名" align="center">
                        </el-table-column>
                        <el-table-column prop="contact" label="联系方式" align="center">
                        </el-table-column>
                        <el-table-column prop="roleZh" label="账号类型" align="center"> </el-table-column>
                        <el-table-column label="操作" align="center" class="remarks">
                            <template slot-scope="{ row }">
                                <el-button 
                                :disabled="isDeleteAccountDisabled(row)"
                                    type="text" style="color: red; font-size: 12px"
                                    @click="delateAccount(row)">
                                    删除
                                </el-button>
                                <el-button :disabled="isReviseAccountDisabled()" type="text" style="font-size: 12px" @click="reviseAccount(row)">
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
        <userDialog :createUserAccountDialogVisible.sync="createUserAccountDialogVisible"
        >
        </userDialog>
        <el-dialog title="编辑账号" :visible.sync="reviseUserAccountDialogVisible" width="498px" align="center"
            :close-on-click-modal="false">
            <el-form :model="accountForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
                    <el-button type="primary" @click="update">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span>是否确定删除该账号</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleClose">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
import ContentHead from "@/components/contentHead.vue";
import userDialog from "./components/userDialog.vue";
import { accountList, updateAccount ,deleteAccountInfo} from "@/util/api.js";
import { JSONSwitchFormData } from "@/util/util.js";


export default {
    name: "userManagement",
    components: { ContentHead, userDialog },
    data() {
        return {
            pageNumber: 1, //分页器的第几页
            pageSize: 10, //每一页展示的条数
            roleId: '',//用户权限id
            role: localStorage.getItem('rootId'),
            userId:localStorage.getItem('userId'),
            total: 0, //总共的条数
            createUserAccountDialogVisible: false,//控制新建dialog是否显示
            reviseUserAccountDialogVisible: false,//控制修改dialog是否显示
            dialogVisible: false,//控制删除dialog是否显示
            //存放表单数据
            accountForm: {
                name: "",
                contact: "",
                type: "",
                id: '',
            },
            // accountId: '',
            accountListData: [],//账号管理页面初始化数据
            selectValue: "",//账号管理选择框结果
            inputKeyWords: "",//存放搜索数据
            //存放选择框数据
            roleOptions: [
                {
                    value: '',
                    label: '全部',
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
        };
    },
    mounted() {
        this.getAccountList();
        console.log(this.id);
    },
    computed: {
    },
    methods: {
        //账号管理初始化
        async getAccountList() {
            // console.log("test-data",this.pageNumber);
            const res = await accountList({
                pageNumber: this.pageNumber,
                pageSize: `${this.pageSize}?roleId=${this.selectValue}&accountName=${this.inputKeyWords}`,
            });
            if (res.data.code === 0) {
                if (Object.prototype.toString.call(res.data.data) == '[object Object]') {
                    this.accountListData = [res.data.data];
                } else {
                    this.accountListData = res.data.data
                }
                this.total = res.data.total;
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
            this.accountForm.name = row.accountName;
            this.accountForm.contact = row.contact;
            this.accountForm.type = row.roleZh;
            this.accountForm.id = row.accountId;
        },
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
                    }).then(async () => {
                        const res = await deleteAccountInfo(row.accountId);
                        if (res.data.code === 0) {
                            this.$message({
                                type: "success",
                                message: "删除成功!",
                            });
                            // if (this.accountListData.length === 1) {
                            //     this.pageNumber -= 1
                            // }
                            this.pageNumber = this.accountListData.length > 1
                                    ? this.pageNumber
                                    : this.pageNumber - 1
                            
                            this.getAccountList(
                                // this.accountListData.length > 1
                                //     ? this.pageNumber
                                //     : this.pageNumber - 1
                            )
                            
                        }
                    }).catch(() => {
                    })
                })
                .catch(() => {
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
        isDeleteAccountDisabled(row) {
                return !((this.role == 1 || this.role == 2) && row.accountId != this.userId )
            
        },
        isReviseAccountDisabled() {
            return !(this.role ==1 || this.role==2)
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
    margin:0 25px 0 25px;
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
    border-color:transparent !important;
}

</style>
