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
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    // legend: {
    //   orient: "vertical",
    //   left: "left",
    //   data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    // },
    series: [
      {
        name: "成绩",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: [
          { value: props.ruleForm.ChineseScore, name: "语文" },
          { value: props.ruleForm.MathScore, name: "数学" },
          { value: props.ruleForm.EnglishScore, name: "英语" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
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
