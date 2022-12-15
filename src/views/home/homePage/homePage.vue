<template>
    <div>
        <div class="home-page">
            <div class="from">
                <span class="title">通用存证平台</span>
                <el-form ref="verifyForm" :model="verifyForm" :rules="rules1" hide-required-asterisk
                    label-width="120px">
                    <el-form-item label="存证模板名称" prop="depositoryTemplateId">
                        <el-select v-model="verifyForm.depositoryTemplateId" placeholder="请选择存证模板" style="width: 100%"
                            @focus="getDepositoryListData">
                            <el-option v-for="item in DepositoryListData" :key="item.depositoryTemplateId"
                                :label="item.depositoryTemplateName" :value="item.depositoryTemplateId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="dataHash">
                        <el-select v-model="credentialType" @change="changeSelect('verifyForm')" placeholder="凭证类型"
                            style="width:120px;margin-left: -120px;">
                            <el-option label="数据凭证" value="1"></el-option>
                            <el-option label="文件凭证" value="2"></el-option>
                        </el-select>
                        <el-input :placeholder="[credentialType == 2 ? '请上传文件' : '请输入数据凭证']" :disabled="disabled"
                            v-model="verifyForm.dataHash" clearable
                            :style="{ 'width': (credentialType == 2 ? '535px' : '632px') }">
                        </el-input>
                        <!-- <el-button v-if="credentialType == 2" type="primary" size="small" style="margin-left:16px">上传文件</el-button> -->
                        <el-upload v-if="credentialType == 2" class="upload-file" action="" ref="upload" :limit="1"
                            :file-list="fileList" :auto-upload="true" :before-upload="beforeUpload"
                            :on-exceed="handleExceed" :http-request="Upload" :on-remove="handleRemove">
                            <el-button type="primary" size="small">点击上传</el-button>
                        </el-upload>

                    </el-form-item>
                    <el-progress v-if="credentialType == 2 && progressVisible == true"
                        :percentage="parseInt(percentage)" status="success"
                        style="width:88%;margin-left: 120px;margin-top: -20px;"></el-progress>
                    <el-form-item label="验证码" prop="verifyCode">
                        <el-input placeholder="请输入验证码" maxlength="4" style="width:460px"
                            v-model="verifyForm.verifyCode"></el-input>
                        <span class="vercode">
                            <img style="width: 100%; height: 100%" :src="codeUrl" alt="" @click="clickChangeCode" />
                        </span>
                        <el-button type="primary" size="small" style="text-align: right; margin-left: 10px;"
                            :loading="loading" @click="submit('verifyForm')">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="table">
            <div class="table-center">
                <h1 class="table-header">验证结果：</h1>
                <el-table :data="tableData" border style="margin:10px;height: 90px; width: 752px;">
                    <el-table-column prop="factHash" label="凭证信息" width="180">
                    </el-table-column>
                    <el-table-column prop="latestVersion" label="是否为最新版本" width="180">
                    </el-table-column>
                    <el-table-column prop="creator" label="提交人">
                    </el-table-column>
                    <el-table-column prop="createTime" label="提交时间">
                    </el-table-column>
                </el-table>
                <h1>链上数据：</h1>
                <div class="table-footer" v-if="chainDataVisible">
                    <p>{</p>
                    <ul>
                        <li v-for="(item, index) in verifyDetails" :key="index">"
                            {{
                                    index
                            }}":
                            "{{ item }}"</li>
                    </ul>
                    <p>}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getPictureCheckCode, getDepositoryList, dataVerify, fileVerify, getFileHash } from "@/util/api";
