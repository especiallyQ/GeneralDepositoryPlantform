"use strict"

/**
 * 长整形时间戳转换为字符串
 *
 * @param {number} val 长整形时间戳
 * @return {string} yyyy-MM-dd hh:mm:ss格式字符串
 */
export function getDate(val) {
    val = Number(val);
    let date = new Date(val);
    let Y = date.getFullYear();
    let M = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    let D = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    let h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    let m = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    let s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
}

/**
 * 长整形时间戳转换为精确到毫秒的字符串
 *
 * @param {number} val 长整形时间戳
 * @return {string} yyyy-MM-dd hh:mm:ss.ms格式字符串
 */
export function getDateToMs(val) {
    val = Number(val);
    let date = new Date(val);
    let Y = date.getFullYear();
    let M = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    let D = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    let h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    let m = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    let s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
    let ms = date.getMilliseconds() > 100 ? date.getMilliseconds() :
        (date.getMilliseconds() > 10 ? '0' + date.getMilliseconds() : '00' + date.getMilliseconds());
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s + '.' + ms;
}

/**
 * 处理请求参数
 *
 * @param {object} necessary 必需参数
 * @param {object} query 可选参数
 * @return {object} 请求参数
 */
export function reviseParam(necessary, query) {
    let params = arguments[0],
        querys = arguments[1],
        arr = [],
        str = '';
    for (let i in params) {
        arr.push(params[i])
    }
    str = arr.join('/');
    return { str, querys };
}

/**
 * 通过名称获取cookie
 *
 * @param {string} name cookie名称
 * @return {string} cookie内容
 */
export function getCookie(name) {
    let arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if (arr = document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}

/**
 * 设置cookie
 *
 * @param {string} c_name cookie名称
 * @param {string} value cookie内容
 * @param {number} expiredays 有效天数
 */
export function setCookie(c_name, value, expiredays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
};

/**
 * 删除指定名称的cookie
 *
 * @param {string} name 要删除cookie的名称
 */
export function delCookie(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null)
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
};

/**
 * 数值格式化
 *
 * @param {number} number 待格式化数值
 * @param {number} decimals 小数点后保留位数
 * @param {string} dec_point 小数点文本符号
 * @param {string} thousands 千位文本符号
 * @return {string} 格式化后的数值
 */
export function numberFormat(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    let n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.ceil(n * k) / k;
        };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    let re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, '$1' + sep + '$2');
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

/**
 * 判断是否为number类型
 *
 * @param {object} obj 待判断值
 * @return {boolean} 是number类型返回true,否则返回false
 */
export function isNumber(obj) {
    return typeof obj === 'number' && !isNaN(obj);
}

/**
 * 将数组中的重复值去掉并返回
 * 利用了Set中元素只会出现一次的特性
 *
 * @param {array} array 数组
 * @return {array} 无重复值的数组
 */
export function unique(array) {
    return Array.from(new Set(array));
}

/**
 * 将对象数组中指定属性值做为数组返回,且得到的数组中无重复值
 * 利用了对象属性名不可重复的特性
 *
 * @param {array} array 对象数组
 * @param {string} onlyKey 需要得到值的属性名
 * @return {array} 无重复值的数组
 */
export function uniqueWithField(array, onlyKey) {
    let result = {}, finalResult = [], oneKey = onlyKey;
    for (let i = 0; i < array.length; i++) {
        result[array[i][oneKey]] = array[i];
    }
    for (let key in result) {
        finalResult.push(result[key]);
    }
    return finalResult;
}

/**
 * 将对象数组中的对象按照指定的属性去重
 *
 * @param {array} array 对象数组
 * @param {string} field 用于判断可能存在重复值的对象属性
 * @return {array} 根据对象属性去掉重复属性值后的数组
 */
export function uniqueByField(array, field) {
    return array.reduce((pre, cur) => pre.some(item => item[field] == cur[field]) ? pre : [...pre, cur], []);
}

/**
 * 判断字符串是否为JSON格式
 *
 * @param {string} str 待判断的字符串
 * @return {boolean} 为JSON格式返回true,否则返回false
 */
export function isJson(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
}

/**
 * 版本号对比
 * 
 * @param {string} v1 版本号1
 * @param {string} v2 版本号2
 * @return {boolean} 版本号2比版本号1新的话返回true,否则返回false
 */
export function validateVersion(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    let len = Math.max(v1.length, v2.length);

    while (v1.length < len) v1.push('0');
    while (v2.length < len) v2.push('0');

    for (let i = 0; i < len; i++) {
        let num1 = parseInt(v1[i]);
        let num2 = parseInt(v2[i]);

        if (num1 < num2) {
            return true;
        } else if (num1 > num2) {
            return false;
        }
    }
    return false;
}

/**
 * 数组元素判重
 * 利用了对象属性名不可重复的特性
 *
 * @param {array} arr 数组
 * @return {boolean} 数组有重复元素返回true,否则返回false
 */
export function isArrayRepeat(arr) {
    let hash = {};
    for (let i in arr) {
        if (hash[arr[i]]) {
            return true;
        }
        hash[arr[i]] = true;
    }
    return false;
}

/**
 * Earth Tones是一组被定义好的网页安全颜色集合
 *
 * @return {array} 网页安全色集合
 */
export function earthTones() {
    return [
        '#336699', '#33CC99', '#666699', '#996699', '#999999', '#333399', '#339933',
        '#3399CC', '#663333', '#996633', '#99CCCC', '#CC6666', '#CCCC33', '#333366',
        '#336633', '#33CCCC', '#663366', '#669966', '#993399', '#999966', '#CC3366',
        '#CCCCCC', '#3333CC', '#336666', '#66CC33', '#993333', '#99CC99', '#CC66CC'

    ];
}

/**
 * 从指定范围内获取随机数
 *
 * @param {number} min 最小取值范围,可选参数,默认为0
 * @param {number} max 最大取值范围
 * @return {number} 范围内随机数值
 */
export function random(min, max) {
    if (arguments.length < 2) {
        max = min;
        min = 0;
    }

    if (min > max) {
        let hold = max;
        max = min;
        min = hold;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 判断对象是否为空
 *
 * @param {Object} obj 传入对象
 * @return {Boolean} 对象为空返回true，否则返回false
 */
export function objectIsEmpty(obj) {
    if (Object.prototype.toString.call(obj) !== "[object Object]") {
        throw new Error("传入数据类型不匹配，需传入对象类型数据")
    }

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false
        }
    }
    return true
}

/**
 * 生成随机rgb颜色
 *
 * @return {String} 返回rgb字符串
 */
export function rgb() {
    let r = Math.floor(Math.random() * 256)
    let g = Math.floor(Math.random() * 256)
    let b = Math.floor(Math.random() * 256)

    return `rgb(${r},${g},${b})`
}


/**
 * 将JSON数据转换为FormData，允许传入多层嵌套对象
 * 
 * @param {Object} obj 传入需要转换的json数据
 * @return {String} 返回FormData数据
 */
export function JSONSwitchFormData(JSONData) {
    let formData = new FormData()
    
    function switchFn(JSONData) {
        Object.keys(JSONData).forEach((key) => {
            if(Array.isArray(JSONData[key])){
                JSONData[key].forEach((val) => {
                    formData.append(key,val)
                })
            }else if(Object.prototype.toString.call(JSONData[key]) == '[object Object]'){
                switchFn(JSONData[key])
            }else {
                formData.set(key, JSONData[key])
            }
        })
    }
    
    switchFn(JSONData)
    return formData
}