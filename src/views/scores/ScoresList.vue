<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px"><Money /></el-icon>班级科目成绩
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="12">
            <el-col :span="5">
              <el-select
                v-model="gradeClassId"
                placeholder="请选择班级"
                style="width: 100%"
              >
                <el-option
                  v-for="item in gradeClassOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select
                v-model="courseId"
                placeholder="请选择科目"
                style="width: 100%"
              >
                <el-option
                  v-for="item in courseOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button plain color="#2fa7b9" @click="registerScores"
                >登记成绩</el-button
              >
              <el-button plain @click="exportExcelAction" type="primary">
                <el-icon style="margin-right: 1px"><Download /></el-icon>导出
                Excel
              </el-button>
            </el-col>
            <el-col :span="3">
              <el-input
                v-model="stuno"
                @keyup.enter.native="search"
                placeholder="学号搜索（回车）"
              />
            </el-col>
            <el-col :span="3">
              <el-input
                v-model="name"
                @keyup.enter.native="search"
                placeholder="姓名搜索（回车）"
              />
            </el-col>
            <el-col
              :span="2"
              style="
                display: inline-flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
              "
            >
              <el-icon style="font-size: 20px; color: #b3b6bc" @click="refresh">
                <Refresh />
              </el-icon>
            </el-col>
          </el-row>
        </div>
        <!--搜索区域 end-->
      </div>
    </template>
    <!--头部 end-->
    <!--表格区域 start-->
    <div class="table-box">
      <el-table
        row-key="id"
        element-loading-text="数据加载中..."
        v-loading="loading"
        :data="tableData"
        style="width: 100%; text-align: center"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{
          fontSize: '15px',
          background: '#178557',
          color: 'white',
          textAlign: 'center',
        }"
        @cell-dblclick="celldblclick"
      >
        <!-- <el-table-column
          label="序号"
          width="100"
          type="index"
          :index="Nindex"
        /> -->
        <el-table-column label="学号" prop="student.stuno">
          <template #default="scope">
            <span>{{ scope.row.student.stuno }}</span>
          </template>
        </el-table-column>

        <el-table-column label="学生姓名" prop="name">
          <template #default="scope">
            <el-button @click="handleClick(scope.row.student.name)" round
              ><span> {{ scope.row.student.name }}</span></el-button
            >
          </template>
        </el-table-column>

        <el-table-column prop="coursename" label="学科">
          <template #default="scope">
            <span>{{ scope.row.course.coursename }}</span>
          </template>
        </el-table-column>

        <el-table-column>
          <template #header>
            <span> 成绩 </span>
            <el-icon>
              <Edit />
            </el-icon>
          </template>
          <template #default="scope">
            <div
              @click="
                scoreDialogVisibleChange();
                id = scope.row.id;
              "
            >
              {{ scope.row.score }}
              <el-icon>
                <Edit />
              </el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column>
          <template #header>
            <span> 上次成绩 </span>
          </template>

          <template #default="scope">
            {{ scope.row.oldScore }}
          </template>
        </el-table-column>

        <el-table-column label="类型" prop="type">
          <template #default="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column label="成绩跟踪">
          <template #default="scope">
            <el-button round @click="handleClick1(scope.row.student.name)">
              <span>学生成绩跟踪</span>
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="评价生成" prop="name">
          <template #default="scope">
            <el-button
              round
              @click="
                handleClick2(
                  scope.row.student.name,
                  scope.row.course.coursename,
                  scope.row.student.stuno,
                  scope.row.gradeClass.name
                )
              "
              ><span>学生评价生成</span></el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="教学策略" prop="name">
          <template #default="scope">
            <el-button round @click="handleClick3(scope.row.student.name)"
              ><span>教学策略生成</span></el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--个人成绩-->
    <el-dialog align-center v-model="prosonScores" width="62%" destroy-on-close>
      <ScoreContrastCensusBar
        :categoryData="categoryData"
        :seriesData="seriesData"
        height="360px"
        width="900px"
        id="pie"
      />
    </el-dialog>
    <!--成绩跟踪-->
    <el-dialog
      v-model="centerDialogVisible"
      title="成绩跟踪"
      width="1000"
      center
      destroy-on-close
    >
      <ScoreContrastCensusBar
        :categoryData="categoryData1"
        :seriesData="seriesLastData"
        height="360px"
        width="900px"
        id="pie"
      />
      <text style="font-size: 25px">
        该同学数学成绩{{
          judgment(seriesLastData.data[0], seriesLastData.data[1])
        }}， 英语成绩{{
          judgment(seriesLastData.data[2], seriesLastData.data[3])
        }}， 语文成绩{{
          judgment(seriesLastData.data[4], seriesLastData.data[5])
        }}。
        {{ mathJudge(seriesLastData.data[0]) }}
        {{ EnglishJudge(seriesLastData.data[2]) }}
        {{ ChineseJudge(seriesLastData.data[4]) }}
      </text>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="centerDialogVisible = false">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!--成绩编辑-->
    <el-dialog
      v-model="scoreDialogVisible"
      title="成绩录入"
      width="500"
      align-center
      destroy-on-close
    >
      <el-input
        clearable
        v-model="score"
        placeholder="请输入总分"
        size="small"
      ></el-input>
      <br />
      <br />
      <el-input
        clearable
        v-model="baseScore"
        placeholder="请输入基础分"
        size="small"
      ></el-input>
      <br />
      <br />
      <el-input
        v-model="difficultScore"
        clearable
        placeholder="请输入重难点分数"
        size="small"
      ></el-input>
      <br />
      <br />
      <el-input
        v-model="oldScore"
        clearable
        placeholder="请输入上次分数"
        size="small"
      ></el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="scoreDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="scoreDialogVisibleSave">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!--学生评价-->
    <el-dialog v-model="reviewsDialogVisible" title="" center destroy-on-close>
      <el-card ref="tableRef">
        <el-descriptions title="三年级1班语文成绩分析" :column="3" border>
          <el-descriptions-item
            label="学生姓名"
            label-align="right"
            align="center"
            label-class-name="my-label"
            class-name="my-content"
            width="150px"
          >
            {{ studentName }}
          </el-descriptions-item>
          <el-descriptions-item
            label="开课单位"
            label-align="right"
            align="center"
          >
            番茄市第一小学
          </el-descriptions-item>
          <el-descriptions-item label="教师" label-align="right" align="center">
            {{ teacherName }}
          </el-descriptions-item>
          <el-descriptions-item label="班级" label-align="right" align="center">
            <!-- 三年级1班 -->{{ gradeClassName }}
          </el-descriptions-item>
          <el-descriptions-item
            label="试卷性质"
            label-align="right"
            align="center"
          >
            期末考试
          </el-descriptions-item>
          <el-descriptions-item
            label="考试科目"
            label-align="right"
            align="center"
          >
            {{ courseName }}
          </el-descriptions-item>
          <el-descriptions-item label="学号" label-align="right" align="center">
            {{ studentId }}
          </el-descriptions-item>
          <el-descriptions-item
            label="监考老师"
            label-align="right"
            align="center"
          >
            {{ invigilateTeacher }}
          </el-descriptions-item>
          <el-descriptions-item
            label="有无作弊"
            label-align="right"
            align="center"
          >
            无
          </el-descriptions-item>
        </el-descriptions>
        <el-card shadow="never">
          <ScoreContrastCensusBar
            :categoryData="categoryData2"
            :seriesData="seriesAllData"
            height="200px"
            width="650px"
            id="pie"
          />
        </el-card>
        <el-descriptions :column="3" border>
          <el-descriptions-item
            label="学生评价"
            label-align="right"
            width="150px"
          >
            1、数学成绩：{{ judgment1(seriesAllData.data[0], "数学")
            }}{{ judgment2(seriesAllData.data[1], "数学基础题")
            }}{{ judgment2(seriesAllData.data[2], "数学重难点题") }}成绩总体{{
              judgment(seriesAllData.data[0], seriesAllData.data[3])
            }}； 2、英语成绩：{{ judgment1(seriesAllData.data[4], "英语")
            }}{{ judgment2(seriesAllData.data[5], "英语基础题")
            }}{{ judgment2(seriesAllData.data[6], "英语重难点题") }}成绩总体{{
              judgment(seriesAllData.data[4], seriesAllData.data[7])
            }}； 3、语文成绩：{{ judgment1(seriesAllData.data[8], "语文")
            }}{{ judgment2(seriesAllData.data[9], "语文基础题")
            }}{{ judgment2(seriesAllData.data[10], "语文重难点题") }}成绩总体{{
              judgment(seriesAllData.data[8], seriesAllData.data[11])
            }}。
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
    <!--教学策略-->
    <el-dialog v-model="StrategyDialogVisible" title="" center destroy-on-close>
      <el-card ref="tableRef">
        {{studentName}}成绩
        <el-card shadow="never">
          <ScoreContrastCensusBar
            :categoryData="categoryData2"
            :seriesData="seriesAllData"
            height="200px"
            width="650px"
            id="pie"
          />
        </el-card>
        <el-descriptions :column="3" border>
          <el-descriptions-item
            label="教学策略"
            label-align="right"
            width="150px"
          >
            {{ mathJudge1(seriesAllData.data[0]) }}
            {{ EnglishJudge1(seriesAllData.data[4]) }}
            {{ ChineseJudge1(seriesAllData.data[8]) }}
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

    <!--分页 start-->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      v-model:page-size="pageSize"
      @current-change="changePage"
      :page-sizes="[10]"
    />
    <!--分页 end-->
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from "vue";
// 定义班级下拉选择项
import { gradeClassListApi } from "../../api/student/student";
import { getAllCourseListApi } from "../../api/teacher/teacher";
import {
  deleteScoresApi,
  editScoresApi,
  getScoresListApi,
  registerScoresApi,
  editLastScoresApi,
} from "../../api/scores/scores";
import { formatTime } from "../../utils/date";
import { ElMessage } from "element-plus";
import { exportExcel } from "../../utils/exprotExcel";
import ScoreContrastCensusBar from "./components/ScoreContrastCensusBar.vue";
import { allScoresCensusApi } from "../../api/census/census";
import html2canvas from "html2canvas";
// 成绩跟踪弹窗
const centerDialogVisible = ref(false);

