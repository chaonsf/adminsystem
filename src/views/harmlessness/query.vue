<template>
<div class="approval">
    <Query ref='cond' @search='submit' @clear='clear'>
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
    <div class="content">
        <el-table :data='tabledata' border stripe>
            <el-table-column prop="province" label="省" align='center' width='80'> </el-table-column>
            <el-table-column prop="city" label="市" align='center' width='80'> </el-table-column>
            <el-table-column prop="county" label="县/区" align='center' width='80'> </el-table-column>
            <el-table-column prop="farmName" label="名称" align='center' width='150'> </el-table-column>
            <el-table-column align='center' prop="farmerName" label="场主" width='120'></el-table-column>
            <el-table-column align='center' prop="address" label="地址"></el-table-column>
            <el-table-column align='center' prop="telephone" label="联系方式" width='120'></el-table-column>
            <el-table-column align='center' prop="lsCount" label="报损数量" width='80'></el-table-column>
            <el-table-column width='80' align='center' label="批量报损列表" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-biaodanliebiao-03" @click='detaillist(scope.row)'></i>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="审批" fixed='right'>
                <template slot-scope="scope">
                    <span v-if='scope.row.status==1'>已批准</span>
                    <span v-if='scope.row.status==2'>审批中</span>
                    <span v-if='scope.row.status==3'>未批准</span>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="处理结果" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-xiangqing" @click='approval(scope.row)'></i>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="page.total" @current-change="currentChange" @size-change="sizeChange" :hide-on-single-page='boff'> </el-pagination>
    </div>
    <el-dialog :visible.sync='approvalbox' title="证明" width="500" class='deta'>
        <el-carousel indicator-position="outside">
            <el-carousel-item v-for="(item,index)  in imgdata" :key="index">
                <el-image :src='item'></el-image>
            </el-carousel-item>
        </el-carousel>
    </el-dialog>
    <el-dialog :visible.sync='listbox' title='报损列表' width="940px">
        <Lossreport :operId='operId'></Lossreport>
    </el-dialog>
</div>
</template>

<script>
import {
    provinceAndcity,
    zone,
    varieties,
    dictionary,
    attribute,
    harmlesslist,
    examine
} from '@/api/poverty'
import {
    Loading
} from 'element-ui';
import Lossreport from "@/components/newcomponent/lossreportlist"
import Query from "@/components/newcomponent/queryhead"
export default {
    components: {
        Lossreport,
        Query
    },
    data() {
        return {
            variety: [], //品种
            categorys: [], //品类
            attrs: [],
            query: {
                varietid: "",
                categoryid: '',
                attrid: '',
                farmName: ''
            },
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                pagerCount: 5,
            },
            tabledata: [],
            approvalbox: false,
            imgdata: [],
            listbox: false,
            operId: '', //报损列表参数
            boff: false
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
        submit(query) {
            let param
            if (query) {
                param = {
                    ...query,
                    current: this.page.currentPage,
                    size: this.page.pageSize,
                    category: this.query.categoryid,
                    variety: this.query.varietid,
                    property: this.query.attrid,
                    farmName: query.keyword
                }
            } else {
                let cond = this.$refs.cond
                let value = cond.value
                param = {
                    ...cond.query,
                    current: this.page.currentPage,
                    size: this.page.pageSize,
                    category: this.query.categoryid,
                    variety: this.query.varietid,
                    property: this.query.attrid,
                    farmName: cond.query.keyword,
                    startTime: value[0],
                    endTime: value[1]
                }
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            harmlesslist(param).then(res => {
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
        currentChange(cur) {
            this.page.currentPage = cur
            this.submit()
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.submit()
        },
        approval(item) {
            let imgarr = item.imgUrl
            if (imgarr.length > 0) {
                this.imgdata = imgarr.split(',')
            }
            this.approvalbox = true

        },

        detaillist(item) {
            this.operId = item.operId
            this.listbox = true
        },
        clear() {
            this.variety = []
            this.categorys = []
            this.attrs = []
            this.query = {
                varietid: "",
                categoryid: '',
                attrid: '',
                farmName: ''
            }
            this.category()
        }
    }
}
</script>

<style lang="scss">
@import '@/styles/dialog.scss';

.approval {
    padding: 10px 20px 80px;

    .form {
        .el-input__inner {
            width: 175px;
            box-sizing: border-box;
        }

        .el-select {
            width: 175px;
        }

        .time {
            .el-form-item__content {
                width: 456px;

                .el-date-editor {
                    width: 100%;
                }
            }
        }
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

    .iconfont {
        color: #409eef;
        cursor: pointer;
    }

    .deta {
        .el-image {
            width: 100%;
            height: 100%;
        }
    }

    .el-pagination {
        text-align: center;
        margin-top: 10px;
    }
}
</style>
