<template>
  <div>
    <ContentHead headTitle="存证管理" headSubTitle="存证信息列表"></ContentHead>
    <div class="module-wrapper">
      <div class="search-part">
        <div class="icon" :style="{ background: getColor() }">
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
          <el-descriptions size="medium" style="fontSize:25px">
            <el-descriptions-item label="创建者"
              >{{ templateMsg.creator }}</el-descriptions-item
            >
            <el-descriptions-item label="创建时间"
              >{{ templateMsg.createTime }}</el-descriptions-item
            >
            <el-descriptions-item label="存证信息数量">{{ templateMsg.depositoryCount }}</el-descriptions-item>
            <el-descriptions-item label="备注"
              >{{ templateMsg.remark }}</el-descriptions-item
            >
          </el-descriptions>
        </div>
      </div>
      <div class="input-btn">
        <el-button type="primary" size="small">录入存证内容</el-button>
        <el-button type="primary" size="mini">批量录入</el-button>
      </div>
      <div class="depository-list">
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
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                class="el-button-text"
                @click="handleDelete(scope.$index, scope.row)"
                >历史版本</el-button
              >
              <el-button
                type="text"
                class="el-button-text"
                @click="handleDelete(scope.$index, scope.row)"
                >数据校验</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="page"
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
import { getTemplateDetailsData, getTemplateDetailsListData } from "@/util/api";
import { rgb } from "@/util/util";
export default {
  name: "DepositDetails",
  components: {
    ContentHead,
  },
  data() {
    return {
      templateMsg: {},
      firstCharacter: "", //   首个字符
      total: 0, //列表总条数
      currentPage: 1, // 分页-当前页码
      pageSize: 10, // 分页-每页数据条目数
      listLoading: false, //列表loading
      tableData: [], //存证信息列表数据
      newTableHeader: [], //存证信息列表表头
    };
  },
  mounted() {
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
            this.templateMsg = res.data.data;
            this.firstCharacter =
              res.data.data.depositoryTemplateName.substring(0, 1);
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
            this.newTableHeader = [];
            this.tableData = [];
            for (let key of res.data.data.depositoryList[0].depositoryParams) {
              this.newTableHeader.push({
                enName: key.parameterName,
                name: key.parameterName,
                props: key.parameterName,
                align: "center",
                width: "150px",
              });
            }

            for (let key of res.data.data.depositoryList) {
              const { createTime, creator } = key;
              for (let item of key.depositoryParams) {
                this.tableData.push({
                  createTime,
                  creator,
                  [item.parameterName]: [item.parameterContent],
                });
              }
            }
            this.total = res.data.data.total;
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
      this.getDepositoryListMsg();
    },
    // 切换当前页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDepositoryListMsg();
    },
    // 生成随机颜色
    getColor() {
      return rgb();
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
  line-height: 40px;
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