<template>
<div class='standard'>
    <Query @search='submit' :time='false' ref='cond' @clear='clear'>
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
    <div>
        <el-table :data='tabledata' border stripe>
            <el-table-column prop="province" label="省" align='center' width='80'> </el-table-column>
            <el-table-column prop="city" label="市" align='center' width='80'> </el-table-column>
            <el-table-column prop="county" label="县/区" align='center' width='80'> </el-table-column>
            <el-table-column prop="farmName" label="名称" align='center' width='150'> </el-table-column>
            <el-table-column align='center' prop="farmerName" label="养殖场主" width='120'></el-table-column>
            <el-table-column align='center' prop="address" label="地址"></el-table-column>
            <el-table-column align='center' prop="telephone" label="联系方式" width='120'></el-table-column>
            <el-table-column width='80' align='center' label="详细信息" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-view" @click='querydetail(scope.row)'></i>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="直播" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-zhibobofangshexiangjitianxianxianxing" @click='broadcast(scope.row)'></i>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="禽畜列表" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-biaodanliebiao-03" @click='livestock(scope.row)'></i>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="出入栏" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-churu" @click='accessbar(scope.row)'></i>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="环境" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-huanjing" @click='whatdata(scope.row)'></i>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="扶贫" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-jingzhunfupin" @click='helpoor(scope.row)'></i>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="page.total" @current-change="currentChange" @size-change="sizeChange" :hide-on-single-page='boff' :current-page='page.currentPage'> </el-pagination>
    </div>
    <el-dialog :visible.sync='enterprisebox' title="查看" class="detail" width='980px'>
        <Buinessdetail :enterprisedata='enterprisedata' :enterImg='enterImg'></Buinessdetail>
    </el-dialog>
    <el-dialog :visible.sync='livestockbox' :title='farmname' class="detail" width='940px'>
        <Livestock :livestockdata='livestockdata' :id='farmId'></Livestock>
    </el-dialog>
    <el-dialog :visible.sync='accessbarbox' :title='farmname' class="detail" width='80%'>
        <Accessba :id='farmId'></Accessba>
    </el-dialog>
    <el-dialog :visible.sync='helpoorbox' title='扶贫信息'>
        <Helpoor :id='farmId'></Helpoor>
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
    farmlist,
    helpBusiness,
    livestockinfarm
} from '@/api/poverty'
import {
    Loading
} from 'element-ui';
import Query from "@/components/newcomponent/queryhead"
import Buinessdetail from "@/components/newcomponent/Buinessdetail"
import Livestock from "@/components/newcomponent/livestocklists"
import Accessba from "@/components/newcomponent/accessbar"
import Helpoor from "@/components/newcomponent/helpoortable"
export default {
    components: {
        Buinessdetail,
        Livestock,
        Accessba,
        Helpoor,
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
            },
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                pagerCount: 5,
            },
            tabledata: [],
            enterImg: [],
            enterprisebox: false,
            enterprisedata: {},
            livestockbox: false,
            farmname: '',
            farmId: '',
            livestockdata: [],
            accessbarbox: false,
            helpoorbox: false,
            boff: false

        }
    },
    created() {
        this.category()
    },
    methods: {
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
                param = {
                    ...cond.query,
                    current: this.page.currentPage,
                    size: this.page.pageSize,
                    category: this.query.categoryid,
                    variety: this.query.varietid,
                    property: this.query.attrid,
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
                    this.tabledata = data.records
                    this.page.total = data.total
                    if (data.records.length == 0) {
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
        pinzhong() {
            let param = {
                category: this.query.categoryid
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
                category: this.query.categoryid
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
                    this.isstore()
                } else {
                    this.$msg({
                        msg: msg
                    })
                }
            })
        },
        isstore() {
            var standard = localStorage.getItem('standard')
            if (standard) {
                standard = JSON.parse(standard)
                let cond = this.$refs.cond
                cond.query = Object.assign({}, standard)
                this.query = Object.assign({}, standard)
                this.page.currentPage = standard.current
                localStorage.removeItem('standard')
                this.submit()
            }
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
        currentChange(cur) {
            this.page.currentPage = cur
            this.submit()
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.submit()
        },
        broadcast(item) {
            let id = item.id;
            this.setstore()
            this.$router.push("/broadcast/index?id=" + id)
        },
        setstore() {
            let cond = this.$refs.cond
            let param = {
                ...cond.query,
                current: this.page.currentPage,
                size: this.page.pageSize,
                category: this.query.categoryid,
                variety: this.query.varietid,
                property: this.query.attrid,
                farmName: cond.query.keyword
            }
            localStorage.setItem('standard', JSON.stringify(param))
        },
        livestock(item) {
            this.common(item)
            this.livestockbox = true
            let param = {
                farmId: this.farmId
            }
            livestockinfarm(param).then(res => {
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    this.livestockdata = data
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
        accessbar(item) {
            this.common(item)
            this.accessbarbox = true

        },
        common(item) {
            let id = item.id;
            let name = this.tabledata.find(item => {
                return item.id == id
            })
            this.farmname = name.farmName
            this.farmId = id
        },
        helpoor(item) {
            this.common(item)
            this.helpoorbox = true
        },
        clear() {
            this.variety = []
            this.categorys = []
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
@import '@/styles/dialog.scss';

.standard {
    padding: 10px 20px 80px;

    .form {
        .el-input__inner {
            width: 175px;
            box-sizing: border-box;
        }

        .el-select {
            width: 175px;
        }
    }

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
