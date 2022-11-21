<template>
    <div class="home-page">
        <div class="tabs">
            <el-tabs type="border-card" class="data-bcg" @tab-click="handleClick">
                <el-tab-pane label="数据验证">
                    <div class="from-style">
                        <el-form label-position="right" label-width="80px" :model="verifyForm">
                            <el-form-item label="存证模板">
                                <el-select v-model="verifyForm.depositoryTemplateId" placeholder="请选择存证模板"
                                    style="width: 100%" @focus="getDepositoryListData">
                                    <el-option v-for="item in DepositoryListData" :key="item.depositoryTemplateId"
                                        :label="item.depositoryTemplateName" :value="item.depositoryTemplateId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="数据凭证">
                                <el-input v-model="verifyForm.factHash"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码">
                                <el-input v-model="verifyForm.verifyCode" placeholder="请输入验证码" maxlength="4"
                                    style="width:600px"></el-input>
                                <span class="vercode">
                                    <img style="width: 100%; height: 100%" :src="codeUrl" alt=""
                                        @click="clickChangeCode" />
                                </span>
                            </el-form-item>
                            <el-button type="primary" class="rigth-btn" @click="inquire">查询</el-button>
                        </el-form>
                        <div class="table-footer" v-show="drawerVisible">
                            <el-table :data="tableData" border style="width: 100%"
                                :header-cell-style="{ background: 'rgba(105,105,105,0.4)' }">
                                <el-table-column prop="factHash" label="凭证信息" width="380" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="latestVersion" label="是否为最新版本" width="120">
                                </el-table-column>
                                <el-table-column prop="createTime" label="提交时间" width="176">
                                </el-table-column>
                                <el-table-column label="操作" width="122" align="center">
                                    <template>
                                        <el-button type="text" style="color:#75C2E9" @click="dialogVisible = true"> 查看详情
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="文件验证">
                    <div class="from-style">
                        <el-form label-position="right" label-width="80px" :model="verifyFormFile">
                            <el-form-item label="存证模板">
                                <el-select v-model="verifyFormFile.depositoryTemplateId" placeholder="请选择存证模板"
                                    style="width: 100%" @focus="getDepositoryListData">
                                    <el-option v-for="item in DepositoryListData" :key="item.depositoryTemplateId"
                                        :label="item.depositoryTemplateName" :value="item.depositoryTemplateId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="文件凭证">
                                <el-input v-model="verifyFormFile.fileHash" style="width:578px" disabled></el-input>
                                <el-upload class="upload-file" action="" ref="upload" :limit="1" :file-list="fileList"
                                        :auto-upload="false" :before-upload="beforeUpload" :on-exceed="handleExceed">
                                    <el-button type="primary">点击上传</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="验证码">
                                <el-input v-model="verifyFormFile.verifyCode" placeholder="请输入验证码" maxlength="4"
                                    style="width:600px"></el-input>
                                <span class="vercode">
                                    <img style="width: 100%; height: 100%" :src="codeUrl" alt=""
                                        @click="clickChangeCode" />
                                </span>
                            </el-form-item>
                            <el-button type="primary" class="rigth-btn" @click="inquire">查询</el-button>
                        </el-form>
                        <div class="table-footer" v-show="fileVisible">
                            <el-table :data="tableFileData" border style="width: 100%"
                                :header-cell-style="{ background: 'rgba(105,105,105,0.4)' }">
                                <el-table-column prop="fileHash" label="凭证信息" width="380" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="latestVersion" label="是否为最新版本" width="120">
                                </el-table-column>
                                <el-table-column prop="createTime" label="提交时间" width="176">
                                </el-table-column>
                                <el-table-column label="操作" width="122" align="center">
                                    <template>
                                        <el-button type="text" style="color:#75C2E9" @click="dialogVisible = true"> 查看详情
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <el-dialog title="存证内容详情" :visible.sync="dialogVisible" width="30%">
                <div class="dialog-content">
                    <span class="content-header">链上数据：</span>
                    <div class=" content-center">
                        <p>{</p>
                        <ul >
                            <li v-for="(item, index) in tabId==0?verifyDetails:verifyDetailsFile" :key="index">"{{ item.depositoryParamName }}":
                                "{{ item.depositoryParamValue }}"</li>
                        </ul>
                        <p>}</p>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">返回</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { getPictureCheckCode, getDepositoryList, dataVerify, fileVerify } from "@/util/api";
