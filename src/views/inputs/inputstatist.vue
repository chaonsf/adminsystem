<template>
<div class='statist'>
    <Query @search='submit' :show='false' ref='cond' @clear='clear'>
        <template v-slot:status>
            <el-form-item label='投入品种类'>
                <el-select placeholder="选择投入品种类" v-model="query.type">
                    <el-option v-for="(item,index) in inputype" :key='index' :value='item.dictKey' :label="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='投入品名称'>
                <el-select placeholder="选择投入品名称" v-model="query.name">
                    <el-option v-for="(item,index) in inputname" :key='index' :value='item.dictKey' :label="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
        </template>
    </Query>
    <div class='content'>
        <el-row :gutter='30'>
            <el-col :xs='24' :sm='24' :md='24' :lg='24' :xl='24'>
                <el-table border :data="tableData" :span-method="objectSpanMethod">
                    <el-table-column label='禽畜种类' prop='type' width='80'></el-table-column>
                    <el-table-column label='品类' prop='category' width='80'></el-table-column>
                    <el-table-column label='品种' prop='variety'></el-table-column>
                    <el-table-column label='饲料' prop='siliao' width='140'></el-table-column>
                    <el-table-column label='玉米' prop='yumi' width='140'></el-table-column>
                    <el-table-column label='稻谷' prop='daogu' width='140'></el-table-column>
                    <el-table-column label='饲料添加剂' prop='siliaotianjiaji' width='140'></el-table-column>
                    <el-table-column label='兽药' prop='shouyao' width='140'></el-table-column>
                </el-table>

            </el-col>
            <el-col :xs='24' :sm='24' :md='24' :lg='24' :xl='24'>
                <div class='pie' id='statist'></div>
            </el-col>
        </el-row>
    </div>

</div>
</template>

<script>
import Query from '@/components/epidemic/querycomponent';
import echarts from 'echarts'
export default {
    components: {
        Query
    },
    data() {
        return {
            query: {
                type: '',
                name: ''
            },
            inputype: [{
                dictKey: '1',
                dictValue: '饲料'
            }],
            inputname: [{
                dictKey: '1',
                dictValue: '兽用饲料'
            }],
            tableData: [{
                    type: '禽类',
                    category: '鸡',
                    variety: 'F9金蝉土鸡',
                    siliao: 94456,
                    yumi: 23452,
                    daogu: 2564,
                    siliaotianjiaji: 5645,
                    shouyao: 2564,
                },
                {
                    type: '禽类',
                    category: '鸡',
                    variety: '白羽鸡',
                    siliao: 45612,
                    yumi: 15862,
                    daogu: 5233,
                    siliaotianjiaji: 565,
                    shouyao: 2452,
                },
                {
                    type: '禽类',
                    category: '鸡',
                    variety: '乌骨鸡',
                    siliao: 73625,
                    yumi: 43561,
                    daogu: 35142,
                    siliaotianjiaji: 12528,
                    shouyao: 30541,
                },
                {
                    type: '禽类',
                    category: '鸡',
                    variety: '珍珠鸡',
                    siliao: 40655,
                    yumi: 30251,
                    daogu: 62036,
                    siliaotianjiaji: 53632,
                    shouyao: 45234,
                },
                {
                    type: '禽类',
                    category: '鸡',
                    variety: '芦花鸡',
                    siliao: 54166,
                    yumi: 45425,
                    daogu: 69443,
                    siliaotianjiaji: 45226,
                    shouyao: 38364,
                },
                {
                    type: '禽类',
                    category: '鸡',
                    variety: '跑山鸡',
                    siliao: 89356,
                    yumi: 52254,
                    daogu: 55245,
                    siliaotianjiaji: 45845,
                    shouyao: 52332
                },
            ],
            spanArr: [],
            catearr: [],
        }
    },
    created() {
        this.getOrderNumber()
    },
    mounted() {
        this.linechart1()
    },
    methods: {
        submit() {

        },
        clear() {

        },
        getOrderNumber() {
            let data = this.tableData;
            for (let i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1)
                    this.pos = 0
                    //第二行
                    this.catearr.push(1)
                    this.cate = 0
                } else {
                    if (data[i].type === data[i - 1].type) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);

                    } else {
                        this.spanArr.push(1);
                        this.pos = i;

                    }
                    if (data[i].category === data[i - 1].category) {
                        this.catearr[this.cate] += 1
                        this.catearr.push(0)
                    } else {
                        this.catearr.push(1)
                        this.cate = i
                    }
                }
            }

        },
        objectSpanMethod({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            if (columnIndex === 0) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
            if (columnIndex === 1) {
                const _row = this.catearr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }

        },
        linechart1() {
            let chartup = echarts.init(document.getElementById('statist'));
            let name = [];
            let siliao = []
            let yumi = [];
            let daogu = [];
            let siliaotianjiaji = []
            let shouyao = []
            let tabledata = this.tableData;
            for (let i = 0; i < tabledata.length; i++) {
                name.push(tabledata[i].variety)
                siliao.push(tabledata[i].siliao)
                yumi.push(tabledata[i].yumi)
                daogu.push(tabledata[i].daogu)
                siliaotianjiaji.push(tabledata[i].siliaotianjiaji)
                shouyao.push(tabledata[i].shouyao)

            }
            let option = {
                legend: {
                    data: ['饲料', '玉米', '稻谷', '饲料添加剂', '兽药']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: name,
                    axisPointer: {
                        type: 'shadow',
                    }
                }],
                yAxis: {},

                series: [{
                        name: '饲料',
                        type: 'bar',
                        data: siliao,
                        barWidth: 30,
                        itemStyle: {
                            normal: {
                                color: '#5195d2'
                            }
                        }
                    },
                    {
                        name: '玉米',
                        type: 'bar',
                        data: yumi,
                        itemStyle: {
                            normal: {
                                color: '#ef8943'
                            }
                        }
                    },
                    {
                        name: '稻谷',
                        type: 'bar',
                        data: daogu,
                    },
                    {
                        name: '饲料添加剂',
                        type: 'line',
                        data: siliaotianjiaji,
                    },
                    {
                        name: '兽药',
                        type: 'line',
                        data: shouyao,
                    },

                ]
            }
            chartup.setOption(option)
        },
    }
}
</script>

<style lang="scss" scoped>
.statist {
    padding: 10px;

    .pie {
        height: 450px;
        width: 100%;
    }

    .bh {
        height: 50px;
    }
}
</style>
