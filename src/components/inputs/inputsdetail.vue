<template>
<div class='inputsdetail'>
    <el-form label-width="110px">
        <el-form-item label='投入品种类:'>
            <span>饲料</span>
        </el-form-item>
        <el-form-item label='投入品种类:'>
            <span>兽用饲料</span>
        </el-form-item>
        <el-form-item label='生产企业名称:'>
            <span>天津海锐德国际贸易有限责任公司</span>
        </el-form-item>
        <el-form-item label='批号:'>
            <span>YHCZ00000000000420191221</span>
        </el-form-item>
        <el-form-item label='购进数量:'>
            <span>20</span>
        </el-form-item>
        <el-form-item label='单位:'>
            <span>吨</span>
        </el-form-item>
        <el-form-item label='使用对象:'>
            <span><i class="el-icon-s-unfold" @click="flod"></i></span>
        </el-form-item>
        <el-form-item label='用法:'>
            <span>口服</span>
        </el-form-item>
        <el-form-item label='用量:'>
            <span>500g</span>
        </el-form-item>
        <el-form-item label='使用期间:'>
            <span>2020/10/19-2020/10/29</span>
        </el-form-item>
        <el-form-item label='休眠期:'>
            <span></span>
        </el-form-item>
        <el-form-item label='备注:'>
            <span></span>
        </el-form-item>

    </el-form>
    <el-dialog :visible.sync='listbox' title="投入品使用列表" class="detail" width='980px' :modal='false'>
        <Applylist :applyid='operId'></Applylist>
    </el-dialog>
</div>
</template>

<script>
import Applylist from '@/components/epidemic/applylist'
export default {
    components: {
        Applylist
    },
    data() {
        return {
            operId: '1',
            listbox: false
        }
    },
    methods: {
        flod() {
            this.listbox = true
        }
    }
}
</script>

<style lang="scss" scoped>
.inputsdetail {}
</style>
