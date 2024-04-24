<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px"><Histogram /></el-icon
          >个人成绩展示
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="8">
            <el-col :span="24">
              <el-select
                v-model="courseId"
                placeholder="请选择"
                style="width: 100%"
                @change="change"
              >
                <el-option
                  v-for="item in courseOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
          </el-row>
        </div>
        <!--搜索区域 end-->
      </div>
    </template>
    <!--底部 end-->

    <!--表格区域 start-->
    <div class="table-box">
      <el-table
        element-loading-text="数据加载中..."
        :data="user ? heighStudentsList : lowStudentsList"
        style="width: 100%; text-align: center"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{
          fontSize: '15px',
          background: '#178557',
          color: 'white',
          textAlign: 'center',
        }"
      >
        <el-table-column label="学号">
          <template #default="scope">
            <span>{{ scope.row.stuno }}</span>
          </template>
        </el-table-column>

        <el-table-column label="学生姓名">
          <template #default="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="班级名称">
          <template #default="scope">
            <span>{{ scope.row.classname }}</span>
          </template>
        </el-table-column>

        <el-table-column label="语文">
          <template #default="scope">
            <span>{{ scope.row.ChineseScore }}</span>
          </template>
        </el-table-column>

        <el-table-column label="数学">
          <template #default="scope">
            <span>{{ scope.row.mathScore }}</span>
          </template>
        </el-table-column>

        <el-table-column label="英语">
          <template #default="scope">
            <span>{{ scope.row.EnglishScore }}</span>
          </template>
        </el-table-column>

        <el-table-column label="总分">
          <template #default="scope">
            <span>{{
              scope.row.ChineseScore +
              scope.row.EnglishScore +
              scope.row.mathScore
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--表格区域 end-->
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from "vue";
import { allScoresCensusApi } from "../../api/census/census";

// 定义
let user = ref(true);
const courseId = ref();
const courseOptions = ref([
  { id: 1, name: "优秀榜单" },
  { id: 2, name: "待关注学生" },
]);

interface math {
  name: string;
  mathScore: number;
}
interface English {
  name: string;
  EnglishScore: number;
}
interface Chinese {
  name: string;
  ChineseScore: number;
}

interface other {
  stuno: string;
  name: string;
  classname: string;
}
interface Students {
  stuno: string;
  name: string;
  classname: string;
  mathScore: number;
  EnglishScore: number;
  ChineseScore: number;
}
const mathList: math[] = [];

const EnglishList: English[] = [];

const ChineseList: Chinese[] = [];

const otherList: other[] = [];

const heighStudentsList = ref<Students[]>([]);
const lowStudentsList = ref<Students[]>([]);

const getIndexTotal = async () => {
  const { data } = await allScoresCensusApi();
  //console.log({ data })

  if (data.status === 200) {
    // seriesData.value = data.result;
    for (let key in data.result) {
      mathList.push({
        name: data.result[key].name,
        mathScore: data.result[key].数学,
      });
      EnglishList.push({
        name: data.result[key].name,
        EnglishScore: data.result[key].英语,
      });
      ChineseList.push({
        name: data.result[key].name,
        ChineseScore: data.result[key].语文,
      });
      otherList.push({
        stuno: data.result[key].stuno,
        name: data.result[key].name,
        classname: data.result[key].classname,
      });
    }
    for (let i = 0; i < otherList.length; i++) {
      if (
        mathList[i].mathScore > 60 &&
        EnglishList[i].EnglishScore > 60 &&
        ChineseList[i].ChineseScore > 60 &&
        mathList[i].mathScore +
          EnglishList[i].EnglishScore +
          ChineseList[i].ChineseScore >
          240
      ) {
        heighStudentsList.value.push({
          name: otherList[i].name,
          stuno: otherList[i].stuno,
          classname: otherList[i].classname,
          mathScore: mathList[i].mathScore,
          EnglishScore: EnglishList[i].EnglishScore,
          ChineseScore: ChineseList[i].ChineseScore,
        });
        // tableData.splice(0, 2);
      }
      if (
        mathList[i].mathScore +
          EnglishList[i].EnglishScore +
          ChineseList[i].ChineseScore <
        180
      ) {
        lowStudentsList.value.push({
          name: otherList[i].name,
          stuno: otherList[i].stuno,
          classname: otherList[i].classname,
          mathScore: mathList[i].mathScore,
          EnglishScore: EnglishList[i].EnglishScore,
          ChineseScore: ChineseList[i].ChineseScore,
        });
      }
    }
  }
  // 按总分排序
  heighStudentsList.value.sort((a, b) => {
      const totalScoreA = a.mathScore + a.EnglishScore + a.ChineseScore;
      const totalScoreB = b.mathScore + b.EnglishScore + b.ChineseScore;
      return totalScoreB - totalScoreA; // 降序排列
    });
};

const change = () => {
  if (courseId.value == 2) {
    user.value = false;
  }else{
    user.value = true;
  }
};

//挂载后加载数据
onBeforeMount(() => {
  getIndexTotal();
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
</style>