// 个人评价弹窗
const reviewsDialogVisible = ref(false);

// 教学策略弹窗
const StrategyDialogVisible = ref(false);

//个人成绩弹窗
const prosonScores = ref(false);
//编辑成绩弹框
const scoreDialogVisible = ref(false);

//分数、总分、基础分、重难点分
const id = ref(0);
const score = ref();
const baseScore = ref();
const difficultScore = ref();
const oldScore = ref();

//弹窗学生名字
const studentName = ref("");
//弹窗科目
const courseName = ref("");

//弹窗学号
const studentId = ref("");

//弹窗班级
const gradeClassName = ref("");

//教师
const teacherName = ref("");

//监考老师
const invigilateTeacher = ref("");

//成绩判断
const judgment = (a: number, b: number) => {
  if (a - b >= 10) {
    return "进步";
  } else if (a - b <= -10) {
    return "退步";
  } else {
    return "总体平稳";
  }
};
const mathJudge = (a: number) => {
  if (a >= 90) {
    return "数学成绩优秀。";
  } else if (a < 60) {
    return "数学成绩不足。";
  } else {
    return "";
  }
};
const EnglishJudge = (a: number) => {
  if (a >= 90) {
    return "英语成绩优秀。";
  } else if (a < 60) {
    return "英语成绩不足。";
  } else {
    return "";
  }
};
const ChineseJudge = (a: number) => {
  if (a >= 90) {
    return "语文成绩优秀。";
  } else if (a < 60) {
    return "语文成绩不足。";
  } else {
    return "";
  }
};

