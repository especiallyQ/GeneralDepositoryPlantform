<template>
    <div>
        <ContentHead headTitle="系统配置"></ContentHead>
        <div class="content-container module-wrapper">
            <el-form class="system-form" label-position="right" label-width="auto" :model="systemConfigurationForm"
                :rules="rules" ref="ruleForm">
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
                    <el-select v-model="systemConfigurationForm.chainName" placeholder="请选择" style="width: 100%"
                        @focus="getChainList" @change="selectData">
                        <el-option v-for="item in chainCodeData" :key="item.chainCode" :label="item.chainName"
                            :value="{ value: item.chainCode, label: item.chainId }">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="存证合约:" prop="contractId">
                    <el-select v-model="systemConfigurationForm.contractId" placeholder="请选择" style="width: 100%"
                        @focus="getContractList">
                        <el-option v-for="item in contractIdData" :key="item.contractId" :label="item.contractName"
                            :value="item.contractId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="form-btn" @click="submitForm('ruleForm')">确认配置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import ContentHead from "@/components/contentHead.vue";
import { JSONSwitchFormData } from "@/util/util.js";
import { ContractList, ChainList, bindAccount } from "@/util/api.js";
import { sm3 } from "sm-crypto";
export default {
    name: "systemConfiguration1",
    components: { ContentHead },
    data() {
        return {
            contractIdData: [], //存证合约下拉框数据
            chainCodeData: [], //应用链ID下拉框数据
            //系统配置表单数据
            systemConfigurationForm: {
                serverPath: "", //CMSP服务地址
                serverAccount: "", //CMSP管理员账号
                serverPassword: "", //CMSP管理员密码
                chainCode: "", //应用链名称
                chainId: "", //应用链ID
                contractId: "", //存证合约ID
            },
            rules: {
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
        };
    },
    methods: {
        selectData(data) {
            this.systemConfigurationForm.contractId = "";
            this.contractIdData = [];
            const { value, label } = data;
            this.systemConfigurationForm.chainCode = value;
            this.systemConfigurationForm.chainId = label;
            console.log(
                this.systemConfigurationForm.chainCode,
                this.systemConfigurationForm.chainId
            );
        },
        //获取存证合约
        async getContractList() {
            const res = await ContractList(
                `?serverAccount=${this.systemConfigurationForm.serverAccount}&serverPath=${this.systemConfigurationForm.serverPath}&serverPassword=${this.systemConfigurationForm.serverPassword}&chainId=${this.systemConfigurationForm.chainId}`
            );
            if (res.data.code === 0) {
                this.contractIdData = res.data.data;
            } else {
                this.contractIdData = [];
                this.$message({
                    message: this.$chooseLang(res.data.code),
                    type: "error",
                    duration: 2000,
                });
            }
        },
        //获取应用链ID
        async getChainList() {

            if (this.systemConfigurationForm.serverPassword == "") {
                const res = await ChainList({
                    serverAccount: `?serverAccount=${this.systemConfigurationForm.serverAccount}&serverPath=${this.systemConfigurationForm.serverPath}&serverPassword=${this.systemConfigurationForm.serverPassword}`,
                    // serverPassword: sm3(this.systemConfigurationForm.serverPassword),
                });
                if (res.data.code === 0) {
                    this.chainCodeData = res.data.data;
                } else {
                    this.chainCodeData = [];
                    this.systemConfigurationForm.chainCode = "";
                    this.systemConfigurationForm.chainId = "";

                    this.systemConfigurationForm.contractId = "";
                    this.contractIdData = [];
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000,
                    });
                }
            } else {
                const res = await ChainList({
                    serverAccount: `?serverAccount=${this.systemConfigurationForm.serverAccount
                        }&serverPath=${this.systemConfigurationForm.serverPath
                        }&serverPassword=${sm3(this.systemConfigurationForm.serverPassword)}`,
                });
                if (res.data.code === 0) {
                    this.chainCodeData = res.data.data;
                    // console.log(this.chainCodeData);
                } else {
                    this.chainCodeData = [];
                    this.systemConfigurationForm.chainCode = "";
                    this.systemConfigurationForm.chainId = "";

                    this.systemConfigurationForm.contractId = "";
                    this.contractIdData = [];
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000,
                    });
                }
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let formData = JSONSwitchFormData({
                        ...this.systemConfigurationForm,
                        serverPassword: sm3(this.systemConfigurationForm.serverPassword),
                    });
                    const res = await bindAccount(formData);
                    if (res.data.code === 0) {
                        this.$refs[formName].resetFields();
                        this.$message({
                            type: "success",
                            message: "配置成功!",
                        });
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000,
                        });
                    }
                } else {
                    return false;
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
.content-container {
    position: relative;
    height: 680px;
    background-color: white;

    .system-form {
        position: absolute;
        top: 10%;
        left: 50%;
        margin-left: -300px;
        width: 600px;

        .form-btn {
            position: absolute;
            right: 20px;
        }
    }
}
</style>
