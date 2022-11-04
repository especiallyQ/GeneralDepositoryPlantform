let errCode = {
    "102000": {
        en: "General Depository Plantform system exception",
        zh: "General Depository Plantform系统异常"
    },
    "102001": {
        en: "",
        zh: "获取校验码失败"
    },
    "202000": {
        en: "CheckCode is null",
        zh: "校验码为空"
    },
    "202001": {
        en: "invalid checkCode",
        zh: "无效的校验码"
    },
    "202002":{
        en: "The account or password is incorrect",
        zh: "账号或密码错误"
    },
    "202003": {
        en: "invalid token",
        zh: "无效的token"
    },
    "202004": {
        en: "token expire",
        zh: "token过期"
    },
}

export default errCode;

export function chooseLang(code, value) {
    // let lang = localStorage.getItem('lang');
    let message = errCode[code]['zh'];
    if (value) {
        let oldMessage;
        let arry = message.split('/');
        oldMessage = arry[0] + value + arry[2];
        return oldMessage;
    } else {
        return message;
    }
}
