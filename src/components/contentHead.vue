<template>
    <div class="content-head-wrapper">
        <div class="content-head-title">
            <span class="content-head-icon" v-if="icon" @click="skip">
                <i class="ext-icon-back"></i>
            </span>
            <span :class="{'font-color-9da2ab': headSubTitle}">{{title}}</span>
            <span v-show="headSubTitle" class="font-color-ccd2dc">/</span>
            <span>{{headSubTitle}}</span>
            <el-tooltip
                effect="dark"
                placement="bottom-start"
                v-if="headTooltip"
                offset='0'
                :open-delay="1000">
                <div slot="content">{{headTooltip}}</div>
                <i class="el-icon-info font-15"></i>
            </el-tooltip>
            <a v-if="headHref"
                target="_blank"
                :href="headHref.href"
                class="font-color-fff font-12">
                {{headHref.content}}
            </a>
        </div>
        <div class="content-head-network">
            <a class="content-head-network-link">
                <span class="link-item" @click="toMessage">
                    {{this.$t("title.message")}}
                    <el-badge
                        class="item"
                        :max="99"
                        :value="unReadAlarmLogNum"
                        v-if="unReadAlarmLogNum > 0" />
                </span>
            </a>
            <a class="content-head-network-link" v-if="root === 'PU_Admin'">
                <span class="link-item" @click="toBacklog">
                    {{this.$t("title.backlog")}}
                    <el-badge
                        class="item"
                        :max="99"
                        :value="backlogNum"
                        v-if="backlogNum > 0" />
                </span>
            </a>
            <span class="content-head-network-text">
                {{this.$t("head.group")}}: {{groupName}}
            </span>
            <el-popover
                placement="bottom"
                width="0"
                min-width="50px"
                trigger="click">
                <div class="sign-out-wrapper">
                    <div class="change-password" @click="changePassword">
                        {{this.$t("head.changePassword")}}
                    </div>
                    <div class="change-password" @click="lookVersion">
                        {{this.$t("head.versionInfo")}}
                    </div>
                    <div class="sign-out" @click="signOut">
                        {{this.$t("head.exit")}}
                    </div>
                </div>
                <a class="browse-user" slot="reference">
                    <i class="ext-icon-user-icon"></i>
                    <i>{{accountName}}</i>
                </a>
            </el-popover>
        </div>
        <el-dialog
            :title="$t('head.changePassword')"
            :visible.sync="changePasswordDialogVisible"
            width="30%"
            :center="true"
            :close-on-click-modal="false"
            class="dialog-wrapper">
            <change-password-dialog @success="success">
            </change-password-dialog>
        </el-dialog>
        <el-dialog
            :title="$t('head.versionInfo')"
            :visible.sync="versionInfoVisible"
            width="24%"
            :center="true"
            class="dialog-wrapper">
            <div class="version-item">
                <div class="title">{{$t("text.chainVersion")}}</div>
                <div class="label">
                    <div class="label-box">{{versionChainmarker}}</div>
                </div>
            </div>
            <div class="version-item">
                <div class="title">{{$t('text.supportVersion')}}</div>
                <div class="label">
                    <div class="label-box">{{versionCompatible}}</div>
                </div>
            </div>
            <div class="version-item">
                <div class="title">{{$t("text.cmspVersion")}}</div>
                <div class="label">
                    <div class="label-box">{{versionCmsp}}</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import changePasswordDialog from './changePasswordDialog';
