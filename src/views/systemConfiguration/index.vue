<template>
    <div>
        <ContentHead headTitle='系统配置'></ContentHead>
        <div class="content-container">
            <el-form class="system-form" label-position="right" label-width="auto" :model="systemConfigurationForm"
                :rules="rules" ref="ruleForm" >
                <el-form-item label="CSMP服务地址:" prop="serverPath">
                    <el-input v-model="systemConfigurationForm.serverPath"></el-input>
                </el-form-item>
                <el-form-item label="CSMP管理员账号:" prop="serverAccount">
                    <el-input v-model="systemConfigurationForm.serverAccount"></el-input>
                </el-form-item>
                <el-form-item label="CSMP管理员密码:" prop="serverPassword">
                    <el-input v-model="systemConfigurationForm.serverPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="应用链ID:" prop="chainCode">
                    <el-select v-model="systemConfigurationForm.chainCode" placeholder="请选择" style="width:100%"
                        @focus="getChainList">
                        <el-option v-for="item in chainCodeData" :key="item.chainCode" :label="item.chainCode"
                            :value="item.chainCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="存证合约:" prop="contractId">
                    <el-select v-model="systemConfigurationForm.contractId" placeholder="请选择" style="width:100%"
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
import { ContractList, ChainList, bindAccount } from '@/util/api.js';
import { sm3 } from "sm-crypto";
export default {
    name: "systemConfiguration",
    components: { ContentHead },
    data() {
        return {
            contractIdData: [],//存证合约下拉框数据
            chainCodeData: [],//应用链ID下拉框数据
            //系统配置表单数据
            systemConfigurationForm: {
                serverPath: '',//CSMP服务地址
                serverAccount: '',//CSMP管理员账号
                serverPassword: '',//CSMP管理员密码
                chainCode: '',//应用链ID
                contractId: '',//存证合约
            },
            rules: {
                serverPath: [
                    { required: true, message: '请输入CSMP服务地址', trigger: 'blur' }
                ],
                serverAccount: [
                    { required: true, message: '请输入CSMP管理员账号', trigger: 'blur' }
                ],
                serverPassword: [
                    { required: true, message: '请输入CSMP管理员密码', trigger: 'blur' }
                ],
                chainCode: [
                    { required: true, message: '请输入应用链ID', trigger: 'blur' }
                ],
                contractId: [
                    { required: true, message: '请选择存证合约', trigger: 'blur' }
                ],
            }
        };
    },
    methods: {
        //获取存证合约
        async getContractList() {
            // console.log(this.systemConfigurationForm.serverAccount);
            const res = await ContractList(this.systemConfigurationForm.serverAccount);
            if (res.data.code === 0) {
                this.contractIdData = res.data.data;
                // console.log(this.contractIdData);
            } else {
                this.$message({
                    message: this.$chooseLang(res.data.code),
                    type: "error",
                    duration: 2000,
                });
            }
        },
        //获取应用链ID
        async getChainList() {
            const res = await ChainList({
                // serverPath: this.systemConfigurationForm.serverPath,
                serverAccount: `${this.systemConfigurationForm.serverAccount}?serverPath=${this.systemConfigurationForm.serverPath}`,
                serverPassword: sm3(this.systemConfigurationForm.serverPassword)
            });
            if (res.data.code === 0) {
                this.chainCodeData = res.data.data;
                // console.log(this.chainCodeData[0].chainCode);
            } else {
                this.$message({
                    message: this.$chooseLang(res.data.code),
                    type: "error",
                    duration: 2000,
                });
            }
        },

        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let formData = JSONSwitchFormData({
                        ...this.systemConfigurationForm,
                        serverPassword:sm3(this.systemConfigurationForm.serverPassword)
                    });
                    const res = await bindAccount(formData);
                    if (res.data.code === 0) {
                    //     this.systemConfigurationForm = {
                    //     serverPath: '',//CSMP服务地址
                    //     ServiceAccount: '',//CSMP管理员账号
                    //     serverPassword: '',//CSMP管理员密码
                    //     chainCode: '',//应用链ID
                    //     contractId: '',//存证合约
                    // };
                    // this.contractIdData = [];
                    // this.chainCodeData = [];
                        this.$message({
                            type: "success",
                            message: "编辑成功!",
                        });
                        
                    } else {
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000,
                        });
                    }
                    
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.content-container {
    position: relative;
    width: 1298px;
    height: 800px;
    background-color: white;
    margin: 15px;
}

.content-container .system-form {
    position: absolute;
    top: 10%;
    right: 30%;
    width: 600px;
}

.content-container .system-form .form-btn {
    float: right;
}
</style>