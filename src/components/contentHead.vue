<template>
  <div class="content-head-wrapper">
    <div class="content-head-title">
      <span class="content-head-icon" v-if="icon" @click="skip">
        <i class="ext-icon-back"></i>
      </span>
      <span :class="{ 'font-color-9da2ab': headSubTitle }">{{ title }}</span>
      <span v-show="headSubTitle" class="font-color-ccd2dc">/</span>
      <span>{{ headSubTitle }}</span>
      <el-tooltip effect="dark" placement="bottom-start" v-if="headTooltip" offset="0" :open-delay="1000">
        <div slot="content">{{ headTooltip }}</div>
        <i class="el-icon-info font-15"></i>
      </el-tooltip>
    </div>
    <div class="content-head-network">
      <el-popover placement="bottom" width="0" min-width="50px" trigger="click">
        <div class="sign-out-wrapper">
          <div class="change-password" @click="changePassword">修改密码</div>
          <div class="change-password" @click="lookVersion">查看版本</div>
          <div class="sign-out" @click="signOut">退出登录</div>
        </div>
        <a class="browse-user" slot="reference">
          <i class="ext-icon-user-icon"></i>
          <i style="marginLeft: 2px">{{ accountName }}</i>
        </a>
      </el-popover>
    </div>
    <el-dialog
            title="修改密码"
            :visible.sync="changePasswordDialogVisible"
            width="30%"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper"
            @close="CloseDialog"
            >
            <change-password-dialog @success="success" ref="child">
            </change-password-dialog>
        </el-dialog>
  </div>
</template>

<script>
import { loginOut } from '@/util/api'
import changePasswordDialog from './changePasswordDialog';
export default {
  name: "conetntHead",
  props: {
    icon: { type: Boolean },
    headSubTitle: { type: String },
    headTitle: { type: String },
    headTooltip: { type: String },
  },
  components: {
        changePasswordDialog
    },

  data() {
    return {
      title: this.headTitle,
      accountName: "-",
      changePasswordDialogVisible:false,
      
    };
  },

  watch: {
    headTitle: function (val) {
      this.title = val;
    },
  },

  mounted() {
    if (localStorage.getItem("user")) {
      this.accountName = localStorage.getItem("user");
    }
  },

  methods: {
    skip() {
      if (this.route) {
        this.$router.push(this.way);
      } else {
        this.$router.go(-1);
      }
    },
    // 修改密码
    changePassword() {
      this.changePasswordDialogVisible = true;
        
  },
    // 查看版本
    lookVersion() { },
    // 退出登录
    async signOut() {
      localStorage.clear();
      await this.quit();
      this.$router.push("/home");
    },
    //调用退出接口
    async quit() {
      const res = await loginOut();
      if (res.data.code === 0) {
      } else {
        this.$message({
          message: this.$chooseLang(res.data.code),
          type: "error",
          duration: 2000,
        });
      }
    },
    success: function (val) {
            this.changePasswordDialogVisible = false;
    },
    //关闭修改密码dialog时清空数据
    CloseDialog() {
          this.$refs.child.closeDialog()
    },

  },
};
</script>

<style lang="less" scoped>
.content-head-wrapper {
  width: calc(100%);
  background-color: rgb(12, 18, 32);
  text-align: left;
  line-height: 54px;
  position: relative;
  user-select: none;
}

.content-head-wrapper::after {
  display: block;
  content: "";
  clear: both;
}

.content-head-title {
  margin-left: 40px;
  display: inline-block;
  font-size: 16px;
  color: #fff;
  font-weight: bold;
}

.content-head-network {
  position: relative;
  float: right;
  padding-right: 10px;
}

.content-head-icon {
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}

.sign-out-wrapper {
  line-height: 32px;
  text-align: center;
}

.change-password {
  color: #409eff;
  cursor: pointer;
}

.sign-out {
  cursor: pointer;
  color: #ed5454;
}

.browse-user::hover {
  color: rgb(55, 238, 242);
}

.browse-user {
  text-align: center;
  text-decoration: none;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  color: #cfd7db;
}

[class^="ext-icon"] {
  font-size: 15px;
  margin: 0 2px;
}

i {
  font-style: normal;
}

.font-color-9da2ab {
  color: #9da2ab;
}

.font-color-ccd2dc {
  color: #ccd2dc;
}

.font-color-fff {
  color: #fff;
}

.font-12 {
  font-size: 12px;
}

.font-15 {
  font-size: 15px;
}
</style>