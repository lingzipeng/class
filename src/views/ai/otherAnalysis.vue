<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px"><Histogram /></el-icon>其他问题
        </h3>
      </div>
    </template>
    <div>
      <span :style="{ color: 'green',fontSize: '24px' }">ai来回答</span>
      <el-card>
        <div v-if="result">
          <p>ai回答：{{ result }}</p>
        </div>
      </el-card>
      <form @submit.prevent="handleSubmit" style="display: flex">
        <div style="flex: 1">
          <el-input
            v-model="inputText"
            style="width: 100%"
            :rows="2"
            type="textarea"
            placeholder="请输入问题"
          />
        </div>
        <button type="submit">提问</button>
      </form>
    </div>
    <!--底部 end-->
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const inputText = ref("");
const result = ref("");

const handleSubmit = async () => {
  try {
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
  }
};
</script>

<style scoped>
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
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  margin: 0 auto;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}

div {
  margin-top: 20px;
}
</style>
