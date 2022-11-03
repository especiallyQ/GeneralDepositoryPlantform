<template>
  <div class="login">
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
    <div class="form-wrapper">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="user">
          <el-input
            v-model="loginForm.user"
            placeholder="请输入账号"
            prefix-icon="cmsp-icon-yonghu"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            prefix-icon="ext-icon-lock"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="vercode">
          <div class="vercode-wrapper">
            <el-input
              style="width: 220px"
              v-model="loginForm.vercode"
              placeholder="请输入验证码"
              @keyup.enter.native="submit('loginForm')"
              prefix-icon="ext-icon-xitongguanli"
            >
            </el-input>
            <span class="vercode">
              <img
                style="width: 100%; height: 100%"
                :src="codeUrl"
                alt=""
                @click="changeCode()"
              />
            </span>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button
        @click="submit('loginForm')"
        type="primary"
        class="login-submit"
        :loading="logining"
      >
        {{ "登录" }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { getPictureCheckCode, login } from "@/util/api";
import url from "@/util/url";
import { sm3 } from "sm-crypto";
export default {
  name: "Login",
  data() {
    return {
      // 登录
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
    };
  },

  mounted() {
    this.changeCode();
  },

  methods: {
    // 获取验证码
    changeCode() {
      this.codeUrl = "";
      this.authToken = "";
      getPictureCheckCode()
        .then((res) => {
          if (res.data.code === 0) {
            this.codeUrl = `data:image/png;base64,${res.data.data.base64Image}`;
            this.authToken = res.data.data.token;
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
          console.log(res);
          if (res.data.code === 0) {
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
  },
};
</script>

<style lang="less" scoped>
.login {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 360px;
  padding: 0 24px 20px 24px;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 45px rgba(255, 255, 255, 0.1);

  .msg-wrapper {
    position: relative;
    min-height: 20px;
    height: auto;

    .msg-error {
      color: #e4393c;
    }
  }

  .form-wrapper {
    position: relative;

    .login-form {
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
    }
  }

  .login-submit {
    width: 100%;
    height: 38px;
    margin-top: 10px;
    font-size: 14px;
  }
}
</style>