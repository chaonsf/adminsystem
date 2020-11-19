<template>
<div class='applylist'>
    <el-table :data='tabledata' border stripe>
        <el-table-column prop="chipNo" label="芯片号" align='center' width='280'> </el-table-column>
        <el-table-column prop="property" label="属性" align='center'> </el-table-column>
        <el-table-column prop="days" label="日龄" align='center'> </el-table-column>
        <el-table-column width='80' align='center' label="详情" fixed='right'>
            <template slot-scope="scope">
                <i class="iconfont icon-xiangqing1" @click="applys(scope.row)"></i>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class='listpage' background layout="prev, pager, next" :total="page.total" @current-change="currentChange" @size-change="sizeChange" :current-page='page.currentPage'> </el-pagination>
    <el-dialog :visible.sync='detailbox' title='查看详情' class='detail' :modal='false' width="700px">
        <Livestock :detailid='detailid'></Livestock>
    </el-dialog>
</div>
</template>

<script>
import {
    batch
} from '@/api/epidemic'
import {
    Loading
} from 'element-ui';
import Livestock from "@/components/newcomponent/livestockdetail"
export default {
    props: ['applyid'],
    components: {
        Livestock
    },
    data() {
        return {
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 6,
                pagerCount: 5,
            },
            tabledata: [],
            detailbox: false,
            detailid: '',
        }
    },
    watch: {
        applyid() {
            this.load()
        }
    },
    created() {
        this.load()
    },
    methods: {
        load() {
            let param = {
                operId: this.applyid,
                current: this.page.currentPage,
                size: this.page.pageSize
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            batch(param).then(res => {
                let {
                    code,
                    data
                } = res.data
                loadingInstance.close();
                if (code == 200) {
                    this.tabledata = data.records;
                    this.page.total = data.total

                }
            })
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.load()
        },
        currentChange(cur) {
            this.page.currentPage = cur
            this.load()

        },
        applys(row) {
            this.detailid = row.id
            this.detailbox = true
        }

    }
}
</script>

<style lang="scss" scoped>
.applylist {
    .listpage {
        margin-top: 10px;
        text-align: center;
    }
}
</style>