import {
    loginOut,
    getUnReadAlarmLogNum,
    getBacklogCount,
    getOrgAndChain
} from '@/util/api';
import { delCookie } from '@/util/util';
import Bus from '@/bus';
import router from '@/router';
export default {
    name: 'conetntHead',
    props: {
        headTitle: { type: String },
        icon: { type: Boolean },
        route: { type: String },
        headSubTitle: { type: String },
        headTooltip: { type: String },
        headHref: { type: Object },
        updateGroup: { type: Number }
    },
    components: {
        changePasswordDialog
    },
    watch: {
        headTitle: function (val) {
            this.title = val;
        },
        updateGroup: function (val) {
            if (localStorage.getItem('groupName')) {
                this.groupName = localStorage.getItem('groupName');
            }
        }
    },
    data: function () {
        return {
            title: this.headTitle,
            groupName: '-',
            accountName: '-',
            path: '',
            headIcon: this.icon || false,
            way: this.route || '',
            changePasswordDialogVisible: false,
            root: localStorage.getItem('root'),
            versionInfoVisible: false,
            unReadAlarmLogNum: 0, // 未读消息通知数
            backlogNum: 0, // 未处理待办事项数
            versionChainmarker: '', // 长安链版本
            versionCompatible: '', // 兼容版本
            versionCmsp: '' // CMSP版本
        };
    },
    beforeDestroy: function () {
        Bus.$off('refreshUnReadNotice');
        Bus.$off('refreshBacklog');
    },
    mounted: function () {
        if (localStorage.getItem('groupName')) {
            this.groupName = localStorage.getItem('groupName');
        }
        if (localStorage.getItem('user')) {
            this.accountName = localStorage.getItem('user');
        }
        this.fetchUnReadAlarmLogNum();
        this.fetchBacklogNum();
        // 注册供外部组件调用的刷新未读通知方法
        Bus.$on('refreshUnReadNotice', () => {
            this.fetchUnReadAlarmLogNum();
        });
        // 注册供外部组件调用的刷新未处理待办事项方法
        Bus.$on('refreshBacklog', () => {
            this.fetchBacklogNum();
        });
        this.refreshOrgAndChain();
        this.fetchSystemConfig();
    },
    methods: {
        skip: function () {
            if (this.route) {
                this.$router.push(this.way);
            } else {
                this.$router.go(-1);
            }
        },
        signOut: function () {
            localStorage.removeItem('user');
            loginOut().then().catch();
            delCookie('JSESSIONID');
            delCookie('NODE_MGR_ACCOUNT_C');
            this.$router.push('/login');
        },
        changePassword: function () {
            this.changePasswordDialogVisible = true;
        },
        lookVersion: function () {
            this.versionInfoVisible = true
        },
        success: function (val) {
            this.changePasswordDialogVisible = false;
        },
        // 获取当前登录账号未读的通知消息总数
        fetchUnReadAlarmLogNum() {
            getUnReadAlarmLogNum().then(res => {
                if (res.data.code === 0) {
                    let num = res.data.data || 0;
                    this.unReadAlarmLogNum = num;
                } else {
                    this.unReadAlarmLogNum = 0;
                }
            });
        },
        // 获取当前登录账号未处理的待办事项总数
        fetchBacklogNum() {
            getBacklogCount().then(res => {
                if (res.data.code === 0) {
                    let num = res.data.totalCount || 0;
                    this.backlogNum = num;
                } else {
                    this.backlogNum = 0;
                }
            });
        },
        // 获取系统配置信息
        fetchSystemConfig() {
            this.versionChainmarker = this.$configOpt('chainMakerVersion');
            this.versionCompatible = this.$configOpt('chainMakerCompatibleVersion');
            this.versionCmsp = this.$configOpt('version');
        },
        // 刷新当前账号有链上身份的组织和订阅的应用链
        refreshOrgAndChain() {
            getOrgAndChain().then(res => {
                if (res.data.code === 0) {
                    let resData = res.data.data.chainUserList || [];
                    let chainIdentity = [], chainOrg = [];
                    resData.forEach(item => {
                        chainIdentity.push(String(item.chainId));
                        chainOrg.push(String(item.orgId));
                    });
                    localStorage.setItem('chainIdentity', chainIdentity);
                    localStorage.setItem('chainOrg', chainOrg);
                }
            });
        },
        toMessage() {
            router.push({path: '/message'});
            Bus.$emit('routing', '/message');
        },
        toBacklog() {
            router.push({path: '/backlog'});
            Bus.$emit('routing', '/backlog');
        }
    }
};
</script>

