<template>
  <div ref="chart" style="width: 100%; height: 400px"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import { defineProps } from 'vue';

// 使用 defineProps 来声明 props
const props = defineProps({
  // 声明名为 scoreListProp 的 prop，类型为数组
  scoreListProp: {
    type: Array as () => number[],
    required: true,
  },
});

const chart = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

onMounted(() => {
  // 初始化ECharts实例
  myChart = echarts.init(chart.value as HTMLDivElement);
  // 设置 x 轴数据
  const xAxisData = Array.from({ length: props.scoreListProp.length }, (_, index) => (index + 1).toString());
  // 在这里配置你的ECharts图表
  myChart.setOption({
    xAxis: {
      type: "category",
      data: xAxisData,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: props.scoreListProp, // 将 props 中的数据传递给 ECharts
        type: "bar", 
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