import { JSONSwitchFormData } from "@/util/util.js";
import url from "@/util/url";
export default {
    name: "HomePage",
    data() {
        return {
            dialogVisible: false,
            drawerVisible: false,
            fileVisible:false,
            codeUrl: url.codeUrl,
            verifyForm: {
                depositoryTemplateId: '',//存证模板数据
                factHash: '',//数据凭证数据
                verifyCode: '',//验证码
            },
            verifyFormFile: {
                depositoryTemplateId: '',//存证模板数据
                fileHash: '',//数据凭证数据
                verifyCode: '',//验证码
            },
            verifyCodeToken: '',//验证码Token
            tableData: [{
                latestVersion: '',
                createTime: '',
                factHash: '',
            }],
            tableFileData: [{
                latestVersion: '',
                createTime: '',
                fileHash: '',
            }],
            fileList: [],
            file: null,//
            DepositoryListData: [],
            verifyDetails: [],//数据验证详情数据
            verifyDetailsFile:[],//文件验证详情数据
            tabId: 0,//区别数据验证跟文件验证

        }
    },
    mounted() {
        this.changeCode();
    },
    methods: {
        async getDepositoryListData() {
            const res = await getDepositoryList()
            if (res.data.code === 0) {
                this.DepositoryListData = res.data.data;
            } else {
                this.$message({
                    message: '',
                    type: "error",
                    duration: 2000,
                });
            }
        },
        beforeUpload(file) {
            this.file = file
        },
        handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleClick(tab, event) {
            this.tabId = tab.index;
            this.changeCode();
        },
        async inquire() {
            this.$refs.upload.submit();
            if (this.tabId == 0) {
                let resData = {
                    ...this.verifyForm,
                    verifyCodeToken: this.verifyCodeToken
                }
                let fromData = JSONSwitchFormData(resData);
                const res = await dataVerify(fromData);
                if (res.data.code === 0) {
                    this.verifyDetails = res.data.data.depositoryParamList;
                    this.tableData[0].createTime = res.data.data.createTime;
                    this.tableData[0].latestVersion = res.data.data.latestVersion;
                    this.tableData[0].factHash = this.verifyForm.factHash;
                    this.drawerVisible = true;
                    this.$message({
                        message: '查询成功',
                        type: "success",
                    });
                } else {
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000,
                    });
                }
            } else {
                let respData = {
                    ...this.verifyFormFile,
                    file: this.file,
                    verifyCodeToken: this.verifyCodeToken
                }
                let fromaData = JSONSwitchFormData(respData);
                const res = await fileVerify(fromaData);
                if (res.data.code === 0) {
                    this.$message({
                        message: '查询成功',
                        type: "success",
                    });
                    this.verifyDetailsFile = res.data.data.depositoryParamList;
                    this.tableFileData[0].createTime = res.data.data.createTime;
                    this.tableFileData[0].latestVersion = res.data.data.latestVersion;
                    this.tableFileData[0].fileHash = res.data.data.fileHash;
                    this.verifyFormFile.fileHash =res.data.data.fileHash;
                    this.fileVisible = true;
                } else {
                    this.fileVisible = false;
                    this.verifyFormFile.fileHash = '';
                    this.$message({
                        message: this.$chooseLang(res.data.code),
                        type: "error",
                        duration: 2000,
                    });
                }
            }
        },
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
    },
}
</script>

<style scoped >
.el-upload-list__item-name {
    color: white !important;
    display: block;
    margin-right: 40px;
    overflow: hidden;
    padding-left: 4px;
    text-overflow: ellipsis;
    transition: color .3s;
    white-space: nowrap;
}

.home-page {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 800px;
    height: 300px;
    padding: 0 24px 20px 24px;
    border-radius: 4px;
    box-sizing: border-box;
}

.tabs {
    position: relative;
    top: 0px;
    left: -25px;
    border-radius: 4px;
    height: 100%;
    width: 800px;
}

.tabs .dialog-content {
    height: 300px;
    border-top: 1px solid red;
    border-bottom: 1px solid #000;
}

.tabs .dialog-content .content-header {
    display: block;
    font-weight: 700;
    margin-top: 20px;
    margin-left: 20px;
}

.tabs .dialog-content .content-center {
    border: 1px solid #DCDCDC;
    border-radius: 4px;
    margin-left: 20px;
    padding: 10px;
}


.data-bcg {
    background-color: rgba(255, 255, 255, 0.2);
}

.from-style /deep/ .el-form-item__label {
    color: white !important;
    font-weight: 700;
    font-size: 16px;
}

.from-style /deep/ .el-input__inner {
    color: white;
    background-color: rgba(255, 255, 255, 0.2);
}

.from-style .upload-file {
    display: inline;
    margin-left: 10px;

}

.from-style .vercode {
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

.from-style .rigth-btn {
    float: right;
    margin-bottom: 20px;
}

.from-style .table-footer {
    width: 810px;
    margin-left: -16px;
    margin-bottom: -16px;
}

.from-style .table-footer /deep/ .el-table,
.from-style /deep/ .el-table__row {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
}

::v-deep .el-table th {
    background-color: rgba(255, 255, 255, 0.1);
}

.from-style /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent !important;
}

::v-deep .el-table td,
.el-table th {
    color: white;
}
</style>