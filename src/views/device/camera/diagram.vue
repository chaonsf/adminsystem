<template>
    <basic-container>
        <el-row>
            <el-col :span="7">
                <div class="subDiv">
                    <span>基地：</span>
                    <el-select
                        v-model="params.farmId"
                        size="small"
                        filterable
                        collapse-tags
                        placeholder="请选择"
                        @change="farmChange"
                    >
                        <el-option
                            v-for="item in farms"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="7">
                <div class="subDiv">
                    <span>摄像头：</span>
                    <el-select
                        v-model="params.deviceId"
                        size="small"
                        :loading="deviceLoading"
                        placeholder="请选择"
                        @change="deviceChange"
                    >
                        <el-option
                            v-for="item in devices"
                            :key="item.value.id"
                            :label="item.label"
                            :value="item.value.id"
                        >
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="10">
                <div class="subDiv">
                    <span>日期：</span>
                    <el-date-picker
                        v-model="selectDate"
                        type="daterange"
                        size="small"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="dateChange"
                    >
                    </el-date-picker>
                </div>
            </el-col>
        </el-row>
        <el-row>
        <waterfall :col="5" :data="datas" class="vue-waterfall" style="margin-top: 10px;">
            <vue-preview :slides="datas" class="cell-item"></vue-preview>
        </waterfall>
    </el-row>
    </basic-container>
</template>

<script>
import { loadmore } from "@/api/farm/diagram.js";
import { dateFormatPattern } from "@/util/date.js";
import { getFarmCameras } from "@/api/device/dome.js";

export default {
    data() {
        return {
            page: {
                current: 1
            },
            deviceLoading: false,
            selectDate: null,
            params: {
                farmId: 1,
                deviceId: 9,
                beginTime: null,
                endTime: null
            },
            farms: [], // [{ label: "", value: "", children: [{ label: "", value: "" }] }]
            devices: [],
            datas: [],
            imgs: [],
            flag:true
        };
    },
    mounted() {
        window.addEventListener('scroll', this.getbottom)
        this.init().then(() => {
            this.selectFarm = this.farms[0].value;
            this.loadmore();
        });
        document
            .getElementsByClassName("vue-waterfall")[0]
            .addEventListener("scroll", this.handleScroll);
    },
    beforeDestroy() {
        document
            .getElementsByClassName("vue-waterfall")[0]
            .removeEventListener("scroll", this.handleScroll);
    },
    computed: {
        itemWidth() {
            return 138 * 0.5 * (document.documentElement.clientWidth / 375);
        },
        gutterWidth() {
            return 9 * 0.5 * (document.documentElement.clientWidth / 375);
        }
    },
    watch: {
        datas() {
            this.imgs = this.datas.map(d => d.acqValue);
        },
        // "params.farmId"() {
        //     if (this.params.farmId) {
        //         this.devices = this.farms.filter(
        //             f => f.value == this.params.farmId
        //         )[0].children;
        //     }
        // },
    },
    methods: {
        openPreview(index = 0) {
            this.$ImagePreview(this.datas, index);
        },
        loadmore() {
            loadmore(this.params, this.page.current)
                .then(res => {
                    let newData = res.data.data.records
                    for( let i=0;i<newData.length;i++ ){
                        this.datas.push({
                            src:newData[i].acqValue+'?x-oss-process=image/resize,w_1500',
                            msrc:newData[i].acqValue+'?x-oss-process=image/resize,w_500',
                            w:1408,
                            h:792
                        })
                    }
                })
                .then(() => {
                    if (this.page.current === 1) {
                        this.$waterfall.forceUpdate();
                    }
                });
        },
        init() {
            // 加载下拉框
            return getFarmCameras().then(res => {
                this.params.farmId = res.data.data[0].value
                this.params.deviceId = res.data.data[0].children[0].value.id
                this.farms = res.data.data;
                if (this.params.farmId) {
                    this.devices = this.farms.filter(
                        f => f.value == this.params.farmId
                    )[0].children;
                }
            });
        },
        farmChange() {
            // 图片数据清空
            this.datas = [];
            this.page.current = 1;
            // 设备信息清空
            this.params.deviceId = null;
            this.loadmore();
            getFarmCameras().then(res=>{
                const { data }  = res.data
                for( let i=0;i<data.length;i++ ){
                    if( data[i].value == this.params.farmId ){
                        this.devices = data[i].children
                    }
                }
            })
        },
        deviceChange() {
            this.datas = [];
            this.page.current = 1;
            this.loadmore();
        },
        dateChange() {
            this.params.beginTime =
                dateFormatPattern(this.selectDate[0], "yyyy-MM-dd") +
                " 00:00:00";
            this.params.endTime =
                dateFormatPattern(this.selectDate[1], "yyyy-MM-dd") +
                " 23:59:59";
            this.datas = [];
            this.page.current = 1;
            this.loadmore();
        },
        handleScroll() {
            let div = document.getElementsByClassName("vue-waterfall")[0];
            if (div.scrollTop + div.clientHeight >= div.scrollHeight - 25) {
                if (div.scrollTop + div.clientHeight >= div.scrollHeight - 5) {
                    this.page.current++;
                    this.loadmore();
                }
            }
        }
    }
};
</script>

<style>
.image {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}
.vue-waterfall-column{
    width: 100% !important;
}
p > img {
    width: 200px;
    cursor: pointer;
    margin: 10px;
    border-radius: 4px;
}

p > img:hover {
    -webkit-box-shadow: 0 0 6px #3f3f3f;
    box-shadow: 0 0 6px #3f3f3f;
}

.center {
    display: flex;
    align-items: center;
    width: 100%;
}
.cell-item img{ 
    width: 320px;
    height: 180px;
    float: left;
    margin: 40px;
    opacity:1;
    border-radius: 3px;
    max-width: 100%;
    max-height: 100%;
    display: block;
}

.vue-waterfall {
    overflow: auto;
    position: relative;
    height: 80vh;
}

.subDiv {
    display: table-cell;
    width: 50%;
    text-align: center;
}
.el-col span {
    margin: 0 auto;
}
.vue-waterfall.is-transition img{
    opacity: 1;
}
</style>
