<template>
  <div>
    <ContentHead headTitle="存证管理" headSubTitle="存证模板列表"></ContentHead>
    <div class="module-wrapper">
      <div class="search-part">
        <div class="search-part-left">
          <el-form :inline="true" label-width="60px" class="search-form">
            <el-form-item label="创建者:">
              <el-select
                v-model="creatorId"
                style="width: 140px"
                @change="getTemplateList"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            class="search-form"
            :inline="true"
          >
            <el-form-item>
              <el-input
                v-model="form.templateName"
                placeholder="模板名称"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="searchTemplateName"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="search-part-right">
          <el-button
            type="primary"
            size="small"
            v-if="role === '1' || role === '2'"
            @click="changeCreateTemplateDialog(true)"
            >新建存证模板</el-button
          >
        </div>
      </div>
      <div class="depository-list">
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%"
          empty-text="暂无数据"
        >
          <el-table-column
            v-for="item in tableHeader"
            :key="item.label"
            :label="item.label"
            :prop="item.prop"
            :align="item.align"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="el-button-text"
                :disabled="
                  (role === '2' && user !== scope.row.creator) || role === '3'
                "
                @click="handleEdit(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="text"
                class="el-button-text"
                :disabled="
                  (role === '2' && user !== scope.row.creator) || role === '3'
                "
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-button
                type="text"
                class="el-button-text"
                :disabled="
                  (role === '2' && user !== scope.row.creator) || role === '3'
                "
                @click="viewDetails(scope.$index, scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
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
      <CreateTemplateDialog
        v-if="createTemplateDialogVisible"
        :createTemplateDialogVisible.sync="createTemplateDialogVisible"
        @updateTemplateDialog="changeCreateTemplateDialog"
        @getNewTemplateList="getNewTemplateList"
      ></CreateTemplateDialog>
      <EditTemplateDialog
        v-if="editTemplateDialogVisible"
        :editTemplateDialogVisible.sync="editTemplateDialogVisible"
        :editTemplateNameId="editTemplateNameId"
        @updateTemplateDialog="changeEditTemplateDialog"
      ></EditTemplateDialog>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import ContentHead from "@/components/contentHead";
import { getDepositoryTemplateCreator, getTemplateListData } from "@/util/api";
import CreateTemplateDialog from "@/views/depository/templateDialog/createTemplateDialog";
import EditTemplateDialog from "@/views/depository/templateDialog/editTemplateDialog";
export default {
  name: "depository",
  components: {
    ContentHead,
    CreateTemplateDialog,
    EditTemplateDialog,
  },
  data() {
    return {
      options: [
        //下拉框选项
        {
          id: "",
          name: "全部",
        },
      ],

      form: {
        templateName: "", //搜索框内容
      },
      creatorId: "", // 下拉框选中的创建者Id
      currentPage: 1, // 分页-当前页码
      pageSize: 10, // 分页-每页数据条目数
      role: localStorage.getItem("rootId"), // 登录账号的类型(角色) 1超级管理员 2普通管理员 3普通用户
      user: localStorage.getItem("user"),
      loading: false, //loading标识
      // 存证管理列表表头
      tableHeader: [
        {
          label: "存证模板名称",
          prop: "depositoryTemplateName",
          align: "center",
        },
        {
          label: "创建者",
          prop: "creator",
          align: "center",
        },
        {
          label: "存证信息数量",
          prop: "depositoryCount",
          align: "center",
        },
      ],

      // 存证管理列表数据
      tableData: [],
      total: 0, //列表总条数

      createTemplateDialogVisible: false, //新建存证模板Dialog是否显示
      editTemplateDialogVisible: false, //编辑存证模板Dialog是否显示
      editTemplateNameId: "", //被编辑存证列表的Id
    };
  },
  mounted() {
    this.getTemplateCreator();
    this.getTemplateList();
  },

  computed: {},
  methods: {
    // 获取全部存证模板创建者名称
    getTemplateCreator() {
      getDepositoryTemplateCreator()
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

    // 获取存证模板列表数据
    getTemplateList() {
      this.loading = true;
      getTemplateListData(
        this.currentPage,
        this.pageSize,
        this.creatorId,
        this.form.templateName
      )
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data;
            this.total = res.data.total;
            this.loading = false;
          } else {
            this.loading = false;
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },

    //搜索模板名称
    searchTemplateName: _.debounce(function () {
      this.getTemplateList();
    }, 400),

    // 新建存证模板后获取最新存证列表
    getNewTemplateList() {
      console.log(this.pageSize);
      this.currentPage = 1;
      this.creatorId = "";
      this.form.templateName = "";
      this.getTemplateList();
    },

    // 切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTemplateList();
    },

    // 切换当前页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTemplateList();
    },
    // 新建存证模板是否显示
    changeCreateTemplateDialog(val) {
      this.createTemplateDialogVisible = val;
    },
    // 编辑存证模板是否显示
    changeEditTemplateDialog(val) {
      this.editTemplateDialogVisible = val;
    },
    // 编辑存证列表
    handleEdit(id) {
      this.editTemplateNameId = id;
      this.editTemplateDialogVisible = true;
    },
    // 删除存证列表
    handleDelete() {},
    // 存证列表查看详情
    viewDetails() {},
  },
};
</script>

<style lang="less" scoped>
.search-form {
  margin-right: 15px;
}

.depository-list {
  margin: 0 25px 0 25px;
}

.el-button-text {
  background-color: transparent !important;
  border: 1px solid transparent !important;
}
</style>