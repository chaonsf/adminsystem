<template>
<div class='accessbar'>
    <el-form :inline="true">
        <el-form-item label='品类'>
            <el-select placeholder="品类" v-model="query.category" @change="category">
                <el-option v-for='item in categorydata' :key='item.dictKey' :value='item.dictKey' :label="item.dictValue"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label='品种'>
            <el-select placeholder="品种" v-model="query.breed" @change="pinzhong">
                <el-option v-for='item in breeddata' :key='item.value' :value='item.value' :label="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label='属性'>
            <el-select placeholder="属性" v-model="query.property">
                <el-option v-for='item in propertydata' :key='item.value' :value='item.value' :label="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label='状态'>
            <el-select placeholder="状态" v-model="query.state">
                <el-option v-for='item in statusdata' :key='item.value' :value='item.value' :label="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label='日期'>
            <el-date-picker v-model="value1" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click='submit'>查询</el-button>
        </el-form-item>
    </el-form>
    <div class="content">
        <div class="pie" id='poou'></div>
        <div>
            <el-table :data="tabledata" border>
                <el-table-column prop="chipNo" label="芯片号" align='center'> </el-table-column>
                <el-table-column prop="property" label="属性" align='center'> </el-table-column>
                <el-table-column prop="status" label="状态" align='center'> </el-table-column>
                <el-table-column prop="days" label="在栏天数" align='center'> </el-table-column>
                <el-table-column width='80' align='center' label="详情" fixed='right'>
                    <template slot-scope="scope">
                        <i class="iconfont icon-xiangqing" @click='detail(scope.row)'></i>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="page.total" @current-change="currentChange" @size-change="sizeChange" :page-sizes="[5, 10, 15, 20]" :page-size='page.pageSize' :hide-on-single-page='boff'> </el-pagination>
        </div>
    </div>
    <el-dialog :visible.sync='detailbox' title='查看详情' class='detail' :modal='false' width="680px">
        <Livestock :detailid='detailid'></Livestock>
    </el-dialog>
</div>
</template>

<script>
import {
    varieties,
    dictionary,
    attribute,
    status,
    livestocklist,
    accessbarlists,
    accessbarchart
} from '@/api/poverty'
import moment from 'moment'
import {
    Loading
} from 'element-ui';
import echarts from 'echarts'
import Livestock from "@/components/newcomponent/livestockdetail"
let now = moment().format("YYYY-MM-DD")
let oneweek = moment().subtract(7, 'd').format("YYYY-MM-DD")
export default {
    props: ['id'],
    components: {
        Livestock
    },
    data() {
        return {
            query: {
                category: '',
                breed: '',
                property: '',
                state: ''
            },
            categorydata: [],
            breeddata: [],
            propertydata: [],
            statusdata: [],
            value1: [oneweek, now],
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 5,
                pagerCount: 5,
            },
            tabledata: [],
            detailbox: false,
            detailid: '', //表格里面点击的id
            boff: false,
        }
    },
    created() {
        this.category()
        this.getstatus()
        this.submit()
    },
    methods: {
        category() {
            let param = {
                code: "livestock"
            }
            this.query.breed = ''
            this.breeddata = []
            this.query.property = ''
            this.propertydata = []
            dictionary(param).then(res => {
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    data.unshift({
                        dictValue: '全部',
                        dictKey: ' '
                    })
                    this.categorydata = data
                    this.pinzhong()
                } else {
                    this.$msg({
                        msg: msg
                    })
                }
            })
        },
        pinzhong() {
            let param = {
                category: this.query.category
            }
            varieties(param).then(res => {
                let {
                    code,
                    data,
                    msg
                } = res.data;
                if (code == 200) {
                    data.unshift({
                        value: " ",
                        name: '全部'
                    })
                    this.breeddata = data
                    this.getattr()
                } else {
                    this.$msg({
                        msg: msg
                    })
                }

            })
        },
        getattr() {
            let param = {
                category: this.query.category
            }
            attribute(param).then(res => {
                let {
                    code,
                    msg,
                    data
                } = res.data
                if (code == 200) {
                    data.unshift({
                        value: " ",
                        name: '全部'
                    })
                    this.propertydata = data
                } else {
                    this.$msg({
                        msg: msg
                    })
                }
            })
        },
        getstatus() {
            status().then(res => {
                let data = res.data
                data.unshift({
                    value: " ",
                    name: "全部"
                })
                this.statusdata = data
            })
        },
        submit() {
            this.tableinit()
            this.chartinit()

        },
        tableinit() {
            let param = this.result();
            let page = this.page
            let table = {
                ...param,
                current: page.currentPage,
                size: page.pageSize
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            accessbarlists(param).then(res => {
                loadingInstance.close();
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
        result() {
            let query = this.query;
            let value = this.value1
            let param = {
                ...query,
                start: value[0],
                end: value[1],
                farmId: this.id
            }
            return param
        },
        currentChange(cur) {
            this.page.currentPage = cur
            this.tableinit()
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.tableinit()
        },
        detail(item) {
            this.detailbox = true
            this.detailid = item.id
        },
        chartinit() {
            let result = this.result()
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            accessbarchart(result).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data,
                    msg
                } = res.data;
                if (code == 200) {
                    this.drawchart(data)
                } else {
                    this.$msg({
                        msg: msg
                    })
                }
            })
        },
        drawchart(data) {
            let lineChart = echarts.init(document.getElementById('poou'));
            let timearray = [];
            let inline = []
            let outline = []
            let diff = []
            let reportloss = []
            data.forEach(item => {
                timearray.push(item.time)
                inline.push(item.in)
                outline.push(item.out)
                diff.push(item.diff)
                reportloss.push(item.damaged)
            })
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['总入栏', '总出栏', '总差值', '报损']
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
                    data: timearray,
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                        "name": '总入栏',
                        type: 'line',
                        data: inline
                    },
                    {
                        "name": '总出栏',
                        type: 'line',
                        data: outline
                    },
                    {
                        "name": '总差值',
                        type: 'line',
                        data: diff
                    },
                    {
                        "name": '报损',
                        type: 'line',
                        data: reportloss
                    }
                ]
            }
            lineChart.setOption(option)
        }

    }
}
</script>

<style lang="scss" scoped>
#poou {
    width: 100%;
    height: 300px;
}
</style>
