<template>
  <basic-container>
    <el-form :inline="true" size="small">
      <el-row :span="24" style="margin-top:10px">
        <el-col :span="20">
          <el-form-item label="养殖基地">
            <el-select v-model="farmId" placeholder="请选择养殖基地">
              <el-option
                v-for="item in farms"
                :key="item.value"
                :label="item.title"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-switch
              v-model="vline"
              active-text="折线图"
              inactive-text="柱状图"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <ve-line v-if="vline" :data="chartData1" :settings="chartSettings" :extend="extend" ></ve-line>
    <ve-histogram v-if="!vline" :data="chartData1" :settings="chartSettings"></ve-histogram>
    <el-divider></el-divider>
    <ve-line v-if="vline" :data="chartData2" :settings="chartSettings" height='250px' :extend="extend"></ve-line>
    <ve-histogram v-if="!vline" :data="chartData2" :settings="chartSettings" height='250px'></ve-histogram>
  </basic-container>
</template>

<script>
import { getAirInfoList } from "@/api/report/acqsensor";
import { getFarmTree } from "@/api/basic/farm";

export default {
  data() {
    (this.extend = {
      series: {
        label: {
          normal: {
            show: true
          }
        }
      }
    }),
      (this.chartSettings = {
        // axisSite: { right: ["二氧化碳"] },
        // yAxisType: ["KMB", "KMB"],
        // yAxisName: ["温湿度"],
        area: false
      });
    return {
      vline: true,
      farms: [],
      farmId: "",
      chartData1: {
        columns: ["时间", "温度", "湿度", "二氧化碳"],
        rows: []
      },
      chartData2: {
        columns: ["时间", "土质PH", "水质PH"],
        rows: []
      }
    };
  },
  methods: {
    setAirInfo(farmId) {
      getAirInfoList(farmId).then(res => {
        this.chartData1.rows = res.data.data;
        this.chartData2.rows = res.data.data;
      });
    },
    handleSearch() {
      console.info(this.farmId);
      this.setAirInfo(this.farmId);
    }
  },
  created: function() {
    getFarmTree("").then(res => {
      this.farms = res.data.data;
      if (this.farms.length > 0) this.farmId = this.farms[0].value;
      this.setAirInfo(this.farmId);
    });
  },
  mounted: function() {
    //需要触发的函数
  }
};
</script>

<style>
</style>