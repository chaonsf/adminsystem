<template>
<div class='poorlist'>
    <Query @search='submit' :time='false' ref='cond'></Query>

    <div>
        <el-table :data='tabledata' border>
            <el-table-column prop="province" label="省" align='center' width='80'> </el-table-column>
            <el-table-column prop="city" label="市" align='center' width='80'> </el-table-column>
            <el-table-column prop="county" label="县/区" align='center' width='80'> </el-table-column>
            <el-table-column prop="farmName" label="名称" align='center'> </el-table-column>
            <el-table-column align='center' prop="farmerName" label="养殖场主"></el-table-column>
            <el-table-column align='center' prop="address" label="地址"></el-table-column>
            <el-table-column align='center' prop="telephone" label="联系方式"></el-table-column>
            <el-table-column width='80' align='center' label="详细信息" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-view" @click='querydetail(scope.row)'></i>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="环境" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-huanjing" @click='whatdata(scope.row)'></i>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="直播" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-zhibobofangshexiangjitianxianxianxing" @click='broadcast(scope.row)'></i>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="page.total" @current-change="currentChange" @size-change="sizeChange" :hide-on-single-page='boff' :current-page='page.currentPage'> </el-pagination>
    </div>

    <el-dialog :visible.sync='enterprisebox' title="查看" class="detail" width='980px'>
        <Buinessdetail :enterprisedata='enterprisedata' :enterImg='enterImg'></Buinessdetail>
    </el-dialog>
</div>
</template>

<script>
import {
    provinceAndcity,
    farmlist,
    helpBusiness,
    zone,
    testData
} from '@/api/poverty'
import Buinessdetail from "@/components/newcomponent/Buinessdetail"
import Query from "@/components/newcomponent/queryhead"
import {
    Loading
} from 'element-ui';
export default {
    components: {
        Buinessdetail,
        Query
    },
    data() {
        return {
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                pagerCount: 5,
            },
            tabledata: [],
            enterprisebox: false,
            enterprisedata: {},
            enterImg: [],
            boff: false
        }
    },
    created() {},
    methods: {
        submit(query) {
            let param
            if (query) {
                param = {
                    ...query,
                    current: this.page.currentPage,
                    size: this.page.pageSize,
                    farmName: query.keyword
                }
            } else {
                let cond = this.$refs.cond
                param = {
                    ...cond.query,
                    current: this.page.currentPage,
                    size: this.page.pageSize,
                    farmName: cond.query.keyword
                }
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            farmlist(param).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data,
                    msg
                } = res.data;
                if (code == 200) {
                    let records = data.records
                    this.page.total = data.total
                    this.tabledata = records
                    if (records.length == 0) {
                        this.boff = true
                    } else {
                        this.boff = false
                    }
                    this.isstore()
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
            this.enterprisebox = true
            let id = item.id
            let param = {
                id,
                data: {
                    farmId: id
                }
            }
            helpBusiness(param).then(res => {
                let {
                    data,
                    msg,
                    code
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
        whatdata(item) {
            let id = item.id;
            this.setstore()
            this.$router.push('/watch/index?id=' + id)
        },
        broadcast(item) {
            let id = item.id
            this.setstore()
            this.$router.push("/broadcast/index?id=" + id)
        },
        setstore() {
            let cond = this.$refs.cond
            let param = {
                ...cond.query,
                current: this.page.currentPage,
                size: this.page.pageSize,
                farmName: cond.query.keyword
            }
            localStorage.setItem('environment', JSON.stringify(param))
            this.submit()
        },
        isstore() {
            var standard = localStorage.getItem('environment')
            if (standard) {
                standard = JSON.parse(standard)
                let cond = this.$refs.cond
                cond.query = Object.assign({}, standard)
                this.page.currentPage = standard.current
                localStorage.removeItem('environment')
                this.submit()
            }
        },
    }
}
</script>

<style lang="scss">
@import '@/styles/dialog.scss';

.poorlist {
    padding: 10px 20px 80px;

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
