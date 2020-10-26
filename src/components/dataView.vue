<template>
<div class="appa">
    <div class="header">
        壹农源智慧供应链大数据管理平台
    </div>

    <div class="box">

        <div class="boxTop clearfix">

            <div class="left">

                <div class="blockCss blockBg1">

                    <div class="topTitle">
                        <div class="text">本地天气 | {{cityname}}</div>
                    </div>

                    <div class="blockBtm">

                        <div class="weatherBox">
                            <div class="vertical weatherLeft">
                                <div class="text1">{{ date | formatDate1 }}</div>
                                <div class="text2">{{ todayTime }} <span>{{ todayWeek }}</span>
                                </div>
                            </div>
                            <div class="vertical weatherRight">

                                <div class="icon"><img :src="img" /></div>
                                <div class="text1">{{temperature1}}~{{temperature2}}℃</div>

                            </div>
                        </div>

                    </div>

                </div>
                <div class="blockCss blockBg2">

                    <div class="topTitle">
                        <div class="text">在栏数量</div>
                    </div>

                    <div class="blockBtm">

                        <div class="numberBox">
                            <div class="numberBoxList">
                                <span>畜类：</span><em>8127</em><span>头</span>
                            </div>
                            <div class="numberBoxList numberBoxListColor2">
                                <span>禽类：</span><em>
                                    <!-- {{data.lsNormalCount}} -->204205
                                </em><span>羽</span>
                            </div>
                        </div>

                    </div>

                </div>
                <div class="blockCss blockBg3">

                    <div class="topTitle">
                        <div class="text">入栏数量</div>
                        <div class="tab">
                            <span class="on">月</span>
                            <span>周</span>
                            <span>日</span>
                        </div>
                    </div>

                    <div class="blockBtm">

                        <div class="numberBox">
                            <div class="numberBoxList">
                                <span>畜类：</span><em>18719</em><span>头</span>
                            </div>
                            <div class="numberBoxList numberBoxListColor2">
                                <span>禽类：</span><em>
                                    <!-- {{data.lairageCount}} -->319263
                                </em><span>羽</span>
                            </div>
                        </div>
                        <div class="numberBox">
                            <div class="numberBoxList">
                                <span>畜类：</span><em>4680</em><span>头</span>
                            </div>
                            <div class="numberBoxList numberBoxListColor2">
                                <span>禽类：</span><em>
                                    <!-- {{data.lairageCount}} -->79812
                                </em><span>羽</span>
                            </div>
                        </div>
                        <div class="numberBox">
                            <div class="numberBoxList">
                                <span>畜类：</span><em>624</em><span>头</span>
                            </div>
                            <div class="numberBoxList numberBoxListColor2">
                                <span>禽类：</span><em>
                                    <!-- {{data.lairageCount}} -->10599
                                </em><span>羽</span>
                            </div>
                        </div>

                    </div>

                </div>
                <div class="blockCss blockBg4">

                    <div class="topTitle">
                        <div class="text">出栏数量</div>
                        <div class="tab">
                            <span class="on">月</span>
                            <span>周</span>
                            <span>日</span>
                        </div>
                    </div>

                    <div class="blockBtm">

                        <div class="numberBox">
                            <div class="numberBoxList">
                                <span>畜类：</span><em>10576</em><span>头</span>
                            </div>
                            <div class="numberBoxList numberBoxListColor2">
                                <span>禽类：</span><em>
                                    <!-- {{data.slaughterCount}} -->106589
                                </em><span>羽</span>
                            </div>
                        </div>

                        <div class="numberBox">
                            <div class="numberBoxList">
                                <span>畜类：</span><em>2645</em><span>头</span>
                            </div>
                            <div class="numberBoxList numberBoxListColor2">
                                <span>禽类：</span><em>
                                    <!-- {{data.slaughterCount}} -->26648
                                </em><span>羽</span>
                            </div>
                        </div>
                        <div class="numberBox">
                            <div class="numberBoxList">
                                <span>畜类：</span><em>349</em><span>头</span>
                            </div>
                            <div class="numberBoxList numberBoxListColor2">
                                <span>禽类：</span><em>
                                    <!-- {{data.slaughterCount}} -->3558
                                </em><span>羽</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
            <div class="centerBox">

                <div class="blockCss blockBg5">

                    <div class="topTitle on">
                        <div class="text">基地数量 {{data.farmCount}} 家</div>
                    </div>

                    <div class="blockBtm">

                        <div class="swiperBoxGroup">
                            <div class="swiperBox">
                                <!-- Swiper -->
                                <div class="swiper-container">
                                    <div class="swiper-wrapper">
                                        <div v-for='(item,index) in farmImg' class="swiper-slide" :key='index'>
                                            <img :src="item">
                                        </div>
                                    </div>
                                    <!-- Add Pagination -->
                                    <div class="swiper-pagination swiper-pagination-white"></div>
                                    <!-- Add Arrows -->
                                    <div class="swiper-button-next swiper-button-white"></div>
                                    <div class="swiper-button-prev swiper-button-white"></div>
                                </div>
                            </div>
                        </div>

                        <div class="table">
                            <table>
                                <thead>
                                    <tr>
                                        <td></td>
                                        <td>基地名单</td>
                                        <td>东经</td>
                                        <td>北纬</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in records" :key="index" @click="changeFarm(item,index)" :class="index==0?'dataViewActive only':'only'">
                                        <td>{{index+1}}</td>
                                        <td>{{item.farmName}}</td>
                                        <td>{{item.coords?item.coords.split(',')[0]:''}}</td>
                                        <td>{{item.coords?item.coords.split(',')[1]:""}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>
                <div class="blockCss blockBg6">

                    <div class="topTitle">
                        <div class="text">投保数值</div>
                    </div>

                    <div class="blockBtm insuredValue">

                        <div class="numberBox">
                            <div class="numberBoxList numberBoxListColor3">
                                <h1>投保总价值</h1>
                                <em>844.5</em><span>万元</span>
                            </div>
                            <div class="numberBoxList">
                                <h1>投保畜类</h1>
                                <em>8127</em><span>头</span>
                            </div>
                            <div class="numberBoxList numberBoxListColor2">
                                <h1>投保禽类</h1>
                                <em>21205</em><span>羽</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
            <div class="right">

                <div class="blockCss blockBg7">

                    <div class="topTitle">
                        <!--  <div class="text">环境曲线图</div> -->
                        <div class="text">{{title}}</div>
                    </div>

                    <div class="blockBtm">
                        <div class="chartmainBox">
                            <span>（1PH 水 = 1PH 土 = 温度 5℃ = 湿度 5% = 二氧化碳 50ppm）</span>
                            <div id="chartmain"></div>
                        </div>

                    </div>

                </div>
                <div class="blockCss blockBg8">

                    <div class="topTitle">
                        <div class="text">预计金融授信额</div>
                    </div>

                    <div class="blockBtm insuredValue insuredValue2">

                        <div class="numberBox">
                            <div class="numberBoxList">
                                <em>253.3</em><span>万</span>
                            </div>
                        </div>

                    </div>

                </div>
                <div class="blockCss blockBg8">

                    <div class="topTitle">
                        <div class="text">预计饲料配送量</div>
                        <div class="tab">
                            <span class="on">月</span>
                            <span>周</span>
                            <span>日</span>
                        </div>
                    </div>

                    <div class="blockBtm insuredValue insuredValue2">

                        <div class="numberBox">
                            <div class="numberBoxList">
                                <em>371040</em><span>吨</span>
                            </div>
                        </div>

                        <div class="numberBox">
                            <div class="numberBoxList">
                                <em>86576</em><span>吨</span>
                            </div>
                        </div>

                        <div class="numberBox">
                            <div class="numberBoxList">
                                <em>12368</em><span>吨</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
        <div class="boxBottom clearfix povertyAllBox">

            <div class="povertyAll1">扶 贫窗 口</div>
            <div class="povertyAll2">
                <div class="povertyAll2List">
                    <p><i>569</i><span>户</span></p>
                    <p><span>2020年帮扶贫困户数量</span></p>
                </div>
                <div class="povertyAll2List">
                    <p><i>618</i><span>元</span></p>
                    <p><span>2020年贫困户平均增收</span></p>
                </div>

            </div>
            <div class="povertyAll3 povertyAll3_1">
                <div class="povertyChartBox" id="povertyChart1"></div>
                <div class="label">
                    <div class="block">
                        <p><i class="text1">32785</i><span>头</span></p>
                        <p><span>贫困户畜类在栏数量</span></p>
                    </div>
                    <div class="block">
                        <p><i class="text2">60%</i></p>
                        <p><span>占在栏畜类总数</span></p>
                    </div>
                </div>
            </div>
            <div class="povertyAll3 povertyAll3_2">
                <div class="povertyChartBox" id="povertyChart2"></div>
                <div class="label color2">
                    <div class="block">
                        <p><i class="text1">68303</i><span>羽</span></p>
                        <p><span>贫困户禽类在栏数量</span></p>
                    </div>
                    <div class="block">
                        <p><i class="text2">75%</i></p>
                        <p><span>占在栏禽类总数</span></p>
                    </div>
                </div>
            </div>
            <div class="povertyAll3 povertyAll3_3">
                <div class="povertyChartBox" id="povertyChart3"></div>
                <div class="label color3">
                    <div class="block">
                        <p><i class="text1">170</i><span>万元</span></p>
                        <p><span>帮扶贫困户年产值</span></p>
                    </div>
                    <div class="block">
                        <p><i class="text2">40%</i></p>
                        <p><span>占平台年总产值</span></p>
                    </div>
                </div>
            </div>

        </div>

    </div>
</div>
</template>

<script>
import {
    getindexList
} from "@/api/basic/farm";
import {
    getWeather
} from '@/api/farm/diagram'
import {
    gettrendsInfo,
    getDetail
} from '@/api/dataView'
import echarts from 'echarts'
import Swiper from 'swiper'
import $ from 'jquery'
var padDate = function (value) {
    return value < 10 ? '0' + value : value;
};
/*  var date = new Date();
 var year = padDate(date.getFullYear());
 var month = padDate(date.getMonth()+1);
 var day = padDate(date.getDate());
 var week = date.getDay()
 var todayTime = year + '年' + month + '月' + day + '日'
 var weekday = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六']
 var todayWeek = weekday[week] */
export default {
    data() {
        return {
            data: {},
            records: [],
            povertyAllOption1: {},
            povertyAllOption2: {},
            povertyAllOption3: {},
            date: new Date(),
            temperature1: '10',
            temperature2: '17',
            img: '',
            todayTime: "",
            todayWeek: "",
            cityname: '上海',
            cip: '114.92.203.77',
            farmId: "",
            farmImg: [],
            title: '',
        }
    },
    created() {
        this.load()
    },
    beforeDestroy: function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
        if (this.refreshtime) {
            clearInterval(this.refreshtime)
        }
    },
    filters: {
        formatDate1: function (value) {
            var date = new Date(value);
            var hours = padDate(date.getHours());
            var minutes = padDate(date.getMinutes());
            var seconds = padDate(date.getSeconds());
            return hours + ':' + minutes + ':' + seconds;
        }
    },
    methods: {
        load() {
            this.getindexList()
            // this.getDetail()
            this.getdate()
            this.cityname = localStorage.getItem('cityname')
            this.cip = localStorage.getItem('cip')
            this.xx()
            this.poverFun1();
            this.poverFun2();
            this.poverFun3();
            this.img = require('../styles/dataView/images/weather_icon.png')
            getWeather(this.cip).then(res => {
                let weatherinfo = res.data.HeWeather6[0].now
                this.temperature1 = weatherinfo.tmp
                this.temperature2 = +weatherinfo.tmp + 4
                if (weatherinfo.cond_txt === "阵雨") {
                    this.img = require('../styles/dataView/images/yu.png')
                } else if (weatherinfo.weather === "晴") {
                    this.img = require('../styles/dataView/images/weather_icon.png')
                } else {
                    this.img = require('../styles/dataView/images/duoyun.png')
                }
            })
        },
        getdate() {
            var date = new Date();
            var year = padDate(date.getFullYear());
            var month = padDate(date.getMonth() + 1);
            var day = padDate(date.getDate());
            var week = date.getDay()
            var todayTime = year + '年' + month + '月' + day + '日'
            var weekday = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            var todayWeek = weekday[week];
            this.todayWeek = todayWeek;
            this.todayTime = todayTime
        },
        getDetail() {
            getDetail(this.farmId).then(res => {
                const {
                    photourl,
                    farmName
                } = res.data.data
                this.farmImg = photourl.split(',')
                this.title = farmName
                //轮播
                this.$nextTick(function () {
                    var swiper = new Swiper('.swiper-container', {
                        spaceBetween: 30,
                        effect: 'fade',
                        pagination: {
                            el: '.swiper-pagination',
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                    });
                })
            })
        },
        changeFarm(data, index) {
            $('.only').eq(index).addClass('dataViewActive').siblings().removeClass('dataViewActive')
            console.log("ddd:",data)
            this.farmId = data.id
            this.getDetail()
            // this.getindexList()
            var shijian = [],
                shuizhi = [],
                tuzhi = [],
                wendu = [],
                shidu = [],
                co = []
            //获取dom容器
            var myChart = echarts.init(document.getElementById('chartmain'));
        
            gettrendsInfo(data.id).then(res => {
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['水质(ph)', '土壤(ph)', '温度(℃)', '湿度(%)', '二氧化碳(ppm)'],
                        textStyle: {
                            color: '#6a88e3',
                            fontSize: 12,
                        },
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        axisLine: {
                            lineStyle: {
                                color: '#4e5779',
                                width: 1, //这里是为了突出显示加上的
                            },
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff', //坐标值得具体的颜色
                                fontSize: 14,
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                //type: 'dashed',
                                color: '#18244a'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#4e5779',
                                width: 1, //这里是为了突出显示加上的
                            },
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff', //坐标值得具体的颜色
                                fontSize: 14,
                            }
                        },
                        splitNumber: 8,
                        splitLine: {
                            lineStyle: {
                                //type: 'dashed',
                                color: '#18244a'
                            }
                        }
                    },
                    series: [{
                            name: '水质(ph)',
                            data: [2, 20, 6, 5, 4, 9, 5],
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#0be3f5', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#0be3f5' //改变折线颜色
                                    }
                                },
                            },
                            smooth: true,
                        },
                        {
                            name: '土壤(ph)',
                            data: [2, 20, 6, 5, 4, 9, 5],
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#dbd919', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#dbd919' //改变折线颜色
                                    }
                                },
                            },
                            smooth: true,
                        },
                        {
                            name: '温度(℃)',
                            data: [6, 5, 2, 15, 13, 4, 16],
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#00d98b', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#00d98b' //改变折线颜色
                                    }
                                },
                            },
                            smooth: true,
                        },
                        {
                            name: '湿度(%)',
                            data: [1, 6, 18, 12, 14, 6, 20],
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#ff9745', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#ff9745' //改变折线颜色
                                    }
                                },
                            },
                            smooth: true,
                        },
                        {
                            name: '二氧化碳(ppm)',
                            data: [20, 2, 8, 11, 1, 0, 4],
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#e35d68', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#e35d68' //改变折线颜色
                                    }
                                },
                            },
                            smooth: true,
                        }
                    ]
                }
                res.data.data.forEach(item => {
                    shijian.push(item.时间)
                    shuizhi.push((item.水质PH).toFixed(2))
                    tuzhi.push((item.土质PH).toFixed(2))
                    wendu.push((item.温度 / 5).toFixed(2))
                    shidu.push((item.湿度 / 5).toFixed(2))
                    co.push((item.二氧化碳 / 50).toFixed(2))
                })
                option.xAxis.data = shijian
                option.series[0].data = shuizhi
                option.series[1].data = tuzhi
                option.series[2].data = wendu
                option.series[3].data = shidu
                option.series[4].data = co
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            })
        },
        getindexList() {
            getindexList( /* {farmId:this.farmId} */ ).then(res => {
                this.data = res.data
                this.records = res.data.farms
                if (this.records.length > 0) {
                    this.farmId = this.records[0].id;
                    this.changeFarm(this.records[0])
                    this.getDetail()
                }

            })
        },
        xx() {
            document.getElementsByTagName('body')[0].className = 'oneBody'
        },
        calculationScale() {
            var width = parseInt($(window).width()),
                calculation = 0,
                bodyWidth = 1920;
            calculation = width / bodyWidth;
            $("body").css("transform", "scale(" + calculation + ")");
        },
        poverFun1() {
            this.povertyAllOption1 = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (res) {
                        //  $('.povertyAll3_1 .label .text1').html(res.data.value);
                        //  $('.povertyAll3_1 .label .text2').html(res.data.name);
                    }
                },
                legend: {
                    orient: 'vertical',
                    right: '10',
                    top: 'center',
                    data: ['畜类总数', '禽类总数'],
                    textStyle: {
                        color: "#6a88e4",
                        fontSize: 12,
                    },
                },
                series: [{
                    name: '扶贫窗口数据',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [{
                            value: 273213,
                            name: '',
                            itemStyle: {
                                color: '#0be3f5',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            selected: true,
                            label: { //默认影藏线条true
                                //show: true,
                                position: 'inner',
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: 'bold',
                                padding: [-10, 2, 3, 4],
                            },
                            emphasis: { //划入出现线条
                                label: {
                                    show: true
                                }
                            },
                            labelLine: {
                                show: false
                            },
                        },
                        {
                            value: 163928,
                            name: '',
                            itemStyle: {
                                color: '#6a88e4',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            label: { //默认影藏线条
                                show: false,
                                position: 'inner'
                            },
                            emphasis: { //划入出现线条
                                label: {
                                    show: false
                                }
                            },
                        }
                    ].sort(function (a, b) {
                        return a.value - b.value;
                    }),
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }]
            };
        },
        poverFun2() {
            this.povertyAllOption2 = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (res) {
                        //$('.povertyAll3_2 .label .text1').html(res.data.value);
                        //$('.povertyAll3_2 .label .text2').html(res.data.name);
                    }
                },
                legend: {
                    orient: 'vertical',
                    right: '10',
                    top: 'center',
                    data: ['禽类总数', '畜类总数'],
                    textStyle: {
                        color: "#6a88e4",
                        fontSize: 12,
                    },
                },
                series: [{
                    name: '扶贫窗口数据',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    data: [{
                            value: 341516,
                            name: '',
                            selected: true,
                            itemStyle: {
                                color: '#6a88e4',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            label: { //默认影藏线条
                                show: false,
                                position: 'inner'
                            },
                            emphasis: { //划入出现线条
                                label: {
                                    show: false
                                }
                            },
                        },
                        {
                            value: 113839,
                            name: '',
                            //selected: true,
                            itemStyle: {
                                color: '#ff9745',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            label: { //默认影藏线条
                                //show: false,
                                position: 'inner',
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: 'bold',
                            },
                            emphasis: { //划入出现线条
                                label: {
                                    show: true
                                }
                            },
                            labelLine: {
                                show: false
                            },
                        }
                    ].sort(function (a, b) {
                        return a.value - b.value;
                    }),

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }]
            };
        },
        poverFun3() {
            this.povertyAllOption3 = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (res) {
                        //$('.povertyAll3_3 .label .text1').html(res.data.value);
                        //$('.povertyAll3_3 .label .text2').html(res.data.name);
                    }
                },
                legend: {
                    orient: 'vertical',
                    right: '10',
                    top: 'center',
                    data: ['禽类总数', '畜类总数'],
                    textStyle: {
                        color: "#6a88e4",
                        fontSize: 12,
                    },
                },
                series: [{
                    name: '扶贫窗口数据',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [{
                            value: 853.5,
                            name: '',
                            selected: true,
                            itemStyle: {
                                color: '#bbba1b',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            label: { //默认影藏线条
                                //show: false,
                                position: 'inner',
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: 'bold',
                            },
                            emphasis: { //划入出现线条
                                label: {
                                    show: true
                                }
                            },
                            labelLine: {
                                show: false
                            },
                        },
                        {
                            value: 1422,
                            name: '0',
                            itemStyle: {
                                color: '#6a88e4',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            label: { //默认影藏线条
                                show: false,
                                position: 'inner'
                            },
                            emphasis: { //划入出现线条
                                label: {
                                    show: false
                                }
                            },
                        }
                    ].sort(function (a, b) {
                        return a.value - b.value;
                    }),
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }]
            };
        },
        getObjectIndex(a, b) {
            for (var i in b) {
                if (b[i] == a) {
                    return i;
                }
            }
            return -1;
        },
        charting() {
            var shijian = [],
                shuizhi = [],
                tuzhi = [],
                wendu = [],
                shidu = [],
                co = []
            //获取dom容器
            var myChart = echarts.init(document.getElementById('chartmain'));
            //tab切换
            $('.blockCss').each(function () {
                $(this).find('.blockBtm .numberBox').each(function (index) {
                    if (index != 0) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                })
            })
            var $ml = $('.blockCss .topTitle .tab span');
            $ml.click(function () {
                var parent = $(this).parents('.blockCss .topTitle').siblings('.blockBtm').find('.numberBox'),
                    index = $(this).index();
                $(this).addClass('on').siblings().removeClass('on');
                parent.eq(index).show().siblings().hide();
            });

            //表格切换轮播
            $(".swiperBoxGroup .swiperBox").css({
                "display": "none"
            });
            $(".swiperBoxGroup .swiperBox:first-child").css({
                "display": "block"
            });

            gettrendsInfo(this.farmId).then(res => {
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['水质(ph)', '土壤(ph)', '温度(℃)', '湿度(%)', '二氧化碳(ppm)'],
                        textStyle: {
                            color: '#6a88e3',
                            fontSize: 12,
                        },
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        axisLine: {
                            lineStyle: {
                                color: '#4e5779',
                                width: 1, //这里是为了突出显示加上的
                            },
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff', //坐标值得具体的颜色
                                fontSize: 14,
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                //type: 'dashed',
                                color: '#18244a'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#4e5779',
                                width: 1, //这里是为了突出显示加上的
                            },
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff', //坐标值得具体的颜色
                                fontSize: 14,
                            }
                        },
                        splitNumber: 8,
                        splitLine: {
                            lineStyle: {
                                //type: 'dashed',
                                color: '#18244a'
                            }
                        }
                    },
                    series: [{
                            name: '水质(ph)',
                            data: [2, 20, 6, 5, 4, 9, 5],
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#0be3f5', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#0be3f5' //改变折线颜色
                                    }
                                },
                            },
                            smooth: true,
                        },
                        {
                            name: '土壤(ph)',
                            data: [2, 20, 6, 5, 4, 9, 5],
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#dbd919', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#dbd919' //改变折线颜色
                                    }
                                },
                            },
                            smooth: true,
                        },
                        {
                            name: '温度(℃)',
                            data: [6, 5, 2, 15, 13, 4, 16],
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#00d98b', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#00d98b' //改变折线颜色
                                    }
                                },
                            },
                            smooth: true,
                        },
                        {
                            name: '湿度(%)',
                            data: [1, 6, 18, 12, 14, 6, 20],
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#ff9745', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#ff9745' //改变折线颜色
                                    }
                                },
                            },
                            smooth: true,
                        },
                        {
                            name: '二氧化碳(ppm)',
                            data: [20, 2, 8, 11, 1, 0, 4],
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#e35d68', //改变折线点的颜色
                                    lineStyle: {
                                        color: '#e35d68' //改变折线颜色
                                    }
                                },
                            },
                            smooth: true,
                        }
                    ]
                }
                res.data.data.forEach(item => {
                    shijian.push(item.时间)
                    shuizhi.push((item.水质PH).toFixed(2))
                    tuzhi.push((item.土质PH).toFixed(2))
                    wendu.push((item.温度 / 5).toFixed(2))
                    shidu.push((item.湿度 / 5).toFixed(2))
                    co.push((item.二氧化碳 / 50).toFixed(2))
                })
                option.xAxis.data = shijian
                option.series[0].data = shuizhi
                option.series[1].data = tuzhi
                option.series[2].data = wendu
                option.series[3].data = shidu
                option.series[4].data = co
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            })
            var povertyChart1 = echarts.init(document.getElementById('povertyChart1'));
            povertyChart1.setOption(this.povertyAllOption1);

            var povertyChart2 = echarts.init(document.getElementById('povertyChart2'));
            povertyChart2.setOption(this.povertyAllOption2);

            var povertyChart3 = echarts.init(document.getElementById('povertyChart3'));
            povertyChart3.setOption(this.povertyAllOption3);

            povertyChart1.on('click', function (params) {
                $('.povertyAll3_1 .label .text1').html(params.data.value);
                $('.povertyAll3_1 .label .text2').html(params.data.name);
            });

            povertyChart2.on('click', function (params) {
                $('.povertyAll3_2 .label .text1').html(params.data.value);
                $('.povertyAll3_2 .label .text2').html(params.data.name);
            });

            povertyChart3.on('click', function (params) {
                $('.povertyAll3_3 .label .text1').html(params.data.value);
                $('.povertyAll3_3 .label .text2').html(params.data.name);
            });
        }
    },

    mounted() {
        var _this = this;
        this.timer = setInterval(function () {
            _this.date = new Date();
        }, 1000)
        this.calculationScale();
        this.charting()
        this.refreshtime = setInterval(() => {
            this.load()
            this.charting()
        }, 600000)

    }
}
</script>

<style lang="scss" scoped>
@import '../styles/dataView/css/base.css';
@import '../styles/dataView/css/public.css';
@import '../styles/dataView/css/swiper.css';
@import '../styles/dataView/css/style.css';

.dataViewActive {
    color: #ffffff !important;
}

.table {
    tbody {
        display: block;
        height: 185px;
        overflow-y: scroll;
    }

    tbody::-webkit-scrollbar {
        display: none
    }

    thead,
    tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;

    }

    thead {
        // width: calc(100% - 1em)
    }
}
</style>
