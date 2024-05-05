<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px"><Histogram /></el-icon
          >班级科目成绩统计
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="8">
            <el-col :span="9">
              <el-select
                v-model="gradeClassId"
                placeholder="请选择班级"
                style="width: 100%"
                @change="changeCourse"
              >
                <el-option
                  v-for="item in gradeClassOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="9">
              <el-select
                v-model="courseId"
                placeholder="请选择科目"
                style="width: 100%"
                @change="changeCourse"
              >
                <el-option
                  v-for="item in courseOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="1"> </el-col>
            <el-col :span="3">
              <el-button round @click="centerDialogVisible = true"
                >报告生成</el-button
              >
            </el-col>
          </el-row>
        </div>
        <!--搜索区域 end-->
      </div>
    </template>
    <!--头部 end-->
    <el-dialog v-model="centerDialogVisible" title="" center destroy-on-close>
      <el-card ref="tableRef">
        <el-descriptions title="三年级1班语文成绩分析" :column="3" border>
          <el-descriptions-item
            label="班级名称"
            label-align="right"
            align="center"
            label-class-name="my-label"
            class-name="my-content"
            width="150px"
          >
            <!-- 三年级1班 -->
            三年级{{ gradeClassId }}班
          </el-descriptions-item>
          <el-descriptions-item
            label="开课单位"
            label-align="right"
            align="center"
          >
            番茄市第一小学
          </el-descriptions-item>
          <el-descriptions-item label="教师" label-align="right" align="center">
            {{ courseId == 15 ? "大东" : courseId == 16 ? "小北" : "大南" }}
          </el-descriptions-item>
          <el-descriptions-item
            label="试卷性质"
            label-align="right"
            align="center"
          >
            期末考试
          </el-descriptions-item>
          <el-descriptions-item
            label="考试时长"
            label-align="right"
            align="center"
          >
            90分钟
          </el-descriptions-item>
          <el-descriptions-item
            label="考试科目"
            label-align="right"
            align="center"
          >
            <!-- 数学 -->
            {{ courseId == 15 ? "英语" : courseId == 16 ? "数学" : "语文" }}
          </el-descriptions-item>
          <el-descriptions-item
            label="考试日期"
            label-align="right"
            align="center"
          >
            2023.11.11
          </el-descriptions-item>
          <el-descriptions-item
            label="监考老师"
            label-align="right"
            align="center"
          >
            <!-- 小北 -->
            {{ courseId == 15 ? "小东" : courseId == 16 ? "大北" : "小南" }}
          </el-descriptions-item>
          <el-descriptions-item
            label="作弊人数"
            label-align="right"
            align="center"
          >
            无
          </el-descriptions-item>
        </el-descriptions>
        <el-card shadow="never">
          <ScoreCensusPie
            :seriesData="seriesData"
            :legendData="legendData"
            height="280px"
            width="750px"
            id="pie"
          />
        </el-card>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="分数段" />
          <el-table-column prop="不及格" label="不及格（小于60）" />
          <el-table-column prop="较差" label="较差（60~69）" />
          <el-table-column prop="一般" label="一般（70~79）" />
          <el-table-column prop="良" label="良（80~89）" />
          <el-table-column prop="优" label="优（大于89）" />
        </el-table>
        <el-descriptions :column="3" border>
          <el-descriptions-item
            label="班级评价"
            label-align="right"
            width="150px"
          >
            班级不及格人数{{tableData[0].不及格}}个，较差人数{{tableData[0].较差}}个，一般人数{{tableData[0].一般}}个，良好人数{{tableData[0].良}}个，优秀人数{{tableData[0].优}}个。这个班级的整体表现是相当不错的。{{tableData[0].不及格=="0"?"没有不及格的学生，表明学生在学术方面有良好的表现。":"有一些不及格的学生，需要多多关注他们的情况。"}}{{tableData[0].优=="0"?"班级中没有优秀水平的学生，这可能需要探讨是否有改进的空间，以鼓励更多的学生追求卓越。":"班级有优秀的学生，这这部分学生可以带领其他同学一同进步。"}}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="3" border>
          <el-descriptions-item
            label="教学策略"
            label-align="right"
            width="150px"
          >
          个性化支持： 鉴于较差和一般水平的学生较少，可以通过个性化的辅导和支持帮助这些学生提高成绩。这可能包括额外的辅导课程、一对一指导或小组辅导。
          巩固基础知识： 对于较差和一般水平的学生，确保他们对基础知识的掌握是至关重要的。可以通过定期的复习和练习来巩固他们的基础知识，以便他们能够更好地理解和应用更复杂的概念。
          启发兴趣： 创造性地设计课程内容和活动，以激发学生的兴趣和动力。这可以通过实际案例、互动式学习和与日常生活相关的示例来实现，让学生更容易理解和吸收知识。
          提供反馈： 及时、具体和建设性的反馈对于学生的学习至关重要。教师可以定期评估学生的学术表现，并向他们提供反馈和建议，以帮助他们改进。
          鼓励合作学习： 将学生分成小组，让他们一起解决问题和完成任务，可以促进合作精神和互相学习的机会。这种方法还可以提高学生的沟通和团队合作能力。
          多样化评估方式： 使用多样化的评估方式，如小组项目、口头报告、书面作业等，以充分了解学生的理解程度和能力，并鼓励他们以不同的方式展示他们的学习成果。
          </el-descriptions-item>
        </el-descriptions>
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
          <el-button type="primary" @click="centerDialogVisible = false">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!--echarts start-->
    <ScoreCensusPie
      :seriesData="seriesData"
      :legendData="legendData"
      height="400px"
      width="100%"
      id="pie"
    />
    <!--echarts end-->
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
// 定义班级下拉选择项
import { gradeClassListApi } from "../../api/student/student";
import { getAllCourseListApi } from "../../api/teacher/teacher";
import ScoreCensusPie from "./components/ScoreCensusPie.vue";
import { getScoreCensusApi } from "../../api/census/census";
import html2canvas from "html2canvas";

