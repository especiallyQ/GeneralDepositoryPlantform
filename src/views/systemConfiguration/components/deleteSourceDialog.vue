<template>
    <div>
        <el-dialog :visible.sync="dialogFormVisible" @close="close" width="498px" center :close-on-click-modal="false">
            <div class="dialog-header">
                <div v-if="true">
                    <span class="margins">该数据源下包含个未冻结的存证模板：<span>{{msg2}}</span></span>
                    <span class="margins">删除后挂载在该数据源下的存证模板将会<span class="red">永久冻结</span></span>
                </div>
                <span class="marginss">是否确认删除数据源 {{msg}}</span>
            </div>
            <div class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { ContractList } from "@/util/api.js";
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
        }
    },
    watch: {
        deleteSourceDialogVisible() {
            this.dialogFormVisible = this.deleteSourceDialogVisible;
        },
    },
    data() {
        return {
            dialogFormVisible: this.deleteSourceDialogVisible,
            msg: '数据源1',
            // msg1:['慈善捐款模板','慈善积分模板','坤坤模板']
        }
    },
    computed: {
        msg2() {
            let ms1 = ['慈善捐款模板', '慈善积分模板', '坤坤模板'];
            for (let key of ms1) {
                let a = key
            }
            console.log(a);
            return ms1
        }
    },
    mounted() {
        this.open();
    },
    methods: {
        open() {

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