const judgment1 = (a: number, b: string) => {
  if (a >= 90) {
    return "该同学" + b + "成绩优秀，";
  } else if (a < 60) {
    return "该同学" + b + "成绩不足，";
  } else {
    return "该同学" + b + "成绩一般，";
  }
};
const judgment2 = (a: number, b: string) => {
  if (a > 42) {
    return "该同学" + b + "成绩优秀，";
  } else if (a < 30) {
    return "该同学" + b + "成绩不足，";
  } else {
    return "该同学" + b + "成绩一般，";
  }
};

const mathJudge1 = (a: number) => {
  if (a >= 90) {
    return "学生数学成绩优秀，教学中应拓展数学知识领域，引导学生拓展数学知识的领域，包括数学分析、线性代数、离散数学、概率统计等。提供相关领域的学习材料和资源，让学生在更深层次上理解和应用数学知识。培养问题解决能力，注重培养学生的问题解决能力和创新能力。鼓励学生独立思考、勇于探索，通过解决实际问题或设计数学证明来提升他们的数学思维能力。引导研究性学习，鼓励学生展开独立的数学研究项目，例如选择一个感兴趣的数学课题进行深入研究。提供指导和资源支持，帮助学生培养研究问题、提出假设、验证结论的能力。";
  } else if (a < 60) {
    return "学生数学成绩较差，教学中应找出问题根源：首先要深入了解学生数学学习中存在的问题，可能的原因包括基础薄弱、学习方法不当、学习动力不足等。只有了解问题的根源，才能有针对性地制定解决方案。重点强调数学基础知识的学习，包括算术、代数、几何等方面。通过系统化的教学和练习，帮助学生夯实基础，打好数学学习的基础。";
  } else {
    return "学生数学成绩一般，教学中应巩固基础知识，确保学生对数学基础知识有扎实的掌握，包括算术、代数、几何等方面。通过课堂讲解、练习题和复习资料等方式，帮助学生夯实基础，建立自信心。注培养学生的问题解决能力和数学思维能力。鼓励他们多做数学实践题和应用题，通过解决实际问题来理解和运用数学知识，提高解决问题的能力。";
  }
};
const EnglishJudge1 = (a: number) => {
  if (a >= 90) {
    return "学生英语成绩优秀，教学中应引导独立研究和思考，鼓励学生展开独立的语言研究项目，例如选择一个感兴趣的语言现象或语言问题进行深入研究。提供指导和资源支持，培养学生的自主学习和研究能力。促进创新和创意，鼓励学生在语言运用和表达上展现创新和创意。可以组织创意写作比赛、演讲比赛等活动，让学生有机会展示自己的语言才华和创造力。";
  } else if (a < 60) {
    return "学生英语成绩较差，教学中应鼓励口语表达，鼓励学生多参与口语练习，例如组织小组讨论、演讲比赛等活动。通过实践中的反复练习，学生可以逐渐提高口语表达能力，增强自信心。个性化辅导，针对每个学生的学习特点和问题，提供个性化的辅导和支持。可以通过一对一或小组辅导的方式，针对性地解决学生的困惑和疑惑。";
  } else {
    return "学生英语成绩一般，教学中应巩固基础知识：确保学生对英语的基础知识有扎实的掌握，包括词汇量、语法知识和基本句型。可以通过定期复习和练习来巩固这些知识，确保学生能够在实际应用中灵活运用。拓展语言运用能力：帮助学生提高语言运用能力，包括听、说、读、写四个方面。通过多样化的练习和活动，如听力理解、口语表达、阅读理解、写作练习等，全面提升学生的语言能力。强化阅读理解能力：鼓励学生多读英语原版的文章、故事、新闻等，提高阅读理解能力。可以选择适合学生水平的阅读材料，并配合问题回答、讨论等方式，帮助学生理解文章内容。";
  }
};
const ChineseJudge1 = (a: number) => {
  if (a >= 90) {
    return "学生语文成绩优秀，教学中应鼓励创造性思维和表达，给予学生更多的自主权，鼓励他们在作文、辩论、诗歌创作等方面展现创造性和独立思考能力。提供个性化的写作任务，让他们有机会发挥自己的想象力和文学才华。拓展语文教学的广度和深度，涉及语言学、修辞学、文学批评等领域，让学生了解语言背后的逻辑和文化内涵，培养对语言的敏感性和理解能力。鼓励学生展开自主研究项目，例如选择一个感兴趣的主题进行深入研究，并撰写论文或做报告。提供指导和资源支持，但让学生主导整个研究过程，培养他们的自学能力和批判性思维。";
  } else if (a < 60) {
    return "学生语文成绩较差，教学中应激发学习兴趣，通过生动有趣的故事、实用的例子、有趣的活动等方式，激发学生对语文学习的兴趣和热情。让学生能够主动参与到学习中来，提高学习积极性。鼓励积极参与，给予学生充分的鼓励和肯定，激励他们参与课堂活动和学习任务。建立良好的师生关系，给予学生足够的支持和信心，帮助他们克服困难，取得进步。";
  } else {
    return "学生语文成绩一般，教学中应强化阅读和写作能力，注重培养学生的阅读理解能力和写作表达能力。通过阅读理解训练、写作指导、写作比赛等方式，提高学生的语文表达水平。鼓励自主学习，培养学生的自主学习能力，让他们能够主动查找资料、解决问题、总结经验。提供适当的学习指导和资源支持，引导学生形成良好的学习习惯。";
  }
};

