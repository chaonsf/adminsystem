<template>
<div class='livestockdetails'>
    <el-row>
        <el-col :span='12'>
            <div class="item">
                <label>批次号：</label>
                <span>{{array.batchNo}}</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>入栏时间：</label>
                <span>{{array.createTime}}</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>芯片号：</label>
                <span>{{array.chipNo}}</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>出栏时间：</label>
                <span>{{array.operTime}}</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>属性：</label>
                <span>{{array.property}}</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>来源：</label>
                <span>{{array.source}}</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>昵称：</label>
                <span>{{array.nickName}}</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>入栏重量：</label>
                <span>{{array.weight}}克</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>品种：</label>
                <span>{{array.variety}}</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>入栏年龄：</label>
                <span>{{array.youngDays}}天</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>性别：</label>
                <span>{{array.sex}}</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>累计步数：</label>
                <span>{{array.stepCount}}</span>
            </div>
        </el-col>
        <el-col :span='12'>
            <div class="item">
                <label>状态：</label>
                <span>{{array.status}}</span>
            </div>
        </el-col>
        <el-col :span='12'>

            <vue-qr style="margin-left:80px;" :text="'https://ynyiot.com/#/trace/' + array.chipNo" :margin="0" colorLight="#fff"></vue-qr>
        </el-col>
    </el-row>
</div>
</template>

<script>
/* 单个养殖场畜禽弹窗的弹窗内容 */
import vueQr from "vue-qr";
import {
    livestockdetail
} from '@/api/poverty'
import {
    Loading
} from 'element-ui';
export default {
    props: {
        detailid: {
            default: 1
        }
    },
    data() {
        return {
            array: []
        }
    },
    watch: {
        detailid() {
            this.load()
        }
    },
    created() {
        this.load()
    },
    methods: {
        load() {
            let param = {
                livestockId: this.detailid
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            livestockdetail(param).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data,
                    msg
                } = res.data
                if (code == 200) {
                    this.array = data
                } else {
                    this.$msg({
                        msg: msg
                    })
                }
            })

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/dialog.scss';

.livestockdetails {}
</style>
