import Axios from 'axios'
import router from '../router'
let axiosIns = Axios.create({
    timeout: 60 * 1000
});
axiosIns.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.responseType = 'json';
axiosIns.defaults.withCredentials = true;

// http response interceptor
// axiosIns.interceptors.request.use(
//     config => {
//         const token = localStorage.getItem("token")
//         if (token) {
//             config.headers["token"] = token
//         }

//         return config
//     },
//     err => {
//         return Promise.reject(err.msg || err.message)
//     }
// )
axiosIns.interceptors.response.use(
    response => {
        if (response.data && response.data.code === 302000) {
            router.push({
                path: '/home',
                query: { redirect: router.currentRoute.fullPath }
            })
        }
        if (response.data && (response.data.code === 202003 || response.data.code === 202004)) {
            router.push({
                path: "/home"
            })
        }
        return response;
    },
    error => {
        if (error.message.includes('timeout')) {
            error.data = '请求超时'
        }
        return Promise.reject(error)
    });

export default {
    axiosIns
}
/**post
 * @param options
 * @return {Promise}
 */
export function post(options) {
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};
/**get
 * @param options
 * @return {Promise}
 */
export function get(options) {
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};

/**patch
 * @param options
 * @return {Promise}
 */
export function patch(options) {
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};
/**put
 * @param options
 * @return {Promise}
 */
export function put(options) {
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};
/**delete
 * @param options
 * @return {Promise}
 */
export function deleted(options) {
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};