const handleClick = (name: string) => {
  prosonScores.value = true;
  seriesData.value.data = [];
  let sum = 0;
  for (let i = 0; i < mathList.length; i++) {
    if (name === mathList[i].name) {
      seriesData.value.data.push(mathList[i].mathScore);
      sum += mathList[i].mathScore;
    }
  }
  for (let i = 0; i < EnglishList.length; i++) {
    if (name === EnglishList[i].name) {
      seriesData.value.data.push(EnglishList[i].EnglishScore);
      sum += EnglishList[i].EnglishScore;
    }
  }
  for (let i = 0; i < ChineseList.length; i++) {
    if (name === ChineseList[i].name) {
      seriesData.value.data.push(ChineseList[i].ChineseScore);
      sum += ChineseList[i].ChineseScore;
    }
  }
  seriesData.value.data.push(sum);
};

const handleClick1 = (name: string) => {
  centerDialogVisible.value = true;
  seriesLastData.value.data = [];

  for (let i = 0; i < mathList.length; i++) {
    if (name === mathList[i].name) {
      seriesLastData.value.data.push(mathList[i].mathScore);
      seriesLastData.value.data.push(mathList[i].mathLastScore);
    }
  }
  for (let i = 0; i < EnglishList.length; i++) {
    if (name === EnglishList[i].name) {
      seriesLastData.value.data.push(EnglishList[i].EnglishScore);
      seriesLastData.value.data.push(EnglishList[i].EnglishLastScore);
    }
  }
  for (let i = 0; i < ChineseList.length; i++) {
    if (name === ChineseList[i].name) {
      seriesLastData.value.data.push(ChineseList[i].ChineseScore);
      seriesLastData.value.data.push(ChineseList[i].ChineseLastScore);
    }
  }
};

