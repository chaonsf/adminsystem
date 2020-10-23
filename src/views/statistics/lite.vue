<template>
<div class='poorlist'>
    <Query :show='false' @search='submit' ref='cond'></Query>
    <div>
        <el-table :data='tabledata' border>
            <el-table-column prop="createTime" label="提交日期" align='center'> </el-table-column>
            <el-table-column prop="name" label="户主姓名" align='center'> </el-table-column>
            <el-table-column prop="phone" label="联系方式" align='center'> </el-table-column>
            <el-table-column prop="number" label="扶贫手册编号" align='center'> </el-table-column>
            <el-table-column width='80' align='center' label="帮扶详情" fixed="right">
                <template slot-scope="scope">
                    <i class="iconfont icon-view" @click='querydetail(scope.row)'></i>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="帮扶企业" fixed="right">
                <template slot-scope="scope">
                    <i class="iconfont icon-building" @click='enterprise(scope.row)'></i>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="直播" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-zhibobofangshexiangjitianxianxianxing" @click='broadcast(scope.row)'></i>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="page.total" @current-change="currentChange" @size-change="sizeChange" :hide-on-single-page='boff'> </el-pagination>
    </div>
    <el-dialog :visible.sync='detail' title="帮扶详情" class='detail' width='680px'>
        <Help :detailImg='detailImg' :detaildata='detaildata'></Help>
    </el-dialog>
    <el-dialog :visible.sync='enterprisebox' title="帮扶企业" class="detail" width='980px'>
        <Buinessdetail :enterprisedata='enterprisedata' :enterImg='enterImg'></Buinessdetail>
    </el-dialog>
</div>
</template>

<script>
import {
    provinceAndcity,
    listByTime,
    helpBusiness,
    zone,
    helpdetail
} from '@/api/poverty'
import Buinessdetail from "@/components/newcomponent/Buinessdetail"
import Help from "@/components/newcomponent/helpdetail"
import moment from 'moment'
import Query from "@/components/newcomponent/queryhead"
import {
    Loading
} from 'element-ui';
export default {
    components: {
        Buinessdetail,
        Help,
        Query
    },
    data() {
        return {
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 7,
                pagerCount: 5,
            },
            tabledata: [],
            detail: false,
            detaildata: [],
            detailImg: [],
            enterprisebox: false,
            enterprisedata: [],
            enterImg: [],
            boff: false
        }
    },
    methods: {
        submit(query) {
            let param
            if (query) {
                param = {
                    ...query,
                    current: this.page.currentPage,
                    size: this.page.pageSize,
                }
            } else {
                let cond = this.$refs.cond
                let value = cond.value
                param = {
                    ...cond.query,
                    startTime: value[0],
                    endTime: value[1],
                    current: this.page.currentPage,
                    size: this.page.pageSize,
                }
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            listByTime(param).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data,
                    msg
                } = res.data;
                if (code == 200) {
                    let records = data.records
                    for (let i = 0; i < records.length; i++) {
                        records[i].createTime = records[i].createTime.substr(0, 10)
                    }
                    this.page.total = data.total
                    this.tabledata = records
                    if (records.length == 0) {
                        this.boff = true
                    } else {
                        this.boff = false
                    }
                } else {
                    this.$msg({
                        msg
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
        querydetail(item) {
            this.detail = true;
            let id = item.id;
            helpdetail(id).then(res => {
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    this.detaildata = data;
                    if (this.detaildata.proveUrl) {
                        this.detailImg = this.detaildata.proveUrl.split(',')
                    }
                } else {
                    this.$msg({
                        msg: msg
                    })
                }
            })

        },
        enterprise(item) {
            this.enterprisebox = true
            let id = item.farmId
            let param = {
                id,
                data: {
                    farmId: id
                }
            }
            helpBusiness(param).then(res => {
                let {
                    data,
                    code,
                    msg
                } = res.data;
                if (code == 200) {
                    this.enterprisedata = data
                    if (this.enterprisedata.photourl) {
                        this.enterImg = this.enterprisedata.photourl.split(',')
                    }
                } else {
                    this.$msg({
                        msg
                    })
                }
            })
        },
        broadcast(item) {
            let id = item.id
            this.$router.push("/broadcast/index?id=" + id)
        }
    }
}
</script>

<style lang="scss">
@import '@/styles/dialog.scss';

.poorlist {
    padding: 20px;

    .iconfont {
        color: #409eef;
        cursor: pointer;
    }

    .icon-view {
        font-size: 22px;
    }

    .el-pagination {
        text-align: center;
        margin-top: 10px;
    }
}
</style>
