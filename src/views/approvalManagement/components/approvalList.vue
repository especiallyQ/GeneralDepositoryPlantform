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
        :row-style="{ height: '55px' }"
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
            <svg
              t="1669858089787"
              v-else
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5047"
              width="200"
              height="200"
            >
              <path
                d="M512 329.325a33.868 33.868 0 0 0-34.101 33.589v224.1c0 1.535 0.744 2.884 0.93 4.372 0.326 2.466 0.605 4.746 1.443 6.979 0.79 2 1.86 3.722 2.93 5.443 1.117 1.907 2.187 3.722 3.722 5.443 1.582 1.721 3.443 2.884 5.397 4.466 1.256 0.838 2.093 2.187 3.536 2.885l195.162 103.745a34.148 34.148 0 0 0 16.143 4.001 34.148 34.148 0 0 0 30.054-17.632 33.403 33.403 0 0 0-13.864-45.592l-177.25-94.302V362.914A33.961 33.961 0 0 0 512 329.324z m454.386 179.251a33.822 33.822 0 0 0-34.008 33.636c0 228.612-188.556 414.516-420.331 414.516-231.823 0-420.332-185.904-420.332-414.516 0-228.659 188.51-414.563 420.332-414.563a426.612 426.612 0 0 1 146.778 26.797l-44.754 11.817a33.543 33.543 0 0 0 8.792 66.062 34.38 34.38 0 0 0 8.84-1.117l109.56-28.983a56.292 56.292 0 0 0 34.66-26.146 54.897 54.897 0 0 0 5.582-42.521L752.15 25.392a33.961 33.961 0 0 0-41.731-23.82A33.59 33.59 0 0 0 686.32 42.7l14.98 55.22A497.327 497.327 0 0 0 512 60.424c-269.366 0-488.487 216.144-488.487 481.788S242.634 1024 512 1024c269.32 0 488.487-216.144 488.487-481.741 0-18.61-15.26-33.683-34.1-33.683z"
                p-id="5048"
              ></path>
            </svg>
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
import { getDate } from "@/util/util";
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
      tableData: [],
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
            for (let key of this.tableData) {
              this.$set(key, 'submitTime', getDate(key.submitTime));
              this.$set(key, 'approvalTime', getDate(key.approvalTime));
            }
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
        .catch((err) => {
  
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