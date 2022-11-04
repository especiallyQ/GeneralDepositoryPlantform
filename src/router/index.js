import Vue from 'vue';
import Router from 'vue-router';

const Home = () => import('@/views/home')
const Main = () => import('@/views/index/main.vue')
const Depository = () => import('../views/depository/depository.vue')


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
    name: 'main',
    nameKey: 'depositoryTitle',
    leaf: true,
    iconCls: 'ext-icon-regulatory sidebar-icon',
    component: Main,
    children: [
        {
            path: '/depository', component: Depository, name: 'depositoryList', nameKey: 'depositoryTitle', meta: { requireAuth: true }
        }
    ]

}];

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
