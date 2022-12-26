<template>
    <div>
        <el-dialog :visible.sync="dialogFormVisible" @close="close" width="498px" center :close-on-click-modal="false">
            <div class="dialog-header" v-loading="getLoading">
                <div v-if="depositoryTemplateList.length">
                    <span class="margins">该数据源下包含{{ count }}个未冻结的存证模板：<span v-for="(item, index) in depositoryTemplateList"
                            :key="index">{{ item.depositoryTemplateName }}、 </span></span>
                    <span class="margins">删除后挂载在该数据源下的存证模板将会<span class="red">永久冻结</span></span>
                </div>
                <span class="marginss">是否确认删除数据源 {{ dataSourceName }}</span>
            </div>
            <div class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="getDeleteDatasource" :loading="loading">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { deleteDataSourceById, deleteDatasource } from "@/util/api.js";
export default {
    name: "deleteSourceDialog",
    props: {
        deleteSourceDialogVisible: {
            type: Boolean,
            default: false,
            required: true,
        },
        deleteDataSourceId: {
            type: Number,
            required: true,
        },
        deleteDataSourceName: {
            type: String,
            require: true
        }
    },
    watch: {
        deleteSourceDialogVisible() {
            this.dialogFormVisible = this.deleteSourceDialogVisible;
        },
        deleteDataSourceName() {
            this.dataSourceName = this.deleteDataSourceName
        }
    },
    data() {
        return {
            dialogFormVisible: this.deleteSourceDialogVisible,
            getLoading: false,
            loading: false,
            dataSourceName: this.deleteDataSourceName,
            depositoryTemplateList: [],
            depositoryTemplateIds: [],
            count:'',
            // ms1:['慈善捐款模板', '慈善积分模板', '坤坤模板'],
        }
    },
    mounted() {
        this.open();
    },
    methods: {
        open() {
            this.getLoading = true;
            deleteDataSourceById(this.deleteDataSourceId).then((res) => {
                if (res.data.code === 0) {
                    this.count = res.data.data.count;
                    this.getLoading = false;
                    this.depositoryTemplateList = res.data.data.depositoryList;
                    this.depositoryTemplateIds = JSON.stringify(this.depositoryTemplateList.map((key) => {
                        return key.depositoryTemplateId
                    }))
                } else {
                    this.getLoading = false;
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000,
                    });
                }
            })
        },
        getDeleteDatasource() {
            this.loading = true;
            deleteDatasource(
                {
                    datasourceId: this.deleteDataSourceId,
                    depositoryTemplateIds: this.depositoryTemplateIds
                }
            ).then((res) => {
                if (res.data.code === 0) {
                    this.close();
                    this.$emit("getNewDataSourceList");
                    this.$message({
                        message: "删除成功",
                        type: "success",
                        duration: 2000,
                    });
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.close();
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000,
                    });
                }
            })
        },

        //关闭dialog
        close() {
            this.$emit("update:deleteSourceDialogVisible", false);
        }
    },
}
</script>

<style lang="less" scoped>
.dialog-header {
    text-align: center;
    margin-bottom: 40px;

    .margins {
        display: block;
        margin-bottom: 10px;
    }

    .red {
        color: red;
        font-weight: 700;
        // font-size: 18px;
    }
}

.dialog-footer {
    text-align: right;
}
</style>
