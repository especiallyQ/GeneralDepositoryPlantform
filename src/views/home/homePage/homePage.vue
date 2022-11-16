<template>
    <div class="home-page">
        <div class="tabs">
            <el-tabs type="border-card" class="data-bcg">
                <el-tab-pane label="数据验证">
                    <div class="from-style">
                        <el-form label-position="right" label-width="80px" :model="verifyForm">
                            <el-form-item label="存证模板">
                                <el-select v-model="verifyForm.deposiTtemplate" placeholder="请选择存证模板"
                                    style="width: 100%">
                                    <!-- <el-option v-for="item in roleOptions" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option> -->
                                    <el-option value="1">1111</el-option>
                                    <el-option value="2">2222</el-option>
                                    <el-option value="3">3333</el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="数据凭证">
                                <el-input v-model="verifyForm.dataCredentials"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码">
                                <el-input v-model="verifyForm.vercode" placeholder="请输入验证码" maxlength="4"
                                    style="width:600px"></el-input>
                                <span class="vercode">
                                    <img style="width: 100%; height: 100%" :src="codeUrl" alt=""
                                        @click="clickChangeCode" />
                                </span>
                            </el-form-item>
                            <el-button type="primary" class="rigth-btn" @click="inquire">查询</el-button>
                        </el-form>
                        <div class="table-footer" v-show="drawerVisible">
                            <el-table :data="tableData" border style="width: 100%" v-loading="loading"
                                :header-cell-style="{ background: 'rgba(105,105,105,0.4)' }">
                                <el-table-column prop="date" label="凭证信息" width="380" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="name" label="是否为最新版本" width="120">
                                </el-table-column>
                                <el-table-column prop="address" label="提交时间" width="176">
                                </el-table-column>
                                <el-table-column label="操作" width="122" align="center">
                                    <template slot-scope="{}">
                                        <el-button type="text" style="color:#75C2E9" @click="dialogVisible = true"> 查看详情
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="配置管理">
                    配置管理
                    <!-- <div class="from-style">
                        <el-form label-position="right" label-width="80px" :model="verifyForm">
                            <el-form-item label="存证模板">
                                <el-select v-model="verifyForm.deposiTtemplate" placeholder="请选择存证模板"
                                    style="width: 100%">
                                    
                                </el-select>
                            </el-form-item>
                            <el-form-item label="文件凭证">
                                <el-input v-model="verifyForm.dataCredentials"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码">
                                <el-input v-model="verifyForm.vercode" placeholder="请输入验证码" maxlength="4"
                                    style="width:600px"></el-input>
                                <span class="vercode">
                                    <img style="width: 100%; height: 100%" :src="codeUrl" alt=""
                                        @click="clickChangeCode" />
                                </span>
                            </el-form-item>
                            <el-button type="primary" class="rigth-btn">查询</el-button>
                        </el-form>
                        <div class="table-footer">
                            <el-table :data="tableData" border style="width: 100%" v-show="true"
                            :header-cell-style="{background:'rgba(105,105,105,0.4)'}"
                            >
                            <el-table-column prop="date" label="日期" width="180">
                            </el-table-column>
                            <el-table-column prop="name" label="姓名" width="180">
                            </el-table-column>
                            <el-table-column prop="address" label="地址">
                            </el-table-column>
                            <el-table-column prop="address" label="地址">
                            </el-table-column>
                        </el-table>
                        </div>
                        
                    </div> -->

                </el-tab-pane>
            </el-tabs>
            <el-dialog title="存证内容详情" :visible.sync="dialogVisible" width="30%" :before-close="handleClose"
            >
                <div class="dialog-content">
                    <span class="content-header">链上数据：</span>
                <div class=" content-center">
                    <p>{</p>
                        111111111111111 <br>
                        11111111222222 <br>
                        3 <br>
                        4 <br>
                        5 <br>
                        6
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
import { getPictureCheckCode } from "@/util/api";
import url from "@/util/url";
export default {
    name: "HomePage",
    data() {
        return {
            dialogVisible: false,
            loading: false,
            drawerVisible: false,
            codeUrl: url.codeUrl,
            verifyForm: {
                deposiTtemplate: '',//存证模板数据
                dataCredentials: '',//数据凭证数据
                vercode: '',//验证码
            },
            vercodeToken: '',//验证码Token
            tableData: [{
                date: '2016-05-02-  -0000000000000000000000000000000000',
                name: '是',
                address: '2022-11-15 14:26:30'
            },]
        }
    },
    mounted() {
        this.changeCode();
    },
    methods: {
        inquire() {
            this.drawerVisible = true
            let resData = {
                ...this.verifyForm,
                vercodeToken: this.vercodeToken
            }
            console.log(resData);
        },
        // test(row) {
        //     this.drawerVisible = true
        //     console.log(row);
        // },
        // 点击验证码
        clickChangeCode: _.throttle(function () {
            this.changeCode();
        }, 500),
        // 获取验证码
        changeCode() {
            this.codeUrl = "";
            getPictureCheckCode()
                .then((res) => {
                    if (res.data.code === 0) {
                        this.vercodeToken = res.data.data.token;
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
.tabs  .dialog-content{
    height: 300px;
    border-top: 1px solid red;
    border-bottom: 1px solid #000;
}
.tabs  .dialog-content .content-header{
    display: block;
    font-weight: 700;
    margin-top: 20px;
    margin-left: 20px;
}
.tabs  .dialog-content .content-center{
    border: 1px solid #DCDCDC;
    border-radius: 4px;
    margin-left: 20px;
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
/deep/ .el-table__row {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
}

::v-deep .el-table th {
    background-color: rgba(255, 255, 255, 0.1);
}

/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent !important;
}

::v-deep .el-table td,
.el-table th {
    color: white;
}
</style>