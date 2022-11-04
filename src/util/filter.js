import Vue from 'vue'
/**
 * 截取字符串前8位
 */
Vue.filter('splitString', function (value) {
    return value.substring(0, 8)
});
/**
 * 截取字符串前6位
 */
Vue.filter('splitString6', function (value) {
    return value.substring(0, 6)
});
/**
 * 截取字符串前25位
 */
Vue.filter('splitString_0_25', function (value) {
    return value.substring(0, 25)
});

Vue.filter('formatErrorMessage', function (value) {
    try {
        return `${value.formattedMessage} `
    } catch (error) {
        console.warn(error);
    }
});