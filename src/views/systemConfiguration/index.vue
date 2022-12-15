<template>
    <div>
        <ContentHead headTitle="系统配置" headSubTitle="数据源配置"></ContentHead>
        <div class="content-container module-wrapper">
            <div class="content-header">
                <el-input v-model="searchKeyWords" @keyup.enter.native="searchDataByName" placeholder="数据源名称" clearable
                    class="search" size="small">
                </el-input>
                <el-button class="searchButton" icon="el-icon-search" size="small"
                    @click="searchDataByName"></el-button>
                <el-button type="primary" size="small" class="newBtn" @click="showSourceDialog">
                    新建数据源
                </el-button>
            </div>
            <div class="content-center">
                <el-table :data="tableData" style="width: 100%" v-loading="listLoading">
                    <el-table-column v-for="item in tableHeader" :key="item.label" :label="item.label" :prop="item.prop"
                        :min-width="item.width" :align="item.align" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" align="center" min-width="150px">
                        <template slot-scope="{ row }">
                            <el-button type="text" style="color: red; font-size: 12px" class="el-button-text"
                                @click="deleteDataSource(row)">
                                删除
                            </el-button>
                            <el-button type="text" style="font-size: 12px" class="el-button-text"
                                @click="editDataSource(row)">
                                编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="content-footer">
                <el-pagination @size-change="handleSizeChange" @current-change="changePage" :current-page="pageNumber"
                    :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <CreateSourceDialog v-if="createSourceDialogVisible" :createSourceDialogVisible.sync="createSourceDialogVisible"
            @getNewDataSourceList="getNewDataSourceList">
        </CreateSourceDialog>
        <EditSourceDialog v-if="editSourceDialogVisible" :editSourceDialogVisible.sync="editSourceDialogVisible"
            :editDataSourceId="editDataSourceId" @getNewDataSourceList="getNewDataSourceList">
        </EditSourceDialog>
        <DeleteSourceDialog v-if="deleteSourceDialogVisible" :deleteSourceDialogVisible.sync="deleteSourceDialogVisible"
            :deleteDataSourceId="deleteDataSourceId" @getNewDataSourceList="getNewDataSourceList"></DeleteSourceDialog>
    </div>
</template>
<script>
import _ from "lodash";
import CreateSourceDialog from "@/views/systemConfiguration/components/createSourceDialog.vue";
import EditSourceDialog from "./components/editSourceDialog.vue";
import DeleteSourceDialog from "./components/deleteSourceDialog.vue"
import ContentHead from "@/components/contentHead.vue";
import { dataSourceList } from "@/util/api.js"
export default {
    name: "systemConfiguration",
    components: { ContentHead, CreateSourceDialog, EditSourceDialog, DeleteSourceDialog },
    data() {
        return {
            createSourceDialogVisible: false,
            editSourceDialogVisible: false,
            deleteSourceDialogVisible: false,
            editDataSourceId: '',
            deleteDataSourceId: '',
            searchKeyWords: "", //搜索框内容
            listLoading: false, //数据源列表loading
            pageNumber: 1, //分页器的第几页
            pageSize: 10, //每一页展示的条数
            total: 0, //总共的条数
            tableData: [], // 数据源列表数据
            //数据源列表表头数据
            tableHeader: [
                {
                    label: "数据源名称",
                    prop: "name",
                    align: "center",
                    width: "130px",
                },
                {
                    label: "CMSP服务地址",
                    prop: "cmspAddress",
                    align: "center",
                    width: "300px",
                },
                {
                    label: "CMSP管理员账号",
                    prop: "cmspAccount",
                    align: "center",
                    width: "150px",
                },
                {
                    label: "应用链名称",
                    prop: "chainName",
                    align: "center",
                    width: "150px",
                },
                {
                    label: "存证合约名称",
                    prop: "contract",
                    align: "center",
                    width: "150px",
                },
            ],
        };
    },
    mounted() {
        this.getDataSourceList();
    },
    methods: {
        //初始化数据源列表
        async getDataSourceList() {
            const res = await dataSourceList({
                pageNumber: this.pageNumber,
                pageSize: `${this.pageSize}?name=${this.searchKeyWords}`,
            });
            if (res.data.code === 0) {
                // console.log(res.data.data);
                if (
                    Object.prototype.toString.call(res.data.data) == "[object Object]"
                ) {
                    this.tableData = [res.data.data.datasourceList];
                } else {
                    this.tableData = res.data.data.datasourceList;
                }
                this.total = res.data.data.total;
                this.listLoading = false;
                for (let item of this.tableData) {
                    return this.tableData = item
                }
            } else {
                this.$message({
                    message: this.$chooseLang(res.data.code),
                    type: "error",
                    duration: 2000,
                });
            }
        },
        editDataSource(row) {
            this.editSourceDialogVisible = true;
            this.editDataSourceId = row.id
        },
        deleteDataSource(row) {
            this.deleteSourceDialogVisible = true;
            this.deleteDataSourceId = row.id;
            // this.$confirm(`确定删除账号${row.name}?`, {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消",
            // }).then(async () => {
            //                 const res = await delDictionary(row.id);
            //                 if (res.data.code === 0) {
            //                     this.$message({
            //                         type: "success",
            //                         message: "删除成功!",
            //                     });
            //                     this.pageNumber =
            //                         this.dictionaryListData.length > 1
            //                             ? this.pageNumber
            //                             : this.pageNumber - 1;
            //                     this.getDictionaryList();
            //                 } else {
            //                     this.$message({
            //                         message:
            //                             "删除失败",
            //                         type: "error",
            //                     });
            //                 }
            //             })
            //             .catch(() => { });
        },
        showSourceDialog() {
            this.createSourceDialogVisible = true;
        },
        // 切换每页显示条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.listLoading = true;
            this.getDataSourceList();
        },
        // 切换当前页码
        changePage(paper = 1) {
            this.pageNumber = paper;
            this.listLoading = true;
            this.getDataSourceList();
        },
        //
        searchDataByName: _.debounce(function () {
            this.pageNumber = 1;
            this.listLoading = true;
            this.getDataSourceList();
        }, 400),
        getNewDataSourceList() {
            this.pageNumber = 1;
            this.getDataSourceList();
        },
    },
};
</script>

<style lang="less" scoped>
.content-container {
    background-color: white;

    .el-message-box__message p {
        text-align: center !important;
    }

    .content-header {
        display: flex;
        position: relative;
        height: 100px;
        align-items: center;

        .search {
            width: 180px;
            margin-left: 30px;
        }

        .searchButton {
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

        .newBtn {
            position: absolute;
            right: 20px;
        }
    }

    .content-center {
        margin: 0 25px 0 25px;

        .el-button-text {
            background-color: transparent !important;
            border-color: transparent !important;
        }
    }

    .content-footer {
        height: 76px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 40px;
    }
}
</style>