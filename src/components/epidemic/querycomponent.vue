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
    <el-form-item label='县/区'>
        <el-select placeholder="县/区" v-model="query.county" @change="countyChange">
            <el-option v-for='item in county' :key='item.zoneCode' :value='item.zoneCode' :label="item.zoneName"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label='乡/镇'>
        <el-select placeholder="乡/镇" v-model="query.town" @change="townChange">
            <el-option v-for='item in town' :key='item.zoneCode' :value='item.zoneCode' :label="item.zoneName"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label='村'>
        <el-select placeholder="村" v-model="query.village">
            <el-option v-for='item in village' :key='item.zoneCode' :value='item.zoneCode' :label="item.zoneName"></el-option>
        </el-select>
    </el-form-item>
   <el-form-item label='养殖场'>
                <el-autocomplete
                   class="inline-input"
                    v-model="query.farmName"
                    :fetch-suggestions="querySearch"
                   placeholder="请输入内容"
                   :trigger-on-focus="false"
                ></el-autocomplete>
    </el-form-item>
    <slot name="status"></slot>

    <el-form-item label='开始时间' v-if='time'>
        <el-date-picker v-model="value[0]" type="date" placeholder="选择日期">
        </el-date-picker>
    </el-form-item>
    <el-form-item label='结束时间' v-if='time'>
        <el-date-picker v-model="value[1]" type="date" placeholder="选择日期">
        </el-date-picker>
    </el-form-item>
            <el-form-item label='品类'>
                <el-select placeholder="品类" v-model="query.category" @change='category'>
                    <el-option v-for='item in categorys' :key='item.dictKey' :value='item.dictKey' :label="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='品种'>
                <el-select placeholder="品种" v-model="query.variety" @change="pinzhong">
                    <el-option v-for='item in variety' :key='item.value' :value='item.value' :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='属性'>
                <el-select placeholder="属性" v-model="query.property">
                    <el-option v-for='item in attrs' :key='item.value' :value='item.value' :label="item.name"></el-option>
                </el-select>
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
    insurancequery,
    varieties,
    dictionary,
    attribute,
    farmlist
} from '@/api/poverty'
import {farmsall} from  '@/api/epidemic'
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
            town: [],
            village: [],
            variety :[],
            categorys:[],
            attrs:[],
           farms: [],
            query: {
                keyword: '',
                province: '',
                city: '',
                county: '',
                town: '',
                village: '',
                category:'',
                variety:'',
                property:"",
               farmName:''
            },
            value: [oneyear, now],
        }
    },
    created() {
        this.load()
    },
    methods: {
        load(){
            this.jurisdictionArea()
            this.category();
            this.getfarm()
            this.submit()
        },
        jurisdictionArea() {
            zone().then(res => {
                let {
                    code,
                    data
                } = res.data;
                if (code == 200) {
                    if (data[1]) {
                        this.province = data[1]
                        if (data[2]) {
                            this.city = data[2];
                            if (data[3]) {
                                this.county = data[3]
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
            this.query.town = ''
            this.town = []
            this.query.village = ''
            this.village = []
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
            this.town = []
            this.query.town = ''
            this.village = []
            this.query.village = ''
            if (this.query.city) {
                provinceAndcity(parm).then(res => {
                    let {
                        code,
                        data
                    } = res.data
                    if (code == 200) {
                        this.county = data;
                        this.countyChange()
                    }
                })
            }
        },
        countyChange() {
            let param = {
                parentCode: this.query.county
            }
            this.town = []
            this.query.town = ''
            this.village = []
            this.query.village = ''
            if (this.query.county) {
                provinceAndcity(param).then(res => {
                    let {
                        code,
                        data
                    } = res.data;
                    if (code == 200) {
                        this.town = data
                        this.townChange()
                    }
                })
            }

        },
        townChange() {
            let param = {
                parentCode: this.query.town
            }
            this.village = []
            this.query.village = ''
            if (this.query.town) {
                provinceAndcity(param).then(res => {
                    let {
                        code,
                        data
                    } = res.data;
                    if (code == 200) {
                        this.village = data
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
            this.county = [];
            this.town = [];
            this.village = []
            this.variety=[]
            this.categorys=[]
            this.attrs=[]
                this.query = {
                    keyword: '',
                    province: '',
                    city: '',
                    county: '',
                    town: '',
                    village: '',
                    category:'',
                    variety:'',
                    property:"",
                }
            this.value = [oneyear, now];
            this.$emit('clear')
            this.load()
            

        },
        category() {
            let param = {
                code: "livestock"
            }
            this.query.variety= ''
            this.variety = []
            this.attrs = []
            this.query.property= ''
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
        pinzhong() {
            let param = {
                category: this.query.category
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
        getattr() {
            let param = {
                category: this.query.category
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
                } else {
                    this.$msg({
                        msg: msg
                    })
                }
            })
        },
        getfarm(){
            let query=this.query
           let param={
               province:query.province,
               city:query.city,
               county:query.county,
               town:query.town,
               village:query.village
           }
           farmsall(param).then(res=>{
               let {code,data}=res.data;
               if(code==200){
                   this.farms=data
               }
           })
        },
        querySearch(queryString, cb){
            let farms=this.farms;
            let result=farms.filter(item=>{
                   item.value=item.farmName
                   return item.value.indexOf(queryString)>-1
            })
            cb(result)
        },
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
