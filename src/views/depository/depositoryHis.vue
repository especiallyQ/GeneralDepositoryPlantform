<template>
  <div>
    <ContentHead headTitle="存证管理" headSubTitle="存证信息历史"></ContentHead>
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
              <el-button
                class="backBtn"
                size="small"
                @click="backDepositDetails"
                >返回</el-button
              >
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
  </div>
</template>
  
  <script>
import ContentHead from "@/components/contentHead";
import {
  getTemplateDetailsData,
  getDepositoryHistoryMessage,
} from "@/util/api";
import { rgb } from "@/util/util";
export default {
  name: "DepositoryHis",
  components: {
    ContentHead,
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
      depositoryId: null, //数据校验列表id
    };
  },
  mounted() {
    this.DepositPageLoading = true;
    this.getTemplateDetails();
    this.getDepositoryHistoryListMsg();
  },
  methods: {
    // 获取模板上方详情信息
    getTemplateDetails() {
      const { id } = this.$route.params;
      getTemplateDetailsData(id)
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
            this.setBtnShow = true;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
            this.setBtnShow = true;
          }
        })
        .catch(() => {
          this.setBtnShow = true;
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },

    // 获取模板下方历史列表数据
    getDepositoryHistoryListMsg() {
      const { rowId } = this.$route.params;
      getDepositoryHistoryMessage(rowId, this.currentPage, this.pageSize)
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = [];
            for (let key of res.data.data.depositoryList) {
              const { createTime, approver, submitter } = key;
              this.tableData.push({
                approver,
                createTime,
                submitter,
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
      this.getDepositoryHistoryListMsg();
    },

    // 切换当前页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.listLoading = true;
      this.getDepositoryHistoryListMsg();
    },

    // 返回存证信息
    backDepositDetails() {
      this.$router.go(-1);
    },
  },

  computed: {
    // 计算存证信息表头
    tableHeader() {
      let headerData = [
        {
          enName: "creator",
          name: "提交人",
          props: "submitter",
          align: "center",
          width: "195px",
        },
        {
          enName: "approver",
          name: "审批人",
          props: "approver",
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
.search-part{
  position: relative;
  .template-details {
  width: calc(100% - 40px);

  .template-name-freeze {
    width: 100%;
    font-size: 18px;
    font-weight: bolder;
    display: flex;
    letter-spacing: 0.5px;
    line-height: 35px;

    .freeze-thaw {
      margin-left: 10px;
      width: 92%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .backBtn{
        position: absolute;
        top: 30px;
        left: 1200px;
      }
    }
  }
}
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