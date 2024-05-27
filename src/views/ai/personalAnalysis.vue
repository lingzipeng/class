<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px"><Histogram /></el-icon
          >个人教学分析报告快速生成
        </h3>
      </div>
    </template>
    <div>
      <el-form
        ref="ruleFormRef"
        style="max-width: 300px"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item label="学生姓名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="语文成绩" prop="ChineseScore">
          <el-input v-model.number="ruleForm.ChineseScore" />
        </el-form-item>
        <el-form-item label="数学成绩" prop="MathScore">
          <el-input v-model.number="ruleForm.MathScore" />
        </el-form-item>
        <el-form-item label="英语成绩" prop="EnglishScore">
          <el-input v-model.number="ruleForm.EnglishScore" />
        </el-form-item>
        <el-form-item label="上次语文成绩" prop="LastChineseScore">
          <el-input v-model.number="ruleForm.LastChineseScore" />
        </el-form-item>
        <el-form-item label="上次数学成绩" prop="LastMathScore">
          <el-input v-model.number="ruleForm.LastMathScore" />
        </el-form-item>
        <el-form-item label="上次英语成绩" prop="LastEnglishScore">
          <el-input v-model.number="ruleForm.LastEnglishScore" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm(ruleFormRef)">
            提交
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
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
        <h3>{{ ruleForm.name }}的成绩</h3>
        <div class="inner-container">
          <el-card class="inner-card">
            <div class="inner-container">
              <el-card style="width: 200px; height: 80px"
                ><h3>语文成绩</h3>
                <span :style="{ color: 'blue', fontSize: '24px' }">{{
                  ruleForm.ChineseScore
                }}</span></el-card
              >
              <el-card style="width: 200px; height: 80px"
                ><h3>数学成绩</h3>
                <span :style="{ color: 'orange', fontSize: '24px' }">{{
                  ruleForm.MathScore
                }}</span></el-card
              >
              <el-card style="width: 200px; height: 80px"
                ><h3>英语成绩</h3>
                <span :style="{ color: 'red', fontSize: '24px' }">{{
                  ruleForm.EnglishScore
                }}</span></el-card
              >
              <el-card style="width: 200px; height: 80px"
                ><h3>总分成绩</h3>
                <span :style="{ color: 'purple', fontSize: '24px' }">{{
                  ruleForm.ChineseScore +
                  ruleForm.MathScore +
                  ruleForm.EnglishScore
                }}</span></el-card
              >
            </div>
          </el-card>
          <el-card class="inner-card"
            ><pie :ruleForm="ruleForm" style="width: 350px; height: 230px"
          /></el-card>
          <el-card class="inner-card"
            ><bb :ruleForm="ruleForm" style="width: 330px; height: 310px"
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
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import pie from "./components/pie.vue";
import bb from "./components/bb.vue";
import html2canvas from "html2canvas";
//ai回答
const inputText = ref("");
const result = ref("");
const isLoading = ref(false);
//报告生成
const centerDialogVisible = ref(false);

//饼状图

const ruleFormRef = ref<FormInstance>();

const checkscore = (rule: any, value: any, callback: any) => {
  if (value === null || value === undefined) {
    return callback(new Error("请输入成绩"));
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error("请输入数字"));
    } else {
      if (value < 0) {
        callback(new Error("成绩必须大于等于0"));
      } else if (value > 100) {
        callback(new Error("成绩必须小于等于100"));
      } else {
        callback();
      }
    }
  }, 1000);
};

const ruleForm = reactive({
  ChineseScore: "",
  EnglishScore: "",
  MathScore: "",
  LastChineseScore: "",
  LastEnglishScore: "",
  LastMathScore: "",
  name: "",
});

const rules = reactive<FormRules<typeof ruleForm>>({
  ChineseScore: [{ validator: checkscore, trigger: "blur" }],
  EnglishScore: [{ validator: checkscore, trigger: "blur" }],
  MathScore: [{ validator: checkscore, trigger: "blur" }],
  LastChineseScore: [{ validator: checkscore, trigger: "blur" }],
  LastEnglishScore: [{ validator: checkscore, trigger: "blur" }],
  LastMathScore: [{ validator: checkscore, trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  centerDialogVisible.value = true;
  //console.log(ruleForm.MathScore);
  inputText.value =
    "这是三年级" +
    ruleForm.name +
    "成绩语文" +
    ruleForm.ChineseScore +
    "分数学" +
    ruleForm.MathScore +
    "分英语" +
    ruleForm.EnglishScore +
    "分，" +
    "上次成绩语文" +
    ruleForm.LastChineseScore +
    "分数学" +
    ruleForm.LastMathScore +
    "分英语" +
    ruleForm.LastEnglishScore +
    "分。" +
    "请帮我分析他的成绩并给出建议（回答不要分段且250字以内）";
  handleSubmit();
};

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

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
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
  link.download = ruleForm.name + "_student_image.png";

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
