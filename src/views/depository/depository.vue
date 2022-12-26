<template>
  <div>
    <ContentHead headTitle="存证管理" headSubTitle="存证模板列表"></ContentHead>
    <div class="module-wrapper">
      <div class="search-part">
        <div class="search-part-left">
          <el-form :inline="true" label-width="75px" class="search-form">
            <el-form-item label="所属数据源:">
              <el-select
                v-model="dataOriginId"
                style="width: 140px"
                @change="changeSelectList"
              >
                <el-option
                  v-for="item in dataOriginOptions"
                  :key="item.id1"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form :inline="true" label-width="55px" class="search-form">
            <el-form-item label="创建者:">
              <el-select
                v-model="creatorId"
                style="width: 140px"
                @change="changeSelectList"
              >
                <el-option
                  v-for="item in creatorOptions"
                  :key="item.id2"
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
            class="search-form search-creator"
            :inline="true"
          >
            <el-form-item>
              <el-input
                v-model="form.templateName"
                placeholder="模板名称"
                @keyup.enter.native="searchTemplateName"
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
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="el-button-text"
                :disabled="
                  (role === '2' && user !== scope.row.creator) ||
                  role === '3' ||
                  scope.row.freeze !== 0
                "
                @click="handleEdit(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="text"
                style="color: red"
                class="el-button-text"
                :disabled="
                  // (role === '2' && user !== scope.row.creator) || role === '3'
                  true
                "
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-button
                type="text"
                class="el-button-text"
                :disabled="
                  (role === '2' && user !== scope.row.creator) ||
                  role === '3' ||
                  scope.row.freeze !== 0
                "
                @click="changeFreezeThawDialog(0, scope.row)"
                >冻结</el-button
              >
              <el-button
                type="text"
                class="el-button-text"
                :disabled="
                  (role === '2' && user !== scope.row.creator) ||
                  role === '3' ||
                  scope.row.freeze !== 1
                "
                @click="changeFreezeThawDialog(1, scope.row)"
                >解冻</el-button
              >
              <el-button
                type="text"
                class="el-button-text"
                @click="viewDetails(scope.row.id)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
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
        @getNewTemplateList="getNewTemplateList"
      ></EditTemplateDialog>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import ContentHead from "@/components/contentHead";
import {
  getDepositoryTemplateCreator,
  getDataOrigin,
  getTemplateListData,
  freezeTemplate,
  thawTemplate,
} from "@/util/api";
import CreateTemplateDialog from "@/views/depository/depositoryDialog/createTemplateDialog";
import EditTemplateDialog from "@/views/depository/depositoryDialog/editTemplateDialog";
export default {
  name: "depository",
  components: {
    ContentHead,
    CreateTemplateDialog,
    EditTemplateDialog,
  },
  data() {
    return {
      dataOriginOptions: [
        //数据源下拉框选项
        {
          id: "",
          label: "全部",
        },
      ],

      creatorOptions: [
        //创建者下拉框选项
        {
          id: "",
          name: "全部",
        },
      ],

      form: {
        templateName: "", //搜索框内容
      },
      creatorId: "", // 下拉框选中的创建者Id
      dataOriginId: "", // 下拉框选中的数据源Id
      currentPage: 1, // 分页-当前页码
      pageSize: 10, // 分页-每页数据条目数
      role: localStorage.getItem("rootId"), // 登录账号的类型(角色) 1超级管理员 2普通管理员 3普通用户
      user: localStorage.getItem("user"),
      listLoading: false, //存证模板列表Loading标识
      // 存证管理列表表头
      tableHeader: [
        {
          label: "存证模板名称",
          prop: "depositoryTemplateName",
          align: "center",
        },
        {
          label: "所属数据源",
          prop: "depositoryTemplateDataOrigin",
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
    this.getDataOriginList();
    this.getNewTemplateList();
  },

  computed: {},
  methods: {
    // 获取全部存证模板创建者名称
    getTemplateCreator() {
      getDepositoryTemplateCreator()
        .then((res) => {
          if (res.data.code === 0) {
            this.creatorOptions = this.creatorOptions.concat(res.data.data);
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

    // 获取全部数据源列表
    getDataOriginList() {
      getDataOrigin()
        .then((res) => {
          if (res.data.code === 0) {
            this.dataOriginOptions = this.dataOriginOptions.concat(
              res.data.data
            );
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
      this.listLoading = true;
      getTemplateListData(
        this.currentPage,
        this.pageSize,
        this.creatorId,
        this.dataOriginId,
        this.form.templateName
      )
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.data;
            this.total = res.data.total;
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.listLoading = false;
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },

    // 根据创建者筛选存证列表
    changeSelectList() {
      this.currentPage = 1;
      this.getTemplateList();
    },

    //搜索模板名称
    searchTemplateName: _.debounce(function () {
      this.currentPage = 1;
      this.getTemplateList();
    }, 400),

    // 新建存证模板后获取最新存证列表
    getNewTemplateList() {
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
    handleDelete() {
      console.log("删除");
    },

    // 显示冻结解冻Dialog
    changeFreezeThawDialog(status, row) {
      const h = this.$createElement;
      this.$msgbox({
        title: "提示",
        message: h("p", null, [
          h("span", null, `是否确认${status ? "解冻" : "冻结"}存证模板 `),
          h("strong", { style: "color: red" }, row.depositoryTemplateName),
        ]),
        closeOnClickModal: false,
        showCancelButton: true,
        showClose: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        lockScroll: false,
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            switch (status) {
              case 0:
                this.handleFreeze(row.id, instance, done);
                break;
              case 1:
                this.handleThaw(row.id, instance, done);
                break;
            }
          } else {
            done();
          }
        },
      }).catch(() => {
        return false;
      });
    },

    // 处理冻结存证模板
    handleFreeze(id, instance, done) {
      freezeTemplate(id)
        .then((res) => {
          if (res.data.code === 0) {
            this.getTemplateList();
            done();
            instance.confirmButtonLoading = false;
            this.$message({
              message: "冻结成功",
              type: "success",
              duration: 2000,
            });
          } else {
            done();
            instance.confirmButtonLoading = false;
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          done();
          instance.confirmButtonLoading = false;
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },

    //  处理解冻存证模板
    handleThaw(id, instance, done) {
      thawTemplate(id)
        .then((res) => {
          if (res.data.code === 0) {
            this.getTemplateList();
            done();
            instance.confirmButtonLoading = false;
            this.$message({
              message: "解冻成功",
              type: "success",
              duration: 2000,
            });
          } else {
            done();
            instance.confirmButtonLoading = false;
            this.$message({
              message: this.$chooseLang(res.data.code),
              type: "error",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          done();
          instance.confirmButtonLoading = false;
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        });
    },

    // 存证列表查看详情
    viewDetails(id) {
      this.$router.push(`/depositDetails/${id}`);
    },
  },
};
</script>

<style lang="less" scoped>
.search-form {
  margin-right: 15px;
}

.search-creator {
  margin-left: 10px;
}

.depository-list {
  margin: 0 25px 0 25px;
}

.el-button-text {
  background-color: transparent !important;
  border: 1px solid transparent !important;
  font-size: 12px;
}

.freezeDialogTitle {
  text-align: center;
  font-size: 16px;
  font-weight: bolder;
  letter-spacing: 0.5px;
}
</style>