<template>
    <basic-container>
        <el-form :inline="true" class="selection-bar">
            <farm-select label="基地" @callback="farmChange"></farm-select>
        </el-form>

        <el-row :span="24" style="margin-top:10px;">
            <el-col :span="8">
                <basic-container>
                    <ve-pie :data="chartData1"></ve-pie>
                </basic-container>
            </el-col>
            <el-col :span="8">
                <basic-container>
                    <ve-pie :data="chartData2"></ve-pie>
                </basic-container>
            </el-col>
            <el-col :span="8">
                <basic-container>
                    <ve-pie :data="chartData3"></ve-pie>
                </basic-container>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
//https://www.cnblogs.com/yesyes/p/7161923.html
//https://v-charts.js.org/#/histogram
import { getData } from "@/api/report/livestock";
import { getFarmTree } from "@/api/basic/farm";
import FarmSelect from "@/components/farmSelect.vue";

export default {
    components: {
        "farm-select": FarmSelect
    },
    data() {
        this.extend = {
            series: {
                label: { show: true, position: "top" }
            }
        };
        this.chartSettings = {
            dimension: "养殖基地",
            metrics: "畜禽总数"
        };
        return {
            chartData1: {
                columns: ["品种", "数量"],
                rows: []
            },
            chartData2: {
                columns: ["性别", "数量"],
                rows: []
            },
            chartData3: {
                columns: ["状态", "数量"],
                rows: []
            },
            farm: null
        };
    },
    methods: {
        onLoad() {
            this.empty();
            getData(this.farm).then(res => {
                let data = res.data.data;
                if (data["variety"]) {
                    data["variety"].forEach(e => {
                        let row = {};
                        row["品种"] = e.varName;
                        row["数量"] = e.count;
                        this.chartData1.rows.push(row);
                    });
                }
                if (data["sex"]) {
                    data["sex"].forEach(e => {
                        let row = {};
                        row["性别"] = e.sex ? "母" : "公";
                        row["数量"] = e.count;
                        this.chartData2.rows.push(row);
                    });
                }
                if (data["status"]) {
                    data["status"].forEach(e => {
                        let row = {};
                        row["状态"] = e.status;
                        row["数量"] = e.count;
                        this.chartData3.rows.push(row);
                    });
                }
            });
        },
        visibleChange(bool) {
            // true为出现，false为隐藏
            if (!bool) {
                // 失去下拉框焦点，刷新数据
                this.onLoad();
            }
        },
        farmChange(farmId) {
            this.farm = farmId;
            this.onLoad(this.page);
        },
        empty() {
            this.chartData1.rows = [];
            this.chartData2.rows = [];
            this.chartData3.rows = [];
        }
    }
};
</script>

<style></style>
