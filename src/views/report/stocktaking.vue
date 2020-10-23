<template>
    <basic-container>
        <el-form v-model="form" :inline="true" class="selection-bar">
            <farm-select label="基地" @callback="farmChange"></farm-select>
            <el-form-item label="日期">
                <el-date-picker
                    v-model="form.selectDate"
                    type="daterange"
                    size="small"
                    :clearable="false"
                    @change="load()"
                >
                </el-date-picker
            ></el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="load()"
                    >查询</el-button
                >
            </el-form-item>
        </el-form>

        <el-row :span="24">
            <el-col>
                <basic-container class="teaa">
                    <ve-line
                        :data="chartData"
                        :settings="chartSettings"
                        :extend="extend"
                    ></ve-line>
                </basic-container>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="24" class="basc">
                <avue-crud
                    :option="option"
                    :data="chartData.rows"
                    :cell-style="cellStyle"
                ></avue-crud>
            </el-col>
        </el-row>
        <el-dialog
            title="连续三天都未盘点到的畜禽记录"
            :visible.sync="box"
            :class="{ 'avue-dialog': type == 0 }"
            width="70%"
        >
            <avue-crud
                :option="nearlythreeDaysoption"
                :data="nearlythreeDaysData"
                :page.sync="page"
                @current-change="currentChange"
                @size-change="sizeChange"
            ></avue-crud>
        </el-dialog>
    </basic-container>
</template>

<script>
import { differenceInCalendarDays, addDays, subDays, format } from "date-fns";
import FarmSelect from "@/components/farmSelect.vue";
import { Myget } from "@/api/report/api";
import { Loading } from "element-ui";
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
                axisSite: { right: ["盘点率"] },
                yAxisType: ["KMB", "percent"],
                yAxisName: ["数值", "比率"],
                area: false
            });
        return {
            form: {
                farmId: null,
                selectDate: []
            },
            chartData: {
                columns: ["日期", "盘点数", "盘点率"],
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
                        label: "盘点数",
                        prop: "盘点数"
                    },
                    {
                        label: "在栏数",
                        prop: "totalNum"
                    },
                    {
                        label: "盘点率",
                        prop: "scanprecent"
                    },
                    {
                        label: "未盘点数",
                        prop: "unscan"
                    }
                ]
            },
            type: "",
            box: false,
            nearlythreeDaysoption: {
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
                column: [
                    {
                        label: "昵称",
                        prop: "nickName"
                    },
                    {
                        label: "性别", //0为母
                        prop: "sexName"
                    },
                    {
                        label: "体重(g)",
                        prop: "weight"
                    },
                    {
                        label: "芯片号",
                        prop: "chipNo"
                    },
                    {
                        label: "累计步数",
                        prop: "stepCount"
                    },
                    {
                        label: "图片",
                        prop: "photourl",
                        dataType: "string",
                        type: "upload",
                        propsHttp: {
                            url: "data"
                        },
                        span: 24,
                        listType: "picture-card",
                        tip: "只能上传jpg/png文件，且不超过1Mb",
                        action: "/api/alioss/imgupload"
                    }
                ]
            },
            nearlythreeDaysData: [],
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                pagerCount: 5
            }
        };
    },
    mounted() {
        let today = new Date();
        this.form.selectDate = [subDays(today, 15), today];
    },
    methods: {
        async load() {
            let beginTime = format(
                this.form.selectDate[0],
                "yyyy-MM-dd 00:00:00"
            );
            let endTime = format(
                this.form.selectDate[1],
                "yyyy-MM-dd 23:59:59"
            );
            let param = {
                farmId: this.form.farmId,
                beginTime: beginTime,
                endTime: endTime
            };
            let res = await Myget(
                { params: param },
                "/api/mkx-report/report/stocktaking2"
            );
            let data = res.data;
            let rows = [];
            for (let d of data) {
                d.time = d.date.substr(0, 10);
                if (d.totalNum != 0) {
                    d.precent =
                        (parseInt(d.scanNum) / parseInt(d.totalNum)) * 100;
                } else {
                    d.precent = 0.0;
                }

                rows.push({
                    日期: d.time,
                    盘点数: d.scanNum,
                    totalNum: d.totalNum,
                    unscan: d.totalNum - d.scanNum,
                    scanprecent: d.precent.toFixed(2) + "%",
                    盘点率: (d.precent / 100).toFixed(2)
                });
            }
            this.chartData.rows = rows;
        },
        async nearlyThreeDays() {
            let param = {
                farmId: this.form.farmId,
                current: this.page.currentPage,
                size: this.page.pageSize
            };
            let loading = Loading.service({
                target: "el-dialog__body",
                text: "正在加载中。。。"
            });
            let res = await Myget(
                { params: param },
                "/api/mkx-report/report/unScanInfo"
            );
            loading.close();
            let data = res.data.records;
            let totalPage = Math.ceil(res.data.total / this.page.pageSize);

            this.page.total = res.data.total;
            if (data.length > 0) {
                this.box = true;
            }
            data.forEach(item => {
                if (item.sex == "1") {
                    item.sexName = "公";
                } else {
                    item.sexName = "母";
                }
            });
            this.nearlythreeDaysData = data;
        },
        async farmChange(farmId) {
            this.form.farmId = farmId;
            await this.load();
            await this.nearlyThreeDays();
        },
        async currentChange(cur) {
            this.page.currentPage = cur;
            await this.nearlyThreeDays();
        },
        async sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            await this.nearlyThreeDays();
        },
        cellStyle({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 4 || columnIndex == 5) {
                if (row.scanprecent != "100.00%") {
                    return {
                        color: "red"
                    };
                }
            }
        }
    }
};
</script>

<style lang="scss">
@import url("../../styles/selectionbar.scss");
.avue-dialog {
    .el-dialog {
        .el-dialog__body {
            padding: 0 20px 30px;
            .avue-crud__menu {
                min-height: 10px;
            }
        }
    }
}
.teaa {
    padding-bottom: 0 !important;
    .el-card__body {
        padding-bottom: 0;
    }
}
.basc {
    .avue-crud {
        .avue-crud__menu {
            min-height: 0;
            height: 0;
        }
    }
}
</style>