const handleClick2 = (
  name: string,
  coursename: string,
  stuno: string,
  classname: string
) => {
  studentName.value = name;
  courseName.value = coursename;
  studentId.value = stuno;
  gradeClassName.value = classname;
  teacherName.value =
    coursename == "英语" ? "大东" : coursename == "数学" ? "小北" : "大南";
  invigilateTeacher.value =
    coursename == "英语" ? "小东" : coursename == "数学" ? "大北" : "小南";

  reviewsDialogVisible.value = true;
  seriesAllData.value.data = [];

  for (let i = 0; i < mathList.length; i++) {
    if (name === mathList[i].name) {
      seriesAllData.value.data.push(mathList[i].mathScore);

      seriesAllData.value.data.push(mathList[i].mathBaseScore);
      seriesAllData.value.data.push(mathList[i].mathDifficultScore);
      seriesAllData.value.data.push(mathList[i].mathLastScore);
    }
  }
  for (let i = 0; i < EnglishList.length; i++) {
    if (name === EnglishList[i].name) {
      seriesAllData.value.data.push(EnglishList[i].EnglishScore);

      seriesAllData.value.data.push(EnglishList[i].EnglishBaseScore);
      seriesAllData.value.data.push(EnglishList[i].EnglishDifficultScore);
      seriesAllData.value.data.push(EnglishList[i].EnglishLastScore);
    }
  }
  for (let i = 0; i < ChineseList.length; i++) {
    if (name === ChineseList[i].name) {
      seriesAllData.value.data.push(ChineseList[i].ChineseScore);

      seriesAllData.value.data.push(ChineseList[i].ChineseBaseScore);
      seriesAllData.value.data.push(ChineseList[i].ChineseDifficultScore);
      seriesAllData.value.data.push(ChineseList[i].ChineseLastScore);
    }
  }
  //console.log(seriesAllData.value.data);
};

