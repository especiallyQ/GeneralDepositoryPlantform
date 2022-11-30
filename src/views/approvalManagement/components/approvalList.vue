<template>
  <div>
    <div class="search_part">
      <span>按审批人筛选：</span>
      <el-select
        v-model="approver"
        placeholder="全部"
        size="small"
        @change="changeSelectList"
      >
        <el-option
          v-for="item in options"
          :key="item.approverId"
          :label="item.approverName"
          :value="item.approverId"
        >
        </el-option>
      </el-select>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        class="search-form"
        :inline="true"
      >
        <el-form-item>
          <el-input
            v-model="form.submitter"
            placeholder="提交人"
            @keyup.enter.native="searchSubmitter"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="searchSubmitter"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%"
        empty-text="暂无数据"
      >
        <el-table-column align="right" width="60px">
          <template slot-scope="scope">
            <svg
              v-if="activeName === '666' && scope.row.status === 1"
              t="1669713844649"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7728"
              width="200"
              height="200"
            >
              <path
                d="M512 22C241.38 22 22 241.38 22 512s219.38 490 490 490 490-219.38 490-490S782.62 22 512 22z m259.66 369.85L481.12 682.38c-13.87 13.87-36.36 13.87-50.23 0L252.34 503.83c-13.87-13.87-13.87-36.36 0-50.23 13.87-13.87 36.36-13.87 50.23 0l153.44 153.44 265.42-265.42c13.87-13.87 36.36-13.87 50.23 0 13.87 13.87 13.87 36.36 0 50.23z"
                p-id="7729"
                fill="#1afa29"
              ></path>
            </svg>
            <svg
              v-else-if="activeName === '666' && scope.row.status === 2"
              t="1669715890738"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="13599"
              width="200"
              height="200"
            >
              <path
                d="M512 981.333333C252.8 981.333333 42.666667 771.2 42.666667 512S252.8 42.666667 512 42.666667s469.333333 210.133333 469.333333 469.333333-210.133333 469.333333-469.333333 469.333333z m44.245333-469.333333l159.914667-159.914667a31.274667 31.274667 0 1 0-44.245333-44.245333L512 467.754667 352.085333 307.84a31.274667 31.274667 0 1 0-44.245333 44.245333L467.754667 512l-159.914667 159.914667a31.274667 31.274667 0 1 0 44.245333 44.245333L512 556.245333l159.914667 159.914667a31.274667 31.274667 0 1 0 44.245333-44.245333L556.245333 512z"
                fill="#F5222D"
                p-id="13600"
              ></path>
            </svg>
            <i class="el-icon-time" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in tableHeader"
          :key="item.label"
          :label="item.label"
          :prop="item.prop"
          :align="item.align"
          :min-width="item.width"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="submitTime"
          label="提交时间"
          min-width="150px"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="activeName === '666'"
          prop="approvalTime"
          label="审批时间"
          min-width="150px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="150px"
          v-if="activeName === '0'"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              class="el-button-text"
              @click="openApprovalDialog(scope.row.id)"
              >审批</el-button
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
    <ApprovalDialog
      v-if="approvalDialogVisible"
      :approvalDialogVisible.sync="approvalDialogVisible"
      :approvalId="approvalId"
      @closeApprovalDialog="closeApprovalDialog"
    ></ApprovalDialog>
  </div>
</template>

<script>
import _ from "lodash";
import { getApproverList, getApprovalList } from "@/util/api";
import ApprovalDialog from "@/views/approvalManagement/components/approvalDialog.vue";
export default {
  name: "ApprovalList",
  props: {
    activeName: {
      type: String,
      default: "0",
      required: true,
    },
  },
  components: {
    ApprovalDialog,
  },
  data() {
    return {
      options: [
        {
          approverId: "",
          approverName: "全部",
        },
      ],
      tableData: null,
      tableHeader: [
        {
          label: "提交人",
          prop: "submitter",
          align: "center",
          width: "130px",
        },
        {
          label: "审批类型",
          prop: "type",
          align: "center",
          width: "150px",
        },
        {
          label: "审批人",
          prop: "operator",
          align: "center",
          width: "150px",
        },
        {
          label: "审批内容",
          prop: "content",
          align: "center",
          width: "300px",
        },
      ],
      listLoading: true, //审批列表loading
      approver: "", //选中审批人下拉框
      form: {
        //搜索表单数据
        submitter: "",
      },
      currentPage: 1, // 分页-当前页码
      pageSize: 10, // 分页-每页数据条目数
      total: 0, //列表总数据条数
      approvalDialogVisible: false, //审批Dialog是否显示
      approvalId: "", //被编辑存证列表的Id
    };
  },

  methods: {
    // 获取审批人列表
    getApproverSearch() {
      getApproverList()
        .then((res) => {
          if (res.data.code === 0) {
            this.options = this.options.concat(res.data.data);
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
    // 获取审批列表数据
    getApprovalListData() {
      getApprovalList(
        this.currentPage,
        this.pageSize,
        this.approver,
        this.form.submitter,
        this.activeName
      )
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data;
            this.total = res.data.total;
            this.listLoading = false;
          } else {
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
            this.listLoading = false;
          }
        })
        .catch(() => {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
          this.listLoading = false;
        });
    },

    // 改变审批人下拉框
    changeSelectList() {
      this.currentPage = 1;
      this.listLoading = true;
      this.getApprovalListData();
    },

    //搜索提交人
    searchSubmitter: _.debounce(function () {
      this.currentPage = 1;
      this.listLoading = true;
      this.getApprovalListData();
    }, 400),

    // 切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.listLoading = true;
      this.getApprovalListData();
    },

    // 切换当前页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.listLoading = true;
      this.getApprovalListData();
    },

    // 开启审批Dialog
    openApprovalDialog(id) {
      this.approvalId = id;
      this.approvalDialogVisible = true;
    },

    //审批Dialog
    closeApprovalDialog(val) {
      this.approvalDialogVisible = false;
      if (val) {
        this.currentPage = 1;
        this.listLoading = true;
        this.getApprovalListData();
      }
    },
  },
  mounted() {
    this.getApprovalListData();
    this.getApproverSearch();
  },
};
</script>

<style lang="less" scoped>
.search_part {
  display: flex;
  align-items: center;
  height: 45px;
  font-size: 13px;
  padding-bottom: 15px;

  .search-form {
    margin-left: 15px;
  }
}

.el-button-text {
  background-color: transparent !important;
  border: 1px solid transparent !important;
  font-size: 12px;
}

.icon {
  font-size: 14px !important;
}
</style>