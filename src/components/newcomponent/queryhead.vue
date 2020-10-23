<template>
<el-form :inline="true" class='form headquery' label-width="82px">
    <el-form-item label="省">
        <el-select placeholder="省" v-model="query.province" @change='provinceChange'>
            <el-option v-for='item in province' :key='item.zoneCode' :value='item.zoneCode' :label='item.zoneName'></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label='市'>
        <el-select placeholder="市" v-model="query.city" @change="cityChange">
            <el-option v-for="item in city" :key='item.zoneCode' :value='item.zoneCode' :label="item.zoneName"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label='县'>
        <el-select placeholder="县" v-model="query.county">
            <el-option v-for='item in county' :key='item.zoneCode' :value='item.zoneCode' :label="item.zoneName"></el-option>
        </el-select>
    </el-form-item>
    <slot name="status"></slot>
    <!--                 <el-form-item label='日期' class='time' v-if='time'>
                   <el-date-picker
                     v-model="value"
                     value-format="yyyy-MM-dd"
                      type="daterange"
                   range-separator="至"
                     start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item> -->
    <el-form-item label='开始时间' v-if='time'>
        <el-date-picker v-model="value[0]" type="date" placeholder="选择日期">
        </el-date-picker>
    </el-form-item>
    <el-form-item label='结束时间' v-if='time'>
        <el-date-picker v-model="value[1]" type="date" placeholder="选择日期">
        </el-date-picker>
    </el-form-item>
    <el-form-item label='关键词' v-if='show'>
        <el-input v-model='query.keyword' placeholder="请输入关键词"></el-input>
    </el-form-item>
    <el-form-item label=''>
        <el-button type="primary" @click='submit'>查询</el-button>
        <el-button type="primary" @click='clear'>清空</el-button>
    </el-form-item>
</el-form>
</template>

<script>
import {
    provinceAndcity,
    zone,
    insurancequery
} from '@/api/poverty'
import moment from 'moment'
let now = moment().format("YYYY-MM-DD")
let oneyear = moment().subtract(1, 'year').format("YYYY-MM-DD")
export default {
    props: {
        show: {
            default () {
                return true
            }
        },
        time: {
            default () {
                return true
            }
        }
    },
    data() {
        return {
            province: [],
            city: [],
            county: [],
            query: {
                keyword: '',
                province: '',
                city: '',
                county: ''
            },
            value: [oneyear, now],
        }
    },
    created() {
        this.jurisdictionArea()
        this.submit()
    },
    methods: {
        jurisdictionArea() {
            zone().then(res => {
                let {
                    code,
                    data
                } = res.data;
                if (code == 200) {
                    if (data[1]) {
                        this.province = data[1]
                        // this.provinceId=data[1][0].zoneCode
                        if (data[2]) {
                            this.city = data[2];
                            //this.cityId=data[2][0].zoneCode
                            if (data[3]) {
                                this.county = data[3]
                                // this.countyId=data[3][0].zoneCode
                            } else {
                                this.cityChange()
                            }
                        } else {
                            this.provinceChange()
                        }
                    } else {
                        this.getProvince()
                    }

                }
            })
        },
        getProvince() {
            provinceAndcity().then(res => {
                let {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    this.province = data;
                    //this.provinceId=data[0].zoneCode
                    this.provinceChange()
                }
            })
        },
        provinceChange() {
            let parm = {
                parentCode: this.query.province
            }
            this.city = [];
            this.query.city = ''
            this.query.county = ''
            this.county = []
            if (this.query.province) {
                provinceAndcity(parm).then(res => {
                    let {
                        code,
                        data
                    } = res.data;
                    if (code == 200) {
                        this.city = data;
                        //this.cityId=data[0].zoneCode
                        this.cityChange()
                    }
                })
            }
        },
        cityChange() {
            let parm = {
                parentCode: this.query.city
            }
            this.county = []
            this.query.county = ''
            if (this.query.city) {
                provinceAndcity(parm).then(res => {
                    let {
                        code,
                        data
                    } = res.data
                    if (code == 200) {
                        this.county = data;
                    }
                })
            }
        },
        submit() {
            let query = this.query
            let value = this.value
            if (moment(value[1]).isBefore(value[0])) {
                this.$msg({
                    msg: "开始时间不能在结束时间之后"
                })
                return
            }
            let param = {
                ...query,
                startTime: value[0],
                endTime: value[1]
            }
            this.$emit('search', param)
        },
        clear() {
            this.province = [];
            this.city = [];
            this.county = []
            this.query = {
                keyword: '',
                province: '',
                city: '',
                county: ''
            }
            this.value = [oneyear, now];
            this.jurisdictionArea()
            this.$emit('clear')
            this.submit()

        }
    }
}
</script>

<style lang="scss">
.headquery {
    .time {
        .el-form-item__content {
            width: 456px;

        }
    }

    .el-input__inner {
        width: 175px;
    }

    .el-date-editor {
        width: 175px;
    }

}
</style>
