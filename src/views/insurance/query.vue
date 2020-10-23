<template>
    <div class='query'>

         <Query ref='query'  @search="search" @clear='clear'>
                <template  v-slot:status>
                    <el-form-item label='状态'> 
                            <el-select  placeholder="选择状态" v-model="status">
                                 <el-option v-for='item in statusdata' :key='item.value'
                                  :value='item.value' :label="item.label"
                                 ></el-option>
                            </el-select>                      
                  </el-form-item>
                </template>
         </Query>
         <div class="content">
           <el-table :data='tabledata' border stripe>
                    <el-table-column  prop="insTime"  label="投保时间" align='center'> </el-table-column>
                    <el-table-column  prop="farmName"  label="养殖场名称" align='center' > </el-table-column>
                    <el-table-column  prop="insProductName"  label="投保险种" align='center' > </el-table-column>
                    <el-table-column  prop="insAmount"  label="保费(元)" align='center' width='100'> </el-table-column>
                    <el-table-column  prop="premium"  label="保额（元）" align='center' width='100'> </el-table-column>
                    <el-table-column width='80' align='center' label="标的清单">
                        <template slot-scope="scope">
                             <i class="iconfont icon-qingdan" @click='subject(scope.row)'></i>
                        </template>
                   </el-table-column>
                    <el-table-column width='80' align='center' label="保单详情">
                        <template slot-scope="scope">
                             <i class="iconfont icon-xiangqing" @click='policy(scope.row)'></i>
                        </template>
                   </el-table-column>
                    <el-table-column  prop="status"  label="状态" align='center' width='80'> 
                        <template slot-scope="scope">
                            <div v-if='scope.row.status==0'>
                                  <span class="anniu" @click='throught(scope.row,1)'>通过</span>
                                  <span class='anniu light' @click='throught(scope.row,-1)'>不通过</span>
                            </div>
                             <span v-if='scope.row.status==1'>保障中</span>
                             <span v-if='scope.row.status==2'>保障结束</span>
                        </template>
                    </el-table-column>
              </el-table>   
            <el-pagination background  layout="prev, pager, next" :total="page.total" @current-change="currentChange"  @size-change="sizeChange" :hide-on-single-page='true'> </el-pagination> 
         </div>
         <el-dialog :visible.sync='subjectbox' title="标的详情" width='800px'>
                <Subjectdetail :insId='insId'></Subjectdetail>
         </el-dialog>
    </div>
</template>
<script>
import {insurancequery,insexam,instatus} from '@/api/poverty'
import Subjectdetail from  "@/components/newcomponent/subjectdetail" 
import { Loading } from 'element-ui';
import Query from "@/components/newcomponent/queryhead" 
export default {
     components:{
        Subjectdetail,Query
     },
      data(){
          return{
              statusdata:[],
              status:'',
              tabledata:[],
              page:{
                total:0,
                currentPage:1,
                pageSize:10,
                pagerCount:5,
            },
            subjectbox:false,
            insId:'',  //标的详情需要参数
          }
      },
      created(){
          this.getstatus()
      },
      methods:{
          search(query){
               var param
             if(query){
               param={
                   ...query,
                   current:this.page.currentPage,
                   size:this.page.pageSize,
                   status:this.status
               }            
             }else{
                  let get=this.$refs.query
                let querya=get.query
                let value=get.value
                param={
                  ...querya,
                  startTime:value[0],
                  endTime:value[1],
                   status:this.status
              }
             }

             let loadingInstance = Loading.service({text:'正在加载中。。。'});
            insurancequery(param).then(res=>{
                 loadingInstance.close();
                 let {code,data,msg}=res.data;
                 if(code==200){
                     this.tabledata=data.records
                     this.page.total=data.total
                 }else{
                      this.$msg({
                           msg:msg
                      })
                 }
            })
          },
          subject(item){
               this.insId=item.insId
               this.subjectbox=true
          },
          currentChange(cur){
              this.page.currentPage=cur
              this.search()
          },
          sizeChange(pageSize){
              this.page.pageSize = pageSize;
              this.search()
          },
          policy(){
               this.$msg({
                    msg:'尚未获得保单模板'
               })
          },
        throught(item,id){
            let text
             if(id==1){
                  text='是否确定通过?'
             }else{
                  text='是否确定拒绝?'
             }
             this.$popup({
                   text:text,
                   ok:()=>{
                       this.toexam(item.insId,id) 
                   }
             })

        },
        toexam(insId,id){
             let param={
                  insId,
                  status:id
             }
         insexam(param).then(res=>{
               let {code,msg}=res.data;
               if(code==200){
                    this.search()
               }else{
                    this.$msg({
                         msg:msg
                    })
               }
          })

        },
        getstatus(){
             instatus().then(res=>{
                 let {code,data,msg}=res.data;
                 if(code==200){
                 let arr=[]
                 for(let key  in data){
                      arr.push({
                            value:key,
                            label:data[key]
                      })
                 }
                 arr.unshift({
                       value:' ',
                       label:'全部'
                 })
                 this.statusdata=arr
                }else{
                     this.$msg({
                          msg
                     })
                }
             })
        },
        clear(){
             this.statusdata=[]
             this.status=''
             this.getstatus()
        }
      }
}
</script>
<style lang="scss">
.query{
   padding: 10px 20px;
    .iconfont{
        color: #409eef;
        cursor: pointer;
    }
    .el-pagination{
        text-align: center;
        margin-top: 10px;
    }
    .form{
   /*    .el-input__inner{
         width: 150px;
         box-sizing: border-box;
      } */
      .time{
           .el-form-item__content{
                width: 456px;
                .el-date-editor{
                     width: 100%;
                }
           }
      }
     .el-select{
        width: 182px;
     }
    }
    .anniu{
         display: block;
         background: #409EFF;
         color: #fff;
         border-radius: 4px;
         font-size: 14px;
         margin-bottom: 5px;
         cursor: pointer;
    }
    .anniu.light{
         background: #ff0033;
    }
}
</style>