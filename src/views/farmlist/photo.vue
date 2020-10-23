<template>
<div class='photo'>
    <el-row>
        <el-col :span='7'>
            <el-form>
                <el-form-item label="摄像机">
                    <el-select v-model="value">
                        <el-option v-for='item in optionarray' :key='item.value' :label='item.label' :value='item.value'></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span='7'>
            <el-form>
                <el-form-item label="起始日期">
                    <el-date-picker placeholder="选择开始时间" v-model='query.beginTime' value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span='7'>
            <el-form>
                <el-form-item label="截至日期">
                    <el-date-picker placeholder="选择结束时间" v-model='query.endTime' value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span='3'>
            <el-button @click="submit">确认删选</el-button>
        </el-col>
    </el-row>
    <div class='content'>
        <el-row :gutter='30'>
            <el-col :span='8' v-for="item in imgarr" :key='item.id'>
                <div class='item' @click="imgclick(item.acqValue)">
                    <el-image :src='item.acqValue' fit='cover'></el-image>
                    <p>{{item.time[0]}}<span>{{item.week}}</span><span>{{item.time[1]}}</span></p>
                </div>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-pagination background layout="prev, pager, next" :total="page.total" @current-change="currentChange" @size-change="sizeChange" :hide-on-single-page='boff'> </el-pagination>
    </div>
</div>
</template>

<script>
import {
    cameraslist,
    photolist
} from '@/api/poverty'
import {
    today
} from "@/util/date.js";
import {
    Loading
} from 'element-ui';
const todaya = today()
export default {
    data() {
        return {
            optionarray: [],
            value: '',
            query: {
                endTime: todaya.todayTime,
                beginTime: todaya.oldyear,
            },
            imgarr: [],
            page: {
                total: 0,
                currentPage: 1,
                pageSize: 6,
                pagerCount: 5,
            },
            dialogVisible: false,
            dialogImageUrl: '',
            boff: false
        }
    },
    created() {
        let id = this.$route.query.id;
        this.getoption(id)
    },
    methods: {
        getoption(id) {
            cameraslist(id).then(res => {
                let {
                    data,
                    code
                } = res.data
                if (code == 200) {
                    this.optionarray = data[0].devices
                    this.value = this.optionarray[0].value
                    this.submit()
                }
            })
        },
        submit() {
            let param = Object.assign({}, this.query, {
                deviceId: this.value,
                current: this.page.currentPage,
                size: this.page.pageSize
            })
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            photolist(param).then(res => {
                loadingInstance.close();
                let {
                    records,
                    total
                } = res.data;
                if (records.length == 0) {
                    this.$msg({
                        msg: "没有查到数据",
                        type: 'info'
                    })
                    this.boff = true
                } else {
                    this.boff = false
                }
                this.page.total = total
                for (let i = 0; i < records.length; i++) {
                    records[i].time = records[i].acqTime.split(' ')
                    records[i].week = this.getweek(records[i].time[0])
                }
                this.imgarr = records
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
        imgclick(url) {
            this.dialogVisible = true;
            this.dialogImageUrl = url
        },
        getweek(day) {
            var str = "";
            var week = new Date().getDay();
            if (week == 0) {
                str = "星期日";
            } else if (week == 1) {
                str = "星期一";
            } else if (week == 2) {
                str = "星期二";
            } else if (week == 3) {
                str = "星期三";
            } else if (week == 4) {
                str = "星期四";
            } else if (week == 5) {
                str = "星期五";
            } else if (week == 6) {
                str = "星期六";
            }
            return str
        }
    }
}
</script>

<style lang="scss" scoped>
.photo {
    padding: 10px 20px;

    .el-button {
        background: #409EFF;
        color: #fff;
    }

    .el-pagination {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 20px;
    }

    .content {
        .item {
            p {
                color: #333;

                span {
                    display: inline-block;
                    margin-left: 10px;
                }
            }
        }
    }
}
</style>