import { JSONSwitchFormData, getDate } from "@/util/util.js";
import url from "@/util/url";
export default {
    name: "HomePage",
    data() {
        return {
            codeUrl: url.codeUrl,
            disabled: false,//文件凭证input是否禁用
            DepositoryListData: [],//存证模板下拉框数据
            credentialType: '数据凭证',//凭证类型
            verifyCodeToken: '',//验证码token
            loading: false,
            tableData: [],
            verifyDetails: [],//数据验证详情数据
            chainDataVisible: false,
            progressVisible: false,
            percentage: 0,
            fileList: [],
            file: '',
            verifyForm: {
                depositoryTemplateId: '',//存证模板数据
                dataHash: '',//数据Hash
                verifyCode: '',//验证码
            },
            rules1: {
                depositoryTemplateId: [
                    {
                        required: true,
                        message: "请选择存证模板",
                        trigger: "blur",
                    },
                ],
                dataHash: [
                    {
                        required: true,
                        message: "请输入数据凭证",
                        trigger: "blur",
                    },
                ],
                verifyCode: [
                    {
                        required: true,
                        message: "请输入验证码",
                        trigger: "blur",
                    },
                ],
            },
        }
    },
    mounted() {
        this.changeCode();
        this.getDepositoryListData();
    },
    watch: {
        'credentialType': {
            handler() {
                if (this.credentialType == 2) {
                    this.rules1.dataHash[0].message = '请上传文件'
                } else {
                    this.rules1.dataHash[0].message = '请输入数据凭证'
                }
            }
        }
    },
    methods: {

        Upload() {
            let func = this.uploadProgress;
            let data = JSONSwitchFormData({ "file": this.file });
            getFileHash(data, func).then((res) => {
                if (res.data.code == 0) {
                    this.verifyForm.dataHash = res.data.data;
                    this.progressVisible = false;
                    this.$message({
                        message: '上传成功',
                        type: "success",
                    });
                }
            })

        },
        uploadProgress(progressEvent) {
            // console.log(Math.round((progressEvent.loaded / progressEvent.total) * 10000) / 100.0);
            this.percentage = Math.round((progressEvent.loaded / progressEvent.total) * 10000) / 100.0;
        },
        handleRemove(file) {
            this.progressVisible = false;
            this.percentage = 0;
            this.verifyForm.dataHash = '';
        },
        beforeUpload(file) {
            this.percentage = 0;
            this.progressVisible = true;
            this.file = file;
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        changeSelect(formName) {
            this.$refs[formName].resetFields();
            this.chainDataVisible = false;
            this.tableData = [];
            console.log(this.credentialType);
            this.$refs.verifyForm.clearValidate()
            if (this.credentialType == 2) {
                this.disabled = true;
            } else {
                this.disabled = false;
            }
        },
        //验证码节流
        clickChangeCode: _.throttle(function () {
            this.changeCode();
        }, 500),
        // 获取验证码
        changeCode() {
            this.codeUrl = "";
            getPictureCheckCode()
                .then((res) => {
                    if (res.data.code === 0) {
                        this.verifyCodeToken = res.data.data.token;
                        this.codeUrl = `data:image/png;base64,${res.data.data.base64Image}`;
                    } else {
                        this.codeUrl = "";
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000,
                        });
                    }
                })
                .catch(() => {
                    this.codeUrl = "";
                    this.$message({
                        message: "系统错误",
                        type: "error",
                        duration: 2000,
                    });
                });
        },
        //获取存证模板下拉框数据
        async getDepositoryListData() {
            const res = await getDepositoryList()
            if (res.data.code === 0) {
                this.DepositoryListData = res.data.data;
            } else {
                this.$message({
                    message: '系统错误',
                    type: "error",
                    duration: 2000,
                });
            }
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.inquire();
                } else {
                    return false;
                }
            });
        },
        async inquire() {
            let resData = {
                ...this.verifyForm,
                factHash: this.verifyForm.dataHash,
                verifyCodeToken: this.verifyCodeToken
            }
            this.loading = true;
            let fromData = JSONSwitchFormData(resData);
            const res = await dataVerify(fromData);
            if (res.data.code === 0) {
                this.loading = false;
                this.chainDataVisible = true;
                this.verifyDetails = res.data.data.depositoryParamList;
                res.data.data.createTime = getDate(res.data.data.createTime);
                this.tableData.push(res.data.data);
                this.$message({
                    message: '查询成功',
                    type: "success",
                });
            } else {
                this.loading = false;
                this.$message({
                    message: this.$chooseLang(res.data.code),
                    type: "error",
                    duration: 2000,
                });
            }
        },
    }
}

</script>
<style scoped >
.home-page {
    /* position: absolute; */
    margin-top: -650px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* margin-bottom: 200px; */
    width: 800px;
    /* height: 300px; */
    padding: 0 24px 20px 24px;
    border-radius: 4px;
    box-sizing: border-box;
}

.home-page .from .title {
    font-size: 30px;
    font-weight: 700;
    color: white;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.from /deep/ .el-form-item__label {
    color: white !important;
    font-weight: 700;
    font-size: 16px;
}

.from /deep/ .el-input__inner {
    color: white;
    background-color: rgba(255, 255, 255, 0.2) !important;
}

.from /deep/ .el-select {
    border: none !important;
}

.from /deep/ .el-input,
.from /deep/ .el-input__inner {
    background-color: rgba(255, 255, 255, 0.04) !important;
    color: white;
    font-weight: 700;
    font-size: 16px;
    border: none;
    font-family: 'Microsoft YaHei';
    /* border-color: white; */
    /* text-align: left; */
    border-radius: 4px;
}

.from .vercode {
    display: inline-block;
    width: 80px;
    height: 34px;
    line-height: 34px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    margin-left: 5px;
}

.table {
    display: flex;
    height: 300px;
    padding: 10px;
    background-color: white;
}

.table .table-footer {
    border: 1px solid #DCDCDC;
    border-radius: 4px;
    margin: 10px;
    padding: 10px;
}

.from .upload-file {
    display: inline;
    margin-left: 16px;

}
</style>