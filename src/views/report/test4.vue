<template>
  <basic-container>
    <h1>页面开发中...</h1>
    <h3>{{this.$route.path}} - {{this.$route.name}}</h3>
    <el-row :span="24" style="margin-top:10px">
      <el-col :span="18">
        <basic-container>
          <ve-line :data="chartData" :settings="chartSettings" :extend="extend"></ve-line>
        </basic-container>
      </el-col>
      <el-col :span="6">
        <basic-container>
          <ve-liquidfill :data="chartData2"></ve-liquidfill>
        </basic-container>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
export default {
  data() {
    (this.extend = {
      "xAxis.0.axisLabel.rotate": 45,
      series: {
        label: {
          normal: {
            show: false
          }
        }
      }
    }),
      (this.chartSettings = {
        axisSite: { right: ["识别率"] },
        yAxisType: ["KMB", "percent"],
        yAxisName: ["数值", "比率"],
        area: false
      });
    return {
      chartData2: {
        columns: ["city", "percent"],
        rows: [
          {
            city: "上海",
            percent: 0.76
          }
        ]
      },
      chartData: {
        columns: ["日期", "畜禽总数", "扫描总数", "识别率"],
        rows: [
          { 日期: "11/1", 畜禽总数: 1393, 扫描总数: 1093, 识别率: 0.32 },
          { 日期: "11/2", 畜禽总数: 3530, 扫描总数: 3230, 识别率: 0.26 },
          { 日期: "11/3", 畜禽总数: 2923, 扫描总数: 2623, 识别率: 0.76 },
          { 日期: "11/4", 畜禽总数: 1723, 扫描总数: 1423, 识别率: 0.49 },
          { 日期: "11/5", 畜禽总数: 3792, 扫描总数: 3492, 识别率: 0.323 },
          { 日期: "11/6", 畜禽总数: 4593, 扫描总数: 4293, 识别率: 0.78 },
          { 日期: "11/7", 畜禽总数: 3291, 扫描总数: 3203, 识别率: 0.55 }
        ]
      }
    };
  }
};
</script>

<style>
</style>
