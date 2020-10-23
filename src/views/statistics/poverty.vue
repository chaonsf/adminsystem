<template>
<div class="analysis">
    <Query :show='false' @search='submit'></Query>
    <div class="content">
        <el-row>
            <el-col :span='12'>
                <div class='item num'>
                    <i class="iconfont icon-shuliang"></i>
                    <p class='number'>{{helpdata.povertyCount}}</p>
                    <p class='title'>帮扶贫困户数量（户）</p>
                </div>
            </el-col>
            <el-col :span='12'>
                <div class='item num'>
                    <i class="iconfont icon-xinzengshoukuandan"></i>
                    <p class='number'>{{helpdata.povertyAvgAmount}}</p>
                    <p class='title'>贫困户平均增收</p>
                </div>
            </el-col>
            <el-col :span='12'>
                <div class="item">
                    <div class='pie' id='poor'>
                    </div>
                    <div class="right">
                        <p><span>{{helpdata.povertyLivestockCount}}</span>头</p>
                        <p>贫困户畜类在栏数量</p>
                        <p class='two'><span>{{helpdata.name1}}</span></p>
                        <p>占在栏畜类总数</p>
                    </div>
                </div>
            </el-col>
            <el-col :span='12'>
                <div class="item">
                    <div class='pie' id='poor2'>
                    </div>
                    <div class="right">
                        <p><span>{{helpdata.povertyPoultryCount}}</span>头</p>
                        <p>贫困户禽类在栏数量</p>
                        <p class='two'><span>{{helpdata.name2}}</span></p>
                        <p>占在栏禽类总数</p>
                    </div>
                </div>
            </el-col>
            <el-col :span='12'>
                <div class="item">
                    <div class='pie' id='poor3'>
                    </div>
                    <div class="right">
                        <p><span>{{helpdata.povertyTotalAmount}}</span>万元</p>
                        <p>帮扶贫困户年产值</p>
                        <p class='two'><span>{{helpdata.name3}}</span></p>
                        <p>占平台年总产值</p>
                    </div>
                </div>
            </el-col>
        </el-row>

    </div>
</div>
</template>

<script>
import {
    provinceAndcity,
    listByTime,
    statistics
} from '@/api/poverty'
import echarts from 'echarts'
import Query from "@/components/newcomponent/queryhead"
import {
    Loading
} from 'element-ui';
export default {
    components: {
        Query
    },
    data() {
        return {
            helpdata: {},
            label: { //显示线条
                show: true,
                position: 'inner',
                color: '#fff',
                fontSize: 16,
            },
            label2: { //隐藏线条
                show: false,
                position: 'inner',
            }

        }
    },
    created() {

    },
    methods: {
        submit(query) {
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            /*      let param=Object.assign({},this.query,{
                     province:parseInt(this.provinceId),
                     city:parseInt(this.cityId),
                     county:parseInt(this.countyId),
                 }) */
            let param = {
                ...query,
                beginTime: query.startTime,
                endTime: query.endTime

            }
            statistics(param).then(res => {
                loadingInstance.close();
                let {
                    code,
                    data,
                    msg
                } = res.data;
                if (code == 200) {
                    this.helpdata = data;
                    this.helpdata.deffpovertyLivestockCount = parseInt(data.totalLivestockCount) - parseInt(data.povertyLivestockCount);
                    if (data.totalLivestockCount != 0) {
                        let name1 = (parseInt(data.povertyLivestockCount) / parseInt(data.totalLivestockCount) * 100).toFixed(2)
                        this.helpdata.name1 = name1 + '%'
                    } else {
                        this.helpdata.name1 = "0%";
                    }
                    this.helpdata.diffpovertyPoultryCount = parseInt(data.totalPoultryCount) - parseInt(data.povertyPoultryCount);
                    if (data.povertyPoultryCount != 0) {
                        let name2 = (parseInt(data.povertyPoultryCount) / parseInt(data.totalPoultryCount) * 100).toFixed(2)
                        this.helpdata.name2 = name2 + "%"
                    } else {
                        this.helpdata.name2 = "0%";
                    }
                    this.helpdata.diffpovertyTotalAmount = parseFloat(data.totalAmount) - parseFloat(data.povertyTotalAmount)
                    if (data.povertyTotalAmount != 0) {
                        let name3 = (parseFloat(data.povertyTotalAmount) / parseFloat(data.totalAmount) * 100).toFixed(2)
                        this.helpdata.name3 = name3 + "%";
                    } else {
                        this.helpdata.name3 = "0%";
                    }
                    this.draw()
                } else {
                    this.$msg({
                        msg: msg
                    })
                }
            })

        },
        draw() {
            this.poor()
            this.poor2()
            this.poor3()
        },
        poor() {
            let poorChart = echarts.init(document.getElementById('poor'));
            let option = {
                series: [{
                        name: '扶贫窗口数据',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [{
                                value: this.helpdata.deffpovertyLivestockCount,
                                name: '0',
                                selected: true,
                                itemStyle: {
                                    color: "red",
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                label: this.label2
                            },
                            {
                                value: this.helpdata.povertyLivestockCount,
                                name: this.helpdata.name1,
                                itemStyle: {
                                    color: "blue",
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                label: this.helpdata.name1 == "0%" || "0.00%" ? this.label2 : this.label

                            },
                        ],
                    },

                ]
            }
            poorChart.setOption(option)
        },
        poor2() {
            let poorChart = echarts.init(document.getElementById('poor2'));
            let option = {
                series: [{
                        name: '扶贫窗口数据',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [{
                                value: this.helpdata.diffpovertyPoultryCount,
                                name: '0',
                                selected: true,
                                itemStyle: {
                                    color: "green",
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                label: this.label2
                            },
                            {
                                value: this.helpdata.povertyPoultryCount,
                                name: this.helpdata.name2,
                                itemStyle: {
                                    color: "blue",
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                label: this.helpdata.name2 == "0%" || "0.00%" ? this.label2 : this.label

                            },
                        ],
                    },

                ]
            }
            poorChart.setOption(option)
        },
        poor3() {
            let poorChart = echarts.init(document.getElementById('poor3'));
            let option = {
                series: [{
                        name: '扶贫窗口数据',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [{
                                value: this.helpdata.diffpovertyTotalAmount,
                                name: '0',
                                selected: true,
                                itemStyle: {
                                    color: "orange",
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                label: this.label2
                            },
                            {
                                value: this.helpdata.povertyTotalAmount,
                                name: this.helpdata.name3,
                                itemStyle: {
                                    color: "blue",
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                label: this.helpdata.name3 == "0%" || "0.00%" ? this.label2 : this.label

                            },
                        ],
                    },

                ]
            }
            poorChart.setOption(option)
        },

    }

}
</script>

<style lang="scss">
.analysis {
    padding: 10px 20px;

    .content {
        .el-col {
            margin-bottom: 40px;

            .item {
                width: 372px;
                height: 150px;
                box-shadow: #ccc 2px 2px 8px;
                padding: 25px 0;
            }

            .num {
                text-align: center;

                .iconfont {
                    font-size: 24px;
                    color: #409eff;
                }

                .number {
                    font-size: 24px;
                    margin-top: 20px;
                    color: #222;
                    margin-bottom: 20px;
                }

                .title {
                    font-size: 14px;
                    color: #666;
                }
            }

            .pie {
                width: 140px;
                height: 140px;
                float: left;
            }

            .right {
                p {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 10px;

                    span {
                        font-size: 20px;
                        color: #1eade9;
                        margin-right: 5px;
                    }
                }

                .two {
                    margin-top: 20px;
                }
            }
        }
    }
}
</style>
