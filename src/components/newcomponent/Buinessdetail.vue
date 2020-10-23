<template>
<el-row>
    <el-col :span='12'>
        <div class="item">
            <label>基地名称：</label>
            <span>{{enterprisedata.farmName}}</span>
        </div>
    </el-col>
    <el-col :span='12'>
        <div class="item">
            <label>场主：</label>
            <span>{{enterprisedata.farmerName}}</span>
        </div>
    </el-col>
    <el-col :span='12'>
        <div class="item">
            <label>性质：</label>
            <span>{{enterprisedata.attribute}}</span>
        </div>
    </el-col>
    <el-col :span='12'>
        <div class="item">
            <label>农场地址：</label>
            <span>{{enterprisedata.province}}{{enterprisedata.city}}{{enterprisedata.county}}{{enterprisedata.address}}</span>
        </div>
    </el-col>
    <el-col :span='12'>
        <div class="item">
            <label>家庭地址：</label>
            <span>{{enterprisedata.homeProvince}}{{enterprisedata.homeCity}}{{enterprisedata.homeCounty}}{{enterprisedata.homeAddress}}</span>
        </div>
    </el-col>
    <el-col :span='12'>
        <div class="item">
            <label>联系方式：</label>
            <span>{{enterprisedata.telephone}}</span>
        </div>
    </el-col>
    <el-col :span='12'>
        <div class="item">
            <label>场主身份证：</label>
            <span class='enterprise'>{{enterprisedata.idCard}}
                <ul>
                    <li @click="showimg(enterprisedata.idCardFront)" v-if='enterprisedata.idCardFront'>
                        <el-image :src='enterprisedata.idCardFront'></el-image>
                    </li>
                    <li @click="showimg(enterprisedata.idCardBack)" v-if='enterprisedata.idCardBack'>
                        <el-image :src='enterprisedata.idCardBack'></el-image>
                    </li>
                </ul>
            </span>
        </div>
    </el-col>
    <el-col :span='12'>
        <div class="item">
            <label>规模：</label>
            <span>{{enterprisedata.scale}}
            </span>
        </div>
    </el-col>
    <!--                    <el-col :span='12'>
                         <div class="item">
                              <label>排序：</label>
                               <span>{{enterprisedata.sort}}</span>
                         </div>
                   </el-col> -->
    <el-col :span='24'>
        <div class="item">
            <label></label>
            <span></span>
        </div>
    </el-col>
    <el-col :span='12'>
        <div class="item">
            <label>图片：</label>
            <span class='enterprise'>
                <ul v-if='enterImg.length>0'>
                    <li v-for='(item,index) in enterImg' :key='index' @click="showimg(enterImg,index)">
                        <el-image :src='item' :lazy='true'></el-image>
                    </li>
                </ul>

            </span>
        </div>
        <el-dialog :visible.sync="dialogVisible" :modal='false'>
            <!-- <img width="100%" :src="dialogImageUrl" alt=""> -->
            <el-carousel height="600px" ref='cnvas'>
                <el-carousel-item v-for="item in dialogImageUrl" :key="item" :autoplay='false'>
                    <img :src="item" style="max-width: 100%;max-height: 100%;display: block; margin: 0 auto;" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </el-col>
    <el-col :span='12'>
        <div class="item">
            <label>证照：</label>
            <span class='enterprise'>
                <ul>
                    <li @click="showimg(enterprisedata.businessLicenseUrl)" v-if='enterprisedata.businessLicenseUrl'>
                        <el-image :src='enterprisedata.businessLicenseUrl'></el-image>
                        <p>营业执照</p>
                    </li>
                    <li @click="showimg(enterprisedata.licenseUrl)" v-if='enterprisedata.licenseUrl'>
                        <el-image :src='enterprisedata.licenseUrl'></el-image>
                        <p>防疫证</p>
                    </li>
                </ul>
            </span>
        </div>
    </el-col>
</el-row>
</template>

<script>
export default {
    props: {
        enterprisedata: {
            require: true
        },
        enterImg: {
            type: Array,
            require: true
        }
    },
    data() {
        return {
            dialogVisible: false,
            dialogImageUrl: '',
        }
    },
    methods: {
        showimg(item, index) {
            this.dialogVisible = true;
            if (typeof item == 'string') {
                this.dialogImageUrl = [item]
            } else {
                this.dialogImageUrl = item
                this.$refs.cnvas.setActiveItem(index)
            }
        },

    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/dialog.scss';
</style>