const handleClick3 = (name: string) => {
  studentName.value = name;
  StrategyDialogVisible.value = true;
  seriesAllData.value.data = [];

  for (let i = 0; i < mathList.length; i++) {
    if (name === mathList[i].name) {
      seriesAllData.value.data.push(mathList[i].mathScore);

      seriesAllData.value.data.push(mathList[i].mathBaseScore);
      seriesAllData.value.data.push(mathList[i].mathDifficultScore);
      seriesAllData.value.data.push(mathList[i].mathLastScore);
    }
  }
  for (let i = 0; i < EnglishList.length; i++) {
    if (name === EnglishList[i].name) {
      seriesAllData.value.data.push(EnglishList[i].EnglishScore);

      seriesAllData.value.data.push(EnglishList[i].EnglishBaseScore);
      seriesAllData.value.data.push(EnglishList[i].EnglishDifficultScore);
      seriesAllData.value.data.push(EnglishList[i].EnglishLastScore);
    }
  }
  for (let i = 0; i < ChineseList.length; i++) {
    if (name === ChineseList[i].name) {
      seriesAllData.value.data.push(ChineseList[i].ChineseScore);

      seriesAllData.value.data.push(ChineseList[i].ChineseBaseScore);
      seriesAllData.value.data.push(ChineseList[i].ChineseDifficultScore);
      seriesAllData.value.data.push(ChineseList[i].ChineseLastScore);
    }
  }
};

const categoryData = ref(["数学", "英语", "语文", "总分"]);

const categoryData1 = ref([
  "数学",
  "上次数学",
  "英语",
  "上次英语",
  "语文",
  "上次语文",
]);

const categoryData2 = ref([
  "数学",
  "数学基础",
  "数学重难点",
  "上次数学",
  "英语",
  "英语基础",
  "英语重难点",
  "上次英语",
  "语文",
  "语文基础",
  "语文重难点",
  "上次语文",
]);

// const seriesData = ref();
const seriesData = ref<{
  data: number[];
  type: string;
  label: {
    show: boolean;
    position: string;
  };
}>({
  data: [],
  type: "bar",
  label: {
    show: true,
    position: "inside",
  },
});

