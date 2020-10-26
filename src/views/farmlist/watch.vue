<template>
<div class="form">
    <el-row :gutter="20">
        <el-col :xs='12' :sm="12" :md="8" :lg="4" :xl="4" v-for='item in chooseData' :key='item.id'>
            <el-button :class='[item.id==chooseid?"selected":""]' @click='initdata(item.start,item.id)'>{{item.name}}</el-button>
        </el-col>
    </el-row>
    <!--  <el-button type="primary" @click="querya">查询</el-button> -->
    <div class="content">
        <el-row>
            <el-col :sm='24' :xs='24' :md='24' :lg='24' :xl='24'>
                <p class='p'>(1PH 水 = 1PH 土 = 温度 5℃ = 湿度 5% = 二氧化碳 50ppm）</p>
                <div id='line'></div>
            </el-col>
            <el-col :sm='24' :xs='24' :md='24' :lg='24' :xl='24'>
                <el-table :data='tabledata' style="width: 100%">
                    <el-table-column prop='time' label='时间'> </el-table-column>
                    <el-table-column prop='water' label='水质(ph)'> </el-table-column>
                    <el-table-column prop='soil' label='土壤(ph)'> </el-table-column>
                    <el-table-column prop='temperature' label='温度(℃)'> </el-table-column>
                    <el-table-column prop='humidity' label='湿度(%)'> </el-table-column>
                    <el-table-column prop='co2' label='co2(ppm)'> </el-table-column>
                </el-table>
                <el-pagination background layout="prev, pager, next" :total="page.total" @current-change="currentChange" @size-change="sizeChange" :hide-on-single-page='boff'> </el-pagination>
            </el-col>
        </el-row>
    </div>
</div>
</template>

<script>
import {
    testData,
    fenyewatch
} from '@/api/poverty'
import {
    today
} from "@/util/date.js";
import {
    Loading
} from 'element-ui';
import echarts from 'echarts'
import {
    tonow,
    beforeoneday,
    beforeoneweek,
    beforeonemonth,
    beforethreemonth,
    beforeoneyear
} from '@/util/watchtime'
const nowa = tonow()
export default {
    data() {
        return {
            farmId: '',
            tabledata: [],
            timea: [],
            temperature: [],
            water: [],
            humidity: [],
            co2: [],
            soil: [],
            chooseid: 0,
            chooseData: [{
                    name: '前一天',
                    start: beforeoneday(),
                    id: 0
                },
                {
                    name: '前一周',
                    start: beforeoneweek(),
                    id: 1
                },
                {
                    name: '前一个月',
                    start: beforeonemonth(),
                    id: 2
                },
                {
                    name: '前三个月',
                    start: beforethreemonth(),
                    id: 3
                },
                {
                    name: '前一年',
                    start: beforeoneyear(),
                    id: 4
                }
            ],
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                pagerCount: 5,
            },
            boff: false

        }
    },
    created() {
        let id = this.$route.query.id;
        this.farmId = id;
        this.initdata()
    },
    methods: {
        querya(query) {
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            testData(query).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data,
                    msg
                } = res.data;
                if (code == 200) {
                    let temperature = [];
                    let co2 = []
                    let humidity = [];
                    let soil = []
                    let timea = []
                    let water = []
                    data.forEach(item => {
                        water.push(item.water)
                        temperature.push(item.temperature)
                        co2.push(item.co2)
                        humidity.push(item.humidity)
                        soil.push(item.soil)
                        timea.push(item.time)
                    })
                    this.timea = timea;
                    this.water = water
                    this.temperature = temperature
                    this.co2 = co2
                    this.humidity = humidity
                    this.soil = soil
                    this.initchart()

                } else {
                    this.$msg({
                        msg: msg
                    })
                }

            })
        },
        initchart() {
            let lineChart = echarts.init(document.getElementById('line'));
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['水质(ph)', '土壤(ph)', '温度(℃)', '湿度(%)', 'co2(ppm)']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.timea,
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                        "name": '水质(ph)',
                        type: 'line',
                        data: this.water
                    },
                    {
                        "name": '土壤(ph)',
                        type: 'line',
                        data: this.soil
                    },
                    {
                        "name": '温度(℃)',
                        type: 'line',
                        data: this.temperature
                    },
                    {
                        "name": '湿度(%)',
                        type: 'line',
                        data: this.humidity
                    },
                    {
                        "name": 'co2(ppm)',
                        type: 'line',
                        data: this.co2
                    }
                ]
            }
            lineChart.setOption(option)
        },
        tableinit(table) {
            fenyewatch(table).then(res => {
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    this.tabledata = data.records
                    this.page.total = data.total
                    if (this.tabledata.length == 0) {
                        this.boff = true
                    } else {
                        this.boff = false
                    }
                } else {
                    this.$msg({
                        msg: msg
                    })
                }
            })
        },
        initdata(start, id) {
            const query = {
                beginTime: start ? start : this.chooseData[0].start,
                endTime: nowa,
                farmId: this.farmId
            }
            if (id) {
                this.chooseid = id
            }
            this.querya(query)
            let table = {
                ...query,
                current: this.page.currentPage,
                size: this.page.pageSize
            }
            this.tableinit(table)
        },
        currentChange(cur) {
            this.page.currentPage = cur;
            let table = this.getpage()
            this.tableinit(table)
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            let table = this.getpage()
            this.tableinit(table)

        },
        getpage() {
            let choose = this.chooseData.find(item => {
                return item.id == this.chooseid
            })
            let table = {
                beginTime: choose.start,
                endTime: nowa,
                farmId: this.farmId,
                current: this.page.currentPage,
                size: this.page.pageSize
            }
            return table
        }
    }
}
</script>

<style lang="scss" scoped>
.form {
    padding: 10px 20px;

    #line {
        width: 100%;
        height: 300px;
    }

    .el-button {
        width: 100%;
    }

    .selected {
        background: #409EFF;
        color: #fff;
    }

    .el-pagination {
        text-align: center;
        margin-top: 10px;
    }

    .content {
        padding-bottom: 50px;

        .p {
            font-size: 14px;
            color: #333;
            text-align: center;
        }

        .el-col {
            margin-bottom: 20px;
        }
    }
}
</style>
