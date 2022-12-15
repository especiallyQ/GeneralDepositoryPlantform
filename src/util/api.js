import url from './url';
import { post, get, patch, put, deleted } from './http';
import { reviseParam } from './util';


// token测试
export function checkToken() {
    return get({
        url: `${url.ORG_LIST}/config/main`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}


// 获取验证码
export function getPictureCheckCode() {
    return get({
        url: `${url.ORG_LIST}/pictureCheckCode`,
        method: 'get'
    })
}

// 登录
export function login(data, code, token) {
    return post({
        url: `${url.ORG_LIST}/account/login?checkCode=${code}`,
        method: 'post',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': token
        }
    })
}
//退出
export function loginOut() {
    return get({
        url: `${url.ORG_LIST}/account/logout`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

//存证模板获取下拉框数据
export function getDepositoryList() {
    return get({
        url: `${url.ORG_LIST}/getDepositoryList`,
        method: 'get',
        // headers: {
        //     AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        // }
    })
}
//数据验证
export function dataVerify(data) {
    return post({
        url: `${url.ORG_LIST}/dataVerify`,
        method: 'post',
        data: data,
    })
}

//文件验证
export function fileVerify(data) {
    return post({
        url: `${url.ORG_LIST}/fileVerify`,
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}


export function getFileHash(data,uploadProgress) {
    return post({
        url: `${url.ORG_LIST}/getFileHash`,
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: uploadProgress
        // onUploadProgress: progressEvent => {
        //     console.log(Math.round((progressEvent.loaded / progressEvent.total) * 10000) / 100.0);
        // },
    })
}





// 账号相关接口-----------------------------

//账号管理初始化 
export function accountList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/account/accountList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}
//新建账号
export function createAccount(data) {
    return post({
        url: `${url.ORG_LIST}/account/createAccount`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

//编辑账号
export function updateAccount(data) {
    return put({
        url: `${url.ORG_LIST}/account/updateAccount`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}
//删除账号
export function deleteAccountInfo(data) {
    return deleted({
        url: `${url.ORG_LIST}/account/deleteAccount/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

//修改密码
export function resetPassword(data) {
    return put({
        url: `${url.ORG_LIST}/account/updatePassword/` + `${data.oldAccountPwd}/${data.newAccountPwd}`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}
//重置密码
export function resetAccountPassword(data) {
    return put({
        url: `${url.ORG_LIST}/account/resetPassword/` + `${data.accountId}/${data.accountName}`,
        method: 'put',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

//字典管理相关接口 =-----------------------------------

//字典管理初始化 
export function dictionaryList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/dictionary/getDictionaryList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}
//新建字典
export function addDictionary(data) {
    return post({
        url: `${url.ORG_LIST}/dictionary/addDictionary`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            // 'Content-Type': 'multipart/form-data'
        }
    })
}
//编辑字典
export function updateDictionary(data) {
    return put({
        url: `${url.ORG_LIST}/dictionary/updateDictionary`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

//删除字典
export function delDictionary(data) {
    return deleted({
        url: `${url.ORG_LIST}/dictionary/deleteDictionary/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}
// 通过Id拿到字典模块数据
export function getDictionaryById(data) {
    return get({
        url: `${url.ORG_LIST}/dictionary/getDictionary/${data}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}
//存证管理模块-新建存证内容-自定义字典-内容
export function dicictionaryName() {
    return post({
        url: `${url.ORG_LIST}/dictionary/getDictionaryName`,
        method: 'post',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            // 'Content-Type': 'multipart/form-data'
        }
    })
}



//系统配置相关接口-----------------------------


//数据源列表初始化
export function dataSourceList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/system/getDataList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}
export function dataSourceListById(data) {
    return get({
        url: `${url.ORG_LIST}/system/initEditData/${data}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}


//新建----获取存证合约列表下拉框
export function ContractList(data) {
    return get({
        url: `${url.ORG_LIST}/system/getContractList/${data}`,
        method: 'get',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

//新建----获取应用链列表下拉框
export function ChainList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/system/getChainList/` +
            `${data.serverAccount}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}
//新建----配置系统
export function bindAccount(data) {
    return post({
        url: `${url.ORG_LIST}/system/bindAccount`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'multipart/form-data'
        }
    })
}


// 存证相关接口-----------------------------

// 存证管理-获取存证模板创建者名称
export function getDepositoryTemplateCreator() {
    return get({
        url: `${url.ORG_LIST}/account/getSelectAccountList`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证管理-获取存证列表数据
export function getTemplateListData(currentPage, pageSize, creatorId, templateName) {
    return get({
        url: `${url.ORG_LIST}/depository/getDepositoryTemplateList/${currentPage}/${pageSize}?creatorId=${creatorId}&depositoryTemplateName=${templateName}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
        }
    })
}

// 存证信息-保存存证模板
export function saveDepoTemplate(data) {
    return post({
        url: `${url.ORG_LIST}/depository/createDepositoryTemplate`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证管理-获取存证模板编辑信息
export function getEditDepositoryTemplate(templateId) {
    return get({
        url: `${url.ORG_LIST}/depository/getDepositoryTemplateById/${templateId}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-编辑存证模板
export function editDepoTemplate(data) {
    return put({
        url: `${url.ORG_LIST}/depository/updateDepositoryTemplate`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-冻结存证模板
export function freezeTemplate(templateId) {
    return put({
        url: `${url.ORG_LIST}/depository/freezeDepositoryTemplate/${templateId}`,
        method: "put",
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-解冻存证模板
export function thawTemplate(templateId) {
    return put({
        url: `${url.ORG_LIST}/depository/unFreezeDepositoryTemplate/${templateId}`,
        method: "put",
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-获取模板上方详情信息
export function getTemplateDetailsData(id) {
    return get({
        url: `${url.ORG_LIST}/depository/getDetails/${id}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-获取模板下方列表数据
export function getTemplateDetailsListData(depositoryTemplateId, pageNo, pageSize) {
    return get({
        url: `${url.ORG_LIST}/depository/getDepositoryList/${depositoryTemplateId}/${pageNo}/${pageSize}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-获取录入存证参数信息
export function getInitAddDepository(templateId) {
    return get({
        url: `${url.ORG_LIST}/depository/initAddDepository/${templateId}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}


// 存证信息-录入存证信息
export function saveDepositoryContent(data) {
    return post({
        url: `${url.ORG_LIST}/depository/addDepository`,
        method: 'post',
        data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 存证信息-获取数据校验信息和编辑存证原始数据
export function getCheckDataMessage(depositoryId) {
    return get({
        url: `${url.ORG_LIST}/depository/initDepositoryParam/${depositoryId}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-存证内容校验
export function validateDepositoryContent(data) {
    return post({
        url: `${url.ORG_LIST}/depository/verifyDepository`,
        method: 'post',
        data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 存证信息-编辑存证信息列表
export function editDepoMsgList(data) {
    return put({
        url: `${url.ORG_LIST}/depository/updateDepository`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-获取存证历史信息
export function getDepositoryHistoryMessage(depositoryId, pageNo, pageSize) {
    return get({

        url: `${url.ORG_LIST}/history/getHistoryList/${depositoryId}/${pageNo}/${pageSize}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}



// 审批管理相关-----------------------------
// 审批管理-获取审批人下拉列表数据
export function getApproverList() {
    return get({
        url: `${url.ORG_LIST}/approval/getApproverList`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 审批管理-获取审批事项列表数据
export function getApprovalList(pageNo, pageSize, approver, submitter, status) {
    return get({
        url: `${url.ORG_LIST}/approval/getApprovalList/${pageNo}/${pageSize}/${status}?operatorId=${approver}&submitter=${submitter}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
        }
    })
}

// 审批管理-获取审批Dialog数据
export function getApprovalComparisonData(id) {
    return get({
        url: `${url.ORG_LIST}/approval/getApprovalFormData/${id}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
        }
    })
}

// 审批管理-提交通过审批结果
export function submitApprovalSuccess(id) {
    return put({
        url: `${url.ORG_LIST}/approval/acceptApproval/${id}`,
        method: 'put',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
        }
    })
}
// 审批管理-提交拒绝审批结果
export function submitApprovalReject(id) {
    return put({
        url: `${url.ORG_LIST}/approval/refusedApproval/${id}`,
        method: 'put',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
        }
    })
}





























// 退出
// export function loginOut() {
//     return get({
//         url: `${url.ORG_LIST}/account/logout`,
//         method: 'get',
//         headers: {
//             AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
//         }
//     })
// }


// 修改密码
// export function resetPassword(data) {
//     return put({
//         url: `${url.ORG_LIST}/account/passwordUpdate`,
//         method: 'put',
//         data: data,
//         headers: {
//             AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
//         }
//     })
// }



// 获取当前账号有链上身份的组织和订阅的应用链
export function getOrgAndChain() {
    return get({
        url: `${url.ORG_LIST}/config/currentChainUserList`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
        }
    })
}


// 数据概览-关键监控指标
export function getChartData() {
    return get({
        url: `${url.ORG_LIST}/main/transactionLine`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 数据概览-基本统计指标
export function getNetworkStatistics() {
    return get({
        url: `${url.ORG_LIST}/main/getLabels`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 数据概览-节点列表
export function getNodeList() {
    return get({
        url: `${url.ORG_LIST}/main/nodelist`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 数据概览-区块列表
export function getBlockList() {
    return get({
        url: `${url.ORG_LIST}/main/blockList`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 数据概览-交易列表
export function getTransactionList() {
    return get({
        url: `${url.ORG_LIST}/main/transactionList`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取合约列表
export function getContractList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/contract/listContract/` +
            `${data.chainId}/${data.pageNumber}/${data.pageSize}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 检查合约名称
export function checkContractName(data) {
    const params = reviseParam(data);
    return post({
        url: `${url.ORG_LIST}/contract/checkContractName`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'application/json'
        }
    })
}

// 部署合约
export function deployContract(data) {
    return post({
        url: `${url.ORG_LIST}/contract/deployContract`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'application/json'
        }
    })
}

// 当前组织所订阅的应用链是否可以部署合约
export function isDeployable(chainId) {
    return get({
        url: `${url.ORG_LIST}/contract/getDeployBtnStatus/${chainId}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 升级合约
export function updateContract(data) {
    return post({
        url: `${url.ORG_LIST}/contract/updateContract`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 吊销合约
export function revokeContract(data) {
    return post({
        url: `${url.ORG_LIST}/contract/revokeContract`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 调用合约
export function invokeContractMedhod(data) {
    return post({
        url: `${url.ORG_LIST}/contract/invokeContract`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 删除失败合约
export function deleteContract(data) {
    return deleted({
        url: `${url.ORG_LIST}/contract/deleteContract/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 新建账号
export function creatAccountInfo(data) {
    return post({
        url: `${url.ORG_LIST}/account/accountInfo`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 编辑账号
export function modifyAccountInfo(data) {
    return put({
        url: `${url.ORG_LIST}/account/accountInfo`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 批量编辑账号(用于批量变更账号群组)
export function batchModifyAccountInfo(data) {
    return put({
        url: `${url.ORG_LIST}/account/batchUpdateAccountInfo/accountInfo`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 删除账号
// export function deleteAccountInfo(data) {
//     return deleted({
//         url: `${url.ORG_LIST}/account/${data}`,
//         method: 'delete',
//         headers: {
//             AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
//         }
//     })
// }

// 批量删除账号
export function batchDeleteAccountInfo(data) {
    return deleted({
        url: `${url.ORG_LIST}/account/batchDeleteAccount/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 重置密码
// export function resetAccountPassword(data) {
//     return put({
//         url: `${url.ORG_LIST}/account/passwordReset/${data}`,
//         method: 'put',
//         data: data,
//         headers: {
//             AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
//         }
//     })
// }

// 批量重置密码
export function batchResetAccountPassword(data) {
    return put({
        url: `${url.ORG_LIST}/account/batchPasswordReset/${data}`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取账号类型列表
export function accountTypeList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/accountType/accountTypeList${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取账号列表
// export function accountList(data, list) {
//     const params = reviseParam(data, {});
//     return post({
//         url: `${url.ORG_LIST}/account/accountList/${params.str}`,
//         method: 'post',
//         data: list,
//         headers: {
//             AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
//         }
//     })
// }

// contract path list
export function getContractPathList(data) {
    return post({
        url: `${url.ORG_LIST}/contract/contractPath/list/${data}`,
        method: 'post',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 合约模板列表查询
export function queryContractTemplateList(data, list) {
    const params = reviseParam(data, {});
    return post({
        url: `${url.ORG_LIST}/contracttemplate/templatelist/${params.str}`,
        method: 'post',
        data: list,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 合约模板新增
export function addContractTemplate(data) {
    return post({
        url: `${url.ORG_LIST}/contracttemplate/addTemplateInfo`,
        method: 'post',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约模板编辑
export function modifyContractTemplate(data) {
    return put({
        url: `${url.ORG_LIST}/contracttemplate/updateTemplateInfo`,
        method: 'put',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约模板删除
export function deleteContractTemplate(data) {
    return deleted({
        url: `${url.ORG_LIST}/contracttemplate/deleteTemplateInfo/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 获取合约模板版本列表
export function queryContractTemplateVersionList(data) {
    return get({
        url: `${url.ORG_LIST}/contracttemplate/templateVersionList/`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 新增合约模板版本信息
export function addContractTemplateVersion(data) {
    return post({
        url: `${url.ORG_LIST}/contracttemplate/addTemplateVersion`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'multipart/form-data'
        }
    });
}

// 合约模板编辑
export function modifyContractTemplateVersion(data) {
    return post({
        url: `${url.ORG_LIST}/contracttemplate/updateTemplateVersion`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'multipart/form-data'
        }
    });
}

// 拷贝合约模板版本信息
export function copyContractTemplateVersion(data) {
    return post({
        url: `${url.ORG_LIST}/contracttemplate/copyTemplateVersion`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'multipart/form-data'
        }
    });
}

// 合约模板删除
export function deleteContractTemplateVersion(data) {
    return deleted({
        url: `${url.ORG_LIST}/contracttemplate/deleteTemplateVersion/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 批量合约模板删除
export function batchDeleteContractTemplateVersion(data) {
    return deleted({
        url: `${url.ORG_LIST}/contracttemplate/batchDeleteTemplateVersion/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约模板下载
export function downloadContractTemplateVersion(vid) {
    return get({
        url: `${url.ORG_LIST}/contracttemplate/downloadContractTemplateVersion/${vid}`,
        method: 'get',
        responseType: 'blob',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 获取账号群组树
export function fetchAccountGroupTree(data) {
    return get({
        url: `${url.ORG_LIST}/accountGroup/accountGroupList/${data}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 新增群组
export function addAccountGroup(data) {
    return post({
        url: `${url.ORG_LIST}/accountGroup/addAccountGroup`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 编辑群组
export function updateAccountGroup(data) {
    return put({
        url: `${url.ORG_LIST}/accountGroup/updateAccountGroup`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 删除群组
export function deleteAccountGroup(data, list) {
    const params = reviseParam(data, list);
    return deleted({
        url: `${url.ORG_LIST}/accountGroup/deleteAccountGroup/${params.str}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 获取链上组织列表
export function chainOrgList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/org/chainOrgList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}


// 编辑链上组织
export function updateChainOrg(data) {
    return put({
        url: `${url.ORG_LIST}/org/chainOrgInfo`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'multipart/form-data'
        }
    })
}


// 组织详情-获取组织信息
export function getChainOrgDetail(chainOrgId) {
    return get({
        url: `${url.ORG_LIST}/orgDetail/getOrgDetail/` +
            chainOrgId,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

/**
 * 组织详情-证书查看
 *   certType： 1组织证书，2节点证书，3用户证书
 *   id：对应对象的ID
 */
export function viewChainOrgCert(data) {
    return get({
        url: `${url.ORG_LIST}/orgDetail/viewCert/${data.certType}/${data.id}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 组织详情-公钥查看
export function viewChainOrgKey(data) {
    let params = reviseParam(data, {});
    return get({
        url: `${url.ORG_LIST}/orgDetail/pwk/viewPwk/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

/**
 * 组织详情-证书下载
 *   certType： 1组织证书，2节点证书，3用户证书
 *   id：对应对象的ID
 */
export function downloadChainOrgCert(data) {
    return get({
        url: `${url.ORG_LIST}/orgDetail/downloadCert/` +
            `${data.certType}/${data.id}`,
        method: 'get',
        responseType: 'blob',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}
// 组织详情-公钥下载
export function downloadChainOrgKey(data) {
    let params = reviseParam(data, {});
    return get({
        url: `${url.ORG_LIST}/orgDetail/pwk/downloadPwk/${params.str}`,
        method: 'get',
        responseType: 'blob',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 组织详情-证书延期
export function renewalChainOrgCert(data) {
    return get({
        url: `${url.ORG_LIST}/orgDetail/renewCert/${data.orgId}/${data.certSn}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 组织详情-节点列表
export function getChainOrgNodeList(data) {
    return get({
        url: `${url.ORG_LIST}/orgDetail/getOrgNodeList/` +
            `${data.pageNumber}/${data.pageSize}/${data.id}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}


// 组织详情-节点修改
export function modifyChainOrgNode(data) {
    return put({
        url: `${url.ORG_LIST}/orgDetail/updateOrgNode`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'multipart/form-data'
        }
    });
}


// 组织详情-链上用户列表
export function getChainOrgUserList(data) {
    return get({
        url: `${url.ORG_LIST}/orgDetail/getOrgUserList/` +
            `${data.pageNumber}/${data.pageSize}/${data.id}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}


// 组织详情-链上用户修改
export function modifyChainOrgUser(data) {
    return put({
        url: `${url.ORG_LIST}/orgDetail/updateOrgUser`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'multipart/form-data'
        }
    });
}



// 获取应用链列表
export function getAppChainList(data, list) {
    const params = reviseParam(data, {});
    return post({
        url: `${url.ORG_LIST}/appchain/appChainList/${params.str}`,
        method: 'post',
        data: list,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 应用链管理-订阅应用链
export function subscribeAppChain(data) {
    return post({
        url: `${url.ORG_LIST}/chainSubscribe/chainSubscribeInfo`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 应用链管理-退订应用链
export function unSubscribeAppChain(data) {
    return deleted({
        url: `${url.ORG_LIST}/chainSubscribe/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 通过id获取应用链(查看详情使用)
export function viewChainInit(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/appchain/viewChainInit/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 通过id获取应用链
export function getAppChainById(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/appchain/modifyChainInit/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 新增应用链
export function addAppChain(data) {
    return post({
        url: `${url.ORG_LIST}/appchain/addAppChain`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 编辑应用链
export function updateAppChain(data) {
    return put({
        url: `${url.ORG_LIST}/appchain/modifyAppChain`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 删除应用链
export function deleteAppChain(data) {
    return deleted({
        url: `${url.ORG_LIST}/appchain/deleteAppChain/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 获取应用链详情中的组织列表
export function getAppChainOrgList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/appchain/orgList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取应用链详情中的用户与节点过滤列表
export function getAppChainUserAndNodeFilterList(data) {
    const params = reviseParam(data, {});
    return get({
        url: `${url.ORG_LIST}/appchain/nodeUserListInit/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取应用链详情中的用户列表
export function getAppChainUserList(data, list) {
    const params = reviseParam(data, {});
    return post({
        url: `${url.ORG_LIST}/appchain/userList/${params.str}`,
        method: 'post',
        data: list,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取应用链详情中的节点列表
export function getAppChainNodeList(data, list) {
    const params = reviseParam(data, {});
    return post({
        url: `${url.ORG_LIST}/appchain/nodeList/${params.str}`,
        method: 'post',
        data: list,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取应用链详情中的区块列表
export function getAppChainBlockList(data, list) {
    const params = reviseParam(data, {});
    return post({
        url: `${url.ORG_LIST}/appchain/blockList/${params.str}`,
        method: 'post',
        data: list,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取应用链详情中区块列表的详情
export function getAppChainBlockDetail(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/appchain/blockDetail/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取应用链详情中的交易列表
export function getAppChainTransactionList(data, list) {
    const params = reviseParam(data, {});
    return post({
        url: `${url.ORG_LIST}/appchain/transactionList/${params.str}`,
        method: 'post',
        data: list,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取应用链详情中交易列表的详情
export function getAppChainTransactionDetail(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/appchain/transactionDetail/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 系统监控-链上事件监控-获取已订阅区块链名称列表
export function getSubscribedChainList() {
    return get({
        url: `${url.ORG_LIST}/chainContractEvent/chainNameList`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 系统监控-链上事件监控-获取已订阅区块链合约名称列表
export function getSubscribedChainContractList(data) {
    return get({
        url: `${url.ORG_LIST}/chainContractEvent/contractNameList`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 系统监控-链上事件监控-获取已订阅区块链合约名称列表
export function getSubscribedChainContractEventList(data) {
    return get({
        url: `${url.ORG_LIST}/chainContractEvent/contractEventNameList`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 系统监控-链上事件监控-获取链上事件列表
export function getChainEventMonitorList(data) {
    return get({
        url: `${url.ORG_LIST}/chainContractEvent/contractEventList/` +
            `${data.pageNumber}/${data.pageSize}`,
        method: 'get',
        params: {
            chainId: data.chainId,
            contractId: data.contractId,
            topic: data.topic
        },
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 系统监控-链上事件监控-获取链上事件详情
export function getChainEventDetail(data) {
    return get({
        url: `${url.ORG_LIST}/chainContractEvent/contractEventDetail`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 系统监控-日志监控列表
export function getSystemLogList(data, list) {
    const params = reviseParam(data, {});
    return post({
        url: `${url.ORG_LIST}/systemLog/systemLogList/${params.str}`,
        method: 'post',
        data: list,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 获取当前账号根级群组下的全部链上组织(节点监控使用)
export function getChainOrgList() {
    return get({
        url: `${url.ORG_LIST}/nodesmonitor/nodesmonitorInit`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取组织内全部监控节点列表
export function getMonitorNodeList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/nodesmonitor/nodemonitorlist/1/999999/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取节点监控数据
export function getNodeMonitorData(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/nodesmonitor/line/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取告警配置列表
export function getAlarmRuleList() {
    return get({
        url: `${url.ORG_LIST}/alarmrule/alarmRuleList`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取账号列表(告警配置使用)
// export function getAccountList() {
//     return get({
//         url: `${url.ORG_LIST}/alarmrule/modifyAlarmRuleInit`,
//         method: 'get',
//         headers: {
//             AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
//         }
//     })
// }

// 编辑告警配置
export function modifyAlarmRule(data) {
    return put({
        url: `${url.ORG_LIST}/alarmrule/modifyAlarmRule`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取当前登录账号未读通知消息的数量
export function getUnReadAlarmLogNum() {
    return get({
        url: `${url.ORG_LIST}/alarmlog/unReadAlarmLogNum`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取通知类型列表
export function getAlarmLogTypeList() {
    return get({
        url: `${url.ORG_LIST}/alarmlog/alarmLogListInit`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取通知列表
export function getAlarmLogList(data, list) {
    const params = reviseParam(data, {});
    return post({
        url: `${url.ORG_LIST}/alarmlog/alarmLogList/${params.str}`,
        method: 'post',
        data: list,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 确认已读通知
export function readAlarmLog(data) {
    const params = reviseParam(data, {});
    return put({
        url: `${url.ORG_LIST}/alarmlog/updateAlarmStatus/${params.str}`,
        method: 'put',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 批量确认已读通知
export function batchReadAlarmLog(data) {
    return put({
        url: `${url.ORG_LIST}/alarmlog/batchUpdateAlarmStatus/${data}`,
        method: 'put',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

export function getContractTemplatsInfos(data) {
    return get({
        url: `${url.ORG_LIST}/contracttemplate/getTemplateListWithVersion`,
        method: 'get',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

// 应用链接入节点的初始化
export function joinInNodeInit(data) {
    return get({
        url: `${url.ORG_LIST}/appchain/nodeRegisterViewInit`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 应用链接入节点
export function joinInNode2Chain(data) {
    return put({
        url: `${url.ORG_LIST}/appchain/nodeRegister`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 在应用链上查询对应组织下的所有节点集合
export function listChainNodeByOrg(data) {
    return get({
        url: `${url.ORG_LIST}/appchain/listChainNodeByOrg`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 应用链移除节点
export function unJoinNodeFromChain(data) {
    return deleted({
        url: `${url.ORG_LIST}/appchain/nodeUnRegister/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 应用链接入组织的初始化
export function joinInOrgInit(data) {
    return get({
        url: `${url.ORG_LIST}/appchain/orgRegisterInitOrg`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 应用链接入组织的的节点初始化
export function joinInOrgInitNodeAndUser(data) {
    return get({
        url: `${url.ORG_LIST}/appchain/orgRegisterInitNodeAndUser`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 应用链接入组织
export function joinInOrg2Chain(data) {
    return put({
        url: `${url.ORG_LIST}/appchain/orgRegister`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取系统配置信息
export function getSystemConfig(data) {
    const params = reviseParam(data, {});
    return get({
        url: `${url.ORG_LIST}/config/system/${params.str}`,
        method: 'get',
        data: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

// 用户注册到链的初始化
export function regUserInit(data) {
    return get({
        url: `${url.ORG_LIST}/appchain/userRegisterViewInit`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 用户注册到链
export function regUser2Chain(data) {
    return put({
        url: `${url.ORG_LIST}/appchain/registerUserToChain`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 用户从链上注销
export function cancelUserFromChain(data) {
    return deleted({
        url: `${url.ORG_LIST}/appchain/unRegisterUserToChain/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 将批量用户从链上注销
export function batchCancelUserFromChain(data) {
    return deleted({
        url: `${url.ORG_LIST}/appchain/batchUnRegisterUserToChain/${data}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 获取当前登录账号待办事项个数
export function getBacklogCount() {
    return get({
        url: `${url.ORG_LIST}/backlog/backlogListCount`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取待办通知列表
export function getBacklogList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `${url.ORG_LIST}/backlog/backlogList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取待办类型字典
export function getBacklogType() {
    return get({
        url: `${url.ORG_LIST}/backlog/backlogTypeList`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取待办操作类型字典
export function getBacklogOperateType(data) {
    return get({
        url: `${url.ORG_LIST}/backlog/operateTypeList`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取待办状态字典
export function getBacklogStatus(data) {
    return get({
        url: `${url.ORG_LIST}/backlog/statusList`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取编辑应用链的多签任务详情
export function getBacklogDetail4ModifyChain(data) {
    return get({
        url: `${url.ORG_LIST}/multiSignature/notificationChainDetail`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取删除应用链的多签任务详情
export function getBacklogDetail4DeleteChain(data) {
    return get({
        url: `${url.ORG_LIST}/multiSignature/notificationChainDeleteDetail`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取组织接入多签任务详情
export function getBacklogDetail4JoinInOrg(data) {
    return get({
        url: `${url.ORG_LIST}/multiSignature/notificationChainOrgDetail`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取节点接入多签任务详情
export function getBacklogDetail4JoinInNode(data) {
    return get({
        url: `${url.ORG_LIST}/multiSignature/notificationChainNodeDetail`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取合约部署与吊销的多签任务详情
export function getBacklogDetail4Contract(data) {
    return get({
        url: `${url.ORG_LIST}/multiSignature/contractDeployRevokeDetail`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 获取升级合约的多签任务详情
export function getBacklogDetail4UpgradeContract(data) {
    return get({
        url: `${url.ORG_LIST}/multiSignature/contractUpgradeDetail`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 多签任务投票
export function voteBacklog(data) {
    return put({
        url: `${url.ORG_LIST}/multiSignature/msHandle`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 取消多签任务
export function cancelMultiSignature(data) {
    return put({
        url: `${url.ORG_LIST}/multiSignature/cancelMultiSignature`,
        method: 'put',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}
// 重新制作节点安装包
export function forceMakeNodePackage(data) {
    return post({
        url: `${url.ORG_LIST}/appchain/makeNodePackage`,
        method: 'post',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 节点安装包下载
export function downloadNodePackageByNotify(nid) {
    return get({
        url: `${url.ORG_LIST}/backlog/nodePkgDownload/${nid}`,
        method: 'get',
        responseType: 'blob',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 存证信息-获取存证使用的应用链列表
export function getAppChain4Depo() {
    return get({
        url: `${url.ORG_LIST}/depository/chainList`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-获取部署在指定链上的合约
export function getContractsByChain(chainId) {
    return get({
        url: `${url.ORG_LIST}/depository/contractList/${chainId}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-获取指定合约的存证模板
export function getDepoTemplateByContract(contractId) {
    return get({
        url: `${url.ORG_LIST}/depository/depositoryTemplateList/${contractId}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-获取存证数据
// export function getDepositoryList(data, list) {
//     const params = reviseParam(data, list);
//     return get({
//         url: `${url.ORG_LIST}/depository/depositoryContentList/${params.str}`,
//         method: 'get',
//         params: params.querys,
//         headers: {
//             AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
//         }
//     })
// }

// 存证信息-获取存证历史版本数据
export function getDepositoryHistoryList(data) {
    const params = reviseParam(data, {});
    return get({
        url: `${url.ORG_LIST}/depository/depositoryContentVersionList/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 存证信息-通过id获取存证模板
export function getDepoTemplateById(templateId) {
    return get({
        url: `${url.ORG_LIST}/depository/initDepositoryContent/${templateId}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}


// 存证信息-修改存证信息数据
export function modifyDepositoryContent(data) {
    return post({
        url: `${url.ORG_LIST}/depository/modifyDepositoryContent`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}


// 存证信息-存证内容校验对比
export function validateDepositoryContentDiff(data) {
    const params = reviseParam(data, {});
    return get({
        url: `${url.ORG_LIST}/alarmlog/alarmLogDetail/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 合约编辑器-获取合约模板工程目录结构
export function getContractProject(data) {
    return get({
        url: `${url.ORG_LIST}/codeEditor/contractProject`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 合约编辑器-导出文件
export function exportFile(data) {
    return get({
        url: `${url.ORG_LIST}/codeEditor/export`,
        method: 'get',
        params: data,
        responseType: 'blob',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 合约编辑器-导入文件
export function importFile(data) {
    return post({
        url: `${url.ORG_LIST}/codeEditor/import`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || '',
            'Content-Type': 'multipart/form-data'
        }
    });
}

// 合约编辑器-新建目录或文件
export function addFso(data) {
    return post({
        url: `${url.ORG_LIST}/codeEditor/new`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约编辑器-删除目录或文件
export function removeFso(data) {
    return post({
        url: `${url.ORG_LIST}/codeEditor/remove`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约编辑器-目录或文件重命名
export function renameFso(data) {
    return post({
        url: `${url.ORG_LIST}/codeEditor/rename`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约编辑器-打开文件
export function openFile(data) {
    return post({
        url: `${url.ORG_LIST}/codeEditor/open`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约编辑器-构建
export function buildContract(data) {
    return post({
        url: `${url.ORG_LIST}/codeEditor/build`,
        method: 'post',
        data: data,
        timeout: 120 * 1000,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约编辑器-保存到当前版本
export function saveToCurrVersion(data) {
    return post({
        url: `${url.ORG_LIST}/codeEditor/save`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约编辑器-另存为新版本
export function saveAsNewVersion(data) {
    return post({
        url: `${url.ORG_LIST}/codeEditor/saveAs`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约编辑器-获取合约方法列表
export function getContractMethodList(data) {
    return get({
        url: `${url.ORG_LIST}/codeEditor/contractMethodList`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 合约编辑器-获取合约方法的参数
export function getContractMethodArgs(data) {
    return get({
        url: `${url.ORG_LIST}/codeEditor/contractArgs`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    })
}

// 合约编辑器-清空模拟合约调用参数
export function cleanContractMethodArgs(data) {
    const params = reviseParam(data, {});
    return deleted({
        url: `${url.ORG_LIST}/codeEditor/contractArgs/${params.str}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约编辑器-调用合约
export function runContract(data) {
    return post({
        url: `${url.ORG_LIST}/codeEditor/run`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约编辑器-删除一条世界状态
export function deleteWorldStateByKey(data) {
    const params = reviseParam(data, {});
    return deleted({
        url: `${url.ORG_LIST}/codeEditor/globalState/${params.str}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 合约编辑器-删除全部世界状态
export function deleteWorldStateByVersion(data) {
    const params = reviseParam(data, {});
    return deleted({
        url: `${url.ORG_LIST}/codeEditor/globalState/${params.str}`,
        method: 'delete',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 创建应用链初始化
export function makeChainInit() {
    return get({
        url: `${url.ORG_LIST}/chainCreate/chainCreateInit`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 创建应用链
export function makeChain(data) {
    return post({
        url: `${url.ORG_LIST}/chainCreate/chainCreateAdd`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 创建应用链初始化（待办）
export function makeChainBacklogInit(data) {
    return get({
        url: `${url.ORG_LIST}/chainCreate/chainCreateBackLogInit/${data}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 创建应用链提交（待办）
export function handleMakeChainBacklog(data) {
    return post({
        url: `${url.ORG_LIST}/chainCreate/chainCreateBackLogAdd`,
        method: 'post',
        data: data,
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}

// 创建应用链提交表单详情（待办）
export function makeChainBacklogDetail(chainId) {
    return get({
        url: `${url.ORG_LIST}/chainCreate/chainCreateBackLogDetail/${chainId}`,
        method: 'get',
        headers: {
            AuthorizationToken: 'Token ' + localStorage.getItem('token') || ''
        }
    });
}
