<template>
<div class='live'>
    <h5>当前在栏数量</h5>
    <el-table :data='livestockdata' border class="livest" stripe>
        <el-table-column prop="typeName" align='center'> </el-table-column>
        <el-table-column prop="categoryName" align='center'> </el-table-column>
        <el-table-column prop="varName" align='center'> </el-table-column>
        <el-table-column prop="count" align='center'> </el-table-column>
    </el-table>
    <h5>当前在栏品种比例</h5>
    <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
    <el-form :inline="true">
        <el-form-item label='品类'>
            <el-select placeholder="品类" v-model="query.category">
                <el-option v-for='item in categorydata' :key='item.dictKey' :value='item.dictKey' :label="item.dictValue"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label='品种'>
            <el-select placeholder="品种" v-model="query.breed">
                <el-option v-for='item in breeddata' :key='item.value' :value='item.value' :label="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label='性别'>
            <el-select placeholder="性别" v-model="query.gender">
                <el-option v-for='item in genderdata' :key='item.value' :value='item.value' :label="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label='状态'>
            <el-select placeholder="状态" v-model="query.state">
                <el-option v-for='item in statusdata' :key='item.value' :value='item.value' :label="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="load">确认</el-button>
        </el-form-item>
    </el-form>
    <div class="xianshi">
        <el-table :data='tabledata' border>
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
    <el-dialog :visible.sync='detailbox' title='查看详情' class='detail' :modal='false' width="680px">
        <Livestock :detailid='detailid'></Livestock>
    </el-dialog>
</div>
</template>

<script>
import echarts from 'echarts'
import {
    varieties,
    dictionary,
    status,
    livestocklist
} from '@/api/poverty'
import {
    Loading
} from 'element-ui';
import Livestock from "@/components/newcomponent/livestockdetail"
export default {
    components: {
        Livestock
    },
    props: {
        livestockdata: {
            type: Array,
            require: true,
        },
        id: {
            require: true
        }
    },
    data() {
        this.chartSettings = {
            level: [
                ["鸡"],
                ["F9级金蝉土鸡", "芦花鸡", '乌骨鸡']
            ],
        }
        return {
            chartData: {
                columns: ['类别', 'num'],
                rows: []
            },
            query: {
                category: '',
                breed: '',
                gender: '',
                state: ''
            },
            categorydata: [],
            breeddata: [],
            genderdata: [{
                    value: ' ',
                    name: "全部"
                },
                {
                    value: 1,
                    name: "公"
                },
                {
                    value: 2,
                    name: "母"
                },
            ],
            statusdata: [],
            tabledata: [],
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 5,
                pagerCount: 5,
            },
            detailbox: false,
            detailid: '', //表格里面点击的id
            boff: false,
        }
    },
    watch: {
        livestockdata: {
            handler() {
                this.chartinit()
            },
            deep: true
        },
        id() {
            this.load()
        }
    },
    created() {
        this.category()
        this.getstatus()

        this.load()
    },
    methods: {
        chartinit() {
            let total = 0;
            let livestockdata = this.livestockdata
            for (let i = 0; i < livestockdata.length; i++) {
                total += livestockdata[i].count
            }
            let Golden = livestockdata.find(item => {
                return item.variety == 1
            })
            let luhua = livestockdata.find(item => {
                return item.variety == 2
            })
            let blackbone = livestockdata.find(item => {
                return item.variety == 3
            })
            let arr = [{
                    "类别": "鸡",
                    "num": total
                },
                {
                    "类别": "F9级金蝉土鸡",
                    "num": Golden ? Golden.count : 0
                },
                {
                    "类别": "芦花鸡",
                    "num": luhua ? luhua.count : 0
                },
                {
                    "类别": "乌骨鸡",
                    "num": blackbone ? blackbone.count : 0
                },
            ]
            let brr = arr.filter(item => {
                return item.num != 0
            })
            if (brr.length == 0) {
                brr = [{
                    "类别": "鸡",
                    "num": total
                }]
            }
            this.chartData.rows = brr
        },
        category() {
            let param = {
                code: "livestock"
            }
            this.query.category = ''
            this.query.breed = ''
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
        load() {
            let query = this.query
            let page = this.page
            let param = {
                ...query,
                current: page.currentPage,
                farmId: this.id,
                size: page.pageSize
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            livestocklist(param).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data,
                    msg
                } = res.data;
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
        currentChange(cur) {
            this.page.currentPage = cur
            this.load()
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.load()
        },
        detail(item) {
            this.detailbox = true
            this.detailid = item.id

        }

    }
}
</script>

<style lang="scss">
.live {
    h5 {
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        margin-top: 30px;
        margin-bottom: 20px;
    }

    .livest {
        .el-table__header {
            display: none;
        }
    }

    .el-select {
        width: 150px;
    }

    .xianshi {
        padding-bottom: 40px;
    }

}
</style>