const seriesLastData = ref<{
  data: number[];
  type: string;
  label: {
    show: boolean;
    position: string;
  };
}>({
  data: [],
  type: "bar",
  label: {
    show: true,
    position: "inside",
  },
});

const seriesAllData = ref<{
  data: number[];
  type: string;
  label: {
    show: boolean;
    position: string;
  };
}>({
  data: [],
  type: "bar",
  label: {
    show: true,
    position: "inside",
  },
});

// seriesData.value.data.push(30);

interface math {
  name: string;
  mathScore: number;
  mathLastScore: number;
  mathBaseScore: number;
  mathDifficultScore: number;
}
interface English {
  name: string;
  EnglishScore: number;
  EnglishLastScore: number;
  EnglishBaseScore: number;
  EnglishDifficultScore: number;
}
interface Chinese {
  name: string;
  ChineseScore: number;
  ChineseLastScore: number;
  ChineseBaseScore: number;
  ChineseDifficultScore: number;
}

const mathList: math[] = [];

const EnglishList: English[] = [];

const ChineseList: Chinese[] = [];
const getIndexTotal = async () => {
  const { data } = await allScoresCensusApi();

  //console.log({ data });
  if (data.status === 200) {
    // seriesData.value = data.result;
    for (let key in data.result) {
      mathList.push({
        name: data.result[key].name,
        mathScore: data.result[key].数学,
        mathLastScore: data.result[key].上次数学,
        mathBaseScore: data.result[key].数学基础,
        mathDifficultScore: data.result[key].数学重难点,
      });
      EnglishList.push({
        name: data.result[key].name,
        EnglishScore: data.result[key].英语,
        EnglishLastScore: data.result[key].上次英语,
        EnglishBaseScore: data.result[key].英语基础,
        EnglishDifficultScore: data.result[key].英语重难点,
      });
      ChineseList.push({
        name: data.result[key].name,
        ChineseScore: data.result[key].语文,
        ChineseLastScore: data.result[key].上次语文,
        ChineseBaseScore: data.result[key].语文基础,
        ChineseDifficultScore: data.result[key].语文重难点,
      });
    }
    // console.log(data.result)
  }
};

// 定义班级ID
const gradeClassId = ref(null);
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
const courseId = ref(null);
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

const state = reactive({
  // 学号
  stuno: "",
  // 姓名搜索
  name: "",
  // 表格全部信息
  tableData: [],
  total: 0, //总条数
  pageSize: 10, //每页显示行数
  pageIndex: 1, //当前页码
  loading: false, // 数据加载
});
// 获取成绩列表数据
const loadData = async (state: any) => {
  state.loading = true;
  // 先清空数据
  state.tableData = [];
  const params = {
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    name: state.name,
    stuno: state.stuno,
    courseId: courseId.value,
    gradeClassId: gradeClassId.value,
  };
  const { data } = await getScoresListApi(params);
  state.tableData = data.content;
  state.total = data.totalElements;
  state.loading = false;
};
const Nindex = (index: number) => {
  // 当前页数 - 1 * 每页数据条数 + 1
  const page = state.pageIndex; // 当前页码
  const pagesize = state.pageSize; // 每页条数
  return index + 1 + (page - 1) * pagesize;
};
// 刷新按钮
const refresh = () => {
  // 根据姓名搜索
  state.name = "";
  // 根据学号搜索
  state.stuno = "";
  // 课程ID
  courseId.value = "";
  // 班级id
  gradeClassId.value = "";
  // 更新数据
  loadData(state);
};
// 搜索
const search = () => {
  if (state.name !== null && state.name !== "") {
    ElMessage({
      type: "success",
      message: `学生姓名“${state.name}”搜索内容如下`,
    });
    loadData(state);
  }

  if (state.stuno !== null && state.stuno !== "") {
    ElMessage({
      type: "success",
      message: `学号“${state.stuno}”搜索内容如下`,
    });
    loadData(state);
  }
};
// 切换页面的执行事件，  val 当前页码
const changePage = (val) => {
  state.pageIndex = val;
  loadData(state);
};

