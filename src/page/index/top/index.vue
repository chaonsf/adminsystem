<template>
<div class="avue-top">
    <div class="top-bar__left">
        <div class="avue-breadcrumb" :class="[{ 'avue-breadcrumb--active': isCollapse }]" v-if="showCollapse">
            <i class="icon-navicon" @click="setCollapse"></i>
        </div>
    </div>
    <div class="top-bar__title">
        <div class="top-bar__item top-bar__item--show" v-if="showMenu">
            <top-menu></top-menu>
        </div>
        <span class="top-bar__item" v-if="showSearch">
            <top-search></top-search>
        </span>
    </div>
    <div class="top-bar__right">
        <!-- <el-tooltip v-if="showColor"
                  effect="dark"
                  :content="$t('navbar.color')"
                  placement="bottom">
        <div class="top-bar__item">
          <top-color></top-color>
        </div>
      </el-tooltip>-->
        <audio ref="audio" controls="controls" hidden src="http://downsc.chinaz.net/files/download/sound1/201209/2125.wav" />
        <button @click="open" v-trigger style="opacity:0;"></button>
        <el-tooltip effect="dark" :content="$t('navbar.official')" placement="bottom">
            <div class="top-bar__item">
                <i class='el-icon-d-arrow-left' @click='backofficial'></i>
            </div>
        </el-tooltip>
        <el-tooltip effect="dark" content="驾驶舱" placement="bottom">
            <!--  <img src="../../../../public/img/cockpit.png" alt="" class="rightimg" style="width:22px;height:22px;margin-right:14px" @click="tiaozhuang"> -->
            <i class='iconfont icon-jiashicang' @click="tiaozhuang"></i>
        </el-tooltip>
        <div class="el-badge">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img src="../../../../public/img/ring.png" alt="" class="rightimg">
                </span>
                <el-dropdown-menu slot="dropdown" disabled="true">
                    <router-link to="/device/monitor/warn/water">
                        <el-dropdown-item :disabled="this.difData.water==0?true:false">水质({{difData.water}})</el-dropdown-item>
                    </router-link>
                    <router-link to="/device/monitor/warn/soil">
                        <el-dropdown-item :disabled="this.difData.soil==0?true:false">土质({{difData.soil}})</el-dropdown-item>
                    </router-link>
                    <router-link to="/device/monitor/warn/air">
                        <el-dropdown-item :disabled="this.difData.air==0?true:false">空气({{difData.air}})</el-dropdown-item>
                    </router-link>
                </el-dropdown-menu>
            </el-dropdown>
            <sup v-show="this.difData.total==0?false:true" class="el-badge__content el-badge__content--undefined is-fixed" style="right: 20px;">{{this.difData.total}}</sup>
        </div>
        <!-- <el-tooltip v-if="showDebug"
                  effect="dark"
                  :content="logsFlag?$t('navbar.bug'):lo0gsLen+$t('navbar.bugs')"
                  placement="bottom">
        <div class="top-bar__item">
          <top-logs></top-logs>
        </div>
      </el-tooltip> -->

        <!--         <el-tooltip v-if="showLock" effect="dark" :content="$t('navbar.lock')" placement="bottom">
            <div class="top-bar__item">
                <top-lock></top-lock>
            </div>
        </el-tooltip> -->
        <!--       <el-tooltip v-if="showTheme" effect="dark" :content="$t('navbar.theme')" placement="bottom">
            <div class="top-bar__item top-bar__item--show">
                <top-theme></top-theme>
            </div>
        </el-tooltip> -->
        <!-- <el-tooltip effect="dark"
                  :content="$t('navbar.language')"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-lang></top-lang>
        </div>
      </el-tooltip> -->
        <el-tooltip v-if="showFullScren" effect="dark" :content="isFullScren?$t('navbar.screenfullF'):$t('navbar.screenfull')" placement="bottom">
            <div class="top-bar__item">
                <i :class="isFullScren?'icon-tuichuquanping':'el-icon-full-screen'" @click="handleScreen"></i>
            </div>
        </el-tooltip>
        <img class="top-bar__img" :src="userInfo.avatar">
        <el-dropdown>
            <span class="el-dropdown-link">
                {{userInfo.userName}}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                    <router-link to="/">{{$t('navbar.dashboard')}}</router-link>
                </el-dropdown-item>
                <!--  <el-dropdown-item @click.native="backofficial" divided>{{$t('navbar.official')}}</el-dropdown-item> -->
                <el-dropdown-item>
                    <router-link to="/info/index">{{$t('navbar.userinfo')}}</router-link>
                </el-dropdown-item>
                <el-dropdown-item @click.native="logout" divided>{{$t('navbar.logOut')}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

    </div>
</div>
</template>

<script>
import {
    getList,
    getDifList
} from '@/api/monitor/warninglog.js'
import {
    mapGetters,
    mapState
} from "vuex";
import {
    fullscreenToggel,
    listenfullscreen
} from "@/util/util";
import topLock from "./top-lock";
import topMenu from "./top-menu";
import topSearch from "./top-search";
import topTheme from "./top-theme";
import topLogs from "./top-logs";
import topColor from "./top-color";
import topLang from "./top-lang";
export default {
    components: {
        topLock,
        topMenu,
        topSearch,
        topTheme,
        topLogs,
        topColor,
        topLang,
    },
    name: "top",
    data() {
        return {
            data: [],
            difData: {
                soil: 0,
                water: 0,
                air: 0,
                total: 0
            },
            params: {
                status: 0,
                farmId: 1
            },
            dialogVisible: false,
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            timer: null,
            option: {
                menu: false,
                addBtn: false,
                page: false,
                border: true,
                expand: true,
                refreshBtn: false,
                headerAlign: "center",
                searchMenuSpan: 4,
                index: true,
                column: [{
                        label: "内容",
                        prop: "content",
                        overHidden: true
                    },
                    {
                        label: "时间",
                        align: "center",
                        prop: "createTime",
                        width: 200
                    }
                ]
            }
        };
    },
    filters: {},
    created() {
        this.getDifList()
        this.alert()
    },
    mounted() {
        listenfullscreen(this.setScreen);
    },
    computed: {
        ...mapState({
            showDebug: state => state.common.showDebug,
            showTheme: state => state.common.showTheme,
            showLock: state => state.common.showLock,
            showFullScren: state => state.common.showFullScren,
            showCollapse: state => state.common.showCollapse,
            showSearch: state => state.common.showSearch,
            showMenu: state => state.common.showMenu,
            showColor: state => state.common.showColor,
        }),
        ...mapGetters([
            "userInfo",
            "isFullScren",
            "tagWel",
            "tagList",
            "isCollapse",
            "tag",
            "logsLen",
            "logsFlag",
        ])
    },
    directives: {
        trigger: {
            inserted(el, binging) {
                el.click()
                //$(el).trigger('click')
            }
        }
    },
    methods: {
        getDifList() {
            getDifList().then(res => {
                let data = res.data.data
                for (let i = 0; i < data.length; i++) {
                    if (data[i].warnType == 4) {
                        this.difData.soil = data[i].count
                    } else if (data[i].warnType == 5) {
                        this.difData.water = data[i].count
                    } else {
                        this.difData.air = data[i].count
                    }
                }
                this.difData.total = this.difData.soil + this.difData.water + this.difData.air
            })
        },
        open() {
            getList(1, 10, this.params).then(res => {
                if (res.data.data.total != 0) {
                    this.audioPlay()
                }
            })
        },
        audioPlay() {
            this.$refs.audio.play()
            // var num = 1
            // var timer = setInterval(() => {
            //   if(num<6){
            //     this.$refs.audio.play()
            //     num++
            //   }else{
            //     this.$once('hook:beforeDestroy', () => {            
            //     clearInterval(timer);                        
            //   })
            //   }
            // },3000);
        },
        alert() {
            this.$notify({
                message: '预警信息连接成功,该消息提醒稍后自动关闭',
                duration: 4000,
                customClass: 'alert1',
                offset: 20,
                iconClass: 'el-icon-bell'
            });
            this.$notify({
                message: '小区信息连接成功,该消息提醒稍后自动关闭',
                offset: 100,
                duration: 5000,
                customClass: 'alert2',
                iconClass: 'el-icon-bell'
            });
            this.$notify({
                message: '广播信息连接成功,该消息提醒稍后自动关闭',
                offset: 180,
                duration: 6000,
                customClass: 'alert3',
                iconClass: 'el-icon-bell'
            });
        },
        tiaozhuang() {
            let routeData = this.$router.resolve({
                path: '/dataView'
            })
            window.open(routeData.href, '_blank')
        },
        close(done) {
            done()
        },
        handleScreen() {
            fullscreenToggel();
        },
        setCollapse() {
            this.$store.commit("SET_COLLAPSE");
        },
        setScreen() {
            this.$store.commit("SET_FULLSCREN");
        },
        logout() {
            this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
                confirmButtonText: this.$t("submitText"),
                cancelButtonText: this.$t("cancelText"),
                type: "warning"
            }).then(() => {
                this.$store.dispatch("LogOut").then(() => {
                    // this.$router.push({ path: "/login" });
                    window.location.href = 'https://ynyiot.com/#/'
                });
            });
        },
        backofficial() {
            window.location.href = 'https://ynyiot.com/#/'
        }
    }
};
</script>

<style lang="scss">
.rightimg {
    width: 22px;
    height: 22px;
    margin-right: 8px;
    margin-top: -10px;
}

.el-notification {
    width: 240px;
    padding: 6px 20px 6px 6px;
}

.alert1 {
    background-color: #67C23A;
    border-color: #e1f3d8
}

.alert2 {
    background-color: #E6A23C;
    border-color: #faecd8
}

.alert3 {
    background-color: #F56C6C;
    border-color: #fde2e2
}

.el-notification__content {
    color: #ffffff;
    text-align: center;
}

.el-notification__title {
    color: #ffffff;
}

.icon-jiashicang {
    color: #fff;
    margin-right: 8px;
    font-size: 18px !important;
}

.el-notification__icon {
    color: #ffffff;
    font-size: 16px;
}

.el-icon-d-arrow-left {
    color: #fff;
    font-size: 20px;
}
</style>
