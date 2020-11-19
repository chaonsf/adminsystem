<template>
    <div class='treatment'>
           <el-form label-width="110px" >
                <el-form-item label='时间:'>
                    <span>{{detail.createTime}}</span>
                </el-form-item>
                <el-form-item label='禽畜标识编码:'>
                    <div v-for='(item,index) in detail.chipNos' :key='index'>{{item.chip_no}}
                         <i class="iconfont icon-xiangqing1" @click="applys(item.id)"></i>
                    </div>
                </el-form-item>
                <el-form-item label='日龄:'>
                    <el-row>
                        <el-col :span='12'>{{detail.age}}天</el-col>
                        <el-col :span='12'><span class='number'>发病数:{{detail.quantity}}</span></el-col>
                    </el-row>
                   
                </el-form-item>
                <el-form-item label='病因:'>
                    <span>{{detail.pathogeny}}</span>
                </el-form-item>
                <el-form-item label='诊疗人员:'>
                    <span>{{detail.operator}}</span>
                </el-form-item>
                <el-form-item label='用药名称:'>
                    <el-row>
                        <el-col :span='12'>{{detail.medicineName}} </el-col>
                        <el-col :span='12'>
                             <span class='number'>用药方法:{{detail.medicineWay}}</span>
                        </el-col>
                    </el-row>
                 
                </el-form-item>
                <el-form-item label='诊疗结果:'>
                    <span>{{detail.result}}</span>
                </el-form-item>
           </el-form>
    <el-dialog :visible.sync='detailbox' title='查看详情' class='detail' :modal='false' width="700px">
        <Livestock :detailid='detailid'></Livestock>
    </el-dialog>
    </div>
</template>
<script>
import {treatmentinfo} from '@/api/epidemic'
import {
    Loading
} from 'element-ui';
import Livestock from "@/components/newcomponent/livestockdetail"
export default {
    props:['treatid'],
    components:{
Livestock
    },
    data(){
        return{
            detail:{},
           detailbox:false,
           detailid:''
        }
    },
    created() {
        this.load()
    },
    watch:{
        treatid(){
             this.load()
        }
    },
    methods:{
         load(){
             let param={
                 id:this.treatid
             }
             let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
           treatmentinfo(param).then(res=>{
               loadingInstance.close();
               let {code,data}=res.data;
               if(code==200){
                    this.detail=data
               }
           }) 
         },
         applys(id){
            this.detailid=id;
            this.detailbox=true
         }
    }
}
</script>
<style lang="scss" scoped>
.treatment{
    .iconfont {
        color: #409eef;
        cursor: pointer;
    }

    .icon-xiangqing1 {
        font-size: 22px;
    }
   /*  .number{
        display: inline-block;
        margin-left: 100px;
    } */
}

</style>