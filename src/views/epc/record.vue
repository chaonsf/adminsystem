<template>
<div class='vaccines'>
    <Query @search='submit' :show='false' ref='cond' @clear='clear'>
        <template v-slot:status>
            <el-form-item label='免疫方法'>
                <el-select placeholder="选择免疫方法" v-model="query.method">
                    <el-option v-for='item in methodsdata' :key='item.dictKey' :value='item.dictKey' :label="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='检测结果'>
                <el-select placeholder="选择检测结果" v-model="query.result">
                    <el-option v-for='item in testresult' :key='item.dictKey' :value='item.dictKey' :label="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='生产厂家'>
                <el-input v-model="query.manufacturer"></el-input>
            </el-form-item>
            <el-form-item label='疫苗种类'>
                <el-input v-model="query.name"></el-input>
            </el-form-item>
        </template>

    </Query>
    <div class='content'>
        <el-table :data='tabledata' border stripe>
            <el-table-column prop="createTime" label="申请时间" align='center' width='180'> </el-table-column>
            <el-table-column prop="farmName" label="农场名称" align='center'> </el-table-column>
            <el-table-column prop="farmerName" label="养殖场主" align='center'> </el-table-column>
            <el-table-column prop="address" label="地址" align='center'> </el-table-column>
            <el-table-column prop="batchNo" label="批次号" align='center' width='215'> </el-table-column>
            <el-table-column prop="type" label="畜禽类型" align='center'> </el-table-column>
            <el-table-column prop="variety" label="畜禽品种" align='center'> </el-table-column>
            <el-table-column prop="vaccineName" label="疫苗种类" align='center'> </el-table-column>
            <el-table-column prop="inFenceQuantity" label="存栏数" align='center'> </el-table-column>
            <el-table-column prop="quantity" label="免疫数" align='center'> </el-table-column>
            <el-table-column width='80' align='center' label="疫苗信息" fixed='right'>
                <template slot-scope="scope">

                    <span class="anniu" @click='inputIn(scope.row,1)'>查看</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="page.total" @current-change="currentChange" @size-change="sizeChange" :current-page='page.currentPage'> </el-pagination>
    </div>
    <el-dialog :visible.sync='lurubox' title="疫苗信息" class="detail" width='500px' :modal='false'>
        <Vaccinesmessage :luruid='id' :luruquery='luruquery' :way='methodsdata' @close='close'></Vaccinesmessage>
    </el-dialog>
</div>
</template>

<script>
import Query from '@/components/epidemic/querycomponent'
import {
    immuitylist
} from '@/api/epidemic'
import {
    Loading
} from 'element-ui';
import Vaccinesmessage from '@/components/epidemic/vaccinesMassge'
import {
    dictionary
} from '@/api/poverty'
export default {
    components: {
        Query,
        Vaccinesmessage
    },
    data() {
        return {
            query: {
                method: '',
                manufacturer: '',
                name: '',
                result: ''
            },
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                pagerCount: 5,
            },
            tabledata: [],
            methodsdata: [],
            testresult: [],
            lurubox: false,
            id: '', //录入id,
            luruquery: 0, // 0 代表录入 1 代表查看
        }
    },
    created() {
        this.load()
    },
    methods: {
        submit(query) {
            let param = {}
            let mid = {
                current: this.page.currentPage,
                size: this.page.pageSize,
                manufacturer: this.query.manufacturer,
                name: this.query.name,
                result: this.query.result,
                method: this.query.method
            }
            if (query) {
                param = {
                    ...query,
                    ...mid,
                }
            } else {
                let cond = this.$refs.cond
                param = {
                    ...cond.query,
                    ...mid
                }
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            immuitylist(param).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    this.tabledata = data.records
                    this.page.total = data.total
                }
            })

        },
        clear() {
            this.methodsdata = []
            this.testresult = []
            this.query = {
                method: '',
                manufacturer: '',
                name: '',
                resut: ''
            }
            this.category()
        },
        load() {
            this.getmethods()
            this.getresult()
        },
        getmethods() { //免疫方法
            let param = {
                code: 'immunity_method'
            }
            dictionary(param).then(res => {
                let {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    /*           data.unshift({
                                  dictKey:' ',
                                  dictValue:'全部'
                              }) */
                    this.methodsdata = data
                }
            })
        },
        inputIn(row, status) {
            this.id = row.id;
            this.luruquery = status
            this.lurubox = true

        },
        close() {
            this.lurubox = false
            this.submit()
        },
        currentChange(cur) {
            this.page.currentPage = cur
            this.submit()
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.submit()
        },
        getresult() {
            let param = {
                code: 'test_result'
            }
            dictionary(param).then(res => {
                let {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    data.unshift({
                        dictKey: ' ',
                        dictValue: '全部'
                    })
                    this.testresult = data
                }
            })
        }

    }

}
</script>

<style lang="scss">
.vaccines {
    padding: 10px 20px;

    .iconfont {
        color: #409eef;
        cursor: pointer;
    }

    .anniu {
        display: block;
        background: #409EFF;
        color: #fff;
        border-radius: 4px;
        font-size: 14px;
        margin-bottom: 5px;
        cursor: pointer;
    }

    .el-pagination {
        text-align: center;
        margin-top: 10px;
    }

    .detail {
        .el-dialog__header {
            text-align: center;
        }

    }

}
</style>
