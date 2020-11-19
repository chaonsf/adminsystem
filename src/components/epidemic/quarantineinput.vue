<template>
    <div class='quarantine'>
        <el-row :gutter='20'>
             <el-col :span='luruquery==0?"24":"12"'>
            <div class="item">
                <label>检疫证编号：</label>
                <span v-show="luruquery==1">{{detail.certificateNo}}</span>
                <el-input v-show='luruquery==0' v-model='form.certificateNo'></el-input>
            </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>日期：</label>
                   <span>{{detail.createTime}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>批次号：</label>
                   <span>{{detail.batchNo}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>品种：</label>
                   <span>{{detail.variety}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>数量：</label>
                   <span>{{detail.quantity}}</span>
                   <span>单位:吨</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>日龄：</label>
                   <span>{{detail.age}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>检疫清单：</label>
                   <i class="iconfont icon-xiangqing1" @click="list"></i>
               </div>
             </el-col>
             <el-col :span='luruquery==0?"24":"12"'>
                <div class="item">
                   <label>检疫合格数量：</label>
                   <span v-show="luruquery==1">{{detail.qualifiedQuantity}}</span>
                   <el-input v-show='luruquery==0' v-model="form.qualifiedQuantity"></el-input>
                </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>检疫不合格数量：</label>
                   <span v-show='luruquery==1'>{{detail.quantity-detail.qualifiedQuantity}}</span>
                    <span v-show='luruquery==0'>{{Unqualified}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>货主：</label>
                   <span>{{detail.ownerName}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>联系电话：</label>
                   <span>{{detail.ownerPhone}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>生产单位名称：</label>
                   <span>{{detail.farmName}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>地址：</label>
                   <span>{{detail.address}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>目的地：</label>
                   <span>{{detail.destination}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>运载方式：</label>
                   <span>{{detail.transMethod}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>联系方式：</label>
                   <span>{{detail.transPhone}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>转运前消毒方式：</label>
                   <span>{{detail.disinfectionMethod}}</span>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>有效期：</label>
                  <span v-show='luruquery==1'>{{detail.validTime}}</span>
                <el-select placeholder="选择有效期" v-model="key" v-show='luruquery==0'>
                    <el-option v-for='item in detail.validityList' :key='item.dictKey' :value='item.dictKey' :label="item.dictValue"></el-option>
                </el-select>
               </div>
             </el-col>
             <el-col :span='12'>
                <div class="item">
                   <label>官方兽医：</label>
                   <span>{{detail.veterinarian}}</span>
               </div>
             </el-col>
        </el-row>
        <div class='button' v-show='luruquery==0'>
            <el-button type='primary' @click="submit">确定录入</el-button>
        </div>
    <el-dialog :visible.sync='listbox' title="申报清单" class="detail" width='980px' :modal='false'>
        <Applylist :applyid='detail.operId' ></Applylist>
    </el-dialog>
    </div>
</template>
<script>
import {
  quarantinequery,quarantineinput
} from '@/api/epidemic'
import {
    Loading
} from 'element-ui';
import Applylist from '@/components/epidemic/applylist'
import moment from 'moment'
export default {
    props:['luruid','luruquery'],
    components:{
          Applylist
    },
    data(){
        return{
           detail:{},
           form:{
               certificateNo:'',
               qualifiedQuantity:'',
           },
           key:'',
           listbox:false,

        }
    },
    watch:{
        luruid(){
             this.load()
        }
    },
    computed:{
        Unqualified(){
            return this.detail.quantity-this.form.qualifiedQuantity
        }
    },
    created() {
        this.load()
    },
    methods:{
        load(){
            let param={
               id:this.luruid
            }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            quarantinequery(param).then(res=>{
                 loadingInstance.close();
                 let {code,data}=res.data
                 if(code==200){
                     this.detail=data;
                    if(this.luruquery==0){
                        this.key=data.validityList[0].dictKey
                    }
                 }
            })
        },
        submit(){
             let param={
                 ...this.form,
                 id:this.luruid,
                 validTime:moment(this.detail.createTime).add(this.key,'h').format('YYYY-MM-DD hh:mm:ss')
             }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            quarantineinput(param).then(res=>{
                loadingInstance.close();
                let{code}=res.data
                if(code==200){
                    this.$msg({
                        msg:'录入成功',
                        type:'success'
                    })
                    this.$emit('close')
                }
            })
             
        },
        list(){
            this.listbox=true
        }
    }
    
}
</script>
<style lang="scss">
@import '@/styles/dialog.scss';
.quarantine{
   .item{
 
   }
   .button{
       text-align: center;
   }
}
</style>