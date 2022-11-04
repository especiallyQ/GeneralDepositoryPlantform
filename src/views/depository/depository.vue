<template>
  <div>
    <ContentHead headTitle="存证管理" headSubTitle="存证模板列表"></ContentHead>
    <div class="module-wrapper">
      <div class="search-part">
        <div class="search-part-left">
          <el-form :inline="true" label-width="60px" class="search-form">
            <el-form-item label="创建者：">
              <el-select
                v-model="creatorId"
                style="width: 140px"
                @change="handleChange"
              >
                <el-option
                  v-for="item in options"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
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
              <el-input v-model="form.name" placeholder="模板名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="searchTemplate"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="depository-list">
        
      </div>
    </div>
  </div>
</template>

<script>
import ContentHead from "@/components/contentHead";
export default {
  name: "depository",
  components: {
    ContentHead,
  },
  data() {
    return {
      creatorId: "黄金糕", // 下拉框选中的创建者

      options: [
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

      form: {
        name: "",
      },
    };
  },
  methods: {
    // 下拉框筛选创建者
    handleChange() {
      console.log(this.creatorId);
    },
    //  根据名称搜索模板
    searchTemplate() {
      console.log("搜索数据了");
    },
  },
};
</script>

<style lang="less" scoped>
.search-form{
  margin-right: 15px;
}
</style>