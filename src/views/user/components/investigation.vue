<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName"
  >
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="address" label="评价" />
    <el-table-column label="评分" width="180">
      <template #default="scope">
        <el-input v-model="scope.row.rating" />
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button @click="editRow(scope.row)">编辑</el-button>
        <el-button @click="deleteRow(scope.$index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface User {
  date: string;
  name: string;
  address: string;
  rating: number; // New property for rating
}

const tableData = ref<User[]>([
  {
    date: "2016-05-03",
    name: "张三",
    address: "小东老师上课非常认真，我听课非常明白，非常感谢小东老师。",
    rating: 0, // Initial rating
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    rating: 0, // Initial rating
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    rating: 0, // Initial rating
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    rating: 0, // Initial rating
  },
]);

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex === 1) {
    return "warning-row";
  } else if (rowIndex === 3) {
    return "success-row";
  }
  return "";
};

const editRow = (row: User) => {
  // You can implement edit logic here
  console.log("Editing row:", row);
};

const deleteRow = (index: number) => {
  // You can implement delete logic here
  console.log("Deleting row at index:", index);
};
</script>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
