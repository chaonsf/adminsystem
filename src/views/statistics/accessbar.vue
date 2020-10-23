<template>
     <div class='accessbar'>
         <Query ref='query'  @search="search" :show='false' @clear='clear'>
                <template  v-slot:status>
                <el-form-item label='品类'>
                            <el-select  placeholder="品类" v-model="query.categoryid" @change='category'>
                                 <el-option v-for='item in categorys' :key='item.dictKey'
                                  :value='item.dictKey' :label="item.dictValue"
                                 ></el-option>
                            </el-select>                      
                </el-form-item>
                <el-form-item label='品种'>
                            <el-select  placeholder="品种" v-model="query.varietid" @change="pinzhong">
                                 <el-option v-for='item in variety' :key='item.value'
                                  :value='item.value' :label="item.name"
                                 ></el-option>
                            </el-select>                      
                </el-form-item>
                <el-form-item label='属性'>
                            <el-select  placeholder="属性" v-model="query.attrid">
                                 <el-option v-for='item in attrs' :key='item.value'
                                  :value='item.value' :label="item.name"
                                 ></el-option>
                            </el-select>                      
                </el-form-item>
                </template>
         </Query>
          <div class="pie" id='poou'></div>
         <div class='list'>
              <el-button type='primary' @click='farmlist'>养殖场列表</el-button>
         </div>
     </div>
</template>
<script>
import {varieties,dictionary,attribute,statisticsarea} from '@/api/poverty'
import Query from "@/components/newcomponent/queryhead" 
import { Loading } from 'element-ui';
import echarts from 'echarts'
export default {
     components:{
         Query
     },
     data(){
         return{
              variety:[],//品种
              categorys:[],//品类
              attrs:[],
              query:{
                   varietid:"",
                   categoryid:'',
                   attrid:'',
              },
         }
     },
     created(){
             this.category()
     },
     methods:{
           pinzhong(){
               let param={
                     category:this.query.categoryid
               }
               this.attrs=[]
               this.query.attrid=''
               varieties(param).then(res=>{
                     let {code,data,msg}=res.data;
                     if(code==200){
                        data.unshift({
                             value:" ",
                             name:'全部'
                        })
                        this.variety=data
                        this.getattr()
                     }else{
                         this.$msg({
                             msg:msg
                         })
                     }

               })
           },
          category(){
              let param={
                  code:"livestock"
              }
              this.query.varietid=''
              this.variety=[]
              this.attrs=[]
               this.query.attrid=''
             dictionary(param).then(res=>{
                  let {code,data,msg}=res.data
                  if(code==200){
                    data.unshift({
                          dictValue:'全部',
                          dictKey:' '
                    })
                   this.categorys=data
                   this.pinzhong()
                  }else{
                         this.$msg({
                             msg:msg
                         })  
                  }
             })  
          },
          getattr(){
              let param={
                   category:this.query.varietid
              }
              attribute(param).then(res=>{
                   let {code,msg,data}=res.data
                   if(code==200){
                        data.unshift({
                             value:" ",
                             name:'全部'
                        })
                         this.attrs=data
                   }else{
                       this.$msg({
                           msg:msg
                       })
                   }
              })
          },
          search(query){
                let param={
                       ...query,
                      end:query.endTime,
                      start:query.startTime,
                      category:this.query.categoryid,
                      property:this.query.attrid,
                      variety:this.query.varietid
                }
                let loadingInstance = Loading.service({text:'正在加载中。。。'});
                statisticsarea(param).then(res=>{
                     loadingInstance.close();
                     let {code,data,msg}=res.data
                     if(code==200){
                          this.drawchart(data)
                     }else{
                         this.$msg({msg})
                     }
                })
          },
           drawchart(data){
                let lineChart=echarts.init(document.getElementById('poou'));
                let timearray=[];
                 let inline=[]
                 let outline=[]
                 let diff=[]
                 let reportloss=[]
               data.forEach(item=>{
                    timearray.push(item.time)
                    inline.push(item.in)
                    outline.push(item.out)
                    diff.push(item.diff)
                    reportloss.push(item.damaged)
               })
             let option={
                     tooltip: {
                         trigger: 'axis'
                     }, 
                     legend:{
                         data:['总入栏', '总出栏', '总差值', '报损']
                     },
                    grid: {
                       left: '3%',
                       right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                   xAxis: {
                     type: 'category',
                     boundaryGap: false,
                     data: timearray,
                   },
                   yAxis: {
                      type: 'value'
                   },
                    series:[
                       {
                           "name":'总入栏',
                             type:'line',
                             data:inline
                       },
                       {
                           "name":'总出栏',
                             type:'line',
                             data:outline
                       },
                       {
                           "name":'总差值',
                             type:'line',
                             data:diff
                       },
                       {
                           "name":'报损',
                             type:'line',
                             data:reportloss
                       }
                    ]
             }
              lineChart.setOption(option)
           },
           farmlist(){
                this.$router.push('/farmlist/standard')
           },
           clear(){
               this.variety=[];
               this.categorys=[]
               this.attrs=[]
                  this.query={
                   varietid:"",
                   categoryid:'',
                   attrid:'',
              }
               this.category()
           }
     }
}
</script>
<style lang="scss" scoped>
.accessbar{
  #poou{
    width: 100%;
    height: 300px;
  }
  .list{
      text-align: center;
      padding-bottom: 20px;
  }
}
</style>