const tableData = ref([
  {
    date: "人数",
    不及格: "0",
    较差: "0",
    一般: "0",
    良: "0",
    优: "0",
  },
]);

//
//班级情况分析描述

//优秀的改进措施

/*
(1)在教学过程中加强各教学环节的成效跟踪与评估，根据反馈结果适当调整教学计划并有针对性地开展学习帮扶，切实提升教学的整体成效。
(2)优化实验指导书，着重引导学生独立实施实验，强化实验过程及结果的整理、分析。
(3)优化作业内容，重点强化作业过程中关于问题的求解、归纳总结以及提出问题等方面的指导。
*/

//中等的改进措施
//较差的改进措施

//报告生成
const centerDialogVisible = ref(false);
// 定义班级ID
const gradeClassId = ref();
const gradeClassOptions = ref<object[]>([]);
// 获取所有班级列表
async function gradeClassList() {
  try {
    const { data } = await gradeClassListApi();
    if (data.status === 200) {
      gradeClassOptions.value = data.result;
    }
  } catch (e) {
    console.log(e);
  }
}
// 定义科目ID
const courseId = ref();
// 定义课程下拉选择项
const courseOptions = ref<object[]>([]);
// 获取所有课程列表
async function getAllCourseList() {
  try {
    const { data } = await getAllCourseListApi();
    if (data.status === 200) {
      courseOptions.value = data.result;
    }
  } catch (e) {
    console.log(e);
  }
}

const legendData = ref(["优", "良", "一般", "较差", "不及格"]);
const seriesData = ref([]);
// 统计班级科目成绩
const getScoreCensus = async () => {
  const { data } = await getScoreCensusApi(courseId.value, gradeClassId.value);

  if (data.status === 200) {
    seriesData.value = data.result;
    tableData.value[0].不及格 = "0";
    tableData.value[0].较差 = "0";
    tableData.value[0].一般 = "0";
    tableData.value[0].良 = "0";
    tableData.value[0].优 = "0";
    seriesData.value.forEach((item) => {
      switch (item.name) {
        case "不及格":
          tableData.value[0].不及格 = item.value.toString();
          break;
        case "较差":
          tableData.value[0].较差 = item.value.toString();
          break;
        case "一般":
          tableData.value[0].一般 = item.value.toString();
          break;
        case "良":
          tableData.value[0].良 = item.value.toString();
          break;
        case "优":
          tableData.value[0].优 = item.value.toString();
          break;
        default:
          break;
      }
    });
  }
};

const changeCourse = async () => {
  if (
    gradeClassId.value !== null &&
    gradeClassId.value !== "" &&
    courseId.value !== null &&
    courseId.value !== ""
  ) {
    await getScoreCensus();
  }
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
  link.download = "三年级" + gradeClassId.value + "班" + (courseId.value === 15 ? "英语" : (courseId.value === 16 ? "数学" : "语文")) + "table_image.png";

  // 触发点击事件以下载图片
  link.click();
};
//挂载后加载数据
onMounted(() => {
  getAllCourseList();
  gradeClassList();
});
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
:deep(.my-label) {
  background: var(--el-color-success-light-9) !important;
}
:deep(.my-content) {
  background: var(--el-color-danger-light-9);
}
</style>
