import Vue from 'vue';
import promise from 'es6-promise';
promise.polyfill();
import App from './App.vue';
/* 路由 */
import router from './router';
/* element-ui */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/* 解决v-html可能导致的XSS漏洞,使用v-dompurify-html替代*/
import VueDOMPurifyHTML from 'vue-dompurify-html';
/* cookies工具 */
// import Cookies from 'js-cookie';
// import { getCookie, setCookie, delCookie } from './util/util';
/* 标准图标库 */
import '@/assets/icon/standard/iconfont.css';
import '@/assets/icon/standard/iconfont.js';
import '@/assets/icon/standard/iconfont_cmsp.css';
/* 扩展图标库 */
import '@/assets/icon/extension/iconfont.css';
import '@/assets/icon/extension/iconfont.js';
import '@/assets/icon/extension/iconfont_ext.css';
/* 公共样式表 */
import '@/assets/css/common.css';
/* 消息弹窗 */
import { message } from '@/util/message.js';
/* 错误码 */
import errcode from './util/errcode';
import { chooseLang } from './util/errcode.js';

Vue.use(router);
Vue.use(ElementUI, {
  size: 'medium'
});
Vue.use(VueDOMPurifyHTML);
Vue.config.productionTip = false
// Vue.prototype.getCookie = getCookie;
// Vue.prototype.setCookie = setCookie;
// Vue.prototype.delCookie = delCookie;
Vue.prototype.$message = message;
Vue.prototype.errcode = errcode;
Vue.prototype.$chooseLang = chooseLang;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
