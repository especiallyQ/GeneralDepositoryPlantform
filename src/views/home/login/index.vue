<template>
    <div>

        <el-dialog title="登录" :visible.sync="dialogFormVisible" @close="close" width="380px" center
            :close-on-click-modal="false">
            <div class="msg-wrapper">
                <div class="msg-error" v-show="msgError || timeout">
                    <i class="el-icon-remove"></i>
                    <span v-if="msgError">
                        {{ msgErrorContent || "登录失败" }}
                    </span>
                    <span v-else-if="timeout">
                        {{ "请求超时" }}
                    </span>
                </div>
            </div>
            <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form">
                <el-form-item prop="user">
                    <el-input v-model="loginForm.user" placeholder="请输入账号" prefix-icon="cmsp-icon-yonghu">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" placeholder="请输入密码" :show-password="true" type="password"
                        prefix-icon="ext-icon-lock">
                    </el-input>
                </el-form-item>
                <el-form-item prop="vercode">
                    <div class="vercode-wrapper">
                        <el-input style="width: 220px" v-model="loginForm.vercode" placeholder="请输入验证码" maxlength="4"
                            @keyup.enter.native="submit('loginForm')" prefix-icon="ext-icon-xitongguanli">
                        </el-input>
                        <span class="vercode">
                            <img style="height:100%;width: 100%;" :src="codeUrl" alt="" @click="clickChangeCode" />
                        </span>
                    </div>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit('loginForm')" :loading="logining">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import _ from "lodash";
import { getPictureCheckCode, login } from "@/util/api";
import url from "@/util/url";
import { sm3 } from "sm-crypto";
import router from "@/router";
export default {
    name: 'createSourceDialog',
    props: {
        loginDialogVisible: {
            type: Boolean,
            default: false,
            required: true,
        }
    },
    watch: {
        loginDialogVisible() {
            this.dialogFormVisible = this.loginDialogVisible
        },
    },
    data() {
        return {
            // 登录
            dialogFormVisible: this.loginDialogVisible,
            logining: false,
            msgError: false,
            msgErrorContent: "",
            timeout: false,
            codeUrl: url.codeUrl,
            authToken: null,
            loginForm: {
                user: "",
                password: "",
                vercode: "",
            },

            rules: {
                user: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur",
                    },
                ],
                vercode: [
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
        this.clickChangeCode()
    },
    methods: {
        // 点击验证码
        clickChangeCode: _.throttle(function () {
            this.changeCode();
        }, 500),

        // 获取验证码
        changeCode() {
            this.codeUrl = "";
            this.authToken = "";
            getPictureCheckCode()
                .then((res) => {
                    if (res.data.code === 0) {
                        this.codeUrl = `data:image/png;base64,${res.data.data.base64Image}`;
                        this.authToken = res.data.data.token;
                        // localStorage.setItem("token",this.authToken)
                    } else {
                        this.codeUrl = "";
                        this.authToken = "";
                        this.$message({
                            message: this.$chooseLang(res.data.code),
                            type: "error",
                            duration: 2000,
                        });
                    }
                })
                .catch(() => {
                    this.codeUrl = "";
                    this.authToken = "";
                    this.$message({
                        message: "系统错误",
                        type: "error",
                        duration: 2000,
                    });
                });
        },

        // 提交登录事件
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.logining = true;
                    this.userLogin();
                } else {
                    return false;
                }
            });
        },

        // 登录
        userLogin() {
            const { user, password, vercode } = this.loginForm;
            let reqData = {
                account: user,
                accountPwd: sm3(password),
            };
            let checkCode = vercode;
            login(reqData, checkCode, this.authToken)
                .then((res) => {
                    if (res.data.code === 0) {
                        const { data } = res.data;
                        // 账号名
                        localStorage.setItem("user", data.accountName);
                        // 账号唯一标识
                        localStorage.setItem("userId", data.accountId);
                        // 账号类型(权限角色)
                        localStorage.setItem("rootId", data.accountRoleId);
                        // 登录系统token
                        localStorage.setItem("token", data.AuthorizationToken);
                        // 默认选中的菜单
                        localStorage.setItem("sidebarActive", "");
                        // 菜单默认不隐藏
                        localStorage.setItem("sidebarHide", "false");

                        router.push("/main");
                    } else {
                        this.changeCode();
                        this.msgErrorContent = this.$chooseLang(res.data.code);
                        this.msgError = true;
                        this.loginForm.password = "";
                        this.loginForm.vercode = "";
                        this.logining = false;
                    }
                })
                .catch(() => {
                    this.changeCode();
                    this.timeout = true;
                    this.loginForm.password = "";
                    this.loginForm.vercode = "";
                    this.logining = false;
                });
        },

        //关闭dialog
        close() {
            this.$emit("update:loginDialogVisible", false);
        }
    },

}
</script>

<style lang="less" scoped>
.msg-wrapper {
    position: relative;
    min-height: 20px;
    height: auto;

    .msg-error {
        color: #e4393c;
    }
}

.vercode-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;

    .vercode {
        display: inline-block;
        width: 80px;
        height: 34px;
        line-height: 34px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
    }
}

.dialog-footer {
    text-align: right;
}
</style>