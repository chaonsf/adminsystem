<template>
  <div>
    <el-row :span="24">
      <basic-container>
        <avue-data-rotate :option="option"></avue-data-rotate>
      </basic-container>
    </el-row>

    <el-row :span="24">
      <el-col :span="18">
        <basic-container>
          <ve-histogram :data="chartData1" :settings="chartSettings1"></ve-histogram>
        </basic-container>
      </el-col>
      <el-col :span="6">
        <basic-container>
          <ve-pie :data="chartData2"></ve-pie>
        </basic-container>
      </el-col>
    </el-row>

    <el-row :span="24">
      <el-col :span="24" class="map">
        <p style="color:white;margin-left:18px;">当前养殖基地示例图</p>
        <p style="margin-left:18px;">
          <el-dropdown  @command="selectChange">
          <span class="el-dropdown-link">
            当前基地<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in selectData" v-bind:key="index" :command='item'>
              {{item.farmName}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </p>
        <baidu-map style="height:600px;" :scroll-wheel-zoom="false" :center="location" :zoom="zoom" ak="oBvDtR6nzWtVchkY4cLHtnah1VVZQKRK">
          <bm-scale anchor="BMAP_ANCHOR_TOP_LEFT"></bm-scale>
          <bm-view style="width: 98%; height:600px; flex: 1;margin:0 auto;margin-top:20px;"></bm-view>
          <bm-local-search :keyword="addressKeyword" :auto-viewport="true"></bm-local-search>
          <bm-marker :position="location" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
            <bm-info-window :show="show" @close="infoWindowClose" style="font-size: 14px">
              <h4>{{mapname}}</h4>
              <p>地理位置:{{mapaddress}}</p>
              <p>当前状态:{{status==1?'正常':'异常'}}</p>
            </bm-info-window>
          </bm-marker>
        </baidu-map>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getindexList } from "@/api/basic/farm";
export default {
  name: "wel",
  data() {
    //oBvDtR6nzWtVchkY4cLHtnah1VVZQKRK
    //https://v-charts.js.org
    this.chartSettings1 = {
      axisSite: { right: ['投保率'] },
      yAxisType: ['KMB', 'percent'],
      yAxisName: ['数值', '比率']
    }
    return {
      selectData:[],
      mapname:'',
      mapaddress:'',
      status:1,
      show: true,
      location: {
        lng: 116.025083,
        lat: 30.341732
      },
      zoom:16,
      addressKeyword:'',
      chartData1: {
        columns: ['日期', '畜禽总数', '投保数量', '投保率'],
        rows: [
          { '日期': '2019-11', '畜禽总数': 1393, '投保数量': 1093, '投保率': 0.32 },
          { '日期': '2019-12', '畜禽总数': 3530, '投保数量': 3230, '投保率': 0.26 },
          { '日期': '2020-1', '畜禽总数': 2923, '投保数量': 2623, '投保率': 0.76 },
          { '日期': '2020-2', '畜禽总数': 1723, '投保数量': 1423, '投保率': 0.49 },
          { '日期': '2020-3', '畜禽总数': 3792, '投保数量': 3492, '投保率': 0.323 },
          { '日期': '2020-4', '畜禽总数': 4593, '投保数量': 4293, '投保率': 0.78 }
        ]
      },
      chartData2: {
        columns: ['畜禽种类', '畜禽占比'],
        rows: [
          { '畜禽种类': '鸡', '畜禽占比': 1393 },
          { '畜禽种类': '猪', '畜禽占比': 3530 },
          { '畜禽种类': '羊', '畜禽占比': 2923 },
        ]
      },
      option:{
        span:8,
        data:[
          {
            click: () => {
              this.$router.push({
                path:'/basic/farm'
              })
            },
            count: 0,
            title: '养殖基地数量',
            icon: 'el-icon-s-order',
            color: 'rgba(255, 120, 0, 1)'
          },
          {
            click: () => {
              this.$router.push({
                path:'/basic/variety'
              })
            },
            count: 0,
            title: '畜禽品种信息',
            icon: 'el-icon-s-finance',
            color: '#B23AEE'
          },
          {
            click: () => {
              this.$router.push({
                path:'/basic/livestock-info'
              })
            },
            count: 0,
            title: '当前畜禽数量',
            icon: 'el-icon-s-data',
            color: 'rgba(31, 147, 255, 0.73)'
          },
          {
            click: () => {
              this.$router.push({
                path:'/breed/fence/livestock'
              })
            },
            count: 0,
            title: '入栏数量',
            icon: 'el-icon-s-fold',
            color: '#66CD00'
          },
          {
            click: () => {
              this.$router.push({
                path:'/breed/fence/slaughter'
              })
            },
            count: 0,
            title: '出栏数量',
            icon: 'el-icon-s-unfold',
            color: '#EEC900'
          },
          {
            click: () => {
              this.$router.push({
                path:'/device/rfid/rfid_data'
              })
            },
            count: 0,
            title: '畜禽扫描记录',
            icon: 'el-icon-s-promotion',
            color: '#CD0000'
          },
        ]
      }
    };
  },
  created(){
    this.getindexList()
  },
  methods:{
    selectChange(item){
      if(!item.coords){
          this.$msg({msg:'请先提供基地坐标地址'})
          return
      }
      this.location.lng = item.coords.split(',')[0]
      this.location.lat = item.coords.split(',')[1]
      this.mapname = item.farmName
      this.mapaddress = item.regname+item.address
      this.status = item.status
    },
    infoWindowClose () {
      this.show = false
    },
    getindexList(){
      getindexList().then(res=>{
        this.selectData = res.data.farms.records
        const {data} = res
        this.option.data[0].count = data.farmCount
        this.option.data[1].count = data.varietyCount
        this.option.data[2].count = data.lsCount
        this.option.data[3].count = data.lairageCount
        this.option.data[4].count = data.slaughterCount
        this.option.data[5].count = data.scanCount
        this.location.lng = data.farms.records[0].coords.split(',')[0]
        this.location.lat = data.farms.records[0].coords.split(',')[1]
        this.mapname = data.farms.records[0].farmName
        this.mapaddress = data.farms.records[0].regname + data.farms.records[0].address
        this.status = data.farms.records[0].status
      })
    }
  },
};
</script>

<style scoped>
.map{
  background-color:#63B8FF;
  height: 660px;
}
</style>