<template>
    <basic-container>
        <el-form v-model="form" :inline="true" class="selection-bar">
            <farm-select label="基地" @callback="farmChange"></farm-select>
            <el-form-item label="年份">
                <el-date-picker
                    v-model="form.selectDate"
                    type="year"
                    size="small"
                    :clearable="false"
                    @change="load"
                    value-format="yyyy"
                >
                </el-date-picker
            ></el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="load"
                    >查询</el-button
                >
            </el-form-item>
        </el-form>

        <el-row :span="24" style="margin-top:10px">
            <el-col :span="24">
                <basic-container>
                    <ve-line
                        :data="chartData"
                        :settings="chartSettings"
                        :extend="extend"
                    ></ve-line>
                </basic-container>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="6">
                <avue-crud :option="option" :data="chartData.rows"></avue-crud>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
import { differenceInCalendarDays, addDays, subDays, format } from "date-fns";
import FarmSelect from "@/components/farmSelect.vue";
export default {
    components: {
        "farm-select": FarmSelect
    },
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
                yAxisType: ["KMB"],
                yAxisName: ["数值"],
                area: false
            });
        return {
            form: {
                selectDate: "2020"
            },
            chartData: {
                columns: ["日期", "出栏数"],
                rows: []
            },
            option: {
                tip: false,
                border: true,
                index: true,
                menu: false,
                addBtn: false,
                columnBtn: false,
                cancelBtn: false,
                delBtn: false,
                editBtn: false,
                refreshBtn: false,
                selection: false,
                searchMenuSpan: 4,
                column: [
                    {
                        label: "日期",
                        prop: "日期"
                    },
                    {
                        label: "出栏数",
                        prop: "出栏数"
                    }
                ]
            }
        };
    },
    methods: {
        load() {
            let beginTime = `${this.form.selectDate}-01-01 00:00:00`;
            let endTime = `${this.form.selectDate}-12-31 23:59:59`;
            this.axios
                .get("/api/mkx-report/report/slaughter", {
                    params: {
                        farmId: this.form.farmId,
                        beginTime: beginTime,
                        endTime: endTime
                    }
                })
                .then(res => {
                    let data = res.data.data;
                    console.log(data);
                    let rows = [];
                    for (let d of data) {
                        rows.push({
                            日期: d.time,
                            出栏数: d.slaughterCount
                        });
                    }
                    this.chartData.rows = rows;
                });
        },
        farmChange(farmId) {
            this.form.farmId = farmId;
            this.load();
        }
    }
};
</script>

<style lang="scss" scoped>
@import url("../../styles/selectionbar.scss");
</style>
