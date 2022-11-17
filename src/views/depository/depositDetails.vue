<template>
  <div>
    <ContentHead headTitle="存证管理" headSubTitle="存证信息列表"></ContentHead>
    <div class="module-wrapper" v-loading="DepositPageLoading">
      <div class="search-part">
        <div class="icon" :style="{ background: getColor }">
          {{ firstCharacter }}
        </div>
        <div class="template-details">
          <div class="template-name-freeze">
            {{ templateMsg.depositoryTemplateName }}
            <div class="freeze-thaw">
              <el-tag effect="dark" size="mini" v-if="templateMsg.freeze === 0">
                未冻结
              </el-tag>
              <el-tag effect="dark" size="mini" type="danger" v-else>
                已冻结
              </el-tag>
            </div>
          </div>
          <el-descriptions size="medium" style="fontsize: 25px">
            <el-descriptions-item label="创建者">{{
              templateMsg.creator
            }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{
              templateMsg.createTime
            }}</el-descriptions-item>
            <el-descriptions-item label="存证信息数量">{{
              templateMsg.depositoryCount
            }}</el-descriptions-item>
            <el-descriptions-item label="备注">{{
              templateMsg.remark || "无"
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="input-btn">
        <el-button
          type="primary"
          size="small"
          @click="openSaveDepositDialog(0)"
          :disabled="templateMsg.freeze === 1"
          >录入存证内容</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="openSaveAllDepositDialog(0)"
          :disabled="templateMsg.freeze === 1"
          >批量录入</el-button
        >
      </div>
      <div class="depository-list" v-if="!DepositPageLoading">
        <el-table
          :data="tableData"
          v-loading="listLoading"
          style="width: 100%"
          empty-text="暂无数据"
        >
          <el-table-column
            v-for="item in tableHeader"
            :key="item.name"
            :label="item.name"
            :align="item.align"
            :min-width="item.width"
            :prop="item.props"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="175px">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="el-button-text"
                @click="openSaveDepositDialog(1, scope.row)"
                :disabled="templateMsg.freeze === 1"
                >编辑</el-button
              >
              <el-button
                type="text"
                class="el-button-text"
                @click="handleHis(scope.$index, scope.row)"
                >历史版本</el-button
              >
              <el-button
                type="text"
                class="el-button-text"
                @click="openSaveDepositDialog(2, scope.row)"
                >数据校验</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="page"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <SaveDepositDialog
      v-if="enteringDepositDialogVisible"
      :visible.sync="enteringDepositDialogVisible"
      :templateMsg="templateMsg"
      :dialogFlag="dialogFlag"
      :depositoryId="depositoryId"
      @closeSaveDetailsDialog="closeSaveDepositDialog"
    ></SaveDepositDialog>
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead";
import { getTemplateDetailsData, getTemplateDetailsListData } from "@/util/api";
import SaveDepositDialog from "@/views/depository/depositDetailsDialog/saveDepositDialog.vue";
import { rgb } from "@/util/util";
export default {
  name: "DepositDetails",
  components: {
    ContentHead,
    SaveDepositDialog,
  },
  data() {
    return {
      templateMsg: {}, //当前模板详细信息
      firstCharacter: "", //   首个字符
      total: 0, //列表总条数
      currentPage: 1, // 分页-当前页码
      pageSize: 10, // 分页-每页数据条目数
      DepositPageLoading: false, // 存证信息全局页面loading
      listLoading: false, //列表loading
      tableData: [], //存证信息列表数据
      newTableHeader: [], //存证信息列表表头
      enteringDepositDialogVisible: false, //录入存证信息Dialog
      dialogFlag: 0, //区分Dialog 0表示录入 1表示数据校验
      depositoryId: null, //数据校验列表id
    };
  },
  mounted() {
    this.DepositPageLoading = true;
    this.getTemplateDetails();
    this.getDepositoryListMsg();
  },
  methods: {
    // 获取模板上方详情信息
    getTemplateDetails() {
      const { rowId } = this.$route.params;
      getTemplateDetailsData(rowId)
        .then((res) => {
          if (res.data.code === 0) {
            this.newTableHeader = [];
            for (let key of res.data.data.params) {
              this.newTableHeader.push({
                enName: key.parameterName,
                name: key.parameterName,
                props: key.parameterName,
                align: "center",
                width: "150px",
              });
            }
            this.templateMsg = res.data.data;
            this.firstCharacter =
              res.data.data.depositoryTemplateName.substring(0, 1);
            this.DepositPageLoading = false;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },

    // 获取模板下方列表数据
    getDepositoryListMsg() {
      const { rowId } = this.$route.params;
      getTemplateDetailsListData(rowId, this.currentPage, this.pageSize)
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = [];
            for (let key of res.data.data.depositoryList) {
              const { createTime, creator, depositoryId } = key;
              this.tableData.push({
                depositoryId,
                createTime,
                creator,
                ...JSON.parse(key.content),
              });
            }
            this.total = res.data.data.total;
            this.listLoading = false;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },

    // 切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.listLoading = true;
      this.getDepositoryListMsg();
    },

    // 切换当前页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.listLoading = true;
      this.getDepositoryListMsg();
    },

    //   开启录入Dialog
    // dialogFlag表示Dialog用途 0表示录入Dialog 1表示编辑存证信息 2表示数据校验Dialog
    // row表示数据校验选中那一行的数据
    openSaveDepositDialog(dialogFlag, row) {
      this.enteringDepositDialogVisible = true;
      this.dialogFlag = dialogFlag;
      if (!!row) {
        this.depositoryId = row.depositoryId;
      }
    },

    //  关闭录入Dialog
    // refresh表示是否刷新列表 0表示不刷新 1表示刷新
    closeSaveDepositDialog(refresh = 0) {
      this.enteringDepositDialogVisible = false;
      if (refresh) {
        this.listLoading = true;
        this.currentPage = 1;
        this.getDepositoryListMsg();
        this.getTemplateDetails();
      }
    },

    // 编辑
    handleEdit() {
      console.log("编辑");
    },

    // 历史记录
    handleHis() {
      console.log("历史版本");
    },
    // 批量录入
    openSaveAllDepositDialog() {
      console.log("批量录入");
    },
  },

  computed: {
    // 计算存证信息表头
    tableHeader() {
      let headerData = [
        {
          enName: "creator",
          name: "提交人",
          props: "creator",
          align: "center",
          width: "195px",
        },
        {
          enName: "createTime",
          name: "提交时间",
          props: "createTime",
          align: "center",
          width: "195px",
        },
      ];
      return this.newTableHeader.concat(headerData);
    },
    // 生成随机颜色
    getColor() {
      return rgb();
    },
  },
};
</script>

<style lang="less" scoped>
.icon {
  width: 45px;
  height: 45px;
  color: white;
  margin-right: 20px;
  text-align: center;
  line-height: 45px;
  font-size: 18px;
  font-weight: bolder;
}

.template-details {
  width: calc(100% - 40px);

  .template-name-freeze {
    font-size: 18px;
    font-weight: bolder;
    display: flex;
    letter-spacing: 0.5px;
    margin-bottom: 10px;

    .freeze-thaw {
      margin-left: 10px;
      line-height: 22px;
    }
  }
}

.input-btn {
  width: 100%;
  display: flex;
  justify-content: end;
  box-sizing: border-box;
  padding: 25px;
  margin-top: -25px;
}

.depository-list {
  margin: -15px 25px 0 25px;

  .el-button-text {
    background-color: transparent !important;
    border: 1px solid transparent !important;
    font-size: 12px;
  }
}
</style>