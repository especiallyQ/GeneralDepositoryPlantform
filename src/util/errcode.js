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
    "202002": {
        en: "The account or password is incorrect",
        zh: "账号或密码错误"
    },
    "202003": {
        en: "invalid token",
        zh: "无效的token"
    },
    "202004": {
        en: "token expire",
        zh: "身份认证过期"
    },
    "202026": {
        en: "account info already exists",
        zh: "账号名重复"
    },
    "202030": {
        en: "password error",
        zh: "原密码错误"
    },
    "202045": {
        en: "",
        zh: "新密码不能与原密码相同"
    },
    "302000": {
        en: "user not logged in",
        zh: "未登录的用户"
    },
    "400001": {
        en: "duplicate config",
        zh: "重复配置"
    },
    "400002": {
        en: "params incorrect, can not get chain message",
        zh: "输入参数错误，无法获得应用链信息"
    },
    "400003": {
        en: "params incorrect, can not get chain message",
        zh: "输入参数错误，无法获得存证合约信息"
    },
    "400004": {
        en: "params incorrect, can not get chain message",
        zh: "该存证模板已冻结，请解冻后操作"
    },
    "400005": {
        en: "",
        zh: "存证模板名称已经存在"
    },
    "400006": {
        en: "file is null",
        zh: "请上传文件"
    },
    "400007": {
        en: "",
        zh: "CMSP服务地址不能为空"
    },
    "400008": {
        en: "",
        zh: "CMSP管理员账号不能为空"
    },
    "400009": {
        en: "",
        zh: "CMSP管理员密码不能为空"
    },
    "400010": {
        en: "",
        zh: "应用链名称不能为空"
    },
    "400011": {
        en: "",
        zh: "数据源下已创建了存证模板，不可编辑"
    },
    "402001": {
        zh: "当前存证信息已被编辑，正在等待管理员审批，暂时无法再次编辑"
    },
    "402002": {
        zh: "当前内容并未修改"
    },
    "402003": {
        zh: "当前字典下已创建了存证模板，不可删除"
    },
    "402005": {
        zh: "数据异常，整数数据超出可表示范围"
    },
    "402006": {
        zh: "字典内容过长，字符长度在1-20之间"
    },
    "402007": {
        zh: "存证模板绑定的数据源不存在，该模板无法解冻"
    },
    "700001": {
        en: "",
        zh: "当前文件与链上存证文件不同"
    },
    "700002": {
        en: "",
        zh: "当前文件与链上存证文件重复"
    },
    "700003": {
        en: "",
        zh: "数据凭证错误"
    }
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
