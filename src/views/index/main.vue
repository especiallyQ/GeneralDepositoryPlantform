<template>
  <div class="main-wrapper">
    <div
      class="menu-wrapper header"
      :class="{ 'menu-show': menuShow, 'menu-hide': menuHide }"
    >
      <Sidebar
        @sidebarChange="change($event)"
        :minMenu="show"
        ref="menu"
      ></Sidebar>
    </div>
    <div
      class="view-wrapper"
      :class="{ 'view-show': menuShow, 'view-hide': menuHide }"
    >
      <router-view class="bg-f7f7f7"></router-view>
    </div>
  </div>
</template>

<script>
import Bus from "@/bus";
import Sidebar from "./sidebar";
import { checkToken } from "@/util/api";
import router from "@/router";
export default {
  name: "Main",
  components: {
    Sidebar,
  },
  data: function () {
    return {
      menuShow: true,
      menuHide: false,
    };
  },
  computed: {
    show: function () {
      return this.menuShow;
    },
  },
  mounted() {
    this.checkToken();
  },
  methods: {
    // 登录状态token测试
    checkToken() {
      checkToken()
        .then((res) => {
          if (res.data.code === 0) {
            if (this.$route.path && this.$route.path !== "/main") {
              router.push(this.$route.path);
            } else if (this.$route.path == "/main") {
              router.push("/depository");
              Bus.$emit("routing", "/depository");
            } else {
              router.push("/depository");
              Bus.$emit("routing", "/depository");
            }
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
            router.push("/home");
          }
        })
        .catch((err) => {
          this.$message({
            message: err.data || "系统错误",
            type: "error",
            duration: 2000,
          });
          router.push("/home");
        });
    },
    change: function (val) {
      this.menuShow = !val;
      this.menuHide = val;
    },
  },
};
</script>
<style scoped>
.header .el-menu {
  height: 100%;
}
.main-wrapper {
  width: 100%;
  background: #f7f7f7;
  height: 100%;
}
.main-wrapper::after {
  display: block;
  content: "";
  clear: both;
}
.menu-wrapper {
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
}
.menu-wrapper::-webkit-scrollbar {
  width: 1px;
  height: 1px;
  background-color: rgb(12, 18, 32);
}
.menu-wrapper::-webkit-scrollbar-track {
  background-color: rgb(12, 18, 32);
}
.menu-wrapper::-webkit-scrollbar-thumb {
  background-color: rgb(12, 18, 32);
}
.menu-wrapper::-webkit-scrollbar-track-piece {
  background-color: rgb(12, 18, 32);
}
.view-wrapper {
  min-height: calc(100%);
  padding-left: 200px;
  box-sizing: content-box;
}
.menu-show {
  width: 200px;
  transition: width 0.5s;
  -moz-transition: width 0.5s;
  -webkit-transition: width 0.5s;
  -o-transition: width 0.5s;
}
.menu-hide {
  width: 56px;
  transition: width 0.5s;
  -moz-transition: width 0.5s;
  -webkit-transition: width 0.5s;
  -o-transition: width 2s;
}
.view-show {
  width: calc(100% - 200px);
  transition: width 0.5s;
  -moz-transition: width 0.5s;
  -webkit-transition: width 0.5s;
  -o-transition: width 0.5s;
}
.view-hide {
  padding-left: 56px;
  transition: width 0.5s;
  -moz-transition: width 0.5s;
  -webkit-transition: width 0.5s;
  -o-transition: width 2s;
}
.bg-f7f7f7 {
  background-color: #f7f7f7;
}
#shade {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.3;
  /*兼容IE8及以下版本浏览器*/
  filter: alpha(opacity=30);
}

#reset-password {
  position: absolute;
  z-index: 3;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 30%;
  height: 320px;
  margin: auto;
  background-color: #fff;
  padding-top: 15px;
  border: 1px solid #eaedf3;
  box-shadow: 0 12px 27px 0 rgb(159 166 189 / 33%);
  border-radius: 4px;
}
.reset-password-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  padding-top: 20px;
  margin-bottom: 10px;
}
.ruleForm {
  padding-top: 20px;
  padding-right: 25px;
}
.ruleForm .dialog-footer {
  width: 100%;
  text-align: right;
  margin-right: -5px;
  padding-bottom: 20px;
}
.ruleForm >>> .el-form-item__label {
  font-size: 12px;
  color: #737a86;
}
</style>
