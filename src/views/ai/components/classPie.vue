<template>
  <div ref="chart" style="width: 100%; height: 400px"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import { defineProps } from 'vue';

interface scoreForm {
  failed: number,
  general: number,
  good: number,
  excellent: number,
}

const props = defineProps<{ scoreForm: scoreForm }>();
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
          { value: props.scoreForm.excellent, name: "优秀" },
          { value: props.scoreForm.good, name: "良好" },
          { value: props.scoreForm.general, name: "一般" },
          { value: props.scoreForm.failed, name: "不及格" },
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
