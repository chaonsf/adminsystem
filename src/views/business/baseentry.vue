<template>
    <div class='basentry'>
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
        <div class='content'>
            <el-table :data='tabledata' border stripe>
                 <el-table-column  prop="createTime"  label="申请时间" align='center' width='165'> </el-table-column>
                  <el-table-column  prop="type"  label="类型" align='center'> </el-table-column>
                   <el-table-column  prop="name"  label="名称" align='center'> </el-table-column>
                 <el-table-column  prop="province"  label="省" align='center' width='100'> </el-table-column>
                  <el-table-column  prop="city"  label="市" align='center'  width='100'> </el-table-column>
                   <el-table-column  prop="county"  label="区/县" align='center'  width='100'> </el-table-column>
                    <el-table-column  prop="lpName"  label="负责人姓名" align='center'> </el-table-column>
                    <el-table-column  prop="phone"  label="负责人电话" align='center'> </el-table-column>
                    <el-table-column width='80' align='center' label="详情" fixed='right'>
                        <template slot-scope="scope">
                             <i class="iconfont icon-xiangqing" @click='detail(scope.row)'></i>
                        </template>
                   </el-table-column>
                    <el-table-column  prop="status"  label="审核" align='center' width='80' fixed='right'> 
                        <template slot-scope="scope">
                            <div v-if='scope.row.status==0'>
                                  <span class="anniu" @click='throught(scope.row,1)'>通过</span>
                                  <span class='anniu light' @click='throught(scope.row,-1)'>不通过</span>
                            </div>
                             <span v-if='scope.row.status==-1' class='red'>审核被拒</span>
                             <span v-if='scope.row.status==1'>审核通过</span>
                        </template>
                    </el-table-column>
            </el-table>
            <el-pagination background  layout="prev, pager, next" :total="page.total" @current-change="currentChange"  @size-change="sizeChange" :hide-on-single-page='boff'> </el-pagination> 
        </div>
         <el-dialog :visible.sync='enterprisebox' title="帮扶企业" class="detail" width='980px'>
              <Buinessdetail :enterprisedata='enterprisedata' :enterImg='enterImg'></Buinessdetail>
         </el-dialog>
    </div>
</template>
<script>
import Query from "@/components/newcomponent/queryhead" 
import {baselist,basestatus,entrydetail,entrypass} from '@/api/poverty'
import { Loading } from 'element-ui';
import Buinessdetail from "@/components/newcomponent/Buinessdetail"
export default {
     components:{
         Query,Buinessdetail
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
            enterprisebox:false,
            enterprisedata:[],
            enterImg:[],
            boff:false
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
                    status:this.status,
                    beginTime:query.startTime
                 }
             }else{
               let get=this.$refs.query
                let querya=get.query
                let value=get.value
                param={
                  ...querya,
                  beginTime:value[0],
                  endTime:value[1],
                   status:this.status,
                    current:this.page.currentPage,
              }
             }
             let loadingInstance = Loading.service({text:'正在加载中。。。'});
             baselist(param).then(res=>{
                 loadingInstance.close();
                 let {code,data,msg}=res.data;
                 if(code==200){
                     this.tabledata=data.records
                     this.page.total=data.total
                     if(this.tabledata.length==0){
                         this.boff=true
                     }else{
                         this.boff=false
                     }
                 }else{
                      this.$msg({
                           msg:msg
                      })
                 }
             })
         },
         detail(item){
               this.enterprisebox=true
               let id=item.id
               let param={
                     insLocateId:id
               }
               entrydetail(param).then(res=>{
                     let {data,code,msg}=res.data;
                     if(code==200){
                     data.farmName=data.name
                     data.farmerName=data.lpName
                     data.attribute=data.nature
                     data.telephone=data.phone
                    this.enterprisedata=data
                    if(this.enterprisedata.photos){
                        // this.enterImg=JSON.parse(this.enterprisedata.photos)
                        this.enterImg=this.enterprisedata.photos.split(',')
                    }
                     }else{
                          this.$msg({msg})
                     }

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
                       this.toexam(item.id,id) 
                   }
             })
         },
        toexam(insLocateId,id){
             let param={
                  insLocateId,
                  status:id
             }
         entrypass(param).then(res=>{
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
             basestatus().then(res=>{
                 let {code,data,msg}=res.data;
                 console.log("ddd:",res.data)
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
          currentChange(cur){
              this.page.currentPage=cur
              this.search()
          },
          sizeChange(pageSize){
              this.page.pageSize = pageSize;
              this.search()
          },
          clear(){
              this.statusdata=[]
              this.status=''
               this.getstatus()
          }
     }

}
</script>
<style lang="scss" scoped>
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
.red{
     color: red;
}
.basentry{
   padding: 10px 20px 40px 20px;
    .iconfont{
        color: #409eef;
        cursor: pointer;
    }
    .el-pagination{
        text-align: center;
        margin-top: 10px;
    }
}
</style>