<template>
  <div class="sidebar-wrapper">
    <div class="sidebar-content">
      <div class="image-flex justify-center center" v-if="menuShow">
        <span class="sidebar-header">通用存证平台</span>
        <span class="sidebar-contract-icon">
          <i
            class="el-icon-caret-left font-color-aeb1b5"
            @click="hideMune(true)"
            style="font-size: 18px"
          >
          </i>
        </span>
      </div>
      <div class="mini-sidebar-contract-icon" v-if="!menuShow">
        <i
          class="el-icon-caret-right font-color-aeb1b5"
          @click="hideMune(false)"
          style="font-size: 18px"
        >
        </i>
      </div>
      <el-menu
        ref="elMenu"
        default-active="999"
        router
        class="el-menu-vertical-demo"
        text-color="#ccd2dc"
        :active-text-color="activeTextColor ? '#37eef2' : ''"
        active-background-color="#1e293e"
        background-color="#0c1220"
        :unique-opened="true"
        @select="select"
        :collapse="!menuShow"
      >
        <template v-for="(item, index) in routes">
          <template v-if="item.menuShow">
            <el-submenu
              v-if="!item.leaf"
              :key="index"
              :index="`${index}`"
              ref="ele"
              class=""
            >
              <template slot="title">
                <div :style="{ 'padding-left': menuShow ? '13px' : '' }">
                  <i
                    :class="item.iconCls"
                    :style="{ color: activeIndex == index ? '#37eef2' : '' }"
                  >
                  </i>
                  <span :class="{ 'font-color-37eef2': activeIndex == index }">
                    {{ item.name }}
                  </span>
                </div>
              </template>
              <template v-for="term in item.children">
                <el-menu-item
                  :key="term.path"
                  :index="term.path"
                  v-if="term.menuShow"
                  :style="{
                    color: term.path == activeRoute ? '#37eef2' : '',
                    'border-left':
                      term.path == activeRoute ? '3px solid #37eef2' : '',
                    'padding-left': term.path == activeRoute ? '55px' : '58px',
                    'background-color':
                      term.path == activeRoute ? '#1e293e' : '#0c1220',
                  }"
                >
                  <span>{{ term.name }}</span>
                </el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item
              v-if="item.leaf && item.children && item.children.length"
              :key="item.children[0].path"
              :index="item.children[0].path"
              :style="{
                'border-left':
                  item.children[0].path == activeRoute
                    ? '3px solid #37eef2'
                    : '',
                'padding-left':
                  item.children[0].path == activeRoute ? '30px' : '33px',
                'background-color':
                  item.children[0].path == activeRoute ? '#1e293e' : '#0c1220',
              }"
            >
              <i :class="item.iconCls"></i>
              <span slot="title">{{ item.children[0].name }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
import Bus from "@/bus";
export default {
  name: "Sidebar",
  props: ["minMenu"],
  data() {
    return {
      activeIndex: 0,
      active: "",
      role: localStorage.getItem("rootId"),
      routesList: [],
      activeTextColor: true,
    };
  },
  computed: {
    routes() {
      let list = this.routesList;
      list.forEach((item) => {
        // 主菜单国际化
        item.name = {
          userManagement: '用户管理',
          systemConfiguration:'系统配置',

        }[item.nameKey];
        // 子菜单国际化
        if (item.children) {
          item.children.forEach((it) => {
            it.name = {
              dataOverview: "数据概览",
              depositoryTitle: "存证管理",
              userManagement: '账号管理',
              systemConfiguration:'系统配置',
            }[it.nameKey];
          });
        }
      });
      return list;
    },
    menuShow() {
      if (this.minMenu) {
        return this.minMenu;
      } else {
        return false;
      }
    },
    activeRoute() {
      return this.active ? this.active : this.$route.path;
    },
  },
  watch: {
    $route(to, from) {
      if (this.$route.path !== to.path) {
        this.active = this.$route.path;
      }
      if (to.path != from.path) {
        this.activeTextColor = false;
      }
    },
  },
  beforeDestroy() {
    Bus.$off("routing");
  },
  mounted() {
    this.$nextTick(() => {
      this.changeRouter(() => {
        this.$nextTick(() => {
          let path = localStorage.getItem("sidebarActive");
          let sidebarHide = localStorage.getItem("sidebarHide");
          sidebarHide = /^true$/.test(sidebarHide);
          if (!!path) {
            this.routing(path);
          }
          this.hideMune(sidebarHide);
        });
      });
    });
    Bus.$on("routing", (path) => {
      this.routing(path);
    });
  },
  methods: {
    // 权限处理
    changeRouter(callback) {
      let list = this.$router.options.routes.map((item) => {
        return item;
      });
      list.forEach((item) => {
        // 主菜单权限
        item.menuShow =
          {
            home: false,
            main: false,
          depositoryTitle: true,
          userManagement: true,
          systemConfiguration:true,
            data: true,
          }[item.nameKey] || false;

        // 子菜单权限
        if (item.children) {
          item.children.forEach((it) => {
            it.menuShow =
              {
                dataOverview: true,
                chainOrgMgmt: true,
                accountManagement: true,
                message: true,
              depositoryTitle: true,
              userManagement: true,
                backlog: this.role === "PU_Admin",
              }[it.nameKey] || false;
          });
        }
      });
      this.routesList = list;

      callback && callback();
    },
    select(index, indexPath) {
      this.activeIndex = indexPath[0];
      this.active = index;
      localStorage.setItem("sidebarActive", index);
    },
    hideMune(val) {
      this.$emit("sidebarChange", val);
      localStorage.setItem("sidebarHide", val);
      // if (!this.menuShow) {
      //   if (!!this.activeIndex) {
      //     this.$refs.elMenu.open(this.activeIndex);
      //   }
      // }
    },
    // 路由跳转时,通过目标路由的path来变更菜单的选中状态
    routing(path) {
      if (!path) return;

      let indexPath = "",
        isLeaf = true;
      for (let i = 0; i < this.routesList.length; i++) {
        let menu = this.routesList[i];
        let subMenu = menu.children || [];
        for (let j = 0; j < subMenu.length; j++) {
          if (path === subMenu[j].path) {
            isLeaf = menu.leaf;
            indexPath = isLeaf ? path : String(i);
            break;
          }
        }
      }
      if (!!indexPath) {
        this.$refs.elMenu.activeIndex = indexPath;
        this.activeIndex = indexPath;
        this.active = path;
        localStorage.setItem("sidebarActive", path);
        if (!isLeaf) {
          this.$refs.elMenu.open(indexPath);
        }
      }
    },
  },
};
</script>

<style scoped>

.el-submenu__title * {
    margin-left: -5px;
    vertical-align: middle;
}
.el-icon-connection:before {
    content: "\e736";
    margin-left: 8px;
}
.el-menu-vertical-demo {
  padding-top: 16px;
  border: none;
}
.el-menu-vertical-demo >>> .el-menu-item {
  font-size: 14px;
  color: #ccd2dc;
  text-align: left;
}
.el-menu-vertical-demo >>> .el-menu-item.is-active {
  color: rgb(55, 238, 242);
}
.el-menu-vertical-demo >>> .el-submenu__title {
  padding-left: 33px;
}
.el-menu-item-group > ul > .el-menu-item {
  font-size: 14px;
  color: #ccd2dc;
  text-align: left;
  padding-left: 57px !important;
  height: 46px;
  line-height: 46px;
}
.el-menu-item-group > ul > .el-menu-item.is-active {
  color: rgb(55, 238, 242);
}
.sidebar-wrapper {
  position: relative;
  height: 100%;
  box-sizing: border-box;
  user-select: none;
}
.sidebar-content {
  position: relative;
  height: 100%;
  background-color: #0c1220;
  box-sizing: border-box;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.sidebar-content ::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.sidebar-version {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px;
  color: rgba(255, 255, 255, 0.1);
  z-index: 9999;
  background-color: #0c1220;
  box-sizing: border-box;
}
.sidebar-version-item {
  line-height: 22px;
}
.sidebar-content >>> .el-menu--collapse {
  width: 56px;
}
.sidebar-content >>> .el-menu--collapse .is-active .el-tooltip {
  padding-left: 17px !important;
  background-color: #1e293e;
}
.mini-sidebar-contract-icon {
  position: relative;
  text-align: center;
  height: 54px;
}
.mini-sidebar-contract-icon i {
  position: absolute;
  top: 20px;
  right: 10px;
  z-index: 9999;
  cursor: pointer;
}
.image-flex {
  position: relative;
  height: 54px;
  display: -webkit-box !important;
  display: -webkit-flex !important;
  display: -ms-flexbox !important;
  display: flex !important;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.image-flex.justify-center {
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.image-flex.center {
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}
.sidebar-header {
  color: #cfd7db;
  font-size: 20px;
  font-weight: bold;
  padding-right: 18px;
  letter-spacing: 1px;
}
.sidebar-icon {
  font-size: 15px;
  padding-right: 5px;
}
.sidebar-contract-icon {
  position: absolute;
  display: inline-block;
  left: 180px;
  top: 18px;
  font-size: 12px;
  letter-spacing: 0;
  text-align: right;
  cursor: pointer;
  z-index: 6666;
}
.sidebar-contract-icon i {
  cursor: pointer;
}
.font-color-aeb1b5 {
  color: #aeb1b5;
}
.font-color-37eef2 {
  color: #37eef2;
}
</style>