<template>
  <basic-container style="text-align:center">
    <el-form :inline="true" size="large">
      <el-row>
        <el-form-item label="养殖基地摄像机">
          <el-cascader
            v-model="value"
            :options="options"
            expand-trigger="hover"
            style="width:400px"
            placeholder="请选择摄像机"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-row>
    </el-form>
    <iframe :src="frameUrl" frameborder="0" width="1000px" height="600px" align="center" id="ysOpenDevice"  allowfullscreen></iframe>
    <el-row
      style="margin-top:5px;"
      v-if="value.length>0 && value[1].deviceType==3"
    >
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
  </basic-container>
</template>

<script>
import { getFarmCameras } from "@/api/device/gun";
import { getToken, getLiveAddress, ptzStart, ptzStop } from "@/api/ys7";

export default {
  data() {
    return {
      accessToken: "",
      frameUrl: "",
      value: [],
      options: [],
      props: {
        expandTrigger: "hover"
      }
    };
  },
  methods: {
    handleChange() {
      this.frameUrl = "https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://open.ys7.com/" + this.value[1].serial +
      "/1.live&autoplay=1&accessToken="+this.accessToken+"&templete=2";
   
    },
    handlePtz(direction) {


      ptzStart(this.accessToken, this.value[1].serial, direction).then(res => {
        console.info(res);
      });

      setTimeout(() => {
        ptzStop(this.accessToken, this.value[1].serial, direction).then(res => {
          console.info(res);
        });
      }, 1000);
    }
  },
  created: function() {
    getToken().then(res => {
      this.accessToken = res.data.data.accessToken;

      getFarmCameras().then(res => {
        this.options = res.data.data;
        if (res.data.data.length > 0) {
          this.value = [
            res.data.data[0].value,
            res.data.data[0].children[0].value
          ];
          this.handleChange(this.value);
        }
      });
    });
  },
};
</script>

<style >
</style> 
 
