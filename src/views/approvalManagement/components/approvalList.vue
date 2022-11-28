<template>
  <div>
    <div class="search_part">
      <span>按审批人筛选：</span>
      <el-select v-model="approver" placeholder="全部" size="small">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
    <div class="ApproveList">
      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%"
        empty-text="暂无数据"
      >
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
          v-if="activeName === '1'"
          prop="submitTime"
          label="提交时间"
          min-width="150px"
          align="center"
        ></el-table-column>
        <el-table-column
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
              @click="handleApproval(true, scope.row.id)"
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
      @updateTemplateDialog="handleApproval"
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
          value: "选项0",
          label: "全部",
        },
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      tableData: [
        {
          id: 1,
          submitter: "王小虎",
          approver: "张大妈",
          approvalType: "存证信息编辑",
          approvalContent: "上海市普陀区金沙江路 1518 弄",
          submitTime: "2016-05-02",
          approvalTime: "2022-05-02",
        },
      ],
      tableHeader: [
        {
          label: "提交人",
          prop: "submitter",
          align: "center",
          width: "150px",
        },
        {
          label: "审批类型",
          prop: "approvalType",
          align: "center",
          width: "150px",
        },
        {
          label: "审批人",
          prop: "approver",
          align: "center",
          width: "150px",
        },
        {
          label: "审批内容",
          prop: "approvalContent",
          align: "center",
          width: "300px",
        },
      ],
      listLoading: false, //审批列表loading
      approver: "选项0", //选中审批人下拉框
      form: {}, //搜索表单数据
      currentPage: 1, // 分页-当前页码
      pageSize: 10, // 分页-每页数据条目数
      total: 50, //列表总数据条数
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
            console.log(res);
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
            console.log(res);
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

    //搜索提交人
    searchSubmitter: _.debounce(function () {
      this.currentPage = 1;
      this.getApprovalListData();
    }, 400),

    // 切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getApprovalListData();
    },

    // 切换当前页码 审批Dialog
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getApprovalListData();
    },

    //审批Dialog
    handleApproval(val, id) {
      this.approvalId = id;
      this.approvalDialogVisible = val;
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
</style>