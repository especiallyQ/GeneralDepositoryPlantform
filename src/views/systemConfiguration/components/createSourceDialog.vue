<template>
    <div>
        <el-dialog title="新建数据源" :visible.sync="dialogFormVisible" @close="close" width="498px" center
            :close-on-click-modal="false">
            <el-form label-position="right" label-width="auto" :model="systemConfigurationForm" :rules="rules"
                ref="ruleForm">
                <el-form-item label="数据源名称:" prop="dataSourceName">
                    <el-input v-model.trim="systemConfigurationForm.dataSourceName" maxlength="20"
                        show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="CMSP服务地址:" prop="serverPath">
                    <el-input v-model="systemConfigurationForm.serverPath"></el-input>
                </el-form-item>
                <el-form-item label="CMSP管理员账号:" prop="serverAccount">
                    <el-input v-model="systemConfigurationForm.serverAccount"></el-input>
                </el-form-item>
                <el-form-item label="CMSP管理员密码:" prop="serverPassword">
                    <el-input v-model="systemConfigurationForm.serverPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="应用链名称:" prop="chainCode">
                    <el-select v-model="systemConfigurationForm.chainName" placeholder="请选择应用链名称" @focus="getChainList"
                        @change="selectChainData" style="width: 100%">
                        <el-option v-for="item in chainCodeData" :key="item.chainCode" :label="item.chainName"
                            :value="{ value: item.chainCode, label: item.chainId, name: item.chainName }">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="存证合约:" prop="contractId">
                    <el-select v-model="systemConfigurationForm.contractName" placeholder="请选择存证合约"
                        @focus="getContractList" @change="selectContractData" style="width: 100%">
                        <el-option v-for="item in contractIdData" :key="item.contractId" :label="item.contractName"
                            :value="{ value: item.contractId, label: item.contractName, contractVersion: item.contractVersion }">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { JSONSwitchFormData } from "@/util/util.js";
import { ContractList, ChainList, bindAccount } from "@/util/api.js";
import { sm3, sm2 } from "sm-crypto";
export default {
    name: 'createSourceDialog',
    props: {
        createSourceDialogVisible: {
            type: Boolean,
            default: false,
            required: true,
        }
    },
    watch: {
        createSourceDialogVisible() {
            this.dialogFormVisible = this.createSourceDialogVisible
        },
        "systemConfigurationForm.chainName": {
            handler(oldV, newV) {
                if (oldV !== newV) {
                    this.contractIdData = [];
                    this.systemConfigurationForm.contractName = '';
                }
            }
        }
    },
    data() {
        return {
            contractIdData: [], //存证合约下拉框数据
            chainCodeData: [], //应用链ID下拉框数据
            dialogFormVisible: this.createSourceDialogVisible,//控制dialog是否显示
            loading: false,
            //系统配置表单数据
            systemConfigurationForm: {
                dataSourceName: "",//数据源名称
                serverPath: "", //CMSP服务地址
                serverAccount: "", //CMSP管理员账号
                serverPassword: "", //CMSP管理员密码
                chainCode: "", //应用链code
                chainId: "", //应用链ID
                chainName: "",//应用链名称
                contractId: "", //存证合约ID
                contractName: '', //存证合约名称
                contractVersion: "", //存证合约版本号

            },
            rules: {
                dataSourceName: [
                    { required: true, message: "请输入数据源名称", trigger: "blur" }
                ],
                serverPath: [
                    { required: true, message: "请输入CMSP服务地址", trigger: "blur" },
                ],
                serverAccount: [
                    { required: true, message: "请输入CMSP管理员账号", trigger: "blur" },
                ],
                serverPassword: [
                    { required: true, message: "请输入CMSP管理员密码", trigger: "blur" },
                ],
                chainCode: [
                    { required: true, message: "请输入应用链ID", trigger: "change" },
                ],
                contractId: [
                    { required: true, message: "请选择存证合约", trigger: "change" },
                ],
            },
        }
    },
    methods: {
        //提交表单
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.getBindAccount();
                } else {
                    return false;
                }
            });
        },
        selectChainData(data) {
            const { value, label, name } = data;
            this.systemConfigurationForm.chainCode = value;
            this.systemConfigurationForm.chainId = label;
            this.systemConfigurationForm.chainName = name;
        },
        selectContractData(data) {
            const { value, label, contractVersion } = data;
            this.systemConfigurationForm.contractId = value;
            this.systemConfigurationForm.contractName = label;
            this.systemConfigurationForm.contractVersion = contractVersion;
        },
        //获取应用链ID
        async getChainList() {
            // let encPass = this.$Base64.encode(this.systemConfigurationForm.serverPassword);//加密
            // let decPass = this.$Base64.decode(encPass);//解密
        
            const res = await ChainList(
                {
                    serverAccount:
                        `?serverAccount=${this.systemConfigurationForm.serverAccount}&serverPath=${this.systemConfigurationForm.serverPath}&serverPassword=${this.$Base64.encode(this.systemConfigurationForm.serverPassword)}   `,
                }
            );
            if (res.data.code === 0) {
                this.chainCodeData = res.data.data;
            } else {
                this.$message({
                    message: this.$chooseLang(res.data.code),
                    type: "error",
                    duration: 2000,
                });
            }
        },
        //获取存证合约
        async getContractList() {
            const res = await ContractList(
                `?serverAccount=${this.systemConfigurationForm.serverAccount}&serverPath=${this.systemConfigurationForm.serverPath}&serverPassword=${this.$Base64.encode(this.systemConfigurationForm.serverPassword)}&chainId=${this.systemConfigurationForm.chainId}`
            );
            if (res.data.code === 0) {
                this.contractIdData = res.data.data;
            } else {
                this.$message({
                    message: this.$chooseLang(res.data.code),
                    type: "error",
                    duration: 2000,
                });
            }
        },
        //确定配置
        getBindAccount() {
            this.loading = true;
            let formData = JSONSwitchFormData({
                ...this.systemConfigurationForm,
                name: this.systemConfigurationForm.dataSourceName,
                serverPassword: this.$Base64.encode(this.systemConfigurationForm.serverPassword),
            });
            bindAccount(formData).then((res) => {
                if (res.data.code === 0) {
                    this.loading = false;
                    this.close();
                    this.$emit("getNewDataSourceList");
                    this.$message({
                        type: "success",
                        message: "新建成功!",
                    });
                } else {
                    this.loading = false;
                    this.close();
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                    });
                }
            }).catch(() => {
                this.loading = false;
                this.close();
                this.$message({
                    message: "系统错误",
                    type: "error",
                });
            });
        },
        //关闭dialog
        close() {
            this.$emit("update:createSourceDialogVisible", false);
        }
    },

}
</script>
<style  scoped>
.dialog-footer {
    text-align: right;
}
</style>