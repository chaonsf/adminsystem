<template>
<div class='arealive'>
    <Query :time='false' @search="search" @clear='clear'>
        <template v-slot:status>
            <el-form-item label='品类'>
                <el-select placeholder="品类" v-model="query.categoryid" @change='category'>
                    <el-option v-for='item in categorys' :key='item.dictKey' :value='item.dictKey' :label="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='品种'>
                <el-select placeholder="品种" v-model="query.varietid" @change="pinzhong">
                    <el-option v-for='item in variety' :key='item.value' :value='item.value' :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='属性'>
                <el-select placeholder="属性" v-model="query.attrid">
                    <el-option v-for='item in attrs' :key='item.value' :value='item.value' :label="item.name"></el-option>
                </el-select>
            </el-form-item>
        </template>
    </Query>
    <div class='count'>
        <h5>当前在栏数量</h5>
        <el-table :data='livestockdata' border class="livest" stripe>
            <el-table-column prop="typeName" align='center'> </el-table-column>
            <el-table-column prop="categoryName" align='center'> </el-table-column>
            <el-table-column prop="varName" align='center'> </el-table-column>
            <el-table-column prop="count" align='center'> </el-table-column>
        </el-table>
        <h5>当前在栏品种比例</h5>
        <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
    </div>
    <div class='list'>
        <el-button type='primary' @click='farmlist'>养殖场列表</el-button>
    </div>
</div>
</template>

<script>
import Query from "@/components/newcomponent/queryhead"
import {
    varieties,
    dictionary,
    attribute,
    livestockarea
} from '@/api/poverty'
import {
    Loading
} from 'element-ui';
import echarts from 'echarts'
export default {
    components: {
        Query
    },
    data() {
        this.chartSettings = {
            level: [
                ["鸡"],
                ["F9级金蝉土鸡", "芦花鸡", '乌骨鸡']
            ],
        }
        return {
            variety: [], //品种
            categorys: [], //品类
            attrs: [],
            query: {
                varietid: "",
                categoryid: '',
                attrid: '',
            },
            livestockdata: [],
            chartData: {
                columns: ['类别', 'num'],
                rows: []
            },
        }
    },
    created() {
        this.category()
    },
    methods: {
        pinzhong() {
            let param = {
                category: this.query.categoryid
            }
            this.attrs = []
            this.query.attrid = ''
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
                    this.variety = data
                    this.getattr()
                } else {
                    this.$msg({
                        msg: msg
                    })
                }

            })
        },
        category() {
            let param = {
                code: "livestock"
            }
            this.query.varietid = ''
            this.variety = []
            this.attrs = []
            this.query.attrid = ''
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
                    this.categorys = data
                    this.pinzhong()
                } else {
                    this.$msg({
                        msg: msg
                    })
                }
            })
        },
        getattr() {
            let param = {
                category: this.query.varietid
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
                    this.attrs = data
                } else {
                    this.$msg({
                        msg: msg
                    })
                }
            })
        },
        search(query) {
            let param = {
                ...query,
                category: this.query.categoryid,
                property: this.query.attrid,
                variety: this.query.varietid
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            livestockarea(param).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    this.livestockdata = data
                    this.chartinit()
                } else {
                    this.$msg({
                        msg
                    })
                }
            })

        },
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
        farmlist() {
            this.$router.push('/farmlist/standard')
        },
        clear() {
            this.variety = []
            this.category = []
            this.attrs = []
            this.query = {
                varietid: "",
                categoryid: '',
                attrid: '',
            }
            this.category()

        }
    }
}
</script>

<style lang="scss">
.arealive {
    .count {
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
    }

    .list {
        text-align: center;
        padding-bottom: 20px;
    }
}
</style>
