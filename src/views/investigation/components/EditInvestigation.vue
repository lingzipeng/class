<template>
  <el-form
    ref="ruleFormRef"
    :rules="rules"
    :model="formInvestigation"
    label-width="80px"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formInvestigation.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="评分" prop="rating">
          <el-input v-model="formInvestigation.rating" placeholder="请输入评分" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="评价">
          <el-input
            v-model="formInvestigation.remarks"
            :rows="2"
            type="textarea"
            placeholder="请输入评价"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <div class="dialong__button--wrap">
    <el-button @click="close">取消</el-button>
    <el-button
      color="#178557"
      :loading="subLoading"
      type="success"
      @click="editInvestigation(ruleFormRef)"
      >保存</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { editInvestigationApi } from "../../../api/investigation/investigation";
const subLoading = ref(false);
const ruleFormRef = ref<FormInstance>();
// 定义表单约束规则对象
const rules = reactive<FormRules>({
  name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
  rating: [{ required: true, message: "角色评分不能为空", trigger: "blur" }],
});
const formInvestigation = reactive({
  id: 0,
  rating: "",
  name: "",
  remarks: "",
});
const props = defineProps(["investigationInfo"]);
const investigationInfo = ref(props.investigationInfo);
const emit = defineEmits(["closeEditInvestigationForm", "success"]);
// 给表单填充数据
for (const key in formInvestigation) {
  formInvestigation[key]= investigationInfo.value[key];
}
// 编辑角色信息
const editInvestigation = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    subLoading.value = true;
    if (valid) {
      const { data } = await editInvestigationApi(formInvestigation);
      if (data.status === 200) {
        ElMessage.success(data.message);
        emit("success");
      } else {
        ElMessage.error(data.message);
      }
    } else {
      ElMessage.error("提交失败，你还有未填写的项！");
      console.log("error submit!", fields);
    }
    subLoading.value = false;
  });
};
// 取消表单
const close = () => {
  emit("closeEditInvestigationForm");
};
</script>

<style scoped>
.dialong__button--wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