// 登记班级学科成绩
const registerScores = async () => {
  if (gradeClassId.value < 1) {
    ElMessage.success("请选择班级");
    //console.log("gradeClassId.value:", gradeClassId.value);
    return false;
  }
  if (courseId.value < 1) {
    ElMessage.success("请选择学科");
    return false;
  }
  const { data } = await registerScoresApi(gradeClassId.value, courseId.value);
  if (data.status === 200) {
    await loadData(state);
    ElMessage.success(data.message);
  } else {
    ElMessage.error(data.message);
  }
};

// 定义单元格是否可编辑
const edit = ref(false);
// 双击单元格函数
const celldblclick = (row, column, cell, event) => {
  const scoreTarget: any = state.tableData.find((item) => {
    return item.id === row.id;
  });
  if (scoreTarget !== undefined) {
    scoreTarget._originalData = { ...scoreTarget };
    scoreTarget.edit = !scoreTarget.edit;
  }
};
// 取消编辑
const cancel = (key: any) => {
  key._originalData = { ...key };
  key.edit = !key.edit;
};
// 保存编辑上次成绩
const editScores = async (record: { id: any; score: any }) => {
  loading.value = true;
  const { id, score } = record;
  //console.log(id);
  if (!score) {
    loading.value = false;
    ElMessage.error("提交失败，请更改成绩！");
    return;
  }
  const { data } = await editLastScoresApi(id, score);
  if (data.status === 200) {
    ElMessage.success(data.message);
    await loadData(state);
  } else {
    ElMessage.error(data.message);
  }
  loading.value = false;
};

// 删除成绩信息
const delScores = async (id: number) => {
  const { data } = await deleteScoresApi(id);
  if (data.status === 200) {
    ElMessage.success("删除成功");
    await loadData(state);
  } else {
    ElMessage.error("删除失败");
  }
};
// 导出列表
const column = [
  { name: "id", label: "成绩id" },
  { name: "stuno", label: "学号" },
  { name: "name", label: "学生姓名" },
  { name: "coursename", label: "学科" },
  { name: "score", label: "成绩" },
  { name: "type", label: "类型" },
];
const exportExcelAction = () => {
  // 处理表格数据
  const newTableData = state.tableData.flatMap((item: any) => {
    return { ...item, ...item.course, ...item.student };
  });
  exportExcel({
    column,
    data: newTableData,
    filename: "班级学科成绩数据",
    format: "xlsx",
    autoWidth: true,
  });
};

const scoreDialogVisibleChange = () => {
  scoreDialogVisible.value = true;
};

const scoreDialogVisibleSave = async () => {
  //console.log("aaaa");
  const scoreValue = parseFloat(score.value);
  const baseScoreValue = parseFloat(baseScore.value);
  const difficultScoreValue = parseFloat(difficultScore.value);
  const oldScoreValue = parseFloat(oldScore.value);
  const { data } = await editScoresApi(
    id.value,
    scoreValue,
    baseScoreValue,
    difficultScoreValue,
    oldScoreValue
  );
  score.value = 0;
  baseScore.value = 0;
  difficultScore.value = 0;
  oldScore.value = 0;
  scoreDialogVisible.value = false;
};

const tableRef = ref(null);
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
  getAllCourseList();
  gradeClassList();
  getIndexTotal();
});
const { tableData, pageIndex, pageSize, loading, total, name, stuno } =
  toRefs(state);
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
/*分页样式*/
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #178557;
}

.el-pagination {
  margin-top: 20px;
  justify-content: center;
}
.edit-score {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

/*修改v-loading样式*/
:deep(.el-loading-spinner .el-loading-text) {
  color: #178557;
}
:deep(.el-loading-spinner .path) {
  stroke: #178557;
}
</style>
