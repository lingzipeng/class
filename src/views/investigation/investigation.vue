<template>
  <div>
  <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName"
  >
    <el-table-column prop="date" label="" width="180" />
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="remarks" label="评价" />
    <el-table-column prop="rating" label="评分" width="180"> </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button
          size="small"
          @click="editInvestigation(scope.row.id)"
          style="margin: 0 0 10px 10px"
          >编辑</el-button
        >
        <el-popconfirm
          width="200px"
          confirm-button-text="确定"
          cancel-button-text="取消"
          :icon="Delete"
          icon-color="#626AEF"
          :title="'确定删除角色名为“' + scope.row.name + '”的角色吗？'"
          @confirm="delInvestigation(scope.row.id)"
        >
          <template #reference>
            <el-button size="small" type="danger" style="margin-bottom: 10px"
              >删除</el-button
            >
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-button plain style="width: 100%" color="#2fa7b9" @click="addInvestigation"
    >添加角色</el-button
  >
  <!--新增问卷弹出框 start-->
  <el-dialog
    align-center
    v-model="addInvestigationDialogFormVisible"
    width="42%"
    destroy-on-close
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen /></el-icon>
        <h1 id="titleId">{{ addTitle }}</h1>
      </div>
    </template>
    <AddInvestigation
      @closeAddInvestigationForm="closeAddInvestigationForm"
      @success="success"
    />
  </el-dialog>
  <!--编辑问卷弹出框 start-->
  <el-dialog
    align-center
    v-model="editInvestigationDialogFormVisible"
    width="42%"
    destroy-on-close
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen /></el-icon>
        <h1 id="titleId">{{ editTitle }}</h1>
      </div>
    </template>
    <EditInvestigation
      :investigationInfo="investigationInfo"
      @closeEditInvestigationForm="closeEditInvestigationForm"
      @success="success"
    />
  </el-dialog>
  
    <!-- <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      ref="tableRef"
    >
      <el-table-column prop="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="date" label="" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="gender" label="性别"></el-table-column>
      <el-table-column prop="remarks" label="评价" />
      <el-table-column prop="rating" label="评分" width="180">
      </el-table-column>
      <el-table-column label="操作">
      </el-table-column>
    </el-table> -->
    <!-- <el-button
      plain
      style="width: 100%"
      color="#2fa7b9"
      @click="downloadTableAsImage"
      >下载表格图片</el-button
    > -->
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted } from "vue";
import { ElMessage } from "element-plus";
import AddInvestigation from "./components/AddInvestigation.vue";
import EditInvestigation from "./components/EditInvestigation.vue";
import {
  getInvestigationApi,
  deleteInvestigationApi,
  getInvestigationListApi,
} from "../../api/investigation/investigation";
import VueOfficeDocx from "@vue-office/docx";
import { renderAsync } from "docx-preview";
import axios from "axios";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
const state = reactive({
  // 搜索表单内容
  searchValue: "",
  // 表格全部信息
  tableData: [],
  total: 0, //总条数
  pageSize: 10, //每页显示行数
  pageIndex: 1, //当前页码
  loading: false, // 数据加载
});
// 获取列表数据
const loadData = async (state: any) => {
  state.loading = true;
  // 先清空数据
  state.tableData = [];
  const params = {
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    searchValue: state.searchValue,
  };
  const { data } = await getInvestigationListApi(params);
  state.tableData = data.content;
  state.total = data.totalElements;
  state.loading = false;
};
const Nindex = (index) => {
  // 当前页数 - 1 * 每页数据条数 + 1
  const page = state.pageIndex; // 当前页码
  const pagesize = state.pageSize; // 每页条数
  return index + 1 + (page - 1) * pagesize;
};
// 刷新按钮
const refresh = () => {
  // 搜索表单内容
  state.searchValue = "";
  // 更新数据
  loadData(state);
};
// 搜索
const search = () => {
  if (state.searchValue !== null) {
    ElMessage({
      type: "success",
      message: `关键字“${state.searchValue}”搜索内容如下`,
    });
    loadData(state);
  }
};
// 切换页面的执行事件，  val 当前页码
const changePage = (val) => {
  state.pageIndex = val;
  loadData(state);
};
//新增
const addTitle = ref("新增问卷");
const addInvestigationDialogFormVisible = ref(false);
// 添加角色
const addInvestigation = () => {
  addInvestigationDialogFormVisible.value = true;
};
// 关闭新增弹出框
const closeAddInvestigationForm = () => {
  addInvestigationDialogFormVisible.value = false;
};

// 编辑问卷弹窗状态
const editInvestigationDialogFormVisible = ref(false);
const editTitle = ref("编辑问卷");
// 编辑角色信息
const investigationInfo = ref();
const editInvestigation = async (id: number) => {
  const { data } = await getInvestigationApi(id);
  investigationInfo.value = data.result;
  editInvestigationDialogFormVisible.value = true;
};
// 删除角色信息
const delInvestigation = async (id: number) => {
  const { data } = await deleteInvestigationApi(id);
  if (data.status === 200) {
    ElMessage.success("删除成功");
    await loadData(state);
  } else {
    ElMessage.error("删除失败");
  }
};
// 关闭编辑弹出框
const closeEditInvestigationForm = () => {
  editInvestigationDialogFormVisible.value = false;
};

// 提交表单回调函数
const success = () => {
  loadData(state);
  addInvestigationDialogFormVisible.value = false;
  editInvestigationDialogFormVisible.value = false;
};
// 导出列表
const column = [
  { name: "id", label: "角色id" },
  { name: "name", label: "角色名称" },
  { name: "rating", label: "评分" },
  { name: "remarks", label: "评论" },
];

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex === 1) {
    return "warning-row";
  } else if (rowIndex === 3) {
    return "success-row";
  }
  return "";
};
const tableRef = ref(null);
// 下载表格图片方法
const downloadTableAsImage = async () => {
  const tableElement = tableRef.value?.$el; // 获取表格元素的引用
  const canvas = await html2canvas(tableElement);

  // 将Canvas转换为图片的DataURL
  const dataURL = canvas.toDataURL("image/png");

  // 创建一个<a>标签，设置下载属性
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "table_image.png"; // 下载图片的文件名

  // 触发点击事件以下载图片
  link.click();
};

//挂载后加载数据
onMounted(() => {
  loadData(state);
});
const { tableData, pageIndex, pageSize, loading, total, searchValue } =
  toRefs(state);
</script>

<style scoped>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
