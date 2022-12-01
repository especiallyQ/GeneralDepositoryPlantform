<template>
    <div class="account-container">
        <ContentHead headTitle="字典管理" headSubTitle="字典管理列表"></ContentHead>
        <div class="content-container module-wrapper">
            <div class="content-header">
                <span class="left-text">数据类型:</span>
                <el-select v-model="selectValue" placeholder="请选择" @change="selectPage" size="small">
                    <el-option v-for="item in dataTypes" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-input placeholder="字典名称" v-model="inputKeyWords" clearable class="search" size="small">
                </el-input>
                <el-button class="searchButton" icon="el-icon-search" @click="selectPage" size="small"></el-button>
                <el-button type="primary" size="small" class="right" @click="newDictionary" v-if="role == 1 || role == 2">
                    新建字典</el-button>
            </div>
            <div class="content-center">
                <template>
                    <el-table :data="dictionaryListData" style="width: 100%" v-loading="loading">
                        <el-table-column prop="accountName" label="字典名称" align="center">
                        </el-table-column>
                        <el-table-column prop="contact" label="数据类型" align="center" >
                        </el-table-column>
                        <el-table-column prop="roleZh" label="字典内容" align="center">
                        </el-table-column>
                        <el-table-column label="操作" align="center" class="remarks">
                            <template slot-scope="{ row }">
                                <el-button :disabled="isDeleteDictionaryDisabled(row)" type="text"
                                    style="color: red; font-size: 12px" @click="delateDictionary(row)">
                                    删除
                                </el-button>
                                <el-button :disabled="isReviseDictionaryDisabled()" type="text" style="font-size: 12px"
                                    @click="editDictionary(row)">
                                    编辑</el-button>
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
        <DictionaryDialog :createDictionaryDialogVisible.sync="createDictionaryDialogVisible"></DictionaryDialog>
        <EditDictionaryDialog 
        :editDictionaryDialogVisible.sync="editDictionaryDialogVisible"
        :editTemplateNameId="editTemplateNameId">
    </EditDictionaryDialog>
    </div>
</template>

<script>
import DictionaryDialog from "../dictionary/components/dictionaryDialog.vue";
import EditDictionaryDialog from "../dictionary/components/editDictionaryDialog.vue"

import ContentHead from "@/components/contentHead.vue";
import {
    dictionaryList,
    deleteDictionaryInfo,
} from "@/util/api.js";

export default {
    name: "dictionary",
    components: { ContentHead ,DictionaryDialog,EditDictionaryDialog},
    data() {
        return {
            pageNumber: 1, //分页器的第几页
            pageSize: 10, //每一页展示的条数
            roleId: "", //用户权限id
            role: localStorage.getItem("rootId"),
            userId: localStorage.getItem("userId"),
            total: 0, //总共的条数
            createDictionaryDialogVisible: false, //控制新建dialog是否显示
            editDictionaryDialogVisible: false,//控制编辑dialog是否显示
            editTemplateNameId:'',
            dictionaryListData: [], //字典管理页面初始化数据
            selectValue: "", //选择框结果
            inputKeyWords: "", //存放搜索数据
            //存放数据类型选择框数据
            dataTypes: [
                {
                    value: "",
                    label: "全部",
                },
                {
                    value: "string",
                    label: "字符串",
                },
                {
                    value: "int",
                    label: "整数",
                },
                {
                    value: "float",
                    label: "浮点数",
                },
            ],
            loading: true,
        };
    },
    mounted() {
        this.getDictionaryList();
    },
    methods: {
        selectPage() {
            this.pageNumber = 1;
            this.getDictionaryList();
        },
        //账号管理初始化
        async getDictionaryList() {
            const res = await dictionaryList({
                pageNumber: this.pageNumber,
                pageSize: `${this.pageSize}?type=${this.selectValue}&name=${this.inputKeyWords}`,
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
        //点击新建显示dialog
        newDictionary() {
            this.createDictionaryDialogVisible = true;
        },
        //点击编辑显示dialog
        editDictionary(row) {
            this.editDictionaryDialogVisible = true;
            this.editTemplateNameId = row.id;
        },
        //删除账号
        delateDictionary(row) {
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
                            const res = await deleteDictionaryInfo(row.accountId);
                            if (res.data.code === 0) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!",
                                });
                                this.pageNumber =
                                    this.accountListData.length > 1
                                        ? this.pageNumber
                                        : this.pageNumber - 1;
                                this.getDictionaryList();
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
        //底部页码跳转
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getDictionaryList();
        },
        changePage(paper = 1) {
            this.pageNumber = paper;
            this.getDictionaryList();
        },
        //删除操作权限设置
        isDeleteDictionaryDisabled(row) {
            return !(
                (this.role == 1 || this.role == 2) &&
                row.accountId != this.userId
            );
        },
        //编辑权限设置
        isReviseDictionaryDisabled() {
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
