<template>
  <div ref="chart" style="width: 100%; height: 400px"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import { defineProps } from 'vue';

interface RuleForm {
  ChineseScore: number;
  EnglishScore: number;
  MathScore: number;
  LastChineseScore: number;
  LastEnglishScore: number;
  LastMathScore: number;
  name: string;
}

const props = defineProps<{ ruleForm: RuleForm }>();
const chart = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

onMounted(() => {
  // 初始化ECharts实例
  myChart = echarts.init(chart.value as HTMLDivElement);
  // 在这里配置你的ECharts图表
  myChart.setOption({
    xAxis: {
      type: "category",
      data: ["语文", "数学", "英语"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [props.ruleForm.ChineseScore, props.ruleForm.MathScore, props.ruleForm.EnglishScore],
        type: "line", // 实线
      },
      {
        data: [props.ruleForm.LastChineseScore, props.ruleForm.LastMathScore, props.ruleForm.LastEnglishScore],
        type: "line", // 虚线
        lineStyle: {
          type: "dashed",
        },
      },
    ],
  });

  // 监听窗口大小变化，自适应图表
  window.addEventListener("resize", () => {
    if (myChart) {
      myChart.resize();
    }
  });
});

// 在组件销毁时销毁ECharts实例
watch(
  () => chart.value,
  () => {
    if (chart.value) {
      return () => {
        window.removeEventListener("resize", () => {
          if (myChart) {
            myChart.resize();
          }
        });
      };
    }
  }
);
</script>
