<template>
    <div class='information'>
        <el-form label-width="110px" >
            <el-form-item label='疫苗种类:'>
                  <span>{{detail.vaccineName}}</span>
            </el-form-item>
            <el-form-item label='疫苗生产厂家:'>
                    <span v-show="luruquery==1">{{detail.vaccineManufacturer}}</span>
                     <el-input v-show='luruquery==0' v-model='form.vaccineManufacturer'></el-input>
            </el-form-item>
            <el-form-item label='批号:'>
                    <span v-show="luruquery==1">{{detail.vaccineBatchNo}}</span>
                     <el-input v-show='luruquery==0' v-model='form.vaccineBatchNo'></el-input>
            </el-form-item>
            <el-form-item label='有效期至:'>
                    <span v-show="luruquery==1">{{detail.vaccineValidTime?detail.vaccineValidTime.slice(0,10):''}}</span>
                   <el-date-picker
                      v-model="form.vaccineValidTime"
                      type="date"
                      v-show='luruquery==0'
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                      :picker-options='endtime'
                      >
                  </el-date-picker>
            </el-form-item>
            <el-form-item label='免疫方法:'>
                    <span v-show="luruquery==1">{{detail.method}}</span>
                    <el-select  v-show='luruquery==0' v-model='form.method'>
                          <el-option v-for="item in way" :key='item.dictKey' :value='item.dictKey' :label="item.dictValue">

                          </el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label='免疫剂量:'>
                    <span v-show="luruquery==1">{{detail.dosage}}</span>
                     <el-input v-show='luruquery==0' v-model='form.dosage'></el-input>
            </el-form-item>
        </el-form>
        <div class='button' v-show='luruquery==0'>
            <el-button type='primary' @click="submit">确定录入</el-button>
        </div>
    </div>
</template>
<script>
import { vaccinesquery,vaccinesinput} from '@/api/epidemic';
import {
    Loading
} from 'element-ui';
const endtime = () => {
    return {
        disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e6
        }
    }
}
export default {
     props:['luruid','luruquery','way'],
     data(){
         return{
             detail:{},
             form:{
                 vaccineManufacturer:'',
                 vaccineBatchNo:'',
                 vaccineValidTime:'',
                 method:'',
                 dosage:''
             },
             endtime: endtime(),
         }
     },
     watch:{
         luruid(){
             this.load()
         }
     },
     created() {
         this.load()
     },
     methods: {
         load(){
             let param={
                 id:this.luruid
             }
            let loadingInstance = Loading.service({
                text: '正在加载中。。。'
            });
            vaccinesquery(param).then(res=>{
                  loadingInstance.close();
                  let {code,data}=res.data;
                  if(code==200){
                      this.detail=data;

                  }

            })
         },
         submit(){
             let param={...this.form,id:this.luruid,vaccineValidTime:this.form.vaccineValidTime+' 00:00:00'}
             vaccinesinput(param).then(res=>{
                   let{code}=res.data
                if(code==200){
                    this.$msg({
                        msg:'录入成功',
                        type:'success'
                    })
                    this.$emit('close')
                }
             })
         }
     },
}
</script>
<style lang="scss">

.information{
.el-date-editor{
   width: 100%;
}
.el-select{
    width: 100%;
}
   .button{
       text-align: center;
   }
}
</style>