<template>
<div class='records'>
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
        <el-table :data='tabledata' border stripe>
            <el-table-column prop="farmName" label="农场名称" align='center'> </el-table-column>
            <el-table-column prop="farmerName" label="养殖场主" align='center'> </el-table-column>
            <el-table-column prop="address" label="地址" align='center'> </el-table-column>
            <el-table-column prop="batchNo" label="批次号" align='center' width='215'> </el-table-column>
            <el-table-column prop="type" label="畜禽类型" align='center'> </el-table-column>
            <el-table-column prop="variety" label="畜禽品种" align='center'> </el-table-column>
            <el-table-column prop="inputtype" label="投入品种类" align='center'> </el-table-column>
            <el-table-column prop="inputsname" label="投入品名称" align='center'> </el-table-column>
            <el-table-column prop="number" label="购进数量" align='center' width='80'> </el-table-column>
            <el-table-column prop="unit" label="单位" align='center' width='80'> </el-table-column>
            <el-table-column prop="time" label="使用期间" align='center'> </el-table-column>
            <el-table-column width='80' align='center' label="疫苗信息" fixed='right'>
                <template slot-scope="scope">
                    <span class="anniu" @click='inputIn(scope.row)'>查看</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-dialog :visible.sync='querybox' title="投入品详情" class="detail" width='450px' :modal='false'>
        <Inputsdetail></Inputsdetail>
    </el-dialog>
</div>
</template>

<script>
import Query from '@/components/epidemic/querycomponent';
import Inputsdetail from '@/components/inputs/inputsdetail';
export default {
    components: {
        Query,
        Inputsdetail
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
            tabledata: [{
                province: '上海市',
                city: '上海市',
                county: '金山区',
                farmName: '朱奇山,高卫国,侯工',
                farmerName: '塔山村养殖基地',
                address: '松金公路4004号',
                telephone: '18616101063',
                batchNo: 'YHCZ00000000000420191221',
                type: '禽类',
                variety: 'F9级金蝉土鸡',
                inputtype: '饲料',
                inputsname: '兽用饲料',
                number: 20,
                unit: '吨',
                time: '2020/10/19-2020/10/29'
            }],
            querybox: false
        }
    },
    methods: {
        submit(query) {

        },
        clear() {

        },
        inputIn(row) {
            this.querybox = true
        }
    }
}
</script>

<style lang="scss">
.records {
    padding: 10px;

    .anniu {
        display: block;
        background: #409EFF;
        color: #fff;
        border-radius: 4px;
        font-size: 14px;
        margin-bottom: 5px;
        cursor: pointer;
    }

    .detail {
        .el-dialog__header {
            text-align: center;
        }

    }
}
</style>
