let errCode = {
    "102000": {
        en: "CMSP-Node-Manager system exception",
        zh: "CMSP-Node-Manager系统异常"
    },
    "102002": {
        en: "CMSP-Node-Manager system io exception",
        zh: "CMSP-Node-Manager系统IO异常"
    },
    "102005": {
        en: "Create compress file error",
        zh: "创建压缩文件失败"
    },
    "102006": {
        en: "Uncompress file error",
        zh: "解压文件失败"
    },
    "103001": {
        en: "The chain organization is not created by the current login account, and an chain node cannot be created for the chain organization",
        zh: "该链上组织不是当前登录账户创建，无法为链上组织创建链上节点"
    },
    "103002": {
        en: "The chain organization is not created by the current login account, and the chain node cannot be modified",
        zh: "该链上组织不是当前登录账户创建，无法修改链上节点"
    },
    "103003": {
        en: "The ochain organization is not created by the current login account, and the chain node cannot be deleted",
        zh: "该链上组织不是当前登录账户创建，无法删除链上节点"
    },
    "103004": {
        en: "nodeId is incorrect",
        zh: "nodeId不正确"
    },
    "103005": {
        en: "The RPC port exists",
        zh: "远程调用端口重复"
    },
    "103006": {
        en: "The monitor port exists",
        zh: "监控端口重复"
    },
    "103007": {
        en: "The p2p port exists",
        zh: "P2P端口重复"
    },
    "103030": {
        en: "Package Make Exception",
        zh: "安装包生成失败"
    },
    "103031": {
        en: "The node installation package make task id is null",
        zh: "安装包生成任务ID为空"
    },
    "103032": {
        en: "The node installation package workdir is null",
        zh: "安装包生成目录未配置"
    },
    "103033": {
        en: "The node installation package file can not be created",
        zh: "安装包文件创建失败"
    },
    "103034": {
        en: "The node installation package file can not be read",
        zh: "安装包文件读取失败"
    },
    "103035": {
        en: "The node installation package file can not be writed",
        zh: "安装包文件写入失败"
    },
    "103036": {
        en: "Read bc1.yml error",
        zh: "配置文件bc1.yml读取失败"
    },
    "103037": {
        en: "Read chainmaker.yml error",
        zh: "配置文件chainmaker.yml读取失败"
    },
    "103038": {
        en: "The node will be join in was already on chain",
        zh: "接入的节点已在链上"
    },
    "103039": {
        en: "The origin node list on chain is empty",
        zh: "应用链原始节点列表为空"
    },
    "103040": {
        en: "The origin org list on chain is empty",
        zh: "应用链原始组织列表为空"
    },
    "103041": {
        en: "The node installation package already exists",
        zh: "节点安装包已存在"
    },
    "103042": {
        en: "The node installation package not exists",
        zh: "节点安装包不存在"
    },
    "104001": {
        en: "The chain organization is not created by the current login account, and chain users cannot be created for the chain organization",
        zh: "该链上组织不是当前登录账户创建，无法为链上组织创建链上用户"
    },
    "104002": {
        en: "The chain organization is not created by the current login account and cannot modify chain users",
        zh: "该链上组织不是当前登录账户创建，无法修改链上用户"
    },
    "104003": {
        en: "The chain organization is not created by the current login account, and the chain user cannot be deleted",
        zh: "该链上组织不是当前登录账户创建，无法删除链上用户"
    },
    "104004": {
        en: "userId is incorrect",
        zh: "userId不正确"
    },
    "105001": {
        en: "The chain organization is not created by the current login account, and the certificate cannot be extended",
        zh: "该链上组织不是当前登录账户创建，无法延期该证书"
    },
    "106001": {
        en: "The chain organization was not created by the current login account, so this certificate cannot be viewed",
        zh: "该链上组织不是当前登录账户创建，无法查看本证书"
    },
    "106003": {
        en: "This chain organization is not created by the current login account or the platform account bound to the user, and cannot view this certificate",
        zh: "该链上组织不是当前登录账户或者用户绑定的平台账号创建，无法查看本证书"
    },
    "106005": {
        en: "node id does not exist",
        zh: "节点id不存在"
    },
    "106006": {
        en: "User id does not exist",
        zh: "用户id不存在"
    },
    "202000": {
        en: "invalid front info",
        zh: "无效的节点id"
    },
    "202001": {
        en: "database exception",
        zh: "数据库异常"
    },
    "202007": {
        en: "CheckCode is null",
        zh: "校验码为空"
    },
    "202008": {
        en: "invalid checkCode",
        zh: "无效的校验码"
    },
    "202013": {
        en: "invalid user id",
        zh: "无效的用户ID"
    },
    "202014": {
        en: "user already exists",
        zh: "用户信息已经存在"
    },
    "202017": {
        en: "invalid contract id",
        zh: "无效的合约ID"
    },
    "202018": {
        en: "contract not exists",
        zh: "合约不存在"
    },
    "202019": {
        en: "Permission denied on contract",
        zh: "没有操作合约的权限"
    },
    "202020": {
        en: "contract deploy status is not success",
        zh: "合约部署状态不是成功"
    },
    "202021": {
        en: "contract deploy status is not fail",
        zh: "合约部署状态不是失败也不是被拒绝"
    },
    "202022": {
        en: "The status of contract is not supported for contract invoked",
        zh: "当前的合约状态不支持被调用"
    },
    "202023": {
        en: "Permission denied on contract invoke",
        zh: "没有调用合约的权限"
    },
    "202024": {
        en: "account has related with chain user",
        zh: "该账号已与链上用户关联"
    },
    "202025": {
        en: "account id empty",
        zh: "账号ID为空"
    },
    "202026": {
        en: "account info already exists",
        zh: "该帐号已经存在"
    },
    "202027": {
        en: "account info not exists",
        zh: "该帐号不存在"
    },
    "202028": {
        en: "account name empty",
        zh: "帐号名称不能为空"
    },
    "202029": {
        en: "invalid account name",
        zh: "无效的账号名称"
    },
    "202030": {
        en: "password error",
        zh: "密码错误"
    },
    "202031": {
        en: "role id cannot be empty",
        zh: "角色编号不能为空"
    },
    "202032": {
        en: "invalid role id",
        zh: "无效的角色编号"
    },
    "202033":{
        en: "The account or password is incorrect",
        zh: "账号或密码错误"
    },
    "202035": {
        en: "The account has been used by the chain and cannot be change group",
        zh: "该账号已与链上用户关联，无法变更群组"
    },
    "202040": {
        en: "contract deploy fail",
        zh: "合约部署失败"
    },
    "202041": {
        en: "Contract deploy script not found",
        zh: "不能删除已部署的合约"
    },
    "202042": {
        en: "Contract update fail",
        zh: "合约升级失败"
    },
    "202043": {
        en: "The reponse code of contract deploy from chainmaker not success",
        zh: "在链上部署合约的响应码不成功"
    },
    "202045": {
        en: "the new password cannot be same as old",
        zh: "新旧密码不能一致"
    },
    "202046": {
        en: "The reponse code of contract revoke from chainmaker not success",
        zh: "在链上吊销合约的响应码不成功"
    },
    "202047": {
        en: "The reponse code of contract invoke from chainmaker not success",
        zh: "在链上调用合约的响应码不成功"
    },
    "202051": {
        en: "wrong host ip or wrong port: connect failed",
        zh: "错误的主机或端口，连接失败"
    },
    "202052": {
        en: "invalid token",
        zh: "无效的token"
    },
    "202053": {
        en: "token expire",
        zh: "token过期"
    },
    "202062": {
        en: "cert format error, must start with -----BEGIN CERTIFICATE-----\\n, end with end",
        zh: "证书格式错误，必须由 -----BEGIN CERTIFICATE----- 包围"
    },
    "202099": {
        en: "The contract has been invoked or deleted",
        zh: "合约已被调用或删除"
    },
    "202113": {
        en: "Pem file format error, must surrounded by -----XXXXX PRIVATE KEY-----",
        zh: "公钥文件格式错误，必须被 -----XXXXX PRIVATE KEY----- 包围"
    },
    "202120": {
        en: "The param of userId is null",
        zh: "用户编号参数不存在"
    },
    "202121": {
        en: "The param of userType is null",
        zh: "用户类型参数不存在"
    },
    "202122": {
        en: "The chain organization not exists",
        zh: "链上组织不存在"
    },
    "202123": {
        en: "The chain node not exists",
        zh: "链上节点不存在"
    },
    "202124": {
        en: "The chain user not exists",
        zh: "链上用户不存在"
    },
    "202125": {
        en: "The chain organization has no this user",
        zh: "组织内没有当前用户"
    },
    "202126": {
        en: "The chain organization has no this node",
        zh: "组织内没有当前节点"
    },
    "202127": {
        en: "Chain organization name already exists",
        zh: "链上组织名称已存在"
    },
    "202128": {
        en: "Chain organization entity is empty",
        zh: "链上组织不存在"
    },
    "202129": {
        en: "Permission denied on chain organization",
        zh: "无权操作"
    },
    "202130": {
        en: "Group id is empty",
        zh: "组织编号不存在"
    },
    "202131": {
        en: "There are nodes on the chain organization",
        zh: "当前链上组织存在节点"
    },
    "202132": {
        en: "There are users on the chain organization",
        zh: "当前链上组织存在用户"
    },
    "202133": {
        en: "The sign cert is same with tls cert",
        zh: "Sign证书和TLS证书相同"
    },
    "202134": {
        en: "The sign cert ski has already existed",
        zh: "Sign证书已存在"
    },
    "202135": {
        en: "The tls cert ski has already existed",
        zh: "TLS证书已存在"
    },
    "202136": {
        en: "Cert content is invalid",
        zh: "证书内容不正确"
    },
    "202137": {
        en: "The sign cert content is invalid",
        zh: "Sign证书内容不正确"
    },
    "202138": {
        en: "The tls cert content is invalid",
        zh: "TLS证书内容不正确"
    },
    "202139": {
        en: "The sign cert is not matched with private key",
        zh: "Sign证书与私钥不匹配"
    },
    "202140": {
        en: "Chain cert ca server login failed",
        zh: "CA证书服务器登录失败"
    },
    "202141": {
        en: "An error occurred on the ca server",
        zh: "CA证书服务器发生错误"
    },
    "202142": {
        en: "The ca cert has already existed",
        zh: "CA证书已存存"
    },
    "202143": {
        en: "The response from ca server is invalid",
        zh: "CA证书服务器无响应"
    },
    "202144": {
        en: "The tls cert is not matched with private key",
        zh: "TLS证书与私钥不匹配"
    },
    "202145": {
        en: "Contract template already exists",
        zh: "合约模板已存在"
    },
    "202146": {
        en: "Upload file is empty",
        zh: "上传文件为空"
    },
    "202147": {
        en: "Upload file suffix error",
        zh: "上传文件扩展名错误"
    },
    "202148": {
        en: "Upload file error",
        zh: "上传文件错误"
    },
    "202149": {
        en: "Delete file error",
        zh: "删除文件错误"
    },
    "202150": {
        en: "The contract template does not exist",
        zh: "合约模板不存在"
    },
    "202151": {
        en: "Contract template version already exists",
        zh: "合约模板版本已存在"
    },
    "202152": {
        en: "Permission denied on contract template",
        zh: "无权操作合约模板"
    },
    "202153": {
        en: "Contract template or version has been deleted",
        zh: "合约模板已被删除"
    },
    "202154": {
        en: "Get upload file content error",
        zh: "获取上传文件内容出现异常"
    },
    "202155": {
        en: "The uploaded file is not in a valid zip format",
        zh: "上传文件不是有效的zip格式"
    },
    "202156": {
        en: "Missing cert upload parameters",
        zh: "证书上传参数缺失"
    },
    "202157": {
        en: "The ca cert does not exist",
        zh: "CA证书不存在"
    },
    "202158": {
        en: "Chain subscribe name already exists",
        zh: "应用链订阅名称已存存"
    },
    "202160": {
        en: "permission denied on chain subscribe",
        zh: "无权订阅应用链"
    },
    "202161": {
        en: "The organization has subscribed chain",
        zh: "选中应用链已经被当前组织订阅"
    },
    "202164": {
        en: "Contract template has been deployed",
        zh: "合约模板对应的版本文件已被部署"
    },
    "202165": {
        en: "The organization in the sign cert is not matched with the organization of chain",
        zh: "Sign证书的组织与链上组织不匹配"
    },
    "202166": {
        en: "The cert ski has already existed",
        zh: "证书已存在"
    },
    "202167": {
        en: "The cert is not matched with private key",
        zh: "证书与私钥不匹配"
    },
    "202168": {
        en: "The organization in the certificate has already existed",
        zh: "证书中解析出来的组织已存在"
    },
    "202169": {
        en: "The organization in the tls cert is not matched with the organization of chain",
        zh: "TLS证书的组织与组织不匹配"
    },
    "202175": {
        en: "IO Exception, the node installation package may be deleted",
        zh: "IO异常, 节点安装包可能已被删除"
    },
    "202180": {
        en: "Failed to update chain config",
        zh: "更新链的配置失败"
    },
    "202181": {
        en: "The version total of contract template is not zero",
        zh: "合约模板存在版本数据，请先删除版本数据"
    },
    "202182": {
        en: "The contract template version does not exist",
        zh: "合约模板版本不存在"
    },
    "202183": {
        en: "Permission denied on contract template version",
        zh: "无权操作合约模板版本"
    },
    "202188": {
        en: "The chain node code in the sign cert ( common name ) has already existed",
        zh: "Sign证书中解析出来的 ( common name ) 节点编码已存在"
    },
    "202189": {
        en: "The chain user code in the sign cert ( common name ) has already existed",
        zh: "Sign证书中解析出来的 ( common name ) 用户编码已存在"
    },
    "202190": {
        en: "Failed to add trust root node",
        zh: "添加信任根证书失败"
    },
    "202191": {
        en: "Failed to add consensus node",
        zh: "添加共识节点失败"
    },
    "202192": {
        en: "Failed to delete consensus node",
        zh: "删除共识节点失败"
    },
    "202193": {
        en: "Failed to delete trust root node",
        zh: "删除信任根证书失败"
    },
    "202194": {
        en: "Failed to add consensus node and org",
        zh: "添加共识节点组织失败"
    },
    "202195": {
        en: "Failed to delete consensus node and org",
        zh: "删除共识节点组织失败"
    },
    "202198": {
        en: "The chain node is already on chain, can not be deleted",
        zh: "节点已被接入到链上，无法删除"
    },
    "202199": {
        en: "The chain user is already registered to chain, can not be deleted",
        zh: "用户已被注册到链上，无法删除"
    },
    "202200": {
        en: "The multi signature info template not exists",
        zh: "多签请求模板不存在"
    },
    "202201": {
        en: "Permission denied on multi signature",
        zh: "无权进行多签操作"
    },
    "202202": {
        en: "The multi signature notification status has already updated",
        zh: "多签状态已更新"
    },
    "202203": {
        en: "Failed to initiate chain operate",
        zh: "发起多签操作失败"
    },
    "202204": {
        en: "The download info template not exists",
        zh: "下载信息模板不存在"
    },
    "202205": {
        en: "Failed to notify all chain admin users",
        zh: "通知所有链上管理员身份用户失败"
    },
    "202220": {
        en: "The chain node is running, can not be modify",
        zh: "节点正在运行中，无法修改"
    },
    "202221": {
        en: "The chain node is running, can not be deleted",
        zh: "节点正在运行中，无法删除"
    },
    "202222": {
        en: "The chain node is already on chain, can not be modify",
        zh: "节点已被接入到链上，无法修改"
    },
    "202223": {
        en: "The status of the chain node from prometheus is not running",
        zh: "来自监控系统的节点状态为未运行"
    },
    "202240": {
        en: "The nodes changed before and after the chain subscription are the same",
        zh: "应用链订阅更换前后的节点相同"
    },
    "202241": {
        en: "The target node for chain subscription is not compatibled",
        zh: "应用链订阅更换的节点不满足要求"
    },
    "202244": {
        en: "Contract revoke fail",
        zh: "合约吊销失败"
    },
    "202245": {
        en: "Contract invoke fail",
        zh: "合约调用失败"
    },
    "202250": {
        en: "The file already exists",
        zh: "文件已存在"
    },
    "202251": {
        en: "Failed to create the file",
        zh: "创建文件失败"
    },
    "202252": {
        en: "The file not exists",
        zh: "文件不存在"
    },
    "202253": {
        en: "Failed to delete the file",
        zh: "删除文件失败"
    },
    "202254": {
        en: "Failed to delete the contract args",
        zh: "删除合约参数失败"
    },
    "202311": {
        en: "permission denied on chain",
        zh: "无管理链的权限"
    },
    "202402": {
        en: "Fetch image tag from docker registry error",
        zh: "从 Docker 源更新镜像版本失败"
    },
    "202407": {
        en: "Chain exists, deploy failed",
        zh: "链已存在，部署失败"
    },
    "202425": {
        en: "SSH login through username and password is unsupported yet",
        zh: "不支持使用 SSH 密码登录主机"
    },
    "202427": {
        en: "No deployed chain",
        zh: "链不存在"
    },
    "202460": {
        en: "Transfer files error",
        zh: "传输文件失败"
    },
    "202466": {
        en: "Please pull the Docker image manually in host /ip/",
        zh: "主机上的节点镜像不存在，请检查/ip/！"
    },
    "202502": {
        en: "version cannot be empty",
        zh: "版本不能为空"
    },
    "202545": {
        en: "account group info not exists",
        zh: "账号群组信息不存在"
    },
    "300001": {
        en: "There are accounts in the account group. Before deleting the accounts, ensure that the accounts in the account group have been cleared",
        zh: "该账号群组下存在账号，删除前应保证账号群组下账号已清空"
    },
    "300002": {
        en: "You can modify only the account groups that you have created",
        zh: "您只能编辑自己创建的账号群组"
    },
    "300003": {
        en: "You don't have the permission to modify account groups",
        zh: "您不具备编辑账号群组权限"
    },
    "300004": {
        en: "You don't have the permission to modify 'CMSP Management Team'",
        zh: "您不具备编辑CMSP管理团队账号群组权限"
    },
    "300005": {
        en: "You don't have the permission to delete 'CMSP Management Team'",
        zh: "您不具备删除CMSP管理团队账号群组权限"
    },
    "302000": {
        en: "user not logged in",
        zh: "未登录的用户"
    },
    "302001": {
        en: "Access denied",
        zh: "无权访问"
    },
    "402000": {
        en: "param exception",
        zh: "参数错误"
    },
    "500001": {
        en: "Application blockchain code duplication, creation failed",
        zh: "应用链代码重复，创建失败"
    },
    "500002": {
        en: "Application blockchain name duplication, creation failed",
        zh: "应用链名称重复，创建失败"
    },
    "500003": {
        en: "Delete Application blockchain failed",
        zh: "应用链删除失败"
    },
    "500004": {
        en: "The chain not exists",
        zh: "应用链不存在"
    },
    "500005": {
        en: "The application blockchain SDK is exception, operation fails",
        zh: "应用链SDK异常，操作失败"
    },
    "500006": {
        en: "The application blockchain information cannot be queried",
        zh: "查询不到应用链信息"
    },
    "500007": {
        en: "The block information cannot be queried",
        zh: "查询不到块信息"
    },
    "500008": {
        en: "Pu administrators can only cancel multiSignature their own related application chains",
        zh: "平台使用方管理员只取消编辑自己相关的应用链"
    },
    "500009": {
        en: "The multiSignature cannot cancel",
        zh: "无法取消当前多签操作"
    },
    "500010": {
        en: "The application chain does not have other chain org",
        zh: "应用链没有其他的链上组织"
    },
    "500011": {
        en: "The application chain does not have changes",
        zh: "应用链没有任何修改"
    },
    "500012": {
        en: "The organization has been registered",
        zh: "当前组织已经被注册"
    },
    "500013": {
        en: "The chain node has been registered",
        zh: "当前节点已经被注册"
    },
    "500014": {
        en: "The chain is editing or deleting",
        zh: "应用链正在编辑中或删除中"
    },
    "500015": {
        en: "The chain node is registering",
        zh: "链上节点正在注册中"
    },
    "500016": {
        en: "The chain org is registering",
        zh: "链上组织正在注册中"
    },
    "500017": {
        en: "The chain user is registering",
        zh: "链上用户正在注册中"
    },
    "500018": {
        en: "The chain node is removing",
        zh: "链上节点正在移除中"
    },
    "500019": {
        en: "The node is not on chain",
        zh: "节点不在链上"
    },
    "500020": {
        en: "The number of consensus node on chain less then 4, can not be removed",
        zh: "链上共识节点数量小于4"
    },
    "500021": {
        en: "Unknow node type",
        zh: "节点不类型不正确"
    },
    "500022": {
        en: "The account already bind with other chain user on same application chain",
        zh: "该帐号已与同一应用链上的其他链上用户绑定"
    },
    "700001": {
        en: "The depository template name already exists",
        zh: "存证模板名称已经存在"
    },
    "700002": {
        en: "The depository template name already exists in the blockchain",
        zh: "存证模板名称在区块链中已经存在"
    },
    "700003": {
        en: "Failed to create the depository template",
        zh: "存证模板创建失败"
    },
    "700004": {
        en: "Failed to upload the depository content",
        zh: "存证内容上传失败"
    },
    "700005": {
        en: "depository content validate fail",
        zh: "存证内容校验失败"
    },
    "700006": {
        en: "depository content validate api fail",
        zh: "存证内容校验接口调用失败"
    },
    "800004": {
        en: "The pem is not matched with the key",
        zh: "公钥与私钥不匹配"
    },
    "800005": {
        en: "The pem is exist",
        zh: "当前公钥已经存在"
    }
};

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
