import Vue from 'vue';
import Router from 'vue-router';

const Home = () => import('@/views/home')
const Main = () => import('@/views/index/main.vue')
const DataOverview = () => import("@/views/dataOverview/dataOverview.vue")
const Depository = () => import('@/views/depository/depository.vue')
const DepositDetails = () => import('@/views/depository/depositDetails.vue')
const DepositoryHis = () => import('@/views/depository/depositoryHis.vue')
const ApprovalManagement = () => import('@/views/approvalManagement/approvalManagement.vue')
const userManagement = () => import('@/views/userManagement/index.vue');
const systemConfiguration = () => import('@/views/systemConfiguration/index.vue')
const dictionary = () => import('@/views/dictionary/index.vue')

Vue.use(Router);
const routes = [{
    path: '/',
    nameKey: 'main',
    redirect: '/main'
}, {
    path: '/home',
    name: 'home',
    nameKey: 'home',
    component: Home
}, {
    path: '/main',
    name: 'data',
    nameKey: 'data',
    leaf: true,
    iconCls: 'ext-icon-regulatory sidebar-icon',
    component: Main,
    children: [
        {
            path: '/dataOverview', component: DataOverview, name: 'dataOverview', nameKey: 'dataOverview', meta: { requireAuth: true }
        }
    ]
},
{
    path: '/main',
    component: Main,
    name: 'main',
    nameKey: 'userManagement',
    leaf: false,
    menuShow: true,
    iconCls: 'cmsp-icon-yonghuliang sidebar-icon',
    children: [{
        path: '/userManagement', component: userManagement, name: 'userManagement', nameKey: 'userManagement', menuShow: true, meta: { requireAuth: false }
    },
    ]
},
{
    path: '/main',
    name: 'depository',
    nameKey: 'depositoryTitle',
    leaf: true,
    iconCls: 'ext-icon-baocun sidebar-icon',
    component: Main,
    children: [
        {
            path: '/depository', component: Depository, name: 'depositoryList', nameKey: 'depositoryTitle', meta: { requireAuth: true }
        },
        {
            path: '/depositDetails/:rowId', component: DepositDetails, name: 'DepositDetails', nameKey: 'DepositDetails', meta: { requireAuth: true }
        },
        {
            path: '/DepositoryHis/:id/:rowId', component: DepositoryHis, name: 'DepositoryHis', nameKey: 'DepositoryHis', meta: { requireAuth: true }
        },
    ]

},
{
    path: '/main',
    name: '',
    nameKey: 'dictionary',
    leaf: true,
    iconCls: 'cmsp-icon-jiedian sidebar-icon',
    component: Main,
    children: [
        {
            path: '/dictionary', component: dictionary, name: 'dictionary', nameKey: 'dictionary', meta: { requireAuth: true }
        }
    ]
},
{
    path: '/main',
    name: 'approval',
    nameKey: 'approvalManagement',
    leaf: true,
    iconCls: 'cmsp-icon-qukuailian4 sidebar-icon',
    component: Main,
    children: [
        {
            path: '/approvalManagement', component: ApprovalManagement, name: 'ApprovalManagement', nameKey: 'approvalManagement', meta: { requireAuth: true }
        },
    ]

},
{
    path: '/main',
    name: 'system',
    nameKey: 'systemConfiguration',
    leaf: true,
    iconCls: 'ext-icon-monitor  sidebar-icon',
    component: Main,
    children: [
        {
            path: '/systemConfiguration', component: systemConfiguration, name: 'systemConfiguration', nameKey: 'systemConfiguration', meta: { requireAuth: true }
        }
    ]

},

];

const router = new Router({
    // mode: 'history',
    routes
});

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch(err => err);
}

export default router
