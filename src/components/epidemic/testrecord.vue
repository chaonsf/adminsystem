<template>
    <div class='testrecord'>
         <el-row>
             <el-col :span='12'>
                <div class="item">
                 <label>采样日期：</label>
                  <span>{{detail.createTime}}</span>
                </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                 <label>采样数量:</label>
                  <span>{{detail.quantity}}</span>
                </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                 <label>检测项目:</label>
                  <span>{{detail.testItem}}</span>
                </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                 <label>检测单位:</label>
                  <span>{{detail.institution}}</span>
                </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                 <label>检测结果:</label>
                  <span>{{detail.result}}</span>
                </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                 <label>处理情况:</label>
                  <span>{{detail.handleDes}}</span>
                </div>
             </el-col>
         </el-row>
    </div>
</template>
<script>
import {testinfo} from '@/api/epidemic'
import {
    Loading
} from 'element-ui';
export default {
    props:['testid'],
    data(){
        return{
           detail:{},
        }
    },
    watch:{
        testid(){
             this.load()
        }
    },
    created() {
        this.load()
    },
    methods:{
        load(){
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            let param={
                id:this.testid
            }
            testinfo(param).then(res=>{
                loadingInstance.close();
                 let {code,data}=res.data
                 if(code==200){
                       this.detail=data
                 }
            })
        }
    }
}
</script>
<style lang="scss" scoped>

</style>