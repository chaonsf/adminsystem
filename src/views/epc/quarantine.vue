<template>
<div class='quarantine'>
    <Query @search='submit' :show='false' ref='cond' @clear='clear'>

    </Query>
    <div>
        <el-table :data='tabledata' border stripe>
            <el-table-column prop="createTime" label="申报时间" align='center' width='180'> </el-table-column>
            <el-table-column prop="farmName" label="农场名称" align='center'> </el-table-column>
            <el-table-column prop="farmerName" label="养殖场主" align='center'> </el-table-column>
            <el-table-column prop="address" label="地址" align='center'> </el-table-column>
            <el-table-column prop="batchNo" label="批次号" align='center' width='210'> </el-table-column>
            <el-table-column prop="type" label="畜禽类型" align='center'> </el-table-column>
            <el-table-column prop="variety" label="畜禽品种" align='center'> </el-table-column>
            <el-table-column prop="quantity" label="申报数量" align='center'> </el-table-column>
            <el-table-column width='80' align='center' label="申报清单" fixed='right'>
                <template slot-scope="scope">
                    <i class="iconfont icon-xiangqing1" @click="applylist(scope.row)"></i>
                </template>
            </el-table-column>
            <el-table-column width='80' align='center' label="检疫证明" fixed='right'>
                <template slot-scope="scope">
                    <span class="anniu" v-if='scope.row.status==0' @click='inputIn(scope.row,0)'>录入</span>
                    <span class="anniu" v-if='scope.row.status==1' @click='inputIn(scope.row,1)'>查看</span>
                </template>
            </el-table-column>
        </el-table>
          <el-pagination background layout="prev, pager, next" :total="page.total" @current-change="currentChange" @size-change="sizeChange"  :current-page='page.currentPage'> </el-pagination>
    </div>
    <el-dialog :visible.sync='listbox' title="申报清单" class="detail" width='980px'>
        <Applylist :applyid='operId' ></Applylist>
    </el-dialog>
    <el-dialog :visible.sync='lurubox' :title="title" class="detail" width='1000px'  :modal='false'>
        <Quarantineinput :luruid='luruid' :luruquery='luruquery' @close='close'></Quarantineinput>
    </el-dialog>
</div>
</template>

<script>
import Query from '@/components/epidemic/querycomponent'
import {
    farmslist,
    quarantinelist
} from '@/api/epidemic'
import {
    Loading
} from 'element-ui';
import Applylist from '@/components/epidemic/applylist'
import Quarantineinput from '@/components/epidemic/quarantineinput'
export default {
    components: {
        Query,
        Applylist,
        Quarantineinput
    },
    data() {
        return {
            query: {
                varietid: "",
                categoryid: '',
                attrid: '',
                farmId: ''
            },
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                pagerCount: 5,
            },
            farms: [],
            tabledata: [],
            listbox: false,
            operId: '',
            lurubox:false,
            title:'检疫详情录入',
            luruid:'',
            luruquery:0,// 0 代表录入 1 代表查看
        }
    },
    created() {
        this.category();
        this.getfarm()
    },
    methods: {
        clear() {
            this.variety = []
            this.categorys = []
            this.attrs = []
            this.query = {
                varietid: "",
                categoryid: '',
                attrid: '',
                 farmId: ''
            }
            this.category()
        },
        submit(query) {
            let param
            let mid={
                 current: this.page.currentPage,
                  size: this.page.pageSize,
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
                    ...mid,
                }
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            quarantinelist(param).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data
                } = res.data;
                if (code == 200) {
                    this.tabledata = data.records
                     this.page.total = data.total
                }

            })

        },
        applylist(row) {
            this.operId = row.operId;
            this.listbox = true
        },
        inputIn(row,status) {
            this.luruid=row.id;
            this.luruquery=status
            if(status==0){
                this.title='检疫详情录入'
            }else{
                this.title='检疫详情查看'
            }
            this.lurubox=true
        },
        close(){
            this.lurubox=false
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

    }
}
</script>

<style lang="scss">
.quarantine {
    padding: 10px 20px;

    .iconfont {
        color: #409eef;
        cursor: pointer;
    }

    .icon-xiangqing1 {
        font-size: 22px;
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
        .el-dialog__header{
              text-align: center;
        }
        
    }
}
</style>
