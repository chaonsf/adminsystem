<template>
<div class='broadcast'>
    <div class='intr'>
        <div class='left' @click='back'>
            <i class="iconfont icon-fanhui"></i><span>返回</span>
        </div>
        <h4>{{title}}</h4>
    </div>
    <div class="head">
        <el-select v-model="value" @change='change'>
            <el-option v-for='item in optionarray' :key='item.url.flv' :label='item.label' :value='item.serial'></el-option>
        </el-select>
        <div style="text-align:right">
            <el-button type="primary" @click='querypohto' class='querybtn'>查看实时图片</el-button>
        </div>
    </div>
    <div id='iframe'>
        <iframe :src="frameUrl" frameborder="0" width="1000px" height="600px" align="center" id="ysOpenDevice" allowfullscreen></iframe>
    </div>

    <el-row class='bton' style="margin-top:5px;" v-if="value.length>0 && deviceType==3">
        <el-button type="primary" icon="el-icon-top" circle @click="handlePtz(0)"></el-button>
        <el-button type="primary" icon="el-icon-bottom" circle @click="handlePtz(1)"></el-button>
        <el-button type="primary" icon="el-icon-back" circle @click="handlePtz(2)"></el-button>
        <el-button type="primary" icon="el-icon-right" circle @click="handlePtz(3)"></el-button>
        <el-button type="primary" icon="el-icon-top-left" circle @click="handlePtz(4)"></el-button>
        <el-button type="primary" icon="el-icon-bottom-left" circle @click="handlePtz(5)"></el-button>
        <el-button type="primary" icon="el-icon-top-right" circle @click="handlePtz(6)"></el-button>
        <el-button type="primary" icon="el-icon-bottom-right" circle @click="handlePtz(7)"></el-button>
        <el-button type="warning" icon="el-icon-zoom-in" circle @click="handlePtz(8)"></el-button>
        <el-button type="warning" icon="el-icon-zoom-out" circle @click="handlePtz(9)"></el-button>
    </el-row>
</div>
</template>

<script>
import {
    cameraslist
} from '@/api/poverty'
import {
    Loading
} from 'element-ui';
import {
    getToken,
    getLiveAddress,
    ptzStart,
    ptzStop
} from "@/api/ys7";
export default {
    components: {

    },
    data() {
        return {
            optionarray: [],
            value: '',
            frameUrl: "",
            accessToken: "",
            deviceType: '',
            title: ''
        }
    },
    created() {
        let id = this.$route.query.id;
        getToken().then(res => {
            this.accessToken = res.data.data.accessToken;
            this.getoption(id)
        })
    },
    methods: {
        getoption(id) {
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            cameraslist(id).then(res => {
                let {
                    data,
                    code
                } = res.data
                loadingInstance.close();
                if (code == 200) {
                    this.title = data[0].farmName
                    if (data[0].devices.length == 0) {
                        this.$msg({
                            msg: '该农场暂时还未安装摄像头'
                        });
                        return
                    }
                    this.optionarray = data[0].devices
                    this.value = this.optionarray[0].serial;
                    this.deviceType = this.optionarray[0].deviceType
                    this.change()
                }
            })
        },
        change() {
            let value = this.value
            let arr = this.optionarray.find(item => {
                return item.serial == value
            })
            this.deviceType = arr.deviceType
            /*   var iframe = document.getElementById("iframe"); */
            /* iframe.innerHTML = `<iframe src="/management/trace/video.html?url=${this.value}" frameborder="0" width="100%" height='500px'></iframe>` */
            this.frameUrl = "https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://open.ys7.com/" + this.value +
                "/1.live&autoplay=1&accessToken=" + this.accessToken + "&templete=2";
        },

        querypohto() {
            this.$router.push('/photo/index?id=' + this.$route.query.id)
        },
        handlePtz(direction) {

            ptzStart(this.accessToken, this.value, direction).then(res => {
                //console.info(res);
            });

            setTimeout(() => {
                ptzStop(this.accessToken, this.value, direction).then(res => {
                    //  console.info(res);
                });
            }, 1000);
        },
        back() {
            this.$router.go(-1);
        }
    }
}
</script>

<style lang="scss" scoped>
.broadcast {
    padding: 10px 20px 40px 20px;

    .querybtn {
        width: 270px;
        background: #409EFF;
        border-radius: 10px;
        font-size: 16px;
    }

    .head {
        width: 1000px;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .bton {
        text-align: center;
    }

    .intr {
        text-align: center;
        position: relative;
        min-height: 30px;

        .left {
            cursor: pointer;
            position: absolute;
            left: 10px;
        }

        h4 {
            text-align: center;
            font-weight: normal;
        }
    }

}

#iframe {
    text-align: center;
}

#ysOpenDevice {
    margin-top: 10px;
}
</style>