<style scoped>
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
.content-head-icon {
    color: #fff;
    font-weight: bold;
    cursor: pointer;
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
.content-head-version {
    color: #bbb;
}
.content-head-version-data {
    display: inline-block;
    padding-right: 10px;
}
.browse-user {
    text-align: center;
    text-decoration: none;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    color: #cfd7db;
}
.browse-user:hover {
    color: rgb(55, 238, 242);
}
.sign-out-wrapper {
    line-height: 32px;
    text-align: center;
}
.sign-out {
    cursor: pointer;
    color: #ed5454;
}
.change-password {
    color: #409eff;
    cursor: pointer;
}
.network-name {
    font-size: 12px;
    color: #ccd2dc;
    padding: 3px 0px;
    margin-right: 16px;
}
.select-network {
    color: #2d5f9e;
    cursor: default;
}
.content-head-network-link {
    text-decoration: none;
    outline: none;
    color: #cfd7db;
    padding-right: 15px;
    border-right: 1px solid #657d95;
    margin-right: 15px;
}
.content-head-network-link .link-item {
    color: #cfd7db;
    text-decoration: none;
    cursor: pointer;
}
.content-head-network-link .link-item:hover {
    color: rgb(55, 238, 242);
}
.content-head-network-text {
    text-decoration: none;
    outline: none;
    color: #cfd7db;
    margin-right: 15px;
}
.contant-head-name {
    position: relative;
    cursor: pointer;
}
.contant-head-name ul {
    position: absolute;
    width: 150%;
    left: -10px;
    top: 35px;
    background-color: #fff;
    color: #666;
    text-align: center;
    z-index: 9999999;
    box-shadow: 1px 4px 4px;
}
.contant-head-name ul li {
    width: 100%;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
}
.group-item {
    line-height: 32px;
    text-align: center;
    max-height: 200px;
    overflow-y: auto;
    position: relative;
}
.group-item-list {
    cursor: pointer;
}
.group-item-list:hover {
    color: #409eff;
}
.right-menu-item {
    padding: 0 20px;
}
.hover-effect {
    cursor: pointer;
}
.font-color-9da2ab {
    color: #9da2ab
}
.font-color-ccd2dc {
    color: #ccd2dc
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
.content-head-lang {
    position: absolute;
    right: 350px;
    top: 0px;
}
.version-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 28px;
    line-height: 28px;
}
.version-item:last-child {
    margin-bottom: 38px;
}
.version-item .title {
    width: 140px;
    text-align: right;
    font-size: 12px;
    color: #737a86;
}
.version-item .label {
    flex: 1;
    text-align: left;
    padding-left: 12px;
    font-size: 12px;
    color: #737a86;
}
.version-item .label .label-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 42px;
    height: 14px;
    padding: 2px; 
    font-size: 12px;
    color: #fff;
    border-radius: 2px;
    border-color: #409EFF;
    background-color: #409EFF;
}
.content-head-network .content-head-network-link >>> .el-badge__content {
    border: 0;
}
[class^='ext-icon'] {
    font-size: 15px;
    margin: 0 2px;
}
i {
    font-style: normal;
}
.dialog-wrapper >>> .el-dialog__title {
    font-size: 18px;
    color: #36393d;
    font-weight: bold;
    letter-spacing: 0.5px;
}
.dialog-wrapper >>> .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 0;
}
.dialog-wrapper >>> .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label::before {
    vertical-align: middle;
}
.dialog-wrapper >>> .el-form-item__label {
    font-size: 12px;
    color: #737a86;
}
.dialog-wrapper >>> .el-form-item {
    margin-bottom: 26px;
}
.dialog-wrapper >>> .el-form-item .el-select {
    width: 100%;
}
.dialog-wrapper >>> .el-dialog__footer {
    padding-top: 0;
}
.dialog-wrapper >>> .el-button {
    padding: 10px 20px;
}
.dialog-wrapper >>> .el-input__inner {
    height: 36px;
    line-height: 36px;
}
</style>
