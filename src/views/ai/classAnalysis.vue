<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px"><Histogram /></el-icon
          >班级教学分析报告快速生成
        </h3>
      </div>
    </template>
    <el-card>
      <el-select
        v-model="value"
        clearable
        placeholder="选择科目"
        style="width: 240px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- <el-input
        v-model="input"
        style="width: 240px; margin-left: 10px"
        placeholder="输入成绩（每个成绩逗号隔开）"
        clearable
      /> -->
      <el-button
        @click="gradeEntry()"
        style="margin-left: 10px"
        type="primary"
        plain
        >输入成绩</el-button
      >
      <el-button @click="clear()" style="margin-left: 10px" type="danger" plain
        >清空成绩</el-button
      >
      <el-button
        style="margin-left: 10px"
        type="primary"
        @click="submitForm"
        plain
        >生成报告</el-button
      >
      <p>已录入成绩{{ scoreList }}</p>
    </el-card>
    <!--底部 end-->
    <el-dialog
      v-model="centerDialogVisible"
      title=""
      center
      :destroy-on-close="true"
      :width="'70%'"
    >
      <el-card
        ref="tableRef"
        shadow="never"
        style="
          width: 100%;
          height: 500px;
          padding: 20px;
          box-sizing: border-box;
          background-color: #f9f5f5;
        "
      >
        <div class="inner-container">
          <el-card class="inner-card">
            <div>
              <el-table
                :data="tableData1"
                style="width: 350px"
                row-key="id"
                border
                lazy
                :tree-props="{
                  children: 'children',
                  hasChildren: 'hasChildren',
                }"
              >
                <el-table-column prop="fail" label="不及格" />
                <el-table-column prop="general" label="一般" />
                <el-table-column prop="good" label="良好" />
                <el-table-column prop="excellent" label="优秀" />
              </el-table>
            </div>
          </el-card>
          <el-card class="inner-card"
            ><classPie
              :scoreForm="scoreForm"
              style="width: 350px; height: 230px"
          /></el-card>
          <el-card class="inner-card"
            ><classLine
              :scoreListProp="scoreList"
              style="width: 330px; height: 310px"
          /></el-card>
          <el-card
            v-loading="isLoading"
            element-loading-text="ai报告生成中..."
            class="inner-card"
          >
            <div class="article">
              <p>{{ result }}</p>
            </div>
          </el-card>
        </div>
      </el-card>

      <el-button
        plain
        style="width: 100%"
        color="#2fa7b9"
        @click="downloadTableAsImage"
        >下载表格图片</el-button
      >
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="centerDialogVisible = false"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!--成绩录入-->
    <el-dialog v-model="dialogFormVisible" title="成绩录入" width="500">
      <el-form :model="form">
        <el-form-item label="请输入成绩" :label-width="formLabelWidth">
          <el-input v-model="form.score" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="entering()">继续录入</el-button>
          <el-button type="primary" @click="endEnter()"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import classPie from "./components/classPie.vue";
import classLine from "./components/classLine.vue";
import html2canvas from "html2canvas";
//报告生成
const centerDialogVisible = ref(false);
const value = ref("");
//成绩录入
const formLabelWidth = "140px";
const scoreList = ref<number[]>([]);
const form = reactive({
  score: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
const dialogFormVisible = ref(false);
const gradeEntry = () => {
  dialogFormVisible.value = true;
};
//继续录入
const entering = () => {
  //向数组添加数据
  if (form.score.trim() !== "" && !isNaN(parseFloat(form.score))) {
    scoreList.value.push(parseFloat(form.score));
  }
  form.score = "";
  console.log(scoreList.value);
};
//结束录入
const endEnter = () => {
  if (form.score.trim() !== "" && !isNaN(parseFloat(form.score))) {
    scoreList.value.push(parseFloat(form.score));
  }
  form.score = "";
  dialogFormVisible.value = false;
};
//清空数据
const clear = () => {
  scoreList.value = [];
};
//统计优秀率
const scoreForm = reactive({
  failed: 0,
  general: 0,
  good: 0,
  excellent: 0,
});
const resetScoreForm = () => {
  scoreForm.failed = 0;
  scoreForm.general = 0;
  scoreForm.good = 0;
  scoreForm.excellent = 0;
};
//ai回答
const inputText = ref("");
const result = ref("");
const isLoading = ref(false);

//ai回答
const handleSubmit = async () => {
  try {
    result.value = "";
    isLoading.value = true;
    // 将输入文本作为 URL 参数
    const url = `http://127.0.0.1:5000/hello?message=${encodeURIComponent(
      inputText.value
    )}`;

    // 发送 HTTP 请求
    const response = await fetch(url);

    // 解析 JSON 格式的响应
    const data = await response.json();

    // 将后端返回的结果赋值给 result
    result.value = data["ai回答"];
  } catch (error) {
    // 发生错误时的处理
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

const tableData1 = computed(() => {
  return [
    {
      fail: scoreForm.failed,
      general: scoreForm.general,
      good: scoreForm.good,
      excellent: scoreForm.excellent,
    },
  ];
});
const options = [
  {
    value: "语文",
    label: "语文",
  },
  {
    value: "数学",
    label: "数学",
  },
  {
    value: "英语",
    label: "英语",
  },
];
const submitForm = () => {
  resetScoreForm();
  scoreList.value.forEach((score) => {
    if (score < 60) {
      scoreForm.failed++;
    } else if (score >= 60 && score < 80) {
      scoreForm.general++;
    } else if (score >= 80 && score < 90) {
      scoreForm.good++;
    } else if (score >= 90 && score <= 100) {
      scoreForm.excellent++;
    }
  });
  inputText.value =
    "班级的" +
    value.value +
    "成绩为" +
    scoreList.value +
    "请帮我分析该班级的情况并给出建议。（回答不要分段且250字以内）";
  handleSubmit();
  centerDialogVisible.value = true;
};
// 下载表格图片方法
const tableRef = ref(null);
const downloadTableAsImage = async () => {
  const tableElement = tableRef.value?.$el; // 获取表格元素的引用
  const canvas = await html2canvas(tableElement);

  // 将Canvas转换为图片的DataURL
  const dataURL = canvas.toDataURL("image/png");

  // 创建一个<a>标签，设置下载属性
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = value.value + "_class_image.png";

  // 触发点击事件以下载图片
  link.click();
};
</script>

<style scoped>
.inner-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 两列 */
  grid-template-rows: 1fr 1fr; /* 两行 */
  gap: 10px; /* 间距 */
  height: 100%;
}

.inner-card {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #ffffff;
  border: 1px solid #f9f5f5; /* 实线边框 */
  box-sizing: border-box;
  height: 210px; /* 确保子卡片撑满父容器的高度 */
}
.card-header {
  display: flex; /* 弹性布局 */
  justify-content: space-between; /*内容对齐方式 */
  align-items: center; /*设置或检索弹性盒子元素在侧轴（纵轴）方向上的对齐方式*/
}
.card-header h3 {
  display: inline-flex; /*行内块元素*/
  justify-content: center;
  align-items: center;
}

:deep(.el-card__header) {
  border-bottom: 1px solid rgb(238 238 238);
  color: #178557;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.el-card {
  border-radius: 0px;
  border: none;
}
.article {
  text-align: justify; /* 让文本左右对齐 */
}

.article p {
  text-indent: 2em; /* 设置首行缩进为两个字符 */
}
</style>
