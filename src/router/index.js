/*
 * @Author: chengjiang_09
 * @Date: 2022-10-10 15:37:23
 * @LastEditTime: 2022-10-20 09:32:01
 */
import Vue from 'vue';
import Router from 'vue-router';

const login = resolve => require(['@/views/login/login'], resolve);
const main = resolve => require(['@/views/index/index'], resolve);
const home = resolve => require(['@/views/home/home'], resolve);
const accountInfo = resolve => require(['@/views/account/accountInfo'], resolve);
const groupInfo = resolve => require(['@/views/account/groupInfo'], resolve);
const message = resolve => require(['@/views/noticeCenter/index'], resolve);
const backlog = resolve => require(['@/views/backlog/index'], resolve);
const contractTemplate = resolve => require(['@/views/contract/index'], resolve);
const editorView = resolve => require(['@/views/contract/editorView.vue'], resolve)
const depository = resolve => require(['@/views/depository/depository'], resolve)
const depositoryHis = resolve => require(['@/views/depository/depositoryHis'], resolve)

Vue.use(Router);
const routes = [{
    path: '/',
    nameKey: 'main',
    redirect: '/main'
}, {
    path: '/login',
    nameKey: 'login',
    name: 'login',
    component: login
}, {
    path: '/main',
    name: 'main',
    leaf: true,
    nameKey: 'dataOverview',
    menuShow: true,
    iconCls: 'ext-icon-regulatory sidebar-icon',
    component: main,
    children: [{
        path: '/home', component: home, name: 'dataOverview', nameKey: 'dataOverview', menuShow: true, meta: { requireAuth: true }
    }]
}, {
    path: '/',
    component: main,
    name: 'accountManagement',
    nameKey: 'accountManagement',
    leaf: false,
    menuShow: true,
    iconCls: 'cmsp-icon-yonghuliang sidebar-icon',
    children: [{
        path: '/accountInfo', component: accountInfo, name: 'accountMgmt', nameKey: 'accountManagement', menuShow: true, meta: { requireAuth: true }
    }, {
        path: '/groupInfo', component: groupInfo, name: 'groupMgmt', nameKey: 'groupManagement', menuShow: true, meta: { requireAuth: true }
    }]
}, {
    path: '/',
    component: main,
    name: 'main',
    nameKey: 'contractTemplate',
    leaf: true,
    menuShow: true,
    iconCls: 'cmsp-icon-qukuailian4 sidebar-icon',
    children: [{
        path: '/contractTemplate',
        component: contractTemplate,
        name: 'contractTemplate',
        nameKey: 'contractTemplate',
        menuShow: true,
        meta: { requireAuth: false },
    }, {
        path: '/editor/:templateId/:versionId/:permissionId',
        component: editorView,
        name: 'cmspEditor',
        nameKey: 'cmspEditor',
        menuShow: true,
        meta: { requireAuth: false }
    }]
}, {
    path: '/',
    name: 'depository',
    nameKey: 'depositoryTitle',
    leaf: true,
    menuShow: true,
    iconCls: 'ext-icon-baocun sidebar-icon',
    component: main,
    children: [
        {
            path: '/depository', component: depository, name: 'depositoryList', nameKey: 'depositoryTitle', menuShow: true, meta: { requireAuth: true },
        },
        {
            path: '/depositoryHis/:appChainId/:contractNameId/:templateId/:id', component: depositoryHis, name: 'depositoryHis', nameKey: 'depositoryTitle', menuShow: true, meta: { requireAuth: true },
        },
    ]
}, {
    path: '/',
    component: main,
    name: 'noticeCenter',
    nameKey: 'noticeCenter',
    leaf: false,
    menuShow: true,
    iconCls: 'ext-icon-send sidebar-icon',
    children: [{
        path: '/message', component: message, name: 'message', nameKey: 'message', menuShow: true, meta: { requireAuth: true }
    }, {
        path: '/backlog', component: backlog, name: 'backlog', nameKey: 'backlog', menuShow: true, meta: { requireAuth: true }
    }]
},];

const router = new Router({
    routes
});
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch(err => err);
}

export default router